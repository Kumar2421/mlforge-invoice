 Dashboard/components: real vs mocked data
Component	Real (fetched)	Hardcoded/mock
Dashboard.tsx	invoices, payments via fetchAPI('/api/v1/invoices') + /api/v1/payments') (lines 47–58); all summary metrics (totalInvoiced, totalPaid, outstanding, overdueCount, breakdown %s) are computed client-side from that real data (lines 60–78); bottom table rows are real invoices	Greeting "Hi, Jamil Suta 👋" (line 274) is a hardcoded literal, not tied to the logged-in Supabase user; sidebar "Invoices" category counts (Paid 124, Pending 25, Overdue 8, Cancelled 3, Drafts 2) are inline mock array (lines 145–150); the entire "Revenue Trend Overview" chart (Jul/Aug/Sep/Oct bars, $6,810/$8,060/$9,420 labels, "peaked in September", "+6.9% growth") is hardcoded (lines 420–504); dot-matrix decorative grids (line 305) are a static [1,0,1,...] array; "+6.4%"/"+4.1%"/"-2.8%" trend deltas on metric cards are hardcoded strings; "Next email goes out in 2 days" (line 370) is a hardcoded string
ClientsView.tsx	clients via fetchAPI('/api/v1/clients') (line 28); mute-toggle actually PATCHes /api/v1/clients/{id}	historyStages (module-level const, lines 9–13) used for the "Reminder History" timeline in the detail panel — completely static, not per-client; "Invoice History" section (line 231) literally renders the placeholder text "History fetched separately." instead of real data
PaymentsView.tsx	payments via fetchAPI('/api/v1/payments') (line 34); table rows are real	The 3 summary cards ("Received This Month" $6,340, "Pending" $3,850, "Avg. Days to Pay" 9 days, all deltas) are 100% hardcoded JSX (lines 58–87); pagination footer "of 42" (line 161) is a hardcoded literal, not payments.length
ReportsView.tsx	Nothing — no fetchAPI, no useState/useEffect at all	Entirely mock: collectionByMonth (lines 6–11) and revenueByClient (lines 13–19) are module-level const arrays; "Reminder Effectiveness 62%", "Avg. Days to Pay 9 days", "Collection Rate 84%", and the dot-matrix array are all hardcoded JSX
RemindersView.tsx	sequences via fetchAPI('/api/v1/reminder-sequences') (line 55); pause/resume actually PATCHes	defaultTemplateStages (lines 15–19, "Default Template" tab) is a static const, not persisted/fetched from anywhere; "Activity Log" list in the detail panel (lines 260–271) is 3 hardcoded <li> items, not real activity; pagination "of 25" (line 206) is hardcoded
SettingsView.tsx	stripeStatus via fetchAPI('/api/v1/stripe/status') (line 20); connect/disconnect/sync buttons call real API routes	"Default Reminder Cadence" card (lines 168–177) is a static display array, not read from/writable to any settings table; "Sender Identity" fields all have hardcoded defaultValues (see Section 5) with no save handler at all; "Plan & Billing" section (Solo $9/mo, Pro $15/mo) is fully static marketing copy with no real billing/subscription backend
ReminderSequenceView.tsx	overdueInvoices via fetchAPI('/api/v1/invoices') filtered client-side to status === 'Overdue' (lines 45–57); "Activate Sequence" POSTs real data to /api/v1/reminder-sequences	initialStages (lines 24–28) is the starting draft state — a hardcoded 3-stage template (Day 3/7/14), editable in the UI but not loaded from any per-user saved template; the live "From: billing@mlforge.com" in the email preview (line 332) is a hardcoded literal, not the user's real sender identity; footer "on behalf of Jamil Suta" (line 349) hardcoded
InvoicesView.tsx	invoices via fetchAPI('/api/v1/invoices') (line 25); detail panel driven by real selected invoice	previewReminderStages (lines 13–17) is a static const used for every invoice's "Reminder Timeline" regardless of its actual state; "Bill from" block (lines 230–237) — sender name "Jamil Suta" and address "553, Park Avenue..." — fully hardcoded, not tied to any user profile; "Mark as Paid" button (line 189) has no onClick handler; pagination "of 100" (line 166) hardcoded
Common pattern: avatars everywhere use https://i.pravatar.cc/100?img=${...} (random placeholder avatar service), not real uploaded/stored images.

2. API routes (src/app/api/**/route.ts)
Route	Method(s)	Behavior
src/app/api/auth/callback/route.ts	GET	Real: exchanges Supabase OAuth code for a session via supabase.auth.exchangeCodeForSession. Comment notes Google/Apple providers aren't actually enabled in Supabase Auth settings yet.
src/app/api/v1/clients/route.ts	GET	Real: queries clients table scoped to authenticated user_id, maps snake_case→camelCase.
src/app/api/v1/clients/[id]/route.ts	PATCH	Real: updates reminders_muted on a client row, scoped to user_id.
src/app/api/v1/cron/reminders/route.ts	GET	Real, but gated by CRON_SECRET bearer auth (Vercel Cron). Queries active reminder_sequences + due reminder_stages via createAdminClient() (service role), sends actual HTTP POST to https://api.resend.com/emails using process.env.RESEND_API_KEY, then updates stage status and logs to reminder_activity_log. This is the one place email-sending is really wired end-to-end (contingent on RESEND_API_KEY/CRON_SECRET env vars being set).
src/app/api/v1/health/route.ts	GET	Stub: returns { status: "ok", time }, no DB/auth involved.
src/app/api/v1/invoices/route.ts	GET	Real: queries invoices joined with clients, scoped to user_id.
src/app/api/v1/payments/route.ts	GET	Real: queries payments joined with invoices/clients, scoped to user_id.
src/app/api/v1/reminder-sequences/route.ts	GET, POST	Real: GET joins reminder_sequences + clients + invoices + reminder_stages. POST inserts a new sequence and its stages (computing scheduled_for dates).
src/app/api/v1/reminder-sequences/[id]/route.ts	PATCH	Real: updates sequence status (active/paused/completed), scoped to user_id.
src/app/api/v1/reminders/route.ts	GET	Real: queries reminder_activity_log joined with clients/invoices. Note: this route exists but nothing in the components reads from it — RemindersView.tsx reads /api/v1/reminder-sequences instead, so this endpoint appears currently unused by the frontend.
src/app/api/v1/stripe/callback/route.ts	GET	STUB/mock — explicit TODO(Phase 1) comment (line 12–13): does not exchange the OAuth code with Stripe at all; instead inserts a hardcoded fake stripe_account_id: "acct_12345mock" and restricted_key: "rk_test_mock123" into stripe_connections.
src/app/api/v1/stripe/connect/route.ts	GET	Real: builds and returns/redirects to the actual Stripe Connect OAuth authorize URL (connect.stripe.com/oauth/authorize) using STRIPE_CLIENT_ID. (The URL is legit; it's the callback that doesn't complete the handshake for real.)
src/app/api/v1/stripe/disconnect/route.ts	POST	Real: deletes the stripe_connections row for the user.
src/app/api/v1/stripe/status/route.ts	GET	Real: reads stripe_connections row, returns connection status.
src/app/api/v1/sync/route.ts	POST	Real: uses the stored restricted_key to instantiate a real Stripe SDK client and pull customers/invoices/charges, upserting into clients/invoices/payments. This is real Stripe API usage — but it will fail/no-op today since the key that's stored comes from the mocked callback above (rk_test_mock123 isn't a real key).
Bottom line: every data-read route is wired to real Supabase queries. The one broken link in the chain is stripe/callback, which is an explicit mock stub — so the full Stripe OAuth connect → sync pipeline doesn't function end-to-end yet even though connect and sync themselves are real code.

3. Supabase setup
src/lib/supabase-admin.ts: createAdminClient() — service-role client (SUPABASE_SERVICE_ROLE_KEY), persistSession: false, used only by the cron route and the (mock) Stripe callback route.

src/utils/supabase/client.ts: browser client via createBrowserClient (anon key) — used in auth-section-1.tsx.

src/utils/supabase/server.ts: server/RSC client via createServerClient + Next cookies() (anon key) — used in nearly every API route and would be used in server components.

src/utils/supabase/middleware.ts: exports updateSession(request) which calls supabase.auth.getUser() and redirects unauthenticated visits to /dashboard → /login. This function is not imported/called anywhere in the repo — there is no src/middleware.ts (confirmed via Glob: only the util file exists, no root Next.js middleware file). So this session-refresh/redirect logic is dead code, never executed by the framework.

Migration 0001_core_schema.sql: creates stripe_connections (user_id, stripe_account_id, restricted_key, connected_at, last_synced_at), clients (id, user_id, name, company, email, avatar_img, total_invoiced, outstanding_balance, on_time_rate, reminders_muted, created_at), invoices (id, user_id, client_id, date, due_date, amount, status enum, created_at), payments (id, user_id, invoice_id, date, amount, method enum, status enum, created_at). RLS is enabled on all 4 tables, each with a FOR ALL USING (auth.uid() = user_id) policy.

Migration 0002_reminder_engine.sql: creates reminder_sequences (id, user_id, invoice_id, client_id, current_stage_day, status enum, timestamps, unique(invoice_id)), reminder_stages (id, sequence_id, day, status enum, scheduled_for, executed_at, error_message), reminder_activity_log (id, user_id, invoice_id, client_id, stage_id, event_type, description, metadata jsonb, created_at). RLS enabled on all 3; reminder_sequences has a full FOR ALL policy, but reminder_stages and reminder_activity_log only have FOR SELECT policies — meaning inserts/updates to those two tables can only happen via the service-role client (consistent with the cron route using createAdminClient()).

No sender_identity/settings/profile table exists anywhere in the schema — confirms Settings' Sender Identity and reminder-cadence fields have no backing table.

4. Auth state
No root src/middleware.ts exists. Only src/utils/supabase/middleware.ts (an unused helper) contains the auth-gating logic. Since Next.js middleware only runs if a middleware.ts file exists at the project/src root, that gating code never executes.
src/app/dashboard/page.tsx is a plain Server Component that renders <Dashboard /> with no auth check of any kind — no supabase.auth.getUser() call, no redirect. Dashboard.tsx is publicly reachable by navigating directly to /dashboard; it will just render with empty data since fetchAPI calls to /api/v1/* will get 401 Unauthorized from Supabase (those routes do check user), but the shell UI itself renders for anyone.
Sign-in/sign-up is real: src/components/ui/auth-section-1.tsx calls supabase.auth.signUp() / supabase.auth.signInWithPassword() (real Supabase Auth calls), then router.push("/dashboard").
No logout/sign-out flow exists anywhere in the codebase — grepped for logout|signOut|sign-out across src/, zero matches.
No user profile data is wired to the real Supabase auth user anywhere. Grepped for user.email / user_metadata, zero matches outside the auth-check boilerplate in API routes (which only checks if (!user), never reads/displays user.email or metadata). The Dashboard greeting "Hi, Jamil Suta 👋" (Dashboard.tsx:274) is a hardcoded literal name, completely disconnected from the logged-in session.
Google/Apple OAuth buttons exist in the UI but are explicitly disabled via const oauthAvailable = false (auth-section-1.tsx:80), with a code comment noting the providers aren't enabled in the Supabase project yet.
5. Settings — Sender Identity section (exact JSX)
src/components/SettingsView.tsx, lines 182–198:


{/* Sender identity */}
<div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
  <h3 className="text-[13px] font-bold text-gray-900 mb-4">Sender Identity</h3>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">From Name</label>
      <input type="text" defaultValue="Jamil Suta" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">From Email</label>
      <input type="text" defaultValue="billing@mlforge.com" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]" />
    </div>
    <div className="col-span-2">
      <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Reply-To</label>
      <input type="text" defaultValue="jamil@mlforge.com" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]" />
    </div>
  </div>
</div>
All three inputs are uncontrolled (defaultValue only, no value/onChange/state), there's no save button, no fetchAPI call anywhere in this section, and no backing DB column/table exists for it. It's single-recipient in the sense that it only models one "From Name / From Email / Reply-To" identity per account — there's no concept of multiple sending identities. The cron route (cron/reminders/route.ts:57) hardcodes its own separate sender: from: "Reminders <onboarding@resend.dev>", which doesn't even match the Settings placeholder values (billing@mlforge.com) — i.e., two different unconnected hardcoded "from" identities exist in the codebase.

6. Contact page
src/app/contact/page.tsx — confirmed. Line 9: const [submitted, setSubmitted] = useState(false). handleSubmit (lines 11–14):


function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setSubmitted(true)
}
No fetch/fetchAPI call, no API route reference, nothing async. The name/email/message <input>/<textarea> fields (lines 116–149) are all uncontrolled — no value/onChange — so their contents aren't even read into JS state; they're purely discarded on submit. Only the local submitted boolean flips to show the "Message sent" success state (lines 102–109). There is no corresponding /api/contact route anywhere in src/app/api.

7. Resend / sendEmail grep results
Real repo hits (excluding graphify-out/ cache/report artifacts and docs/IMPLEMENTATION_PLAN.md prose):

src/app/api/v1/cron/reminders/route.ts:50 — const resendReq = await fetch("https://api.resend.com/emails", {
src/app/api/v1/cron/reminders/route.ts:54 — Authorization: \Bearer ${process.env.RESEND_API_KEY}`,`
src/app/api/v1/cron/reminders/route.ts:57 — from: "Reminders <onboarding@resend.dev>",
src/app/api/v1/cron/reminders/route.ts:64-65 — error handling: if (!resendReq.ok) { console.error("Failed to send email via Resend:", ...) }
This is the only place Resend is actually invoked — a real fetch to the real Resend REST API (not the resend npm SDK, just raw HTTP), gated on process.env.RESEND_API_KEY being set. No sendEmail function/utility exists anywhere in src/ — the fetch call is inlined directly in the cron route, not abstracted. Nowhere in any of the audited components (RemindersView.tsx, ReminderSequenceView.tsx, etc.) is Resend referenced — those only display static "email preview" copy and don't call any send endpoint from the UI (the "Send Test" button in ReminderSequenceView.tsx:324-326 has no onClick handler at all).

docs/IMPLEMENTATION_PLAN.md:52 confirms this is already tracked as "Done" in project docs: "cron endpoint that finds due stages and sends via Resend."