# Behaviors — aeline.webflow.io /

## Header / Navbar
- **Trigger:** none. Scrolled 600px and re-measured `.navbar` computed styles — `backgroundColor`, `boxShadow`, `position`, `height`, `backdropFilter` are all IDENTICAL before/after.
- **Conclusion:** navbar does NOT change on scroll. It is `position: absolute`, transparent, overlays the hero permanently. No sticky/shrink behavior — do not build one.

## Buttons (`.button`, pill CTAs)
- **Interaction model:** hover-driven, CSS transition.
- **Default:** `background-color: rgb(214, 253, 112)` (lime), `color: rgb(19, 19, 19)`, `transform: none`.
- **Hover:** `background-color: rgb(255, 255, 255)` (white), `transform: scale(0.95)`.
- **Transition:** `transform 0.3s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.3s cubic-bezier(0.19, 1, 0.22, 1)`.
- Implementation: Tailwind `transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-95 hover:bg-white`.

## Cards (generic `[class*="card"]`)
- Cards use scroll-reveal entrance (see below), not a distinct hover-scale defined at the generic level (the measured "before/after" diff above is scroll-position drift from the reveal animation, not a real :hover effect — do not build a card-wide hover-scale). Treat individual card hover per component only where a spec explicitly calls it out (e.g. pricing/services image cards may still have their own hover — verify visually against the screenshot/tsc build, keep subtle: opacity or slight lift only if visible in interaction sweep).

## Scroll-reveal entrance animations (site-wide)
- **Mechanism:** GSAP `ScrollTrigger` + `SplitText` (both loaded from `cdn.prod.website-files.com/gsap/3.15.0/`). Headings are split (likely by line/word) and fade+slide up with stagger as each section enters the viewport; cards/stat-blocks fade+translateY in with stagger per section.
- **Implementation approach for the clone:** use CSS `@keyframes` (fade + translateY(16-24px) → 0, opacity 0 → 1, ~0.5-0.7s ease-out) triggered by `IntersectionObserver` (`threshold: 0.2`, fires once) adding an `is-visible` class — avoids a GSAP dependency while preserving the visual effect. Stagger children with `transition-delay` increments of ~80-120ms.

## Logo strip marquee (`.section_loop` / `.loop_logos`)
- **Interaction model:** time-driven, continuous auto-scroll (not click/hover). DOM contains the 4 logos duplicated 4x (16 total img nodes) = seamless infinite-loop technique.
- **Implementation:** CSS `animation: marquee linear infinite` translating `-50%` on a flex row containing the logo set duplicated once (2x), `animation-duration` ~20-30s, pause on hover optional (not confirmed on source, keep simple continuous scroll).

## Testimonials carousel (`.testimonials_card`, `swiper-slide` classes)
- **Interaction model:** CLICK-driven (Swiper.js). Prev/next arrow buttons swap the active slide with a slide/fade transition (`swiper-slide-active` / `swiper-slide-next` classes observed).
- Large photo-quote variant (`testimonials_card`) shows one big portrait + quote + client logo per slide; a second row shows small avatar+quote cards. Build with a simple controlled-index carousel (buttons cycle `activeIndex`), CSS transition `transform 0.4-0.5s ease` translating slides horizontally, or opacity crossfade if translate proves visually off — match screenshot framing.

## Floating review widget (bottom-right `new-base--t-*` / `temlis_component`)
- Static decorative badge: rotating small profile avatars + 5-star icon row + "Join our AI community" pill + secondary widget card. No confirmed click interaction beyond being a link. Build as static (or simple CSS float/bob if screenshot suggests motion — none confirmed), do not over-engineer.

## Responsive breakpoints
- Confirmed via 1440 / 768 / 390 screenshots: card grids (about/services/expertise/pricing/blog) go from 3-4 columns → single column under ~768px. Navbar links likely collapse to hamburger under Webflow's default 991px breakpoint (verify visually in `section-navbar.png` vs `mobile-full.png`; build nav with a simple hamburger + slide-down/overlay menu under `md:` (768px) as a safe default, since standard Tailwind breakpoints are used elsewhere in this template).

## CTA banner overlay
- Dark gradient overlay `linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0))` sits over `cta-bg.avif`. Static, not scroll/hover-driven — just a fixed CSS layer.
