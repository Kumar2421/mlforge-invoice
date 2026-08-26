-- Phase 0-2: core schema (Stripe connection, clients, invoices, payments)
-- auth.users is Supabase-managed; every table here scopes rows to it via user_id + RLS.

CREATE TABLE IF NOT EXISTS public.stripe_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    stripe_account_id VARCHAR NOT NULL,
    restricted_key TEXT NOT NULL, -- read-only restricted key; encrypt at rest via Supabase Vault before production
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_synced_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.stripe_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own Stripe connection"
ON public.stripe_connections
FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.clients (
    id VARCHAR PRIMARY KEY, -- Stripe customer id when synced, or a generated id for manually-added clients
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name VARCHAR NOT NULL,
    company VARCHAR DEFAULT '',
    email VARCHAR DEFAULT '',
    avatar_img INTEGER DEFAULT 1,
    total_invoiced NUMERIC DEFAULT 0,
    outstanding_balance NUMERIC DEFAULT 0,
    on_time_rate NUMERIC DEFAULT 100,
    reminders_muted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own clients"
ON public.clients
FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.invoices (
    id VARCHAR PRIMARY KEY, -- Stripe invoice id when synced, or a generated id for manually-tracked invoices
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    client_id VARCHAR REFERENCES public.clients(id),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    amount NUMERIC NOT NULL,
    status VARCHAR NOT NULL CHECK (status IN ('Paid', 'Pending', 'Unpaid', 'Overdue', 'Cancelled', 'Draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own invoices"
ON public.invoices
FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR PRIMARY KEY, -- Stripe charge id when synced
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    invoice_id VARCHAR REFERENCES public.invoices(id),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount NUMERIC NOT NULL,
    method VARCHAR NOT NULL CHECK (method IN ('Stripe', 'PayPal', 'Manual')),
    status VARCHAR NOT NULL CHECK (status IN ('Succeeded', 'Refunded', 'Failed', 'Pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own payments"
ON public.payments
FOR ALL USING (auth.uid() = user_id);
