-- Add SaaS billing and trial tracking to the organizations table

ALTER TABLE public.organizations
ADD COLUMN trial_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled')),
ADD COLUMN stripe_customer_id TEXT;

COMMENT ON COLUMN public.organizations.trial_starts_at IS 'Timestamp when the free trial started for the organization.';
COMMENT ON COLUMN public.organizations.subscription_status IS 'SaaS subscription status (trialing, active, past_due, canceled).';
COMMENT ON COLUMN public.organizations.stripe_customer_id IS 'Stripe Customer ID in our SaaS platform (not the user connected Stripe account).';
