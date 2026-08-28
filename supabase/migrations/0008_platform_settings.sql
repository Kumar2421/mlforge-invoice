CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow platform admins to view and edit settings
CREATE POLICY "Platform admins can view settings" ON public.platform_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.platform_admins WHERE id = auth.uid()
        )
    );

CREATE POLICY "Platform admins can update settings" ON public.platform_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.platform_admins WHERE id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.platform_admins WHERE id = auth.uid()
        )
    );

-- Seed initial settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('manual_invoice_tracking', '{"enabled": true, "percentage": 20}'::jsonb, 'Feature flag for manual invoice tracking rollout'),
  ('sms_reminders', '{"enabled": false}'::jsonb, 'Feature flag for SMS reminders'),
  ('team_invitations', '{"enabled": true, "preview": true}'::jsonb, 'Feature flag for Team invitations'),
  ('daily_send_limit', '20000'::jsonb, 'Global daily limit for outgoing reminder emails'),
  ('retry_window_minutes', '30'::jsonb, 'Time window in minutes before retrying a failed reminder'),
  ('default_cadence_days', '[3, 7, 14]'::jsonb, 'Default schedule for reminder sequences')
ON CONFLICT (key) DO NOTHING;
