-- 0015_email_preferences.sql

CREATE TABLE public.email_unsubscribes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    reason TEXT
);

ALTER TABLE public.email_unsubscribes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert into unsubscribes" 
ON public.email_unsubscribes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Workspace members can view unsubscribes" 
ON public.email_unsubscribes 
FOR SELECT 
USING (public.is_organization_member(organization_id));
