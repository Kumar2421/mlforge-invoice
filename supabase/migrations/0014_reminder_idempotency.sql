-- 0014_reminder_idempotency.sql

CREATE TABLE public.reminder_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    invoice_id TEXT NOT NULL,
    reminder_stage_id UUID NOT NULL REFERENCES public.reminder_stages(id) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    status TEXT NOT NULL, -- e.g., 'delivered', 'failed', 'bounced'
    UNIQUE (invoice_id, reminder_stage_id)
);

ALTER TABLE public.reminder_delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members manage reminder delivery logs" 
ON public.reminder_delivery_logs 
FOR ALL 
USING (public.is_organization_member(organization_id)) 
WITH CHECK (public.is_organization_member(organization_id));
