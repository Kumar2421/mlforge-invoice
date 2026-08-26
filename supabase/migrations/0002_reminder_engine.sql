-- Phase 3: reminder engine schema.
-- Scheduling itself is NOT done here anymore — Vercel Cron (see /vercel.json) hits
-- /api/v1/cron/reminders on a schedule instead of pg_cron pinging a worker directly.
-- This keeps scheduling config in one place (the app repo) instead of split between
-- Postgres and the deployment platform.

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

ALTER TABLE public.reminder_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reminder sequences"
ON public.reminder_sequences
FOR ALL USING (auth.uid() = user_id);

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

CREATE TABLE IF NOT EXISTS public.reminder_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    invoice_id VARCHAR REFERENCES public.invoices(id),
    client_id VARCHAR REFERENCES public.clients(id),
    stage_id UUID REFERENCES public.reminder_stages(id),
    event_type VARCHAR NOT NULL, -- e.g. 'email_sent', 'sequence_paused', 'sequence_completed'
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reminder_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminder activity logs"
ON public.reminder_activity_log
FOR SELECT USING (auth.uid() = user_id);
