# mlforge Invoice — Implementation Plan

## Goal

Ship a SaaS where a freelancer connects their own Stripe (and later PayPal) account **read-only**, and the product automatically sends escalating payment reminder emails for overdue invoices — no invoice creation, no money movement, flat $9–15/mo, no percentage cut.

Core loop: **Stripe has the invoice → we detect it's overdue → we send Day 3 / Day 7 / Day 14 reminder emails → we stop the moment it's paid.**

Everything defined here builds toward that loop. Nothing outside it is in scope for v1.

## Current state (as of this doc)

- **Frontend**: Next.js 16 App Router, fully built as a mocked UI — every page (`Dashboard`, `Invoices`, `Clients`, `Payments`, `Reports`, `Reminders`, `Settings`, `New Reminder Sequence`) exists under `src/components/`, wired via client-side tab state in `Dashboard.tsx`. All data is inline-hardcoded arrays. Zero backend calls.
- **Reference backend**: `reffolder/minvoice/` is a separate, already-working invoicing app (Hono + Cloudflare Workers + D1 + Drizzle-style migrations, email outbox pattern, PDF generation, login-attempt tracking). It is NOT our backend — it's a design reference for patterns worth reusing (migrations layout, email outbox, auth scaffolding), since it solves adjacent problems (sending invoices, generating PDFs) with a stack that fits our budget (Cloudflare = cheap, fast, matches a $9/mo flat-fee margin).
- **Design system**: locked this session — `--radius: 0.5rem` base, green `#22C55E` primary, teal `#074E5B` secondary, established scroll pattern (`flex-1 min-h-0 overflow-y-auto`, learned the hard way — don't regress it).

## Architecture decision

Two services, kept intentionally simple:

1. **Frontend** — this repo (`forge-invoice`), Next.js, deployed as-is (Vercel or Cloudflare Pages).
2. **Backend** — new Cloudflare Worker (Hono), modeled on `reffolder/minvoice`'s structure but built fresh for this product's schema. Supabase for database (PostgreSQL) and Authentication, Cloudflare Queues for the reminder scheduler, Cloudflare Cron Triggers for the daily overdue-check.

Frontend talks to backend over a versioned JSON API (`/api/v1/...`), auth via Supabase session cookie/JWT, CORS locked to the frontend origin.

Why not Next.js API routes / server actions instead of a separate Worker: the reminder engine needs a reliable cron + queue (retry-safe "check every overdue invoice once a day, send if due" job) that outlives a single request — that's what Cloudflare Cron Triggers + Queues are for. Supabase provides a robust relational DB and handles all auth edge cases out of the box.

---

## Phase 0 — Foundations (backend scaffolding)

**Goal:** empty but real backend exists, deployable, with auth.

- Init Hono + Cloudflare Workers project (`apps/api/` or sibling repo — decide based on whether this stays a monorepo).
- Supabase schema setup: `stripe_connections` (encrypted refresh token, restricted-key scope, connected_at, last_synced_at) extending the default `auth.users`.
- Auth: Supabase Auth (Email+Password or Magic Link) using `@supabase/supabase-js`.
- Health check endpoint, deploy pipeline (`wrangler deploy`), staging + prod environments.

**Done when:** can create an account, log in, get a session cookie, hit an authenticated `/api/v1/me` endpoint from `curl`.

---

## Phase 1 — Stripe read-only connect

**Goal:** a user can connect their Stripe account with zero write scope, and we can prove it's genuinely read-only end to end.

- Stripe Connect OAuth flow, **restricted key** with read-only scopes only (`invoices:read`, `charges:read`, `customers:read` — no `write` anywhere). This is the product's core trust claim; get the scope list right and keep it visible in code review, not just marketing copy.
- Backend endpoint: `POST /api/v1/stripe/connect` (starts OAuth), `GET /api/v1/stripe/callback` (exchanges code, stores restricted key encrypted at rest — Supabase pgsodium or Cloudflare secrets).
- `GET /api/v1/stripe/status` — connection state, last synced timestamp, scope list (frontend Settings page renders this directly, replacing the mocked "Read-only / Last synced 4 minutes ago" chip already built).
- Disconnect endpoint that actually revokes the Stripe key, not just deletes our local row.

**Done when:** connect flow works against a real (test-mode) Stripe account, and the Settings page shows a real connection instead of the mocked one.

---

## Phase 2 — Data sync (invoices, clients, payments)

**Goal:** replace every hardcoded array in the frontend with real Stripe-sourced data.

- Sync job (Cron Trigger, every 15 min + on-demand via Stripe webhook `invoice.*` and `charge.*` events): pull invoices, derive `clients` from Stripe customers, pull `payments` from charges/payment_intents. Store in Supabase Postgres (`invoices`, `clients`, `payments` tables — schema maps directly onto the `Invoice`/`Client`/`Payment` types already defined in `src/types/index.ts`, written with this sync in mind).
- Stripe webhook endpoint (`POST /api/v1/webhooks/stripe`), signature-verified, idempotent (Stripe can redeliver).
- REST endpoints: `GET /api/v1/invoices`, `GET /api/v1/clients`, `GET /api/v1/payments`, each paginated to match the existing frontend pagination UI (`Showing 15 of 100` pattern already built into `InvoicesView`/`ClientsView`/`PaymentsView`).

**Done when:** a real overdue invoice from a test Stripe account shows up in the `Invoices` and `Dashboard` pages with correct amount/status/dates.

---

## Phase 3 — Reminder engine (the actual product)

**Goal:** the escalating Day 3 / 7 / 14 reminder logic runs for real, on a schedule, and stops itself correctly.

- `reminder_sequences` + `reminder_stages` tables (maps onto `ReminderSequence`/`ReminderStage` types already defined).
- Daily Cron Trigger: for every overdue invoice without a paused/completed sequence, check if a stage is due today → enqueue a send job (Cloudflare Queue, not a direct send — keeps the cron job fast and gives retry-on-failure for free).
- Queue consumer: renders the stage's subject/body template (same `{{client}}` / `{{invoice}}` / `{{amount}}` interpolation already built into `ReminderSequenceView`'s preview), sends via a transactional email provider (Resend or Postmark — pick one, both have clean Worker-compatible SDKs), logs to `reminder_activity_log` (backs the "Activity Log" panel already built in `RemindersView`).
- Auto-pause: webhook-driven — when Stripe reports the invoice paid, mark the sequence `paused`/`completed` immediately, don't wait for the next cron tick.
- Per-client mute (`clients.reminders_muted`) and per-sequence pause/resume — both already have working UI toggles in `ClientsView` and `RemindersView`; wire them to `PATCH` endpoints.

**Done when:** create a test overdue invoice, watch a Day-3 email actually arrive, mark it paid in Stripe test mode, confirm the sequence stops.

---

## Phase 4 — Middleware & frontend wiring

**Goal:** delete every mock array, frontend is a real client of the backend.

- API client layer in the frontend (`src/lib/api.ts`), thin `fetch` wrapper with the session cookie, typed against `src/types/index.ts` (already shared-shape, minimal friction).
- Replace inline mock data in `RemindersView`, `ClientsView`, `PaymentsView`, `ReportsView`, `InvoicesView`, `Dashboard` main view with real fetches — likely via React Server Components for initial load + client-side mutation for toggles (pause/mute/etc.), matching Next.js App Router conventions this repo is already built on.
- Loading/empty/error states: the design system doesn't have these yet (mocked data is always "present") — needs skeleton states for tables and the reminder timeline, an empty state for "no clients yet" / "Stripe not connected" (the latter should redirect to a connect-Stripe first-run flow, replacing the current default-populated Dashboard).
- Auth middleware on the frontend: unauthenticated users redirect to login; add `middleware.ts` checking the session cookie before rendering protected routes.

**Done when:** fresh account, no data, sees a real "Connect Stripe" first-run screen; after connecting, real data populates every page; refreshing the browser doesn't lose state.

---

## Phase 5 — Billing (the SaaS's own subscription, not the customer's Stripe)

**Goal:** collect the $9/$15 flat fee. This is a *second*, separate Stripe integration — our own platform account, full API access — not to be confused with the read-only customer connection from Phase 1. Keep these two Stripe integrations architecturally separate in code (different keys, different modules) so the "read-only" trust claim about customer data is never technically muddied by the fact that we do use Stripe normally for our own billing.

- Stripe Checkout for subscription signup, Stripe Customer Portal for plan management/cancellation.
- Webhook-driven plan state (`subscription_status`, `plan` on `users`), gate Pro-only features (PayPal connect, custom cadences) behind `plan === 'pro'`.
- Settings → Plan & Billing card (already built, static) wired to real subscription state + a real "Upgrade" checkout redirect.

**Done when:** can subscribe, get charged in test mode, see the correct plan reflected in Settings, and get gated correctly.

---

## Phase 6 — PayPal (Pro tier)

**Goal:** second read-only provider, same trust model as Stripe.

- PayPal OAuth (read-only scope), same connect/status/disconnect endpoint shape as Phase 1, same sync job pattern as Phase 2 but for PayPal's transaction API.
- Frontend: the PayPal "Connect" chip already exists in the sidebar and Settings — wire it, gate behind Pro plan (Phase 5).

**Done when:** a Pro user connects PayPal and PayPal-sourced invoices/payments show up alongside Stripe ones in the same tables.

---

## Phase 7 — Launch hardening

**Goal:** not embarrassing at 100 real users.

- Rate limiting on auth + webhook endpoints.
- Error tracking (Sentry or Cloudflare's own logging) on both frontend and Worker.
- Reminder-send idempotency audit (never double-send a stage — this is the one bug that would break trust immediately).
- Backup/restore plan for Supabase (PITR).
- Terms covering the read-only claim precisely (legal review, not engineering, but flag it here so it doesn't get forgotten).
- Load-test the daily cron against a realistic invoice count before the first paying cohort.

**Done when:** could hand this to 100 real freelancers without checking logs every hour.

---

## Sequencing note

Phases 0–4 are the actual product (a user can connect Stripe and get reminded). Phases 5–7 are what make it a sellable, sustainable business. Do not let billing (Phase 5) block Phase 3 — the reminder engine working end-to-end in test mode is the real validation milestone, billing can follow once the core loop is proven.
