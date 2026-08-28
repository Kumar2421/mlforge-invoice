CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    organization_id UUID REFERENCES public.organizations(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    assigned_to UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own tickets
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
    FOR SELECT USING (user_id = auth.uid());

-- Allow users to create tickets
CREATE POLICY "Users can create tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow platform admins to manage all tickets
CREATE POLICY "Platform admins can manage all tickets" ON public.support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.platform_admins WHERE id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.platform_admins WHERE id = auth.uid()
        )
    );

-- Seed some mock tickets for the admin dashboard since the product isn't fully ready
INSERT INTO public.support_tickets (subject, description, user_id, assigned_to, status, priority)
SELECT 'Stripe sync is delayed', 'Sync is taking longer than 48 hours.', id, NULL, 'open', 'high'
FROM auth.users LIMIT 1;

INSERT INTO public.support_tickets (subject, description, user_id, assigned_to, status, priority)
SELECT 'Where do I change my sender email?', 'I need to update my brand email.', id, id, 'in_progress', 'normal'
FROM auth.users LIMIT 1 OFFSET 1;

INSERT INTO public.support_tickets (subject, description, user_id, assigned_to, status, priority)
SELECT 'Trial extension request', 'Can we get 7 more days to evaluate?', id, id, 'open', 'normal'
FROM auth.users LIMIT 1 OFFSET 2;
