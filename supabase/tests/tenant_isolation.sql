-- tenant_isolation.sql
-- Manual RLS / tenant-isolation check (B2). Run in the Supabase SQL editor.
-- It creates two throwaway orgs + users, then asserts one cannot see the other's rows.
-- Everything is rolled back at the end.

BEGIN;

-- ── setup ──────────────────────────────────────────────────────────────
DO $$
DECLARE
  user_a UUID := gen_random_uuid();
  user_b UUID := gen_random_uuid();
  org_a  UUID;
  org_b  UUID;
BEGIN
  -- fake auth.users rows (service role only)
  INSERT INTO auth.users (id, email, raw_user_meta_data, aud, role)
  VALUES (user_a, 'iso-a@example.test', '{}'::jsonb, 'authenticated', 'authenticated'),
         (user_b, 'iso-b@example.test', '{}'::jsonb, 'authenticated', 'authenticated');

  -- the 0006 trigger creates an org + owner membership per user
  SELECT id INTO org_a FROM public.organizations WHERE created_by = user_a LIMIT 1;
  SELECT id INTO org_b FROM public.organizations WHERE created_by = user_b LIMIT 1;

  INSERT INTO public.clients (id, user_id, organization_id, name)
  VALUES ('iso_client_a', user_a, org_a, 'A client'),
         ('iso_client_b', user_b, org_b, 'B client');

  INSERT INTO public.invoices (id, user_id, organization_id, date, amount, status)
  VALUES ('iso_inv_a', user_a, org_a, now(), 100, 'Overdue'),
         ('iso_inv_b', user_b, org_b, now(), 200, 'Overdue');

  -- ── assert: user A sees only org A ──────────────────────────────────
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_a, 'role', 'authenticated')::text, true);
  SET LOCAL ROLE authenticated;

  IF (SELECT count(*) FROM public.invoices WHERE id = 'iso_inv_b') <> 0 THEN
    RAISE EXCEPTION 'FAIL: user A can read user B invoice';
  END IF;
  IF (SELECT count(*) FROM public.clients WHERE id = 'iso_client_b') <> 0 THEN
    RAISE EXCEPTION 'FAIL: user A can read user B client';
  END IF;
  IF (SELECT count(*) FROM public.invoices WHERE id = 'iso_inv_a') <> 1 THEN
    RAISE EXCEPTION 'FAIL: user A cannot read own invoice';
  END IF;

  -- ── assert: user A cannot write into org B ─────────────────────────
  BEGIN
    INSERT INTO public.clients (id, user_id, organization_id, name)
    VALUES ('iso_client_x', user_a, org_b, 'cross-tenant write');
    RAISE EXCEPTION 'FAIL: user A wrote a client into org B';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    NULL; -- expected
  END;

  RESET ROLE;
  RAISE NOTICE 'PASS: tenant isolation holds for invoices + clients';
END $$;

ROLLBACK;
