# Product and Platform Admin Plan

## Product promise

Payment Reminders helps businesses get paid faster without creating invoices or moving money. The core loop is: detect an overdue invoice, send escalating reminders, and stop immediately when payment is detected.

## Customer workspace gaps

| Area | Missing capability | Planned phase |
| --- | --- | --- |
| First-run experience | Guided connection, cadence, sender identity, and first sequence setup | 8 |
| Invoice sources | CSV and accounting-platform imports after manual tracking validation | 5 |
| Team access | Organizations, roles, invitations, and workspace switching | 6 |
| Payment resolution | Pay links, partial payments, and dispute handling | 7 |
| Communication trust | Test sends, delivery status, unsubscribe controls, and localization | 8 |
| Customer billing | Checkout, plan state, portal, and feature gates | 9 |
| Reliability | Rate limits, error tracking, idempotency, and tenant-security audit | 10 |

## Platform admin console

The admin console is an internal operator tool at `/admin`; it is not a customer workspace. It shares the product's visual language but is clearly marked as **Platform Admin**.

| Page | Operator purpose | Phase 1 UI | Phase 2 data/action work |
| --- | --- | --- | --- |
| Overview | Assess daily platform health | Metrics, alerts, growth chart, active queue | Aggregated platform metrics and alert rules |
| Accounts | Find and govern customer workspaces | Searchable account table, statuses, plan/integration markers | Org-backed search, suspension and audit actions |
| Account 360 | Support one customer with context | Account detail panel and activity timeline | Real invoices, members, connections, and settings |
| Reminder Ops | Protect the core reminder loop | Queue table, failed-send panel, stage filters | Retry/pause actions, job state, idempotency safeguards |
| Delivery Log | Explain every email event | Delivery table and status filters | Provider events, bounce/complaint and unsubscribe data |
| Integrations | Keep imports and webhooks trustworthy | Connection health and sync-status cards | Stripe sync, webhook, reconnect and diagnostics APIs |
| Billing | Run the product's subscriptions | MRR cards and subscription table | Own-Stripe billing, plans, failed-payment workflows |
| Support Inbox | Own customer requests end-to-end | Ticket inbox, SLA and assigned-owner states | Contact API, assignments, notes and notifications |
| Risk & Audit | Make privileged work accountable | Sensitive-event list and audit trail | Immutable event store, role and session security signals |
| Platform Settings | Manage controlled rollout configuration | Feature flags, defaults, and sending guardrails | Permissioned config persistence and change audit |
| System Health | See operational failures early | Cron, webhook and provider health cards | Job runs, error tracking and alerting integrations |

## Permissions and safety

Phase 2 introduces `platform_admins` with `support`, `operations`, and `platform_admin` roles, enforced in server-rendered routes and all admin APIs. Workspace roles (`owner`, `admin`, `member`) remain separate. No browser code receives a service-role key. Every write is permission-checked and written to an immutable audit log. Customer impersonation is intentionally deferred.

### Initial platform-admin bootstrap

Apply migration `0004_platform_admin.sql`, then add the authenticated operator's UUID and role to `platform_admins` through a trusted service-role migration or the Supabase SQL editor. For the first deployment only, `PLATFORM_ADMIN_EMAILS` may contain a comma-separated allowlist of operator emails; it grants `platform_admin` access before the table is seeded. Remove that temporary allowlist once table-backed roles are established.

## Delivery sequence

1. **Phase 1 — Admin UX foundation:** complete `/admin` shell and all page layouts with local mock data.
2. **Phase 2 — Admin data and access (Complete):** platform roles, audit schema, protected routes, live Overview/Accounts plus read-only reminder, delivery, and integration records. Account 360 receives live data after organization scoping lands. Includes Risk & Audit, Platform Settings, Account Suspension, and Support Inbox.
3. **Phase 3 — Core operations:** real reminder queue, delivery log, integration diagnostics, safe retry and pause controls.
4. **Phase 4 — Team workspaces:** organizations, memberships, invitations, and the customer Team UI are implemented. `0006_prepare_organization_scoping.sql` backfills organization IDs and creates a workspace for every new user; the next migration switches APIs and RLS to use that scope together.
5. **Phase 5 — Payment workflow:** manual tracking completion, imports, pay links, partial payments and disputes.
6. **Phase 6 — Reach and support:** contact inbox, onboarding, compliance, SMS and localization.
7. **Phase 7 — Monetization:** own Stripe billing, plan enforcement, billing admin controls and customer portal.
8. **Phase 8 — Hardening:** observability, rate limiting, full RLS review, idempotency tests and legal/compliance review.

The existing Stripe OAuth, webhook auto-pause, persisted settings, reports, and manual paid override are the completed foundation that the roadmap builds on.
