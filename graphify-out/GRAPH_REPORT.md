# Graph Report - forge-invoice  (2026-08-28)

## Corpus Check
- 134 files · ~713,323 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 534 nodes · 821 edges · 38 communities (30 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bc6bc737`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard.tsx
- Aeline Page Topology.md (root page)
- cn
- Reveal.tsx
- package.json
- compilerOptions
- dependencies
- createClient
- components.json
- /api/v1/cron/reminders
- devDependencies
- Directory List Reference
- sync-skills.mjs
- createAdminClient
- middleware.ts
- app/layout.tsx
- sync-agent-rules.sh
- eslint.config.mjs
- middleware.ts (dashboard gate)
- next.config.ts
- postcss.config.mjs
- vercel.json
- AdminDashboard.tsx
- auth-section-1.tsx
- app/page.tsx
- Testimonials.tsx
- Expertise.tsx
- Product and Platform Admin Plan
- blog/page.tsx
- [token]/page.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 46 edges
2. `createAdminClient()` - 27 edges
3. `cn()` - 24 edges
4. `getCurrentWorkspace()` - 19 edges
5. `getPlatformAdmin()` - 17 edges
6. `fetchAPI()` - 17 edges
7. `compilerOptions` - 16 edges
8. `Reveal()` - 11 edges
9. `Aeline Page Topology.md (root page)` - 11 edges
10. `clone-website Skill` - 10 edges

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

## Communities (38 total, 8 thin omitted)

### Community 0 - "Dashboard.tsx"
Cohesion: 0.06
Nodes (46): DashboardPage(), ClientsView(), historyStages, onTimeBadgeClass(), Dashboard(), DashboardProps, InvoicesView(), InvoicesViewProps (+38 more)

### Community 1 - "Aeline Page Topology.md (root page)"
Cohesion: 0.07
Nodes (36): Aeline Behaviors.md (root page), Aeline body-innertext.txt, CTA Banner Section (.cta-wrap), Aeline full-page.html, Hero Section (.section_hero), Logo Strip Marquee Time-Driven Finding, Logo Strip Section (.section_loop/.loop_logos), Navbar Does Not Change on Scroll Finding (+28 more)

### Community 2 - "cn"
Cohesion: 0.24
Nodes (11): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Input (+3 more)

### Community 3 - "Reveal.tsx"
Cohesion: 0.18
Nodes (9): metadata, ContactPage(), metadata, About(), CtaBanner(), Footer(), Pricing(), Reveal() (+1 more)

### Community 4 - "package.json"
Cohesion: 0.06
Nodes (30): author, bugs, url, description, engines, node, homepage, keywords (+22 more)

### Community 5 - "compilerOptions"
Cohesion: 0.06
Nodes (31): api, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+23 more)

### Community 6 - "dependencies"
Cohesion: 0.07
Nodes (29): @base-ui/react, class-variance-authority, clsx, lucide-react, next, dependencies, @base-ui/react, class-variance-authority (+21 more)

### Community 7 - "createClient"
Cohesion: 0.10
Nodes (31): GET(), PATCH(), GET(), completeReminderSequence(), PATCH(), GET(), GET(), POST() (+23 more)

### Community 8 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "/api/v1/cron/reminders"
Cohesion: 0.11
Nodes (20): /api/v1/sync, Foundation First Principle, Core Schema (0001: stripe_connections/clients/invoices/payments), /api/v1/cron/reminders, mlforge Invoice Implementation Plan, "Get Paid Faster" Positioning, mlforge Invoice Product, organizations/organization_members Schema (Phase 6, planned) (+12 more)

### Community 10 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, playwright, tailwindcss, @tailwindcss/postcss (+11 more)

### Community 11 - "Directory List Reference"
Cohesion: 0.18
Nodes (18): AlternativeTo, Capterra, Directory List Reference, Directory Submissions Skill, Positioning Variations Library, Destination Pages Before Directories Rule, Foundation Before Submission Rule, G2/Capterra 10-in-30 Review Protocol (+10 more)

### Community 12 - "sync-skills.mjs"
Cohesion: 0.29
Nodes (6): agentSkill(), geminiBody, match, noArgs(), ROOT, SOURCE

### Community 13 - "createAdminClient"
Cohesion: 0.10
Nodes (32): AdminLayout(), GET(), ConnectionRow, GET(), SettingsRow, POST(), displayTime(), GET() (+24 more)

### Community 15 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): inter, metadata, plusJakartaSans

### Community 16 - "sync-agent-rules.sh"
Cohesion: 0.83
Nodes (3): resolve_imports(), sync-agent-rules.sh script, write_file()

### Community 25 - "AdminDashboard.tsx"
Cohesion: 0.10
Nodes (9): Account, activity, AdminDashboard(), AdminPage, mockAccounts, nav, OperationalRow, operationalRows (+1 more)

### Community 27 - "auth-section-1.tsx"
Cohesion: 0.24
Nodes (5): AuthSectionOne(), Mode, Button(), buttonVariants, createClient()

### Community 28 - "app/page.tsx"
Cohesion: 0.24
Nodes (5): Hero(), LogoMarquee(), LOGOS, ServiceCardProps, Services()

### Community 29 - "Testimonials.tsx"
Cohesion: 0.22
Nodes (7): firstRow, Review, reviews, secondRow, Testimonials(), Marquee(), MarqueeProps

### Community 30 - "Expertise.tsx"
Cohesion: 0.22
Nodes (3): Expertise(), ExpertiseCardProps, ICONS

### Community 31 - "Product and Platform Admin Plan"
Cohesion: 0.25
Nodes (7): Customer workspace gaps, Delivery sequence, Initial platform-admin bootstrap, Permissions and safety, Platform admin console, Product and Platform Admin Plan, Product promise

### Community 32 - "blog/page.tsx"
Cohesion: 0.38
Nodes (3): metadata, Blog(), Navbar()

## Knowledge Gaps
- **187 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+182 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `Dashboard.tsx`, `createAdminClient`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `createAdminClient()` connect `createAdminClient` to `createClient`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _187 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058653846153846154 - nodes in this community are weakly interconnected._
- **Should `Aeline Page Topology.md (root page)` be split into smaller, more focused modules?**
  _Cohesion score 0.06736353077816493 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._