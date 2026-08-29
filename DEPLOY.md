# Deployment Checklist — forge-invoice

## Prerequisites
- Stripe account (India or US) with API keys
- Resend account with verified sender domain
- Supabase project (production)
- GitHub Actions CI/CD (or manual deploy to Netlify)

---

## Step 1: Stripe Setup (wait for approval email)

**After Stripe approves your account:**

1. **Create Prices** (in Stripe Dashboard):
   - Product: "Payment Reminders — Solo" → $9 USD/month recurring
   - Copy Price ID → `.env.production`: `STRIPE_PRICE_SOLO=price_xxxxx`
   - Product: "Payment Reminders — Pro" → $15 USD/month recurring
   - Copy Price ID → `.env.production`: `STRIPE_PRICE_PRO=price_yyyyy`

2. **Get API Keys**:
   - Dashboard → Developers → API Keys → Secret Key
   - Copy → `.env.production`: `STRIPE_SECRET_KEY=sk_live_xxxxx`

3. **Add Billing Webhook Endpoint**:
   - Developers → Webhooks → Add Endpoint
   - URL: `https://invoice.mlforge.in/api/v1/webhooks/billing`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy Signing Secret → `.env.production`: `STRIPE_BILLING_WEBHOOK_SECRET=whsec_xxxxx`

4. **Update Customer Webhook Endpoint** (already exists):
   - Find endpoint for `/api/v1/webhooks/stripe`
   - Add events: `invoice.voided`, `invoice.marked_uncollectible`
   - Save

---

## Step 2: Resend Domain Verification

1. **Go to resend.com → Domains → Add Domain**
2. **Add domain** (or subdomain): `invoice.mlforge.in` or `mail.invoice.mlforge.in`
3. **Follow DNS verification steps**:
   - Add CNAME record (for domain auth)
   - Add SPF record: `v=spf1 include:mailchannels.net ~all`
   - Add DKIM record (from Resend)
4. **Once verified**, set as default sender in Resend dashboard
5. Copy API key → `.env.production`: `RESEND_API_KEY=re_xxxxx`

---

## Step 3: Environment Variables

**Create `.env.production`** (or update existing):

```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe (platform billing)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PRICE_SOLO=price_xxxxx
STRIPE_PRICE_PRO=price_yyyyy
STRIPE_BILLING_WEBHOOK_SECRET=whsec_xxxxx

# Stripe (customer read-only connection)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxx

# Email
RESEND_API_KEY=re_xxxxx
PLATFORM_POSTAL_ADDRESS="123 Main St, City, State 12345\nYour Company Name"

# Site
NEXT_PUBLIC_SITE_URL=https://invoice.mlforge.in
NEXTAUTH_SECRET=generate-a-32-char-secret

# GitHub OAuth (if using)
GITHUB_ID=your-github-app-id
GITHUB_SECRET=your-github-app-secret

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## Step 4: Database Migration

**Run migration 0017** (contains B1–B8 hardening):

```bash
# Using Supabase CLI
supabase db push

# OR manually in Supabase dashboard:
# 1. Go to SQL Editor
# 2. Create new query
# 3. Paste supabase/migrations/0017_launch_hardening.sql
# 4. Run
```

**Verify migration** (optional but recommended):
```bash
supabase db push --dry-run
supabase migration list
```

---

## Step 5: Tenant Isolation Test (optional but recommended)

```bash
# Run isolation test in Supabase SQL Editor
# 1. Copy contents of supabase/tests/tenant_isolation.sql
# 2. Paste into SQL Editor
# 3. Run (should pass all assertions)
# 4. Drop test tables: DROP TABLE test_org_a, test_org_b, ...
```

---

## Step 6: Deploy Application

### Option A: Netlify (recommended for SaaS)
1. **Connect GitHub repo** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `.next`
4. **Add environment variables** in Netlify UI (from `.env.production`)
5. **Deploy**

### Option B: Vercel
1. **Import project** from GitHub
2. **Add environment variables** (same as `.env.production`)
3. **Deploy**

### Option C: Manual (self-hosted)
```bash
npm run build
npm run start
# Behind a reverse proxy (nginx/caddy) with HTTPS
```

---

## Step 7: Post-Deploy Verification

1. **Check health endpoint**:
   ```bash
   curl https://invoice.mlforge.in/api/v1/health
   ```
   Should return `{"status": "ok"}`

2. **Test signup flow**:
   - Sign up → should see onboarding wizard
   - Complete onboarding → should see dashboard
   - Dashboard should show "3-day free trial active"

3. **Test Stripe checkout**:
   - Go to Settings → Plan card → "Upgrade to Pro"
   - Should redirect to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`, any future date, any CVC
   - Should complete → redirect to dashboard with "Subscription Active"

4. **Test invoice sync** (if Stripe connection exists):
   - Dashboard → Invoices → "Sync Stripe"
   - Should fetch invoices from customer's Stripe account
   - Stats (total invoiced, outstanding) should populate

5. **Test manual invoice creation** (Phase 5):
   - Dashboard → Invoices → "New Invoice"
   - Create an invoice → should appear in list
   - Verify `synced_from_stripe = false` in DB

6. **Test reminders** (if invoice is overdue):
   - Cron should fire daily at 00:00 UTC
   - Check `reminder_delivery_logs` table for sent records

---

## Step 8: Monitoring

**Set up alerts for:**
- Stripe webhook failures (Stripe dashboard → Webhooks → view failed deliveries)
- Cron job failures (check `reminder_delivery_logs` for status = 'unknown')
- Database size (Supabase dashboard)

**Optional but recommended:**
- Sentry (error tracking): `npm install @sentry/nextjs`
- PostHog (analytics): `npm install posthog-js`

---

## Rollback Plan

If deployment breaks production:

1. **Revert to previous commit**:
   ```bash
   git revert HEAD
   git push
   ```
   Netlify/Vercel auto-redeploys from main branch

2. **Rollback Supabase migration** (if needed):
   - Migrations are append-only; to undo:
   - Drop columns/tables manually in SQL Editor if necessary
   - Consider creating a new migration to undo changes

---

## After Launch

- **Week 1**: Monitor Stripe webhook deliveries, email send logs
- **Week 2**: Gather user feedback from beta signups
- **Week 3+**: Marketing push (Twitter, Reddit, HN)

---

## Contacts
- Stripe Support: https://support.stripe.com
- Resend Support: https://resend.com/support
- Supabase Support: https://supabase.com/support
