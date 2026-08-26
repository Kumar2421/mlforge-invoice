# Graph Report - forge-invoice  (2026-08-26)

## Corpus Check
- 88 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 411 nodes · 573 edges · 27 communities (22 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.79)
- Token cost: 210,615 input · 0 output

## Community Hubs (Navigation)
- Dashboard Views, Reminder UI & Domain Types
- Repo Docs, Skills & Aeline Clone Research
- Auth, shadcn UI Primitives & Testimonials
- Landing Page Sections & Reveal Animation
- package.json Metadata & Scripts
- TypeScript Compiler Config
- NPM Runtime Dependencies
- API v1 Routes & Supabase Server Client
- shadcn Components Config
- Reminder Engine & Product Positioning Rationale
- Dev Dependencies (Lint/Test/Types)
- Directory Submission Skill & Listing Sites
- Skills Sync Script
- Cron & Stripe Callback Routes
- Middleware & Supabase Session
- Root Layout & Fonts
- Agent Rules Sync Script
- ESLint Config
- Middleware & Supabase Auth Concept
- Next.js Config
- PostCSS Config
- Vercel Cron Config

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 26 edges
2. `cn()` - 24 edges
3. `compilerOptions` - 16 edges
4. `fetchAPI()` - 15 edges
5. `Reveal()` - 11 edges
6. `Aeline Page Topology.md (root page)` - 11 edges
7. `Directory List Reference` - 10 edges
8. `clone-website Skill` - 10 edges
9. `keywords` - 9 edges
10. `scripts` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Foundation First Principle` --semantically_similar_to--> `Why No Cloudflare Decision`  [INFERRED] [semantically similar]
  .github/skills/clone-website/SKILL.md → docs/IMPLEMENTATION_PLAN.md
- `BEHAVIORS.md Artifact Pattern` --implements--> `Aeline Behaviors.md (root page)`  [INFERRED]
  .github/skills/clone-website/SKILL.md → docs/research/aeline-webflow-io-7f5c9972/root-8a5edab2/BEHAVIORS.md
- `Aeline Page Topology.md (root page)` --implements--> `PAGE_TOPOLOGY.md Artifact Pattern`  [INFERRED]
  docs/research/aeline-webflow-io-7f5c9972/root-8a5edab2/PAGE_TOPOLOGY.md → .github/skills/clone-website/SKILL.md
- `CI Generated-Files Sync Check` --rationale_for--> `NOT the Next.js You Know Rule Block`  [INFERRED]
  .github/workflows/ci.yml → AGENTS.md
- `Website Inspection Guide` --conceptually_related_to--> `clone-website Skill`  [INFERRED]
  docs/research/INSPECTION_GUIDE.md → .github/skills/clone-website/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Selectable Email Provider Configuration** — reffolder_minvoice_readme_resend, reffolder_minvoice_readme_cloudflare_email_sending, reffolder_minvoice_readme_admin_dashboard [INFERRED 0.75]
- **AGENTS.md-to-Platform-Files Sync Pipeline** — agents_md, claude_md, gemini_md, github_copilot_instructions, sync_agent_rules_script, github_workflows_ci_yml [INFERRED 0.85]
- **Clone-Website Extract-Spec-Dispatch Pipeline** — github_skills_clone_website_skill, clone_website_foreman_builder_pattern, clone_website_spec_file_source_of_truth, behaviors_md_artifact, page_topology_md_artifact, aeline_behaviors_md, aeline_page_topology_md [INFERRED 0.85]
- **Admin Authentication Fallback Chain** — reffolder_minvoice_readme_admin_password_secret, reffolder_minvoice_readme_cloudflare_access, reffolder_minvoice_readme_access_fails_closed, reffolder_minvoice_readme_architecture_middleware_access_ts [INFERRED 0.85]
- **Idempotent Payment Capture Flow** — reffolder_minvoice_readme_pay_links, reffolder_minvoice_readme_webhook_idempotency, reffolder_minvoice_readme_stripe_checkout, reffolder_minvoice_readme_paypal, reffolder_minvoice_readme_invoice_history_timeline [INFERRED 0.85]
- **Reminder Engine Trust-Critical Payment Detection** — stripe_webhook_route, phase3_auto_pause_gap, phase1_stripe_oauth_gap, cron_reminders_route, reminder_sequences_schema [INFERRED 0.85]

## Communities (27 total, 5 thin omitted)

### Community 0 - "Dashboard Views, Reminder UI & Domain Types"
Cohesion: 0.07
Nodes (37): ClientsView(), historyStages, onTimeBadgeClass(), Dashboard(), InvoicesView(), InvoicesViewProps, previewReminderStages, PaymentsView() (+29 more)

### Community 1 - "Repo Docs, Skills & Aeline Clone Research"
Cohesion: 0.07
Nodes (36): Aeline Behaviors.md (root page), Aeline body-innertext.txt, CTA Banner Section (.cta-wrap), Aeline full-page.html, Hero Section (.section_hero), Logo Strip Marquee Time-Driven Finding, Logo Strip Section (.section_loop/.loop_logos), Navbar Does Not Change on Scroll Finding (+28 more)

### Community 2 - "Auth, shadcn UI Primitives & Testimonials"
Cohesion: 0.10
Nodes (23): firstRow, Review, reviews, secondRow, Testimonials(), AuthSectionOne(), Mode, Button() (+15 more)

### Community 3 - "Landing Page Sections & Reveal Animation"
Cohesion: 0.11
Nodes (15): About(), Blog(), CtaBanner(), Expertise(), ExpertiseCardProps, Footer(), Hero(), LogoMarquee() (+7 more)

### Community 4 - "package.json Metadata & Scripts"
Cohesion: 0.06
Nodes (30): author, bugs, url, description, engines, node, homepage, keywords (+22 more)

### Community 5 - "TypeScript Compiler Config"
Cohesion: 0.06
Nodes (30): api, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+22 more)

### Community 6 - "NPM Runtime Dependencies"
Cohesion: 0.07
Nodes (29): @base-ui/react, class-variance-authority, clsx, lucide-react, next, dependencies, @base-ui/react, class-variance-authority (+21 more)

### Community 7 - "API v1 Routes & Supabase Server Client"
Cohesion: 0.14
Nodes (15): GET(), PATCH(), GET(), GET(), GET(), PATCH(), GET(), POST() (+7 more)

### Community 8 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "Reminder Engine & Product Positioning Rationale"
Cohesion: 0.11
Nodes (20): /api/v1/sync, Foundation First Principle, Core Schema (0001: stripe_connections/clients/invoices/payments), /api/v1/cron/reminders, mlforge Invoice Implementation Plan, "Get Paid Faster" Positioning, mlforge Invoice Product, organizations/organization_members Schema (Phase 6, planned) (+12 more)

### Community 10 - "Dev Dependencies (Lint/Test/Types)"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, playwright, tailwindcss, @tailwindcss/postcss (+11 more)

### Community 11 - "Directory Submission Skill & Listing Sites"
Cohesion: 0.18
Nodes (18): AlternativeTo, Capterra, Directory List Reference, Directory Submissions Skill, Positioning Variations Library, Destination Pages Before Directories Rule, Foundation Before Submission Rule, G2/Capterra 10-in-30 Review Protocol (+10 more)

### Community 12 - "Skills Sync Script"
Cohesion: 0.29
Nodes (6): agentSkill(), geminiBody, match, noArgs(), ROOT, SOURCE

### Community 13 - "Cron & Stripe Callback Routes"
Cohesion: 0.60
Nodes (3): GET(), GET(), createAdminClient()

### Community 14 - "Middleware & Supabase Session"
Cohesion: 0.47
Nodes (4): config, middleware(), IMPORTANT: Avoid writing any logic between createServerClient and, updateSession()

### Community 15 - "Root Layout & Fonts"
Cohesion: 0.40
Nodes (3): inter, metadata, plusJakartaSans

### Community 16 - "Agent Rules Sync Script"
Cohesion: 0.83
Nodes (3): resolve_imports(), sync-agent-rules.sh script, write_file()

## Knowledge Gaps
- **149 isolated node(s):** `StageRow`, `ExpertiseCardProps`, `ServiceCardProps`, `Review`, `RevealProps` (+144 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `NPM Runtime Dependencies` to `package.json Metadata & Scripts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies (Lint/Test/Types)` to `package.json Metadata & Scripts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `clone-website Skill` connect `Repo Docs, Skills & Aeline Clone Research` to `Reminder Engine & Product Positioning Rationale`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `StageRow`, `ExpertiseCardProps`, `ServiceCardProps` to the rest of the system?**
  _149 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Views, Reminder UI & Domain Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07205387205387205 - nodes in this community are weakly interconnected._
- **Should `Repo Docs, Skills & Aeline Clone Research` be split into smaller, more focused modules?**
  _Cohesion score 0.06736353077816493 - nodes in this community are weakly interconnected._
- **Should `Auth, shadcn UI Primitives & Testimonials` be split into smaller, more focused modules?**
  _Cohesion score 0.09957325746799431 - nodes in this community are weakly interconnected._