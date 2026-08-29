-- 0017_launch_hardening.sql
-- Bundles the backend launch-blocker fixes B1–B8:
--  B1  org-scope account_settings (drop the last auth.uid() policy)
--  B2  RLS policy audit — explicit WITH CHECK on every core table, tighten helpers
--  B3  advisory-lock helper for the reminder cron + stuck-delivery reconciliation
--  B4  reminder_stages.subject/body (+ seed) so user templates actually persist & send
--  B5  organizations.onboarded_at so onboarding has a real completion flag
--  B8  own-subscription billing columns + a stripe_webhook_events dedupe table

------------------------------------------------------------------------------
-- B1 + B2 : account_settings is organization-scoped
------------------------------------------------------------------------------

-- Column + backfill already ran in 0006. Guarantee a row per organization.
INSERT INTO public.account_settings (user_id, organization_id)
SELECT o.created_by, o.id
FROM public.organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.account_settings s WHERE s.organization_id = o.id
)
ON CONFLICT DO NOTHING;

-- account_settings PK is user_id (0003). Add a uniqueness guarantee on org so
-- upsert(onConflict: organization_id) is safe.
CREATE UNIQUE INDEX IF NOT EXISTS account_settings_organization_id_key
  ON public.account_settings(organization_id);

DROP POLICY IF EXISTS "Users manage their own account settings" ON public.account_settings;

CREATE POLICY "Workspace members manage account settings"
ON public.account_settings
FOR ALL
USING (public.is_organization_member(organization_id))
WITH CHECK (public.is_organization_member(organization_id));

------------------------------------------------------------------------------
-- B2 : RLS policy audit — make every core-table policy explicit on WITH CHECK.
-- 0007 created "FOR ALL USING(...) WITH CHECK(...)" already; re-assert idempotently
-- so a partially-applied environment converges, and add the two tables 0007 missed
-- when only a SELECT policy existed historically.
------------------------------------------------------------------------------

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'stripe_connections','clients','invoices','payments','reminder_delivery_logs',
    'reminder_sequences','reminder_stages','reminder_activity_log'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format($f$DROP POLICY IF EXISTS "Workspace members manage %1$s" ON public.%1$I$f$, t);
    EXECUTE format(
      $f$CREATE POLICY "Workspace members manage %1$s" ON public.%1$I
         FOR ALL
         USING (public.is_organization_member(organization_id))
         WITH CHECK (public.is_organization_member(organization_id))$f$, t);
  END LOOP;
END $$;

-- Harden the membership helper: reject NULL org id explicitly, keep SECURITY DEFINER
-- + locked search_path (already set in 0005, re-assert).
CREATE OR REPLACE FUNCTION public.is_organization_member(target_organization_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT target_organization_id IS NOT NULL
       AND EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = target_organization_id
          AND user_id = auth.uid()
    );
$$;

-- Role helper for write paths that must be owner/admin only.
CREATE OR REPLACE FUNCTION public.has_organization_role(
  target_organization_id UUID,
  allowed_roles TEXT[]
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT target_organization_id IS NOT NULL
       AND EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = target_organization_id
          AND user_id = auth.uid()
          AND role = ANY(allowed_roles)
    );
$$;

------------------------------------------------------------------------------
-- B3 : reminder cron overlap guard + stuck-delivery reconciliation
------------------------------------------------------------------------------

-- Single global advisory lock key for the reminder sweep. 0x52454d494e = "REMIN".
CREATE OR REPLACE FUNCTION public.try_lock_reminder_sweep()
RETURNS BOOLEAN
LANGUAGE SQL
AS $$
  SELECT pg_try_advisory_lock(352914) ;
$$;

CREATE OR REPLACE FUNCTION public.unlock_reminder_sweep()
RETURNS BOOLEAN
LANGUAGE SQL
AS $$
  SELECT pg_advisory_unlock(352914) ;
$$;

-- Any delivery row left 'pending' for >30 min means the process died mid-send.
-- Mark it 'unknown' so it is never silently retried and is visible in ops.
CREATE OR REPLACE FUNCTION public.reconcile_stuck_reminder_deliveries()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.reminder_delivery_logs
  SET status = 'unknown'
  WHERE status = 'pending'
    AND sent_at < timezone('utc', now()) - INTERVAL '30 minutes';
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

------------------------------------------------------------------------------
-- B4 : persist per-stage reminder templates
------------------------------------------------------------------------------

ALTER TABLE public.reminder_stages
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS tone TEXT
    CHECK (tone IN ('gentle','firm','final'));

-- Org-level default templates, editable from Settings → "Default Template".
CREATE TABLE IF NOT EXISTS public.reminder_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('gentle','firm','final')),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE (organization_id, day)
);

ALTER TABLE public.reminder_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members manage reminder templates"
ON public.reminder_templates
FOR ALL
USING (public.is_organization_member(organization_id))
WITH CHECK (public.is_organization_member(organization_id));

-- Seed the default 3-stage cadence for every existing organization.
INSERT INTO public.reminder_templates (organization_id, day, tone, subject, body)
SELECT o.id, v.day, v.tone, v.subject, v.body
FROM public.organizations o
CROSS JOIN (VALUES
  (3, 'gentle',
   'Friendly reminder: invoice {{invoice}} is overdue',
   'Hi {{client}},' || chr(10) || chr(10) ||
   'Hope all is well. This is a gentle reminder that invoice {{invoice}} for {{amount}} is now past its due date. If it is already on its way, thank you — please ignore this note.' || chr(10) || chr(10) ||
   'If anything is holding it up, just reply to this email and let us know.' || chr(10) || chr(10) ||
   'Thanks,' || chr(10) || '{{sender}}'),
  (7, 'firm',
   'Payment overdue: invoice {{invoice}} ({{amount}})',
   'Hi {{client}},' || chr(10) || chr(10) ||
   'Invoice {{invoice}} for {{amount}} is now a week past due. Please arrange payment at your earliest convenience.' || chr(10) || chr(10) ||
   'If there is a problem with the invoice, reply to this email so we can sort it out.' || chr(10) || chr(10) ||
   'Thanks,' || chr(10) || '{{sender}}'),
  (14, 'final',
   'Final notice: invoice {{invoice}} is 14 days overdue',
   'Hi {{client}},' || chr(10) || chr(10) ||
   'This is a final reminder that invoice {{invoice}} for {{amount}} is now two weeks overdue. Please settle it promptly to avoid further follow-up.' || chr(10) || chr(10) ||
   'If you have already paid, reply and let us know so we can close this out.' || chr(10) || chr(10) ||
   'Thanks,' || chr(10) || '{{sender}}')
) AS v(day, tone, subject, body)
ON CONFLICT (organization_id, day) DO NOTHING;

-- Backfill tone on existing stages from their day.
UPDATE public.reminder_stages
SET tone = CASE WHEN day <= 3 THEN 'gentle' WHEN day <= 7 THEN 'firm' ELSE 'final' END
WHERE tone IS NULL;

------------------------------------------------------------------------------
-- B5 : onboarding completion flag
------------------------------------------------------------------------------

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMP WITH TIME ZONE;

-- Treat an existing Stripe connection as already-onboarded (matches old logic).
UPDATE public.organizations o
SET onboarded_at = timezone('utc', now())
WHERE o.onboarded_at IS NULL
  AND EXISTS (SELECT 1 FROM public.stripe_connections c WHERE c.organization_id = o.id);

------------------------------------------------------------------------------
-- B8 : own-subscription billing (Stripe Checkout for OUR plans)
------------------------------------------------------------------------------

-- 0011 added trial_starts_at / subscription_status / stripe_customer_id.
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'solo' CHECK (plan IN ('solo','pro')),
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;

-- Trial window is 3 days (enforced in app code via TRIAL_DAYS). Keep the default
-- timestamp on trial_starts_at so a fresh org starts its clock at creation.
ALTER TABLE public.organizations
  ALTER COLUMN trial_starts_at SET DEFAULT timezone('utc', now());

-- Idempotency for Stripe webhooks (both the customer connection webhook and the
-- billing webhook). Insert-or-conflict on event id before processing.
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id TEXT PRIMARY KEY,               -- Stripe event id (evt_...)
  type TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;
-- No policies: only the service-role client (webhook handlers) touches this.

------------------------------------------------------------------------------
-- Backfill organization_id on payments (was added in 0006 but never backfilled)
------------------------------------------------------------------------------

UPDATE public.payments p
SET organization_id = i.organization_id
FROM public.invoices i
WHERE p.invoice_id = i.id
  AND p.organization_id IS NULL;

------------------------------------------------------------------------------
-- Phase 5: Manual invoices (not synced from Stripe)
------------------------------------------------------------------------------

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS synced_from_stripe BOOLEAN NOT NULL DEFAULT true;

-- Existing invoices are assumed to be Stripe-synced (or manually created pre-Phase-5).
-- New manual invoices will set this to false when created via the app.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;

------------------------------------------------------------------------------
-- Phase 4: PayPal connection stub (read-only, like Stripe)
------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.paypal_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  -- PayPal OAuth token (encrypted at rest by Supabase)
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  -- Metadata
  paypal_account_id TEXT NOT NULL UNIQUE,
  paypal_email TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE(organization_id) -- one PayPal connection per org
);

ALTER TABLE public.paypal_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members manage PayPal connection"
ON public.paypal_connections
FOR ALL
USING (public.is_organization_member(organization_id))
WITH CHECK (public.is_organization_member(organization_id));
