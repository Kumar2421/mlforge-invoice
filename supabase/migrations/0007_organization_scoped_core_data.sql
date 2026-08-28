DROP POLICY IF EXISTS "Users manage their own Stripe connection" ON public.stripe_connections;
DROP POLICY IF EXISTS "Users manage their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users manage their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users manage their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can manage their own reminder sequences" ON public.reminder_sequences;
DROP POLICY IF EXISTS "Users can view their own reminder stages" ON public.reminder_stages;
DROP POLICY IF EXISTS "Users can view their own reminder activity logs" ON public.reminder_activity_log;

CREATE POLICY "Workspace members manage Stripe connections" ON public.stripe_connections FOR ALL USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY "Workspace members manage clients" ON public.clients FOR ALL USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY "Workspace members manage invoices" ON public.invoices FOR ALL USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY "Workspace members manage payments" ON public.payments FOR ALL USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY "Workspace members manage reminder sequences" ON public.reminder_sequences FOR ALL USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY "Workspace members manage reminder stages" ON public.reminder_stages FOR ALL USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY "Workspace members manage reminder activity" ON public.reminder_activity_log FOR ALL USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));
