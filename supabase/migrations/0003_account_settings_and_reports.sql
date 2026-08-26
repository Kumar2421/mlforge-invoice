-- Phase 4/5 foundation: persisted user settings for reminder cadence and sender identity.

CREATE TABLE IF NOT EXISTS public.account_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    sender_name TEXT DEFAULT '',
    sender_email TEXT DEFAULT '',
    reply_to_email TEXT DEFAULT '',
    reminder_cadence_days JSONB NOT NULL DEFAULT '[3, 7, 14]'::jsonb,
    plan_slug VARCHAR NOT NULL DEFAULT 'solo' CHECK (plan_slug IN ('solo', 'pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.account_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own account settings"
ON public.account_settings
FOR ALL USING (auth.uid() = user_id);
