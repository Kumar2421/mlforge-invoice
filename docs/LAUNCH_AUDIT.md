# mlforge Invoice — Codebase Launch Audit

> Full-stack audit covering security, compliance, data integrity, UI/UX, and missing features.
> Phase 5 (Manual Invoice Tracking / Non-Stripe users) is **explicitly excluded** per user directive.

---

## 1. Org-Scoping Completion Status

Migration `0006` added `organization_id NOT NULL` to all 8 core tables. Migration `0007` replaced all user-scoped RLS policies with `is_organization_member(organization_id)`.

### ✅ Completed
| Table | Column Added | NOT NULL | RLS Updated |
|---|---|---|---|
| `stripe_connections` | ✅ | ✅ | ✅ |
| `clients` | ✅ | ✅ | ✅ |
| `invoices` | ✅ | ✅ | ✅ |
| `payments` | ✅ | ✅ | ✅ |
| `reminder_sequences` | ✅ | ✅ | ✅ |
| `reminder_stages` | ✅ | ✅ | ✅ |
| `reminder_activity_log` | ✅ | ✅ | ✅ |
| `account_settings` | ✅ | ✅ | ❌ No RLS policy |

### 🔴 Gaps to Close
| Issue | Severity | Location |
|---|---|---|
| `account_settings` has NO org-scoped RLS policy | **HIGH** | 0007 migration — was not included |
| `support_tickets` table has NO `organization_id` column at all | **HIGH** | 0010 migration |
| `organizations` table itself lacks `subscription_status` RLS | **MEDIUM** | 0011 migration — billing columns are readable by any member |
| API routes `/api/v1/sync`, `/api/v1/stripe/callback` insert data using `user_id` only — no `organization_id` lookup at write time | **HIGH** | Need to verify all write routes |

---

## 2. RLS / Tenant-Isolation Audit

### Current RLS State

> **CRITICAL:** The `is_organization_member()` function is `SECURITY DEFINER`, which is correct. However, every RLS policy uses `FOR ALL` — this means a member of an organization can INSERT, UPDATE, **and DELETE** any record scoped to that org, even if they are a `member` role (not `admin`/`owner`). There is **no role-based write restriction**.

| Check | Status | Detail |
|---|---|---|
| RLS enabled on all tables | ✅ | Verified via migrations |
| Org-scoped SELECT isolation | ✅ | `is_organization_member()` prevents cross-tenant reads |
| Org-scoped INSERT/UPDATE/DELETE isolation | ⚠️ | No role checks — any `member` can delete invoices |
| Admin bypass via `createAdminClient()` | ✅ | Correctly uses `service_role` key, bypasses RLS |
| Webhook handler uses admin client | ✅ | Correct — webhooks write via service role |
| `support_tickets` tenant isolation | 🔴 | No `organization_id`, no org-scoped RLS |

### Recommended Fix
Create a migration `0012_rls_hardening.sql`:
- Add org-scoped RLS to `account_settings`
- Add `organization_id` to `support_tickets` + RLS policy
- Consider splitting `FOR ALL` into separate `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies with role checks

---

## 3. Reminder-Send Idempotency Check

> **WARNING:** No idempotency guard exists. If the Vercel Cron handler at `/api/v1/cron/reminders` is invoked twice within the same window (e.g., Vercel retries a timed-out request), the same stage will be sent **twice** because:

1. The query `WHERE status = 'pending' AND scheduled_for <= NOW()` has no locking mechanism
2. The `UPDATE status = 'sent'` happens **after** the email send, creating a race window
3. There is no `idempotency_key` column on `reminder_stages` or `reminder_activity_log`

### Recommended Fix
```sql
ALTER TABLE public.reminder_stages
ADD COLUMN IF NOT EXISTS send_lock_id UUID,
ADD COLUMN IF NOT EXISTS send_locked_at TIMESTAMP WITH TIME ZONE;
```
- At the start of the cron job, `UPDATE ... SET send_lock_id = gen_random_uuid(), send_locked_at = NOW() WHERE status = 'pending' AND send_lock_id IS NULL AND scheduled_for <= NOW() RETURNING *`
- This atomic UPDATE+RETURNING pattern ensures only one execution processes each stage
- If the function crashes mid-send, a cleanup sweep can release stale locks older than 5 minutes

---

## 4. CAN-SPAM / Unsubscribe Footer Compliance

> **LAUNCH BLOCKER.** The current email template in the cron handler sends **no unsubscribe link and no physical mailing address**. Under CAN-SPAM (US) and GDPR (EU), every commercial email must contain:

1. A working unsubscribe mechanism (one-click preferred)
2. The sender's physical postal address
3. Clear identification as a commercial message

### Recommended Fix
- Create an `/api/v1/unsubscribe` endpoint that accepts a signed token and marks the client as opted-out
- Add a `unsubscribed_at` column to the `clients` table
- Filter out unsubscribed clients in the cron query
- Add a compliant footer to every email

---

## 5. Onboarding Wizard Audit

### Current Flow
1. User signs up → email confirmation → `/api/auth/callback` redirects to `/onboarding`
2. Onboarding is a 3-step client-only wizard (no server validation)

### Issues Found
| Issue | Severity |
|---|---|
| **No auth guard** on `/onboarding` page — any unauthenticated visitor can access it | HIGH |
| Step 2 "Connect Stripe" navigates away via `window.location.href` but **never returns to the wizard** — user lands back on `/onboarding` again, creating a loop | HIGH |
| No persistence of "onboarding completed" state — user sees onboarding on every OAuth callback forever | MEDIUM |
| Step 1 doesn't actually let users rename their workspace | LOW |

---

## 6. UI/UX Improvement Suggestions

### Dashboard Panel
| Area | Issue | Suggestion |
|---|---|---|
| **Sidebar Invoice Counts** | Hardcoded mock values (`124`, `25`, `8`, `3`, `2`) | Wire to actual invoice status counts from the API |
| **Revenue Chart** | Static hardcoded bar heights and dollar labels | Replace with computed data from the `reports` API |
| **"Full Report" link** | Dead — no `onClick` handler | Wire to `setActiveTab("Reports")` |
| **"View Reminder Queue" button** | Dead — no handler | Wire to `setActiveTab("Reminders")` |
| **Percentage changes** | Hardcoded `+6.4%`, `+4.1%`, `-2.8%` | Compute from current vs. previous month data |
| **Invoice table avatars** | Uses `pravatar.cc` external service | Cache locally or use initials-based avatars |
| **Empty states** | No empty-state illustrations | Add friendly illustrations for zero-data scenarios |
| **Mobile responsiveness** | Sidebar has fixed `w-[240px]` — no mobile hamburger in dashboard | Add collapsible sidebar for mobile |

### Admin Dashboard Panel
| Area | Issue | Suggestion |
|---|---|---|
| **Mock data dominance** | Overview metrics, workspace growth chart, live alerts, billing MRR, and billing table all use hardcoded mock data | Progressively replace with live Supabase queries |
| **"Phase 1 UI prototype" label** | Still shown in the admin header | Remove before launch |
| **Account 360 → Suspend** | Uses `window.prompt()` and `window.alert()` — jarring UX | Replace with modal dialogs |
| **Operator Actions "Retry 1st failure"** | Blindly picks the first failed row | Add proper row selection UI |
| **System Health page** | Entirely mock data | Wire to real service health checks or remove from nav |
| **No pagination** | All tables render every row | Add pagination for tables with >20 rows |

---

## 7. Missing Features Not Yet Covered

| Feature | Why It's Needed | Priority |
|---|---|---|
| **Password reset flow** | Users who sign up with email/password have no way to recover | HIGH |
| **Rate limiting on API routes** | No rate limiting on `/api/v1/*` — vulnerable to abuse | HIGH |
| **Error boundary / 500 page** | No global error boundary | MEDIUM |
| **404 page** | No custom 404 page | LOW |
| **Webhook handler for OUR SaaS billing** | Subscription events have no handler yet | HIGH |
| **Privacy Policy & Terms of Service** | Footer links to `#` — no actual legal pages | HIGH |
| **Cookie consent banner** | No cookie consent for GDPR | MEDIUM |
| **Stripe OAuth state parameter** | Connect flow should use `state` for CSRF protection | HIGH |
| **Notification system** | Bell icon shows hardcoded dot — no real feed | MEDIUM |

---

## 8. SEO / AI-Agent Discoverability Gaps

| Issue | Fix |
|---|---|
| No JSON-LD structured data | Add `SoftwareApplication` schema to the landing page |
| No `llms.txt` | Add `/llms.txt` with product summary for AI agent discovery |
| No FAQ section | FAQ with `FAQPage` schema for AI snippet eligibility |
| No comparison/alternative pages | Search queries like "mlforge vs Chaser" have no content |

---

## Summary Priority Matrix

| Priority | Items |
|---|---|
| 🔴 **P0 — Launch Blockers** | CAN-SPAM footer, Onboarding auth guard + loop fix, RLS on `account_settings`, Rate limiting |
| 🟡 **P1 — Should Fix** | Idempotency guard, `support_tickets` org-scoping, Stripe state param, Privacy/Terms pages |
| 🟢 **P2 — Polish** | Dashboard mock data removal, Admin mock data removal, SEO structured data, Comparison pages |
| ⚪ **P3 — Post-Launch** | Email templates, Bulk operations, CSV export, Notification feed |
