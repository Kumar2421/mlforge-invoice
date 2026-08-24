-- Phase 3: Reminder Engine Schema and pg_cron Setup

-- 1. Create the reminder_sequences table
CREATE TABLE IF NOT EXISTS public.reminder_sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    invoice_id VARCHAR NOT NULL REFERENCES public.invoices(id),
    client_id VARCHAR NOT NULL REFERENCES public.clients(id),
    current_stage_day INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(invoice_id)
);

-- Enable RLS for reminder_sequences
ALTER TABLE public.reminder_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reminder sequences" 
ON public.reminder_sequences 
FOR ALL USING (auth.uid() = user_id);

-- 2. Create the reminder_stages table (for tracking execution state of each step)
CREATE TABLE IF NOT EXISTS public.reminder_stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id UUID REFERENCES public.reminder_sequences(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'sent', 'skipped', 'failed')),
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sequence_id, day)
);

-- Enable RLS for reminder_stages
ALTER TABLE public.reminder_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminder stages" 
ON public.reminder_stages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.reminder_sequences 
    WHERE reminder_sequences.id = reminder_stages.sequence_id 
    AND reminder_sequences.user_id = auth.uid()
  )
);

-- 3. Create the reminder_activity_log table (for the UI timeline)
CREATE TABLE IF NOT EXISTS public.reminder_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    invoice_id VARCHAR REFERENCES public.invoices(id),
    client_id VARCHAR REFERENCES public.clients(id),
    stage_id UUID REFERENCES public.reminder_stages(id),
    event_type VARCHAR NOT NULL, -- e.g., 'email_sent', 'sequence_paused', 'sequence_completed'
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for reminder_activity_log
ALTER TABLE public.reminder_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminder activity logs" 
ON public.reminder_activity_log 
FOR SELECT USING (auth.uid() = user_id);


-- ==========================================
-- CRON JOB CONFIGURATION (pg_cron & pg_net)
-- ==========================================
-- Make sure pg_cron and pg_net extensions are enabled
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the daily cron job that pings our Cloudflare Worker / Hono backend
-- Replace 'https://your-hono-worker.workers.dev' with your actual deployed backend URL 
-- or a local tunnel (like ngrok/localtunnel) for local testing.
-- Also replace 'YOUR_SECRET_CRON_KEY' with a strong random string.
SELECT cron.schedule(
  'process-daily-reminders',
  '0 9 * * *', -- Run every day at 09:00 AM UTC
  $$
    SELECT net.http_post(
        url:='https://YOUR_BACKEND_URL/api/v1/cron/reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SECRET_CRON_KEY"}'::jsonb,
        body:='{"source": "pg_cron"}'::jsonb
    );
  $$
);
