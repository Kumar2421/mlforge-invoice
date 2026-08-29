# Launch Readiness Audit — forge-invoice / "Payment Reminders"

_Date: 2026-08-28 · Branch: main · Graph: refreshed structural build (602 nodes / 928 edges)_

Scope: launch blockers **excluding Phase 5** (manual invoice tracking). Covers backend
hardening, the customer dashboard, the platform admin console, onboarding, email
compliance, and the public landing page.

---

## 0. TL;DR — what actually blocks launch

> **Re-verified 2026-08-28 (2nd pass).** Several items flagged in the first pass were
> already done — corrected below. Migrations run through `0016`.

### Already done (do NOT re-implement)
- **Idempotency table + unique constraint** — `0014_reminder_idempotency.sql` creates
  `reminder_delivery_logs` with `UNIQUE(invoice_id, reminder_stage_id)`; cron
  inserts-as-lock before sending.
- **Unsubscribe / CAN-SPAM plumbing** — `0015_email_preferences.sql`
  (`email_unsubscribes`), cron checks opt-out before send, footer has unsubscribe
  link + physical address.
- **RLS re-assert pass** — `0013_rls_audit_and_cleanup.sql` re-enables RLS on all
  core tables; `0007` swapped policies to `is_organization_member()`.
- **SEO surface** — `app/robots.ts`, `app/sitemap.ts`, homepage has
  `SoftwareApplication` + `FAQPage` JSON-LD, per-page metadata, FAQ copy is real.
- **3 comparison pages** — `/compare/vs-chaser`, `/compare/vs-invoicesherpa`,
  `/compare/vs-enterprise` (Kolleno & YayPay).
- **This session added:** `src/lib/site.ts` (single domain/metadata source),
  `/llms.txt` route, `/opengraph-image`, site-wide Org+WebSite+SoftwareApplication
  JSON-LD in `layout.tsx`, `/compare/no-percentage-cut` wedge page, footer links,
  fixed the Google-login→localhost redirect.

### Implemented 2026-08-28 (3rd pass — migration 0017 + routes)

- **B1** — `account_settings` org-scoped (settings + plan routes rewritten, old
  `auth.uid()` policy dropped); plan moved to `organizations.plan`; webhook
  `completeReminderSequence` no longer keyed on `user_id`; cron sender lookup is
  per-org; `getCurrentWorkspace()` gained an `active_workspace` cookie selector +
  `role`; admin account routes read plan from `organizations`.
- **B2** — `0017` FORCEs RLS + re-asserts `FOR ALL ... USING + WITH CHECK` on all 7
  core tables; `is_organization_member()` now rejects NULL org id; added
  `has_organization_role()`; `supabase/tests/tenant_isolation.sql` manual check.
- **B3** — cron wrapped in `pg_try_advisory_lock` (skips if a sweep is running) +
  `reconcile_stuck_reminder_deliveries()` at the top of each run. Constraint/table
  already existed.
- **B4** — `reminder_stages.subject/body/tone` added + `reminder_templates` table
  (seeded per org with the 3 default tones). Sequence-create seeds stage copy from
  templates; **cron now renders per-stage → org-template → fallback** with
  `{{client}}/{{invoice}}/{{amount}}/{{sender}}` vars via `src/lib/email.ts`
  (adds `List-Unsubscribe` + `List-Unsubscribe-Post` headers, plaintext part,
  platform postal address from `PLATFORM_POSTAL_ADDRESS`). RemindersView "Default
  Template" tab now loads/saves via `/api/v1/reminder-templates`.
- **B5** — `organizations.onboarded_at`; new 4-step wizard on the `/onboarding`
  route (name → Stripe → sender identity → cadence → complete) backed by
  `/api/v1/onboarding`; dead `OnboardingView.tsx` deleted; `dashboard/page.tsx`
  gates on `onboarded_at`; auth callback routes returning users to `/dashboard`.
- **B8** — real Stripe Checkout: `src/lib/billing.ts`,
  `POST /api/v1/billing/checkout`, `POST /api/v1/billing/portal`,
  `POST /api/v1/webhooks/billing` (checkout + subscription + payment-failed →
  `organizations.subscription_status/plan/stripe_subscription_id/current_period_end`);
  `stripe_webhook_events` dedupe table used by BOTH webhooks; `/activate` +
  `/checkout` pages wired to it; mock `/api/v1/settings/plan` returns 410; trial
  extended to **14 days**; dashboard gate reads `subscription_status`.
- Webhook (customer): Stripe event-id dedupe + `invoice.voided` /
  `invoice.marked_uncollectible` now stop the sequence.

**You must do (deployment):** run migration `0017`; set env vars from `.env.example`
(`STRIPE_PRICE_SOLO/PRO`, `STRIPE_BILLING_WEBHOOK_SECRET`, `PLATFORM_POSTAL_ADDRESS`,
`NEXT_PUBLIC_SITE_URL`); add a Stripe webhook endpoint → `/api/v1/webhooks/billing`
(events: `checkout.session.completed`, `customer.subscription.*`,
`invoice.payment_failed`); add `invoice.voided` + `invoice.marked_uncollectible` to
the existing `/api/v1/webhooks/stripe` endpoint's events; create the two recurring
Prices in Stripe; verify a real sender domain in Resend; run
`supabase/tests/tenant_isolation.sql`.

### Still open / follow-ups

| # | Blocker | Severity | Area | Status now |
|---|---------|----------|------|------------|
| B1 | Org-scoping — sync route still writes `user_id` + clobbers client rollup stats as 0; `resolveOwner` in webhook still falls back to `user_id` (acceptable); no active-workspace UI switcher (cookie infra exists) | **Med** | Backend | Mostly done |
| B2 | Run `supabase/tests/tenant_isolation.sql` against the real DB; extend it to reminder tables; consider a build-time lint that `createAdminClient` never lands in a `"use client"` bundle | **Med** | Backend | Migration done, verification pending |
| B3 | Done. Optional: emit a metric when a sweep is skipped for lock contention | **Low** | Backend | Done |
| B4 | Done for the cron path. Follow-up: sender-domain verification flow + block sequence activation until a real from-address is verified (still falls back to `onboarding@resend.dev`) | **Med** | Email | Core path done |
| B5 | Done. Follow-up: `auth/callback` still checks `organizations.created_by` not membership — a non-creator member could loop; and the Stripe-connect step should refresh `stripeConnected` on return | **Low** | Frontend | Done |
| B6 | **Done.** `Reveal` moved to `src/components/ui/Reveal.tsx`; every `@/components/sites/aeline-*` import + `/sites/aeline-*` asset ref removed; `src/components/sites/` deleted. Hero + CtaBanner + login-panel bg images copied to `/public/landing/` and re-referenced. `Testimonials` rebuilt (was fake anime-name reviews + external images) → honest "situations it's built for" cards, same marquee layout. Added `ReminderPreview` (Day 3/7/14 email mockups) + `WhoItsFor` (audience grid). `Services` `id` collision fixed (`features`→`why`), dead buttons → real `/login` links. `LogoMarquee` + `SocialProof` kept as-is per owner (SocialProof still has invented stats — flagged). `Blog` rebuilt without fake images/dead links. | **Med-High (GTM)** | Frontend | Done |
| B7 | **Done (light touch, layout preserved).** Removed the 3 hardcoded "+6.4% / +4.1% / -2.8% than last month" deltas; "Revenue Trend Overview" fake bar chart → real `Collection Rate Over Time` from `/api/v1/reports.collectionByMonth`; "Next email in 2 days" removed; sidebar Stripe pill wired to `/api/v1/stripe/status`; sidebar Invoices sub-nav now filters (`statusFilter` state + chip); `pravatar.cc` avatars → initials; every dead card button now navigates (Reports/Reminders tabs). Dark-mode toggle left in place (owner asked for minimal UX change). | **Med** | Frontend | Done |
| B8 | Done — real Checkout + portal + webhook. **Trial is 3 days** (`TRIAL_DAYS` in `src/lib/billing.ts`; dashboard gate handles `active` / `trialing` / `past_due` / `canceled`; onboarding shows "3-day free trial is now active"). Follow-up: seed the two Stripe Prices, add the webhook endpoint, remove the old `PLATFORM_ADMIN_EMAILS` allowlist after seeding. | **Low** | Backend | Done |

B6/B7 are the remaining first-impression work (frontend). B1/B2 follow-ups are small.

---

## 1. Finish org-scoping (B1)

### Done
- `getCurrentWorkspace()` is now the #1 god node (30 edges) — most customer read routes
  are organization-scoped: `invoices`, `payments`, `clients`, `clients/[id]`,
  `reminders`, `reminder-sequences`, `reminder-sequences/[id]`, `reports`, `sync`,
  `stripe/*`, `unsubscribe`.
- Migration `0007_organization_scoped_core_data.sql` swapped RLS to
  `is_organization_member(organization_id)` on the 7 core tables.

### Still `user_id`-scoped or mixed — convert before launch
| Route / file | Problem |
|---|---|
| `api/v1/webhooks/stripe/route.ts` | `resolveOwner()` + `completeReminderSequence()` key on `user_id`. Works, but if a user belongs to >1 org the wrong org's sequence could be touched. Scope every query by the resolved `organization_id` and stop passing `user_id` as the primary key. |
| `api/v1/cron/reminders/route.ts` | Selects `reminder_sequences` with no org filter (fine — it's a global sweep via admin client), but `account_settings` lookup is `user_id`-only. Sender identity should be per **org**, not per user. |
| `api/v1/settings/route.ts`, `api/v1/settings/plan/route.ts` | `account_settings` and plan are still per-user. Plan/billing must move to `organizations` (already has `subscription_status`, `stripe_customer_id`). |
| `api/v1/support/route.ts` | Ticket ownership on `user_id`. |
| `api/v1/invitations/[token]/accept/route.ts` | Verify it inserts into `organization_members` with correct role and cannot escalate. |
| `dashboard/page.tsx` | Reads `stripe_connections` by `user_id` and `organizations` by `created_by` — should use `getCurrentWorkspace()` for consistency (a member who isn't the creator sees "needs onboarding" forever). |
| `AdminDashboard` overview | `api/admin/overview` counts `stripe_connections` by `user_id` rows and calls workspaces = auth users. After org-scoping, "workspaces" = orgs, not users. |

### Schema debt
- `0002_reminder_engine.sql` still declares `UNIQUE(invoice_id)` on `reminder_sequences`
  and `auth.uid()` policies — later migrations `DROP POLICY` them but the **base
  tables** (`reminder_stages` SELECT-only policy, `reminder_activity_log`) need a
  full re-check that every op (INSERT/UPDATE/DELETE) is covered by an org policy,
  not just SELECT.
- `account_settings` has no `organization_id` column yet.

### Action
1. Add `organization_id` to `account_settings`; backfill; new migration
   `0012_org_scope_settings_billing_support.sql`.
2. Rewrite the 6 routes above to use `getCurrentWorkspace()`.
3. Move plan state from `account_settings.plan_slug` → `organizations.subscription_status` / a `plan` column.
4. `getCurrentWorkspace()` currently picks the **oldest** membership silently. Add an
   explicit active-workspace cookie/selector (Team view already lets users have
   multiple orgs) — otherwise multi-org users get non-deterministic data.

---

## 2. RLS / tenant-isolation audit (B2)

Not yet run. This is the highest-risk moment for a cross-tenant leak. Checklist:

- [ ] Every table with `organization_id` has policies for **all four** verbs
      (SELECT/INSERT/UPDATE/DELETE), each using `is_organization_member(organization_id)`
      on **both** `USING` and `WITH CHECK`.
- [ ] `is_organization_member()` is `SECURITY DEFINER` with a locked `search_path`
      and cannot be tricked by a null/ξ `organization_id`.
- [ ] No table still has a dangling `auth.uid() = user_id` policy that would let a
      user read their own rows in an org they were removed from.
- [ ] `reminder_stages` / `reminder_activity_log` — currently only SELECT policy
      seen in `0002`; confirm `0007` fully replaced them (it references them but
      verify INSERT path used by cron/webhook goes through the **admin client**,
      which bypasses RLS — acceptable, but then app-side org checks must be airtight).
- [ ] Service-role key (`createAdminClient`) is only imported server-side. Grep:
      `createAdminClient` appears in `cron`, `webhooks/stripe`, `lib/platform-admin`,
      all `api/admin/*`. Confirm none are in a `"use client"` file. (Currently clean.)
- [ ] `platform_admins` bootstrap: `PLATFORM_ADMIN_EMAILS` env allowlist must be
      removed after seeding (per `PRODUCT_AND_ADMIN_PLAN.md`).
- [ ] Write an automated test: create 2 orgs, 1 user each, assert user A's token
      gets 0 rows / 403 on every `api/v1/*` route for org B's IDs.

Deliverable: `supabase/migrations/00XX_rls_audit_fixes.sql` + a
`tests/tenant-isolation.spec.ts` (Playwright, already a dep).

---

## 3. Reminder-send idempotency (B3)

### Current mechanism (`cron/reminders/route.ts` lines 72–85)
Inserts a `reminder_delivery_logs` row `{organization_id, invoice_id, reminder_stage_id, status:'pending'}`
**before** sending; if insert fails (dup), it `continue`s. Good instinct.

### Gaps
1. **No unique constraint shown.** The insert only fails-as-lock if there is a
   `UNIQUE(reminder_stage_id)` (or `UNIQUE(invoice_id, reminder_stage_id)`) on
   `reminder_delivery_logs`. Confirm the migration that creates it has that
   constraint. Without it, two overlapping cron runs both insert and both send.
2. **Race window:** insert → send email → `update status`. If the process dies
   after the Resend call but before the `update`, the row stays `pending` and the
   stage stays `pending` → next run re-inserts? No (unique blocks) → but then the
   stage is stuck forever. Need a reconciliation: on startup, any
   `delivery_logs.status='pending'` older than N minutes → mark `unknown`, and
   **do not** retry that stage automatically.
3. **Cron overlap:** Vercel Cron can fire a second run while the first is still
   going (long sweeps). Add a global advisory lock
   (`select pg_try_advisory_lock(...)`) at the top of `processReminders()` and bail
   if not acquired.
4. **`limit(1)` per sequence** means one stage per sequence per run — fine, but a
   backlog (missed days) drains one stage/day. Acceptable; document it.
5. **Stage `scheduled_for`** — verify it's set when the sequence is created, not
   null (null → `.lte()` excludes it → never sends).

### Action
- Add/confirm `ALTER TABLE reminder_delivery_logs ADD CONSTRAINT uq_delivery_stage UNIQUE (reminder_stage_id);`
- Wrap `processReminders()` in `pg_try_advisory_lock`.
- Add a stuck-`pending` reconciliation query at the top of each run.
- Test: run the cron handler twice concurrently against a seeded DB → assert
  exactly one Resend call (mock fetch) and one `sent` stage.

---

## 4. CAN-SPAM / unsubscribe footer (B4)

### Present (`cron/reminders/route.ts` lines 102–121)
- Unsubscribe link with `email` + `org` params → `/unsubscribe` route exists.
- `email_unsubscribes` table checked before send (opt-out honored).
- Physical postal address in footer.
- "automated payment reminder sent on behalf of {sender.name}".

### Problems
1. **Hardcoded postal address** (`"4/12.2 south street . pukkulam . udumalpet..."`).
   CAN-SPAM requires the *sender's* valid physical address. For a multi-tenant
   product the address shown should be **forge-invoice's** business address (you are
   the sender of record), stated clearly, consistently, on every email. Put it in
   an env var / `platform_settings`, not a string literal.
2. **Only the cron template email has the footer.** Any other transactional email
   (invite emails, trial-ending, future pay-link emails) needs the same treatment.
   There is no shared `sendEmail()` helper — every `fetch("https://api.resend.com")`
   is inline. Create `src/lib/email.ts` with `renderReminderEmail()` +
   `sendComplianceEmail()` that always injects: physical address, unsubscribe link,
   "why you got this" line, and a plaintext alternative.
3. **Subject line** is `Invoice Reminder: {invoice.id}` — a raw Stripe id
   (`in_1Q...`). Use a human invoice number or "Invoice from {sender.name} — payment due".
4. **The reminder body ignores the configured cadence tone** (gentle/firm/final)
   and the `reminder_stages`/`ReminderSequenceView` templates the user edits. The
   cron sends a generic body regardless of what the user set in the "Default
   Template" tab. That's a product bug: **user-authored templates are never used.**
5. **No `List-Unsubscribe` header** (one-click unsub, now effectively required by
   Gmail/Yahoo bulk-sender rules). Add `List-Unsubscribe` and
   `List-Unsubscribe-Post: List-Unsubscribe=One-Click`.
6. **From address** falls back to `onboarding@resend.dev` — will land in spam.
   Require a verified domain before a sequence can activate.

### Action
- `src/lib/email.ts` shared sender with mandatory compliance block.
- Wire `reminder_stages.subject`/`body` (user templates) into the cron send.
- Add `List-Unsubscribe` headers.
- Gate sequence activation on "sender domain verified".
- Move postal address + platform sender identity to `platform_settings`.

---

## 5. Onboarding — current flow is broken/duplicated (B5)

There are **two** onboarding implementations that disagree:

| | `src/app/onboarding/page.tsx` (route) | `src/components/OnboardingView.tsx` (in dashboard) |
|---|---|---|
| Trigger | Manual nav to `/onboarding` — **nothing links to it** | `Dashboard` renders it when `needsOnboarding && activeTab==="Dashboard"` (`needsOnboarding = !stripeConnection`) |
| Steps | 3 steps: workspace → connect Stripe → "all set" | 3 static cards + one "Connect Stripe" button → opens Settings |
| Completion | `router.push("/dashboard")` — **no state written**, so user re-enters onboarding forever until they connect Stripe | Opens Settings tab; no cadence/sender step |
| Sender identity | never asked | never asked |
| Cadence | never asked | never asked |
| Team invite | never asked | never asked |

Neither matches the plan's intended wizard: **connect → set cadence → set sender →
(invite team) → done**, with a persisted "onboarded" flag.

### Problems
- `/onboarding/page.tsx` is dead code (unreachable) OR the post-signup redirect
  should point at it — decide one.
- `needsOnboarding` is derived purely from Stripe connection. After Phase 5
  (manual invoices) that logic breaks. Use an `organizations.onboarded_at` column.
- "Your 3-day free trial starts today" (step 3) — 3 days is very short; and it's
  asserted in copy but the trial actually starts at org creation
  (`trial_starts_at DEFAULT NOW()`), not here.
- Step 3 → "Go to Dashboard" but user still has no sender identity, so the first
  reminder would send from `onboarding@resend.dev`.

### Action — build ONE wizard
1. Delete `OnboardingView.tsx` OR `/onboarding/page.tsx` — keep the standalone
   route (`/onboarding`), redirect there from `auth/callback` when
   `organizations.onboarded_at IS NULL`.
2. Steps: (1) name workspace → (2) connect Stripe *or* "I'll add invoices manually"
   [Phase 5 stub, hide for now] → (3) sender identity (name + from-email + verify
   domain CTA) → (4) confirm cadence (prefilled 3/7/14) → (5) done, write
   `onboarded_at = now()`.
3. Dashboard `needsOnboarding` → `!organization.onboarded_at`.
4. Empty-state on each dashboard view already exists ("No invoices found") — good,
   keep, but add a one-line "Connect Stripe in Settings →" CTA in each.

---

## 6. Landing page rewrite + SEO + AI-agent access (B6)

See companion doc `docs/LANDING_AND_SEO_PLAN.md` (to be written). Summary of what
the audit found:

- `src/app/page.tsx` composes `Navbar / Hero / LogoMarquee / About / Pricing /
  CtaBanner / Footer`. Multiple sections still import from
  `@/components/sites/aeline-webflow-io-7f5c9972/...` and reference `/sites/aeline-.../images/*.avif`
  — **leftover from the cloned template**. `LogoMarquee` shows fake logos.
  `Testimonials` / `SocialProof` / `Services` / `Expertise` components exist but
  aren't all on the page and contain template copy.
- Hero copy is decent ("Get paid faster, automatically") but the page **never
  explains**: what a reminder actually looks like, the escalation cadence in
  detail, the "read-only, never moves money" mechanism, who it's for, what happens
  when the invoice is paid, pricing rationale, FAQ. A visitor can't tell what they'd
  be buying.
- No `app/robots.ts`, no `app/sitemap.ts`, no `llms.txt`, no JSON-LD structured
  data. `metadataBase` is a placeholder (`invoice.mlforge.com`). OG image not set.
- `public/google50665d7ae4d268dd.html` (Search Console verification) is committed —
  fine, but means a domain is already claimed; confirm which.
- Blog exists (`/blog` + `Blog` component) but has placeholder content.

### Action (frontend + copywriter + SEO)
1. Strip every `aeline-webflow-io` import and asset from the landing route; move
   real product screenshots into `public/`.
2. New section order: Hero → "How it works" (3 real steps with a reminder-email
   mockup) → "What a reminder looks like" (Day 3 / 7 / 14 sample emails) →
   "Never touches your money" (read-only diagram) → Who it's for → Pricing →
   FAQ → CTA → Footer.
3. Copy: rewrite all section text to the "Get Paid Faster" positioning, audience-
   neutral, concrete numbers (2026 stats: 59% of SMBs carry 30-day-overdue
   invoices; avg $17.7k outstanding).
4. SEO surface:
   - `app/robots.ts` (allow all, point to sitemap)
   - `app/sitemap.ts` (all static + blog + comparison pages)
   - `public/llms.txt` and `/llms-full.txt` — plain-text product summary,
     pricing, positioning, links — so AI agents/answer engines can cite it
   - JSON-LD `SoftwareApplication` + `FAQPage` + `Organization` in the layout /
     page via `<script type="application/ld+json">`
   - real `metadataBase`, OG image (`app/opengraph-image.tsx`)
   - per-page `<title>`/`description` already partly set — extend to all
5. Three comparison / wedge pages (same landing UI shell — Navbar/Footer, same
   type scale, one `<ComparisonTable>` component):
   - `/vs/chaser` — "Chaser alternative without the $49/mo or the AR-suite bloat"
   - `/compare/invoice-reminders-without-percentage-cut` — vs tools that skim 1–3%
     (name the pattern, not a single competitor)
   - `/vs/quickbooks-reminders` — "QuickBooks only sends 3 reminders and you can't
     escalate — here's the gap"
   Each: H1 with the query, 150-word intro, comparison table, "when to pick which",
   FAQ block, CTA. Add to sitemap. Internal-link from the footer + blog.
6. More SEO content (blog / `/guides/`): "how to ask a client for late payment
   (templates)", "late payment statistics 2026", "how to automate invoice
   follow-ups with Stripe", "CAN-SPAM rules for payment reminder emails".

---

## 7. Dashboard — completeness, mockups, incompleteness (B7 + the follow-up ask)

Verdict per view. **"Fake"** = hardcoded value rendered as if real.

### `Dashboard.tsx` (main overview) — **most problematic**
- Fetches real `invoices` + `payments`. Metric **totals** are real.
- **Fake / hardcoded:**
  - "+6.4% than last month", "+4.1%", "-2.8%" deltas — literal strings, no
    month-over-month calc.
  - Dot-matrix + mini-bar sparklines — static arrays.
  - "Revenue Trend Overview" chart — Jul/Aug/Sep/Oct bars, "$6,810 Lowest",
    "$8,060 Average", "$9,420 Peak", "Revenue peaked in September", "AI forecast
    +6.9% growth" — **entirely hardcoded**. There is a real `/api/v1/reports`
    endpoint with `collectionByMonth` that this should use.
  - "Projected Revenue" = `totalPaid + outstanding` mislabeled as an AI forecast.
  - Reminder card: "Next email goes out in 2 days" — hardcoded.
  - Bottom invoice table: uses `i.pravatar.cc` random avatars for every client
    (also in Invoices/Clients/Reminders views) — external dependency, looks fake,
    privacy-adjacent. Replace with initials avatars.
- **Incomplete / non-functional:**
  - Sidebar "Invoices" sub-nav (Paid/Pending/Overdue/Cancelled/Drafts) — buttons
    have no `onClick`, don't filter anything.
  - Top-bar Search icon — no handler.
  - "Full Report ↗", "View Reminder Queue", card `MoreHorizontal` menus — dead.
  - Theme toggle sets `document.documentElement.classList` but there is **no dark
    styling** anywhere → toggling does nothing visible.
  - "Connected Accounts" in sidebar shows Stripe as green/"Read-only" **always**,
    even when not connected (not wired to `stripe/status`).
  - "New Reminder Sequence" button — sequences are only auto-created; the manual
    builder (`ReminderSequenceView`) — verify it can actually create one against a
    real invoice (needs an invoice picker; check `New Reminder Sequence` flow).
- **Fix priority:** replace the trend chart + deltas with `/api/v1/reports` data
  or remove them; wire the sub-nav filters; kill dead buttons or implement;
  fix the Stripe status pill.

### `InvoicesView.tsx`
- Real invoice list + real "Mark as Paid" (PATCH works).
- **Fake:** pagination ("of 100", pages 1/2/3), filter dropdowns (All Time /
  People / Status — no handlers), the right-panel "Bill from: Jamil Suta, 553 Park
  Avenue" is **hardcoded** for every invoice, the items table always shows one
  synthetic "Invoice Balance" line, `previewReminderStages` is a static 3-stage
  array (not the real sequence for that invoice), `billing@mlforge.com` mailto is `#`.
- **Incomplete:** search input non-functional; `ReminderTimeline` in the panel is
  decorative (not the invoice's real stages); no line-item data from Stripe.

### `ClientsView.tsx`
- Real client list, real mute toggle (PATCH).
- **Fake:** pagination, filters/sort dropdowns, "Invoice History" literally says
  "History fetched separately." (placeholder), `historyStages` static, avatars
  pravatar. `onTimeRate` / `outstandingBalance` / `totalInvoiced` come from the
  `clients` table but `sync/route.ts` **writes them as 0 / 100 always** — so these
  columns are effectively fake until a rollup job computes them.
- **Incomplete:** "Add Client" button — no handler (needed for Phase 5 anyway).
  Client detail invoice history not implemented.

### `PaymentsView.tsx`
- Real payments list.
- **Fake:** "+12.4% than last month", "Avg. Days to Pay = 9 / -12 days since
  reminders" (hardcoded — real value is in `/api/v1/reports`), pagination
  ("of 42"), method/filter dropdowns.

### `ReportsView.tsx` — **cleanest view**
- Fully wired to `/api/v1/reports`, real computed metrics, honest "Proxy:" labels.
- Minor: the 5×3 dot grid is decorative; `MoreHorizontal` menus dead; no date-range
  control though the endpoint hardcodes a 4-month window.
- This is the model the other views should follow.

### `SettingsView.tsx` — mostly real
- Real Stripe connect/disconnect/sync, real cadence + sender save
  (`/api/v1/settings`).
- **Fake/incomplete:** "Plan & Billing" cards are static display only — no upgrade
  action, no link to `/activate` or a portal. PayPal row permanently disabled.
  Sender email has **no domain-verification step** (see B4 #6).

### `RemindersView.tsx`
- Real sequence list + real pause toggle.
- **Fake:** pagination ("of 25"), the **"Activity Log"** in the right panel is
  three hardcoded `<li>`s ("Day 3 reminder opened by client · 2:14pm") — not from
  `reminder_activity_log`. The "Default Template" tab has editable subject/body
  inputs with **no save handler** — user edits are discarded (this is the same
  template the cron ignores, B4 #4). "Add Stage" button dead.
- **Incomplete:** no way to see per-stage delivery status / failures for a
  sequence; `reminder_delivery_logs` and `reminder_activity_log` exist but aren't
  surfaced.

### `TeamView.tsx` — real, functional
- Real orgs/members/invitations CRUD, copy-invite-link works.
- Gaps: no "remove member", no "change role", no "leave workspace", no resend/revoke
  invite. Invite **email is never actually sent** (`inviteMember` only creates a
  row + shows "share the invite link") — acceptable MVP but say so in the UI (it
  does). Billing-is-personal caveat shown (honest).

### `ReminderSequenceView` / "New Sequence" builder
- Not fully read here — **verify**: can a user actually create a sequence for a
  chosen invoice from the UI? If sequences are only ever auto-created on sync, the
  prominent "New Reminder Sequence" button everywhere is misleading.

### Cross-cutting dashboard issues
- **`i.pravatar.cc`** external avatars in 4 views — replace with a local
  initials-avatar component (perf, privacy, looks unfinished).
- **No dark mode** despite a toggle — either build it or remove the toggle.
- **Dead controls everywhere** — every non-wired button/dropdown/menu erodes trust
  in a paid product. Do one pass: implement or delete.
- **Hardcoded growth deltas** on Dashboard + Payments — biggest credibility risk.
  A user who knows their real numbers will immediately distrust the "+6.4%".
- **No global error / toast system** — failures `console.error` silently
  (mark-as-paid, mute, pause all fail invisibly).
- **No skeleton consistency** — some views spinner, some full-page loader.

---

## 8. Admin dashboard (`AdminDashboard.tsx`) — completeness

Single 325-line file, all pages inline. Live data exists for several pages.

### Real / wired
- Overview → `/api/admin/overview` (real counts; falls back to fake
  `1284 / 8943` numbers when the fetch returns null — **remove the fake fallback**,
  show "—").
- Accounts → `/api/admin/accounts` (real; but initial state is `mockAccounts`
  array — flashes 5 fake companies before load; **start empty/loading**).
- Account 360 → `/api/admin/accounts/[id]` (real), suspend/unsuspend action real
  (`window.prompt` for reason — crude but auditable).
- Support Inbox → `/api/admin/support` (real list).
- Reminder Ops / Delivery Log / Integrations → `/api/admin/operations?kind=` (real
  rows); retry/pause actions POST to `/api/admin/operations/action`.
- Risk & Audit → `/api/admin/audit` (real), Platform Settings → `/api/admin/settings`
  (real feature flags + guardrails).

### Fake / mock still shown as real
- **Billing page** — 100% hardcoded ("MRR $18,640", "1,024 subscriptions",
  "$420 at-risk"). No endpoint. Label it "Not yet wired" or hide until Phase 9.
- Overview: "Workspace growth" bar chart `[42,54,46,68,71,88]` hardcoded;
  "Live alerts" list is 3 static strings; page subtitle still says
  **"Phase 1 UI prototype — local mock data only"** and **"Good morning, Operator"**
  / "Mock operational data for the Phase 1 interface" (`DataTable` subtitle) — these
  captions now lie for the pages that ARE live. Fix the copy per-page.
- System Health — services list (`Vercel Cron / Stripe / Resend`) hardcoded
  "Healthy / P95 228ms / Elevated 429s". No real health checks.
- Risk & Audit metrics ("2,381 audited events", "14 sensitive actions") hardcoded
  even though the table below is live.
- SplitOperations metrics ("SLA target < 15 min", "98.7% success") hardcoded.
- `operationalRows` / `activity` module-level arrays still referenced by Billing
  and as `DataTable` defaults.

### Incomplete
- `min-w-[1024px]` + no responsive design — unusable on a laptop < 1024 or split
  screen. At least make it scroll.
- No pagination / search on Delivery Log, Reminder Ops (could be thousands of rows).
- Retry/pause "Operator actions" only act on the *first* failed row (`failedIds[0]`)
  — no row selection.
- No auth UI feedback — if `getPlatformAdmin()` returns null the pages just show
  empty tables, not a "you're not an operator" screen. The `/admin/layout.tsx`
  gate should redirect non-operators.
- "Refresh workspace" button in header — no handler.
- Account 360 "Email delivery" card says "Pending real data" permanently.

### Action
- Delete every hardcoded fallback/metric; render "—" or "Not wired".
- Per-page honest subtitles (remove blanket "Phase 1 prototype" from live pages).
- Hide Billing page behind a `PHASE_9` flag.
- Make it scroll on narrow screens.
- Add real `/api/admin/health` (ping cron last-run, Resend, Stripe) for System Health.
- Add row selection + pagination to the ops tables.

---

## 9. UI/UX improvements — customer dashboard

Priority order for a solo founder (impact / effort):

1. **Kill or wire every dead control** (filters, search, pagination, menus). If not
   now, hide them. Half-working UI reads as abandoned.
2. **Replace hardcoded trend chart + % deltas** on Dashboard with real
   `/api/v1/reports` series, or cut them and show a simple "This month vs last"
   number.
3. **Initials avatars** instead of `pravatar.cc`.
4. **Global toast/error boundary** — surface failed mutations.
5. **Real reminder templates** — the "Default Template" editor must save, and the
   cron must use per-stage subject/body. This is a core feature currently missing.
6. **Per-sequence delivery status** — a small "Day 3 ✓ sent · Day 7 ✗ bounced"
   strip from `reminder_activity_log` / `reminder_delivery_logs`.
7. **Consistent empty states** with a next-action CTA ("Connect Stripe →",
   "Sync your invoices →").
8. **First-run gate** — replace cold dashboard with the wizard (B5).
9. **Sender-domain verification banner** — persistent warning until a real from-
   address is verified; block sequence activation otherwise.
10. **Dark mode** — build it (tokens already themeable) or remove the toggle.
11. **Mobile / narrow** — dashboard is `h-screen` flex with a 240px sidebar and
    `grid-cols-4` cards; unusable < ~1100px. Add a breakpoint: collapse sidebar to
    icons, stack cards.
12. **Invoice preview panel** — show the invoice's *real* reminder sequence +
    real "bill from" (the org's sender identity), not "Jamil Suta / Park Avenue".
13. **Accessibility pass** — many clickable `<span role="button">` (toggles) should
    be `<button>`; `<input type="checkbox">` in tables have no labels; focus states
    only on some inputs; color-only status pills (add icon/text).
14. **Number formatting** — everything hardcodes `.00` and `$` prefix; use
    `Intl.NumberFormat` with the org currency (Stripe gives you currency per
    invoice — currently dropped in `sync`).

---

## 10. UI/UX improvements — admin dashboard

1. **Honesty pass** (see §8) — no fake metrics next to real tables.
2. **Operator identity + role** in the header (currently a static "OP" circle).
3. **Redirect non-operators** from `/admin/*`.
4. **Responsive / scroll** — drop `min-w-[1024px]` hard block.
5. **Row selection** on ops tables → bulk retry/pause.
6. **Search + pagination + date filters** on Delivery Log, Reminder Ops, Audit.
7. **Split the 325-line component** into `admin/(pages)/*` — it's one god
   component; hard to maintain, everything re-renders.
8. **Confirmation modals** instead of `window.prompt` / `alert` for
   suspend/retry (still capture the reason, but in a real dialog).
9. **Account 360** — make the timeline paginated; wire the email-delivery card.
10. **Empty/loading states** — Accounts flashes mock companies; start clean.
11. **A "danger zone" visual treatment** for suspend / feature-flag toggles.

---

## 11. Things NOT covered anywhere in the plan / code (gaps found)

1. **User-authored reminder templates are never sent.** The cron uses a generic
   hardcoded body. The whole "Default Template" editor + per-sequence stages UI is
   cosmetic. This is arguably a bigger hole than Phase 5.
2. **Currency is dropped.** `sync` and webhook store `amount` as a bare number,
   assume USD, UI hardcodes `$`. Any non-USD Stripe account shows wrong values.
3. **Client rollup stats (`total_invoiced`, `outstanding_balance`, `on_time_rate`)
   are written as constants (0/0/100).** No job computes them. Clients view columns
   are fake.
4. **Trial length inconsistency** — copy says "3-day free trial", gate in
   `dashboard/page.tsx` redirects to `/activate` after `diffDays > 3`. 3 days is
   extremely short for a B2B tool where the user must connect Stripe, sync, wait
   for an invoice to go overdue, and see a reminder fire. Consider 14 days.
5. **`/activate` is a mock checkout** ("In production, this will redirect to
   Stripe Checkout"). Real billing (Phase 9) — fine to defer, but the trial gate
   is live, so a real user hits a dead paywall on day 4. Either extend the trial
   for beta, disable the gate, or ship Checkout before public launch.
6. **No email domain verification / DNS setup flow** — sequences can activate with
   `onboarding@resend.dev` as sender → guaranteed spam folder → product looks broken
   to the customer's clients.
7. **No rate limiting** on `auth`, `webhooks/stripe`, `cron`, `unsubscribe`,
   `invitations/accept` (plan Phase 10 — pull auth + webhook + unsubscribe forward).
8. **No error tracking (Sentry).** Silent failures everywhere.
9. **No `List-Unsubscribe` header** (Gmail/Yahoo bulk sender requirement 2024+).
10. **Webhook doesn't handle `invoice.voided` / `invoice.marked_uncollectible` /
    refunds** — a voided invoice keeps its reminder sequence running.
11. **Webhook has no idempotency on Stripe event id** — Stripe retries events;
    `upsert` by row id mitigates most, but `reminder_activity_log` inserts can
    duplicate ("Sequence completed" logged N times).
12. **No `stripe_webhook_events` dedupe table.**
13. **Sync is `limit: 100`, no pagination** — accounts with >100 customers/
    invoices/charges silently truncate.
14. **`getCurrentWorkspace()` picks oldest org silently** — no active-workspace
    switcher wired to the API even though Team view supports multiple orgs.
15. **No audit that `createAdminClient` / service-role key can't leak to client
    bundle** — needs a build-time check / lint rule.
16. **No `robots.ts` / `sitemap.ts` / `llms.txt` / structured data** (SEO/AI).
17. **`metadataBase` + OG image are placeholders.**
18. **No legal pages** — Terms, Privacy, DPA, the "we never move money / read-only"
    claim (plan flags this for legal review before it's load-bearing in marketing).
19. **No cookie/analytics consent** and no analytics at all (add Plausible/PostHog
    free tier before launch to measure funnel).
20. **`invoices.id` is the Stripe id (`in_...`)** used as PK and shown truncated in
    UI — fine, but Phase 5 manual invoices need a different id scheme; decide now.
21. **No test suite** beyond `playwright` being a dependency — zero `.spec` files.
    At minimum: tenant isolation, cron idempotency, webhook auto-pause.
22. **CI** (`.github/workflows/ci.yml`) — verify it runs `npm run check`
    (lint+typecheck+build); add the isolation test once written.
23. **The `graphify-out/` folder is committed and huge** (77 image files, caches) —
    add to `.gitignore` or a separate branch; it's bloating the repo and every
    diff.
24. **`AGENTS.md` auto-block** — `next dev` rewrites it; make sure it's committed
    so CI's generated-files check stays green.

---

## 12. Suggested sequencing (excl. Phase 5)

**Week 1 — trust & security (B1–B3, gaps 7/11/12)**
- Finish org-scoping (6 routes + `account_settings` migration + active-workspace selector)
- RLS audit migration + `tenant-isolation.spec.ts`
- Idempotency: unique constraint + advisory lock + reconciliation + `cron.spec.ts`
- Webhook: event-id dedupe table, handle void/uncollectible/refund
- Rate limiting on auth/webhook/unsubscribe

**Week 2 — email & core feature (B4, gaps 1/6/9)**
- `src/lib/email.ts` shared compliant sender
- Wire user templates into cron send
- `List-Unsubscribe` headers, platform postal address in `platform_settings`
- Sender-domain verification flow + activation gate

**Week 3 — onboarding & dashboard honesty (B5, B7)**
- One onboarding wizard + `organizations.onboarded_at`
- Dashboard: kill hardcoded trend/deltas, wire to `/api/v1/reports`, fix Stripe
  status pill, initials avatars, global toasts
- Admin: honesty pass, hide mock Billing, redirect non-operators, responsive scroll

**Week 4 — landing, SEO, GTM prep (B6)**
- Strip aeline template, rewrite copy, new section order + email mockups
- `robots.ts` / `sitemap.ts` / `llms.txt` / JSON-LD / real metadataBase + OG image
- 3 comparison pages + `<ComparisonTable>` component
- 4 SEO guide posts
- Sentry + Plausible/PostHog
- Legal pages (Terms/Privacy) + legal review of the money claim
- Decide trial length; ship Stripe Checkout OR run a free beta cohort

**Then:** Phase 5 (manual invoices) → public launch.

---

## Appendix — graph god nodes (post-refresh)

`getCurrentWorkspace()` (30) · `getPlatformAdmin()` (24) · `createClient()` (23) ·
`cn()` (22) · `createAdminClient()` (19) · `fetchAPI()` (13)

The rise of `getCurrentWorkspace()` to #1 confirms org-scoping is broadly wired on
the read path. `createAdminClient()` (19 edges) is the RLS-bypass surface — every
one of those call sites is in the §2 audit scope.
