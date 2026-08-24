import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_CLIENT_ID: string;
  STRIPE_SECRET_KEY: string;
  FRONTEND_URL: string;
  CRON_SECRET_KEY: string;
  RESEND_API_KEY: string;
}

type Variables = {
  supabase: SupabaseClient
  user: any
}

const app = new Hono<{ Bindings: Env, Variables: Variables }>()

app.use('*', cors({
  origin: 'http://localhost:3000',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'DELETE'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

// Middleware to initialize Supabase and extract user from JWT
app.use('*', async (c, next) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  })
  c.set('supabase', supabase)

  const authHeader = c.req.header('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (user && !error) {
      c.set('user', user)
    }
  }
  await next()
})

app.get('/api/v1/health', (c) => {
  return c.json({ status: 'ok', time: new Date().toISOString() })
})

// === Stripe Endpoints (Phase 1) ===
app.get('/api/v1/stripe/connect', (c) => {
  const clientId = c.env.STRIPE_CLIENT_ID
  const redirectUri = `${c.env.FRONTEND_URL || 'http://localhost:3000'}/api/v1/stripe/callback`
  const state = c.get('user')?.id || 'unauthenticated'
  
  if (state === 'unauthenticated') {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_only&state=${state}&redirect_uri=${redirectUri}`
  return c.redirect(stripeUrl)
})

app.get('/api/v1/stripe/callback', async (c) => {
  const code = c.req.query('code')
  const state = c.req.query('state') // This is the user id passed in connect
  
  if (!code) {
    return c.json({ error: 'Missing code' }, 400)
  }

  // TODO: Call https://connect.stripe.com/oauth/token to exchange code for restricted key
  const mockStripeAccountId = 'acct_12345mock'
  const mockRestrictedKey = 'rk_test_mock123'
  
  // Use service role key to bypass RLS if necessary, or just rely on the anon key if RLS allows inserts for authenticated users
  const supabaseAdmin = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  
  const { error } = await supabaseAdmin
    .from('stripe_connections')
    .insert({
      user_id: state,
      stripe_account_id: mockStripeAccountId,
      restricted_key: mockRestrictedKey
    })
    
  if (error) {
    console.error('Stripe connect error:', error)
    return c.json({ error: 'Failed to save connection' }, 500)
  }
  
  return c.redirect('http://localhost:3000/settings?stripe_connected=true')
})

app.get('/api/v1/stripe/status', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const supabase = c.get('supabase')
  const { data, error } = await supabase
    .from('stripe_connections')
    .select('stripe_account_id, connected_at, last_synced_at')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return c.json({ connected: false })
  }

  return c.json({ 
    connected: true, 
    accountId: data.stripe_account_id,
    connectedAt: data.connected_at,
    lastSyncedAt: data.last_synced_at
  })
})

app.post('/api/v1/stripe/disconnect', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const supabase = c.get('supabase')
  await supabase
    .from('stripe_connections')
    .delete()
    .eq('user_id', user.id)
  
  return c.json({ status: 'success' })
})

import Stripe from 'stripe'

app.post('/api/v1/sync', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const supabase = c.get('supabase')
  const { data: connection } = await supabase
    .from('stripe_connections')
    .select('restricted_key')
    .eq('user_id', user.id)
    .single()
    
  if (!connection?.restricted_key) {
    return c.json({ error: 'No Stripe connection found' }, 400)
  }
  
  const stripe = new Stripe(connection.restricted_key, {
    apiVersion: '2026-07-29.dahlia',
  })
  
  // 1. Fetch Customers -> Clients
  const stripeCustomers = await stripe.customers.list({ limit: 100 })
  const clientsData = stripeCustomers.data.map(cus => ({
    id: cus.id,
    user_id: user.id,
    name: cus.name || cus.email?.split('@')[0] || 'Unknown',
    company: cus.description || '',
    email: cus.email || '',
    avatar_img: Math.floor(Math.random() * 5) + 1, // mock avatar for now
    total_invoiced: 0,
    outstanding_balance: 0,
    on_time_rate: 100,
    reminders_muted: false
  }))
  
  if (clientsData.length > 0) {
    await supabase.from('clients').upsert(clientsData)
  }
  
  // 2. Fetch Invoices
  const stripeInvoices = await stripe.invoices.list({ limit: 100 })
  const invoicesData = stripeInvoices.data.map(inv => {
    // Determine status
    let status = 'Draft';
    if (inv.status === 'paid') status = 'Paid';
    if (inv.status === 'open') {
       if (inv.due_date && inv.due_date < Date.now() / 1000) {
         status = 'Overdue';
       } else {
         status = 'Pending';
       }
    }
    if (inv.status === 'void') status = 'Cancelled';
    if (inv.status === 'uncollectible') status = 'Unpaid';
    
    return {
      id: inv.id,
      user_id: user.id,
      date: new Date(inv.created * 1000).toISOString(),
      due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
      client_id: typeof inv.customer === 'string' ? inv.customer : (inv.customer && 'id' in inv.customer ? inv.customer.id : null),
      amount: inv.total / 100, // Assuming cents
      status
    }
  })
  
  if (invoicesData.length > 0) {
    await supabase.from('invoices').upsert(invoicesData)
  }
  
  // 3. Fetch Charges -> Payments
  const stripeCharges = await stripe.charges.list({ limit: 100 })
  const paymentsData = stripeCharges.data.map(charge => {
    let status = 'Pending';
    if (charge.status === 'succeeded') status = 'Succeeded';
    if (charge.status === 'failed') status = 'Failed';
    if (charge.refunded) status = 'Refunded';
    
    return {
      id: charge.id,
      user_id: user.id,
      date: new Date(charge.created * 1000).toISOString(),
      invoice_id: typeof (charge as any).invoice === 'string' ? (charge as any).invoice : ((charge as any).invoice && 'id' in (charge as any).invoice ? (charge as any).invoice.id : null),
      amount: charge.amount / 100,
      method: 'Stripe',
      status
    }
  })
  
  if (paymentsData.length > 0) {
    await supabase.from('payments').upsert(paymentsData)
  }
  
  // Update last_synced_at
  await supabase
    .from('stripe_connections')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('user_id', user.id)
    
  return c.json({ status: 'success', synced: { clients: clientsData.length, invoices: invoicesData.length, payments: paymentsData.length } })
})

// === Data Sync Endpoints (Phase 2) ===

app.get('/api/v1/clients', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const supabase = c.get('supabase')
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) return c.json({ error: error.message }, 500)

  // Map to frontend expected shape
  const clients = data.map(row => ({
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    avatarImg: row.avatar_img,
    totalInvoiced: row.total_invoiced,
    outstandingBalance: row.outstanding_balance,
    onTimeRate: row.on_time_rate,
    remindersMuted: row.reminders_muted
  }))

  return c.json({ data: clients })
})

app.get('/api/v1/invoices', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const supabase = c.get('supabase')
  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(name, avatar_img)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(50)
  
  if (error) return c.json({ error: error.message }, 500)

  const invoices = data.map(row => ({
    id: row.id,
    date: row.date,
    dueDate: row.due_date,
    clientId: row.client_id,
    clientName: row.clients?.name,
    clientAvatarImg: row.clients?.avatar_img,
    amount: row.amount,
    status: row.status
  }))

  return c.json({ data: invoices })
})

app.get('/api/v1/payments', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const supabase = c.get('supabase')
  const { data, error } = await supabase
    .from('payments')
    .select('*, invoices(client_id), clients!inner(name)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(50)
  
  if (error) return c.json({ error: error.message }, 500)

  const payments = data.map(row => ({
    id: row.id,
    date: row.date,
    invoiceId: row.invoice_id,
    clientName: row.clients?.name,
    amount: row.amount,
    method: row.method,
    status: row.status
  }))

  return c.json({ data: payments })
})

// === Reminder Endpoints (Phase 3) ===

app.post('/api/v1/cron/reminders', async (c) => {
  // Check auth
  const authHeader = c.req.header('Authorization');
  if (authHeader !== `Bearer ${c.env.CRON_SECRET_KEY}`) {
    return c.json({ error: 'Unauthorized cron request' }, 401);
  }

  // Use service role key since there is no specific user session
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Fetch active sequences
  const { data: sequences, error } = await supabase
    .from('reminder_sequences')
    .select('*, invoices!inner(*), clients!inner(*)')
    .eq('status', 'active');
    
  if (error) {
     console.error('Error fetching sequences', error);
     return c.json({ error: error.message }, 500);
  }

  const processed = [];
  
  for (const seq of sequences || []) {
      // Find pending stages scheduled for today or earlier
      const { data: pendingStages } = await supabase
        .from('reminder_stages')
        .select('*')
        .eq('sequence_id', seq.id)
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('day', { ascending: true })
        .limit(1);

      if (pendingStages && pendingStages.length > 0) {
         const stage = pendingStages[0];
         
         const toEmail = seq.clients?.email;
         if (toEmail) {
           const emailBody = `
             <h2>Invoice Reminder</h2>
             <p>Hi ${seq.clients?.name},</p>
             <p>This is a Day ${stage.day} reminder regarding your invoice <strong>${seq.invoices?.id}</strong> for $${seq.invoices?.amount}.</p>
             <p>Please arrange payment at your earliest convenience.</p>
           `;
           
           const resendReq = await fetch('https://api.resend.com/emails', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${c.env.RESEND_API_KEY}`
             },
             body: JSON.stringify({
               from: 'Reminders <onboarding@resend.dev>',
               to: [toEmail],
               subject: `Invoice Reminder: ${seq.invoices?.id}`,
               html: emailBody
             })
           });
           
           if (!resendReq.ok) {
              const resendErr = await resendReq.text();
              console.error('Failed to send email via Resend:', resendErr);
           }
         } else {
           console.warn(`No email found for client ${seq.client_id}`);
         }
         
         // Mark stage as sent
         await supabase.from('reminder_stages').update({
             status: 'sent',
             executed_at: new Date().toISOString()
         }).eq('id', stage.id);
         
         // Update sequence current stage day
         await supabase.from('reminder_sequences').update({
             current_stage_day: stage.day
         }).eq('id', seq.id);
         
         // Log activity
         await supabase.from('reminder_activity_log').insert({
             user_id: seq.user_id,
             invoice_id: seq.invoice_id,
             client_id: seq.client_id,
             stage_id: stage.id,
             event_type: 'email_sent',
             description: `Sent Day ${stage.day} reminder`
         });
         processed.push(stage.id);
      }
  }

  return c.json({ status: 'success', processed: processed.length });
})

app.get('/api/v1/reminders', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const supabase = c.get('supabase')
  
  // Return activity logs for RemindersView UI
  const { data: logs, error } = await supabase
    .from('reminder_activity_log')
    .select('*, clients(name, avatar_img), invoices(amount)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
    
  if (error) return c.json({ error: error.message }, 500)
  
  // Transform to match existing UI structure (mock data uses `id, clientName, clientAvatarImg, amount, latestAction, date`)
  const uiLogs = logs.map(row => ({
     id: row.id,
     clientName: row.clients?.name,
     clientAvatarImg: row.clients?.avatar_img,
     amount: row.invoices?.amount,
     latestAction: row.description,
     date: row.created_at
  }));

  return c.json({ data: uiLogs })
})

app.get('/api/v1/reminder-sequences', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const supabase = c.get('supabase')
  
  // Fetch sequences with nested stages, clients, and invoices
  const { data: sequences, error } = await supabase
    .from('reminder_sequences')
    .select(`
      id, invoice_id, current_stage_day, status,
      clients ( name, avatar_img ),
      invoices ( amount ),
      reminder_stages ( id, day, status, scheduled_for, executed_at )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return c.json({ error: error.message }, 500)
  
  // Transform to match frontend types
  const data = sequences.map(seq => ({
    id: seq.id,
    invoiceId: seq.invoice_id,
    clientName: seq.clients?.name,
    clientAvatarImg: seq.clients?.avatar_img,
    amount: seq.invoices?.amount,
    currentStageDay: seq.current_stage_day,
    paused: seq.status === 'paused',
    stages: (seq.reminder_stages || []).map((s: any) => ({
       day: s.day,
       tone: s.day === 3 ? 'gentle' : s.day === 7 ? 'firm' : 'final', // simplistic mapping
       subject: `Day ${s.day} Reminder`,
       body: '',
       status: s.status
    })).sort((a: any, b: any) => a.day - b.day)
  }))

  return c.json({ data })
})

export default app
