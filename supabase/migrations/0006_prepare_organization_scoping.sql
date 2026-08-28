CREATE OR REPLACE FUNCTION public.create_personal_organization_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_organization_id UUID;
    workspace_name TEXT;
BEGIN
    workspace_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'company_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
        NULLIF(SPLIT_PART(NEW.email, '@', 1), ''),
        'My workspace'
    );

    INSERT INTO public.organizations (name, created_by)
    VALUES (workspace_name, NEW.id)
    RETURNING id INTO new_organization_id;

    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (new_organization_id, NEW.id, 'owner');

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_organization ON auth.users;
CREATE TRIGGER on_auth_user_created_organization
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.create_personal_organization_for_user();

INSERT INTO public.organizations (name, created_by)
SELECT
    COALESCE(
        NULLIF(TRIM(user_record.raw_user_meta_data ->> 'company_name'), ''),
        NULLIF(TRIM(user_record.raw_user_meta_data ->> 'full_name'), ''),
        NULLIF(SPLIT_PART(user_record.email, '@', 1), ''),
        'My workspace'
    ),
    user_record.id
FROM auth.users AS user_record
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization_members member
    WHERE member.user_id = user_record.id
);

INSERT INTO public.organization_members (organization_id, user_id, role)
SELECT organization.id, organization.created_by, 'owner'
FROM public.organizations AS organization
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization_members member
    WHERE member.organization_id = organization.id
    AND member.user_id = organization.created_by
);

ALTER TABLE public.stripe_connections ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.reminder_sequences ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.reminder_stages ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.reminder_activity_log ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.account_settings ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

UPDATE public.stripe_connections AS record SET organization_id = organization.id FROM public.organizations AS organization WHERE record.organization_id IS NULL AND organization.created_by = record.user_id;
UPDATE public.clients AS record SET organization_id = organization.id FROM public.organizations AS organization WHERE record.organization_id IS NULL AND organization.created_by = record.user_id;
UPDATE public.invoices AS record SET organization_id = organization.id FROM public.organizations AS organization WHERE record.organization_id IS NULL AND organization.created_by = record.user_id;
UPDATE public.payments AS record SET organization_id = organization.id FROM public.organizations AS organization WHERE record.organization_id IS NULL AND organization.created_by = record.user_id;
UPDATE public.reminder_sequences AS record SET organization_id = organization.id FROM public.organizations AS organization WHERE record.organization_id IS NULL AND organization.created_by = record.user_id;
UPDATE public.reminder_activity_log AS record SET organization_id = organization.id FROM public.organizations AS organization WHERE record.organization_id IS NULL AND organization.created_by = record.user_id;
UPDATE public.account_settings AS record SET organization_id = organization.id FROM public.organizations AS organization WHERE record.organization_id IS NULL AND organization.created_by = record.user_id;
UPDATE public.reminder_stages AS stage SET organization_id = sequence.organization_id FROM public.reminder_sequences AS sequence WHERE stage.organization_id IS NULL AND sequence.id = stage.sequence_id;

ALTER TABLE public.stripe_connections ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.clients ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.invoices ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.payments ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.reminder_sequences ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.reminder_stages ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.reminder_activity_log ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.account_settings ALTER COLUMN organization_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS stripe_connections_organization_id_idx ON public.stripe_connections(organization_id);
CREATE INDEX IF NOT EXISTS clients_organization_id_idx ON public.clients(organization_id);
CREATE INDEX IF NOT EXISTS invoices_organization_id_idx ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS payments_organization_id_idx ON public.payments(organization_id);
CREATE INDEX IF NOT EXISTS reminder_sequences_organization_id_idx ON public.reminder_sequences(organization_id);
CREATE INDEX IF NOT EXISTS reminder_stages_organization_id_idx ON public.reminder_stages(organization_id);
CREATE INDEX IF NOT EXISTS reminder_activity_log_organization_id_idx ON public.reminder_activity_log(organization_id);
CREATE INDEX IF NOT EXISTS account_settings_organization_id_idx ON public.account_settings(organization_id);
