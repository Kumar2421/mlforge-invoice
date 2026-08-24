# Page Topology — aeline.webflow.io /

Source: https://aeline.webflow.io/
Body class: `bg-primary`. Structure: `.page-wrapper` > [global-styles embed, `.navbar` (fixed/absolute overlay), `main.main-wrapper` (10 sections), floating review widget].

## Layout
- No CSS grid shell; each section is full-width, content constrained by `.container`/`.padding-global` wrappers (~1280–1320px max width, centered, ~24px side padding at desktop, less on mobile).
- Navbar: `position: absolute` over the hero (transparent, white text/icon), NOT sticky, does not change on scroll (verified: header-scroll-diff.json — identical background/shadow/height before and after scrolling 600px).
- Floating widget bottom-right (`.temlis_component` / `new-base--t-*` classes) = 3rd-party review-carousel widget bubble ("Join our AI community" callout with rotating profile cards + star rating). Fixed position, low priority — build as a static decorative badge, not functional.
- GSAP is loaded (`ScrollTrigger.min.js`, `SplitText.min.js`, `gsap.min.js`) → confirms scroll-driven reveal animations (headings split + fade/slide in, staggered cards) rather than plain CSS-only entrance.

## Sections (top → bottom)
1. **Navbar** — logo, nav links (Home/Services/About us/More links dropdown), "Buy Template" pill CTA. Overlays hero, transparent bg.
2. **Hero** (`.section_hero`) — dark blue sky/cloud background image, H1 "Building the future with AI and strategy", subtext, 2 CTA buttons (View Demo / Get Started), a horizontal fan/carousel of floating 3D tilted cards (`.img3d` stack), a small floating review-count badge bottom-right of hero, a floating "Join our AI community" pill card top-right.
3. **Logo strip** (`.section_loop` / `.loop_logos`) — horizontal auto-scrolling marquee of 4 client logos, looped (8 renders in DOM = 2x loop for seamless scroll). Time-driven (continuous CSS/JS marquee), not click/scroll driven.
4. **About** (`.section_about` or similar) — eyebrow "ABOUT US", heading "A global consulting partner dedicated to building smarter and more adaptive", 3-card row: (a) `card_about` — avatar photo + "Ipsum" logo + "120+ Collaborating with leading AI and cloud technology providers" copy, (b) dark card "100% Commitment to measurable results..." with 4 stacked avatar circles, (c) lime-green card "DataPoints 520k+ Analyzed monthly to power smarter business strategies" + black "Contmnts 20+" sub-pill.
5. **Services** (`.section_services`) — eyebrow "SERVICES", heading "Comprehensive consulting and intelligent innovation", CTA button, 3 cards: AI strategy / Business consulting (with photo) / Data & insights — each has icon badge + title + short description; middle card has a background photo.
6. **Expertise** (`.section_expertise`) — eyebrow "EXPERTISE", heading "Where human insight meets intelligent technology", 2x2 grid of 4 cards each with a distinct mockup graphic overlay: Automation & optimization, Data analytics & insights, Digital transformation, Experience intelligence.
7. **Pricing** (`.section_pricing`) — eyebrow "PRICING", heading "Flexible Plans Built for Every Stage of Growth", CTA button, 3 pricing cards (Starter $2,500/mo, Growth $8,500/mo — highlighted/featured with lime bg, Enterprise $10,500/mo), each with feature checklist + Get Started button.
8. **Testimonials** (`.section_testimonials`) — eyebrow "TESTIMONIALS", heading "What they say about us?", swiper carousel of avatar photo + quote + name/role cards, prev/next arrow buttons. CLICK-driven carousel (swiper), also has a large photo-quote card variant (`testimonials_card` with big portrait + client logo overlay).
9. **Blog** (`.section_blog`) — eyebrow "BLOG AND ARTICLES", heading "Latest insights and trends", "View All" link, 3 blog cards each: cover photo + title, e.g. "Turning Data into Strategy: The Power of Analytics".
10. **CTA banner** (`.cta-wrap`) — dark section with `cta-bg.avif` background photo (moody grass/reeds landscape), heading "We combine human insight with artificial intelligence", subtext, Get Started button, small avatar-stack + "8,000+" trust badge, dark gradient overlay.
11. **Footer** — logo, nav link columns (Home v1/v2/v3, Services, Pricing, Contact v1/v2/v3, Blog, About us v1/v2/v3), newsletter email input + submit button, bottom bar (© text, Style Guide / Changelog / Licensing links).

## Responsive
Confirmed via viewport screenshots at 1440 / 768 / 390 (see design-references). Card grids collapse to single column under ~768px; nav collapses to hamburger under ~992px (Webflow default `.w-nav` breakpoint — verify against `.navbar` classes, treat 991px as the mobile-menu breakpoint).

## Z-order / overlays
- Navbar (z-top, absolute) over Hero (background image + gradient).
- Hero's `.img3d` cards are absolutely stacked with z-index driven by order (is-first..is-seven).
- CTA section has a dark gradient overlay (`.overlay`, `linear-gradient(90deg, rgba(0,0,0,.22), rgba(0,0,0,0))`) on top of `cta-bg.avif`.
