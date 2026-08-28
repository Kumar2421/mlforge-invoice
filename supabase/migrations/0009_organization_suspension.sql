ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES auth.users(id);

COMMENT ON COLUMN public.organizations.is_suspended IS 'Flag indicating if the organization is suspended from platform usage.';
