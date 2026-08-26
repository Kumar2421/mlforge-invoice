# mlforge Invoice — Implementation Plan

## Goal

Anyone who sends invoices and gets paid late has this problem — not just freelancers. Freelancers, agencies, small contractors, consultants, landlords, solo SaaS founders billing manually. The freelancer framing was a wedge, not the ceiling.

**Product, restated for that broader audience:** connect however you already get paid (Stripe/PayPal read-only today, manual invoice tracking for everyone else), and get automated, escalating reminder emails the moment an invoice goes overdue — no invoice creation, no money movement, flat monthly fee, no percentage cut.

Core loop: **an invoice goes overdue → we detect it → we send Day 3 / Day 7 / Day 14 reminders, getting firmer each time → we stop the moment it's paid.**

Positioning line: **"Get Paid Faster."** Audience-neutral on purpose.

## Current state

- **Frontend**: Next.js 16 App Router. Dashboard, Invoices, Clients, Payments, Reports, Reminders, Settings, and a "New Reminder Sequence" builder — all built, all wired to real data via `fetchAPI` (only Reports is still mocked, see Phase 4).
- **Auth**: Supabase Auth, cookie-based sessions, `middleware.ts` gates `/dashboard`.
- **Backend**: folded directly into this repo as Next.js App Router route handlers under `src/app/api/v1/**` — no separate service. Previously ran as a Cloudflare Worker (Hono + Wrangler); that's been removed. One deploy target, one codebase, simpler to reason about at this stage.
- **Database**: Supabase Postgres. Schema lives in `supabase/migrations/` (`0001_core_schema.sql` — stripe_connections/clients/invoices/payments; `0002_reminder_engine.sql` — reminder_sequences/stages/activity_log). Every table has RLS scoped to `auth.uid()`.
- **Scheduling**: Vercel Cron (`vercel.json`) hits `/api/v1/cron/reminders` daily, authenticated via the `CRON_SECRET` env var Vercel auto-attaches as a bearer token. Replaces the old `pg_cron`-pings-a-worker approach — scheduling config now lives in the app repo, not split across Postgres and a separate platform.
- **Known gap**: the public `/` landing page still renders leftover placeholder content from the template this repo started from (wrong branding, broken images). Needs a real rewrite — flagged, not yet done.

## Why no Cloudflare

Originally chose Cloudflare Workers for the reminder cron + queue. Decided against it: it meant two codebases, two deploy pipelines, two places state could drift, for a workload that Vercel Cron + Next.js route handlers handle fine at this stage's scale (a daily reminder sweep across some number of users, not millions of events/sec). Fold-into-Next.js wins on operational simplicity until there's an actual reason (proven load Vercel can't handle, cost) to split it back out.

---

## Phase 0 — Foundations ✅ done

Supabase project, auth, Next.js scaffold, base schema, RLS on every table. `/api/v1/health` live.

---

## Phase 1 — Stripe read-only connect (mostly done, one real gap)

**Done:** connect/callback/status/disconnect routes exist, restricted-key scope model in place.

**Gap:** `/api/v1/stripe/callback` currently stores a **mock** restricted key — it never actually exchanges the OAuth `code` at `https://connect.stripe.com/oauth/token`. This is the one piece standing between "looks connected" and "is actually connected." Do this before any real user touches Settings.

**Done when:** connecting a real (test-mode) Stripe account produces a genuinely working restricted key, and `/api/v1/sync` pulls real data with it.

---

## Phase 2 — Data sync ✅ mostly done

`/api/v1/sync` pulls customers/invoices/charges from Stripe into `clients`/`invoices`/`payments`. Gap: no webhook listener yet (`invoice.*`/`charge.*`) — sync is currently manual-trigger only (the "Sync" button in Settings), not event-driven. Add `POST /api/v1/webhooks/stripe` before this feels real-time to users.

---

## Phase 3 — Reminder engine (core product, mostly done)

**Done:** `reminder_sequences`/`reminder_stages`/`reminder_activity_log` schema, sequence CRUD, cron endpoint that finds due stages and sends via Resend, activity logging, pause/resume, per-client mute.

**Gap:** auto-pause on payment isn't wired — right now a sequence only stops if a human pauses it. Once the Stripe webhook (Phase 2 gap) lands, hook it to mark sequences `completed` the moment an invoice's status flips to paid. This is the trust-critical bug: a paid client getting a Day 7 reminder anyway is the one thing that breaks confidence in the product immediately.

**Done when:** mark a test invoice paid in Stripe → its reminder sequence stops before the next cron tick, not after.

---

## Phase 4 — Frontend completeness

- **Reports page**: still fully mocked, no backend endpoint. Needs `GET /api/v1/reports` (collection rate over time, avg days-to-pay, reminder-effectiveness %) computed from `invoices`/`payments`/`reminder_activity_log`.
- **Loading/empty/first-run states**: mostly present (spinners wired in per-page). Missing: a proper "connect Stripe first" gate on first login instead of an empty dashboard.
- **Settings → Sender Identity / Plan & Billing cards**: currently static, not wired to any backend state.

---

## Phase 5 — Broaden beyond Stripe-only (the audience pivot)

This is what "not just freelancers" actually requires. Without it, anyone paid by bank transfer, check, or invoiced through QuickBooks/Xero is locked out — that's most small businesses and contractors.

- **Manual invoice tracking**: let a user add a client + invoice by hand (amount, due date, no Stripe required) and mark it paid manually. Reminder engine treats manually-tracked and Stripe-synced invoices identically — the sequence logic shouldn't care where the invoice came from.
- **"Mark as Paid" action**: on any invoice, manual override, same effect as an auto-detected payment (stops the sequence).
- **QuickBooks/Xero import** (later, once manual tracking proves the model): CSV import at minimum, real OAuth sync as a stretch.

**Done when:** someone with zero Stripe/PayPal connection can still use the core reminder loop.

---

## Phase 6 — Team & multi-user

Agencies and small businesses aren't solo. Owner + bookkeeper + assistant is a common shape.

- `organizations` table, `organization_members` with roles (owner/admin/member).
- Every existing table's `user_id` scoping becomes `organization_id` scoping (schema migration, touches every route handler's RLS assumptions — plan this as one deliberate pass, not incremental drift).
- Invite flow (email invite, accept, join org).

---

## Phase 7 — Client-facing payment loop

Right now a reminder just nags. It doesn't make paying easier, which caps how well it can work.

- Hosted pay link embedded in reminder emails (Stripe Payment Links for Stripe-connected invoices; a simple "mark as paid, notify me" flow for manually-tracked ones).
- Partial-payment / dispute handling: if an invoice is partially paid, the sequence should reflect the remaining balance, not silently ignore it. A "Dispute this invoice" link in the reminder email that pauses the sequence and notifies the sender is worth having before this feels trustworthy at scale.

---

## Phase 8 — Reach & compliance

- **SMS reminders** as a channel option (Twilio) — higher open rate for time-sensitive final-notice stages. Gate behind Pro plan.
- **CAN-SPAM/unsubscribe compliance** in every reminder email footer — not optional once this has real recipients.
- **Onboarding wizard**: connect (Stripe or manual) → set cadence → invite team (if applicable) → done. Replaces the current cold-drop into an empty dashboard.
- **Localization**: non-English reminder templates, once there's a signal international users need it.

---

## Phase 9 — Billing (the SaaS's own subscription)

Separate, own-platform Stripe integration — full API access, deliberately kept architecturally distinct from the read-only customer connection (different keys, different modules), so the "we never touch your money" claim about *their* Stripe stays true regardless of how *our* billing works.

- Stripe Checkout + Customer Portal, webhook-driven plan state, gate Pro features (PayPal, SMS, custom cadences, multi-user) behind `plan === 'pro'`.

---

## Phase 10 — Hardening

- Rate limiting on auth + webhook + cron endpoints.
- Error tracking (Sentry).
- Reminder-send idempotency audit — never double-send a stage, this is the one bug that kills trust on contact.
- RLS audit once Phase 6 (org-scoping) lands — the highest-risk moment for a data leak between tenants.
- Legal review of the "read-only, we never move money" claim before it's load-bearing in marketing copy.

---

## Sequencing note

Phases 0-4 are "the current product works end to end for a Stripe user" — closest to done, finish these first (especially the Phase 1 OAuth gap and Phase 3 auto-pause gap, both trust-critical). Phase 5 (non-Stripe support) is what actually makes the audience pivot real — don't market "works for everyone" until it does. Phases 6-8 are what make it a complete product for teams and non-freelancers specifically. Phase 9-10 make it sellable and safe at scale. Don't let billing block Phase 5 — proving the reminder loop works for a non-Stripe user is a bigger validation milestone than collecting money.
