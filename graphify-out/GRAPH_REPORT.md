# Graph Report - forge-invoice  (2026-08-28)

## Corpus Check
- 134 files · ~700,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 602 nodes · 928 edges · 39 communities (28 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 34

## God Nodes (most connected - your core abstractions)
1. `getCurrentWorkspace()` - 30 edges
2. `getPlatformAdmin()` - 24 edges
3. `createClient()` - 23 edges
4. `cn()` - 22 edges
5. `createAdminClient()` - 19 edges
6. `compilerOptions` - 16 edges
7. `Reveal()` - 14 edges
8. `fetchAPI()` - 13 edges
9. `Aeline Page Topology.md (root page)` - 11 edges
10. `Footer()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Why No Cloudflare Decision` --semantically_similar_to--> `Foundation First Principle`  [INFERRED] [semantically similar]
  docs/IMPLEMENTATION_PLAN.md → .github/skills/clone-website/SKILL.md
- `BEHAVIORS.md Artifact Pattern` --implements--> `Aeline Behaviors.md (root page)`  [INFERRED]
  .github/skills/clone-website/SKILL.md → docs/research/aeline-webflow-io-7f5c9972/root-8a5edab2/BEHAVIORS.md
- `PAGE_TOPOLOGY.md Artifact Pattern` --implements--> `Aeline Page Topology.md (root page)`  [INFERRED]
  .github/skills/clone-website/SKILL.md → docs/research/aeline-webflow-io-7f5c9972/root-8a5edab2/PAGE_TOPOLOGY.md
- `clone-website Skill` --conceptually_related_to--> `Website Inspection Guide`  [INFERRED]
  .github/skills/clone-website/SKILL.md → docs/research/INSPECTION_GUIDE.md
- `CI Generated-Files Sync Check` --rationale_for--> `NOT the Next.js You Know Rule Block`  [INFERRED]
  .github/workflows/ci.yml → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AGENTS.md-to-Platform-Files Sync Pipeline** — agents_md, claude_md, gemini_md, github_copilot_instructions, sync_agent_rules_script, github_workflows_ci_yml [INFERRED 0.85]
- **Clone-Website Extract-Spec-Dispatch Pipeline** — github_skills_clone_website_skill, clone_website_foreman_builder_pattern, clone_website_spec_file_source_of_truth, behaviors_md_artifact, page_topology_md_artifact, aeline_behaviors_md, aeline_page_topology_md [INFERRED 0.85]
- **Reminder Engine Trust-Critical Payment Detection** — stripe_webhook_route, phase3_auto_pause_gap, phase1_stripe_oauth_gap, cron_reminders_route, reminder_sequences_schema [INFERRED 0.85]

## Communities (39 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (33): metadata, metadata, metadata, rows, metadata, rows, metadata, rows (+25 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (46): ClientsView(), historyStages, onTimeBadgeClass(), Dashboard(), DashboardProps, InvoicesView(), InvoicesViewProps, previewReminderStages (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (29): AdminLayout(), GET(), POST(), ConnectionRow, GET(), SettingsRow, GET(), POST() (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (29): PATCH(), GET(), completeReminderSequence(), PATCH(), GET(), GET(), PATCH(), GET() (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (36): Aeline Behaviors.md (root page), Aeline body-innertext.txt, CTA Banner Section (.cta-wrap), Aeline full-page.html, Hero Section (.section_hero), Logo Strip Marquee Time-Driven Finding, Logo Strip Section (.section_loop/.loop_logos), Navbar Does Not Change on Scroll Finding (+28 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (24): ContactPage(), firstRow, Review, reviews, secondRow, Testimonials(), AuthSectionOne(), Mode (+16 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (31): api, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+23 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (10): Account, activity, AdminDashboard(), AdminPage, mockAccounts, nav, OperationalRow, operationalRows (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (29): @base-ui/react, class-variance-authority, clsx, lucide-react, next, dependencies, @base-ui/react, class-variance-authority (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (20): /api/v1/sync, Foundation First Principle, Core Schema (0001: stripe_connections/clients/invoices/payments), /api/v1/cron/reminders, mlforge Invoice Implementation Plan, "Get Paid Faster" Positioning, mlforge Invoice Product, organizations/organization_members Schema (Phase 6, planned) (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (18): AlternativeTo, Capterra, Directory List Reference, Directory Submissions Skill, Positioning Variations Library, Destination Pages Before Directories Rule, Foundation Before Submission Rule, G2/Capterra 10-in-30 Review Protocol (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, @netlify/functions, devDependencies, eslint, eslint-config-next, @netlify/functions, playwright (+9 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (14): author, bugs, url, description, engines, node, homepage, license (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (10): tailwindcss, keywords, ai, claude-code, nextjs, reverse-engineering, shadcn-ui, template (+2 more)

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (8): completeReminderSequence(), POST(), resolveOwner(), StripeChargeLike, StripeInvoiceLike, toInvoiceId(), upsertPaidInvoice(), upsertStripePayment()

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): Customer workspace gaps, Delivery sequence, Initial platform-admin bootstrap, Permissions and safety, Platform admin console, Product and Platform Admin Plan, Product promise

### Community 17 - "Community 17"
Cohesion: 0.29
Nodes (6): agentSkill(), geminiBody, match, noArgs(), ROOT, SOURCE

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (7): scripts, build, check, dev, lint, start, typecheck

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (3): inter, metadata, plusJakartaSans

### Community 20 - "Community 20"
Cohesion: 0.83
Nodes (3): resolve_imports(), sync-agent-rules.sh script, write_file()

## Knowledge Gaps
- **199 isolated node(s):** `RemindersViewProps`, `ServiceCardProps`, `Review`, `MarqueeProps`, `RevealProps` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 3` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `MLForgeMark()` connect `Community 7` to `Community 0`, `Community 1`, `Community 5`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `RemindersViewProps`, `ServiceCardProps`, `Review` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05189189189189189 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.051360842844600525 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07619738751814223 - nodes in this community are weakly interconnected._