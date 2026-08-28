-- 0013_rls_audit_and_cleanup.sql

-- Ensure RLS is enabled on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated users or service role
-- Since contact form might be public, allow inserts if needed, or rely on service_role bypassing RLS
CREATE POLICY "Enable insert for authenticated users only"
ON public.contact_messages FOR INSERT TO authenticated WITH CHECK (true);

-- Ensure all core tables have strict RLS enforced
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_activity_log ENABLE ROW LEVEL SECURITY;
