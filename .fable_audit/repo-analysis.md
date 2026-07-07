# serbyn.io — Repo Analysis (frontend code audit)

Repo: `/Users/vitaliiserbyn/development/serbyn-pro` · Next.js 14 (`package.json:29`) App Router · analyzed 2026-07-06.
All paths below are relative to the repo root unless absolute. Factual findings only, no recommendations.

---

## 1. RENDERING

No page exports `force-dynamic`, `dynamic`, or `revalidate`. The only rendering-config exports in `app/` are:
- `app/feed.xml/route.ts:4` — `export const dynamic = 'force-static'`
- `app/api/subscribe/route.ts:4` — `export const dynamic = 'force-dynamic'`

`middleware.ts:4-22` runs on every non-api/non-static path (`middleware.ts:24-28` matcher) and sets `utm_*` cookies (30-day, `httpOnly: false`).

Per page:

| Route | File | Mode | Notes |
|---|---|---|---|
| `/` | `app/(marketing)/page.tsx:13` | Server / SSG | Pure composition of server components (`hero.tsx`, `results-strip.tsx`, `offers.tsx`, …). No `"use client"`. |
| `/audit` | `app/audit/page.tsx:12` | Server / SSG | Renders `<OfferPage>` (server, `components/site/offer-page.tsx:10`). Static `metadata` export at line 5. |
| `/llm-cost-teardown` | `app/llm-cost-teardown/page.tsx:13` | Server / SSG | Same `OfferPage` pattern. |
| `/fractional` | `app/fractional/page.tsx:13` | Server / SSG | Same + `<AdvisoryNote>`. |
| `/work` | `app/work/page.tsx:7` | Server / SSG | Passes case studies (content stripped, line 9) into client `WorkGrid` (`components/lab/work-grid.tsx:1` `'use client'`) — initial HTML still SSR'd. |
| `/work/[slug]` | `app/work/[slug]/page.tsx:15` | SSG | `generateStaticParams` at line 15; `generateMetadata` line 20. |
| `/blog` | `app/blog/page.tsx:8` | Server / SSG | |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx:15` | SSG | `generateStaticParams` line 15; markdown → HTML at build/server (`markdownToHtml`, line 248). |
| `/writing` | `app/writing/page.tsx` | Server / SSG | |
| `/about` | `app/about/page.tsx` | Server / SSG | |
| `/methodology` | `app/methodology/page.tsx` | Server / SSG | |
| `/legal/privacy`, `/legal/terms` | `app/legal/*/page.tsx` | Server / SSG | |
| `/resume` | `app/resume/page.tsx:1` | **`'use client'` — full client component** | Entire resume is client-rendered markup; metadata comes from `app/resume/layout.tsx:3`. Only page with `"use client"`. |

**Money pages** (`/`, `/audit`, `/llm-cost-teardown`, `/fractional`): no `"use client"` anywhere in their page trees except the CTA buttons (`components/site/cta.tsx:1`) and the shell.

**Metrics/prices are server-rendered**, sourced from one module:
- Prices: `lib/facts.ts:138-166` (`OFFERS`: `$3,500` line 142; `from $2,000` line 151; `from $4,000/mo` line 160) and `ADVISORY` `$200/hr` line 171. Rendered server-side in `components/site/offer-page.tsx:34` (offer hero, exactly once per page) and `components/site/offers.tsx:29` (home cards).
- Metrics: `lib/facts.ts:42-77` (`RESULTS`) rendered by server components `components/site/results-strip.tsx:23` → `components/site/stat.tsx:17-31` ("PLAIN server text (no animation, correct with JS disabled)" — comment at `stat.tsx:4-7`).

Global caveat: the root layout wraps every page in a client shell — `components/lab/app-shell.tsx:1` (`'use client'`) via `app/layout.tsx:62`. Pages remain server-rendered (passed as `children`), but the sidebar/nav/mobile menu is client JS on every route.

## 2. FONTS

- `next/font/google` in `app/layout.tsx:14-26`: `Inter` and `JetBrains_Mono`, both `display: 'swap'`, `preload: true`, exposed as `--font-sans` / `--font-mono`. No `weight` specified → variable fonts. Built output: **13 self-hosted `.woff2` files** in `.next/static/media/` (2 preloaded `.p.woff2`).
- **Duplicate external font loading**: `styles/globals.css:5-6` also `@import`s Google Fonts CSS over the network:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
  ```
  Inter 5 static weights + JetBrains Mono 3 static weights fetched from `fonts.gstatic.com` at runtime, on top of the self-hosted next/font files. CSS `@import` inside the global stylesheet is render-blocking and not preloaded.
- Fallback stacks re-declare fonts in `styles/globals.css:52` (body) and `:61-64` (`.font-mono`); `tailwind.config.ts:12-15` maps `font-sans`/`font-mono` to the CSS variables.
- OG images use `fontFamily: 'sans-serif'` inline (`app/blog/[slug]/opengraph-image.tsx:30`) — no font file loading there.

## 3. IMAGES

- `next/image`: **1 usage total** — `components/navbar.tsx:57-63` (`/logo.svg`, 32×32). Navbar only renders on `/resume` routes (`components/lab/app-shell.tsx:24-26, 48-57`), so effectively zero `next/image` on the public marketing pages.
- Raw `<img>`: **1 code path** — the blog markdown renderer emits `<img src … loading="lazy">` at `app/blog/[slug]/page.tsx:339` (unoptimized, no width/height → CLS-capable). However **no blog post or case study currently contains an image** (`grep '![' content/` → 0 hits), so no raw `<img>` renders in practice.
- The site is essentially image-free: heroes/sections are CSS (`blueprint-grid` texture, `styles/globals.css:134-139`).
- `public/` total **64 KB; zero files > 100 KB**. Largest files: `apple-touch-icon.png`, `logo.png`, `og.png` — each 7,317 bytes (byte-identical sizes; `og.png` is the same asset as the 32px-class logo). `lib/seo.ts:8` sets `ogImage: 'https://serbyn.io/logo.png'` and declares it `1200×630` in OG metadata (`lib/seo.ts:92-94`) — the declared dimensions do not match a 7 KB logo file. Blog/work detail pages instead use dynamic `opengraph-image.tsx` (`image: null`, `app/blog/[slug]/page.tsx:27`, `app/work/[slug]/page.tsx:27`).

## 4. BOOKING CTA

Service: **Calendly, plain external link in a new tab. No embed, no prefill, no qualification params anywhere.**
- Canonical URL: `lib/facts.ts:18` — `booking: 'https://calendly.com/serbyn-vitalii/consulting'`.
- Primary implementation — `components/site/cta.tsx:19-49`:
  ```tsx
  export function BookingButton({ location, label = 'Book a 30-min systems call', variant = 'primary', className }) {
    return (
      <a
        href={CONTACT.booking}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="booking"
        onClick={() => track('cta_click', { cta: 'booking', location, outbound: true })}
        ...
      >
        {label}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }
  ```
- Additional hardcoded Calendly links that bypass `BookingButton` (no `cta_click` tracking): `components/lab/app-shell.tsx:19,99-106,135-142` (sidebar + mobile "CONTACT"), `app/about/page.tsx:118`, `app/blog/[slug]/page.tsx:200` ("Book Architecture Review"), `app/work/[slug]/page.tsx:145`, `components/case-study-footer.tsx:39`.
- `components/calendly-widget.tsx` (react-calendly `PopupWidget`/`InlineWidget`, `CalendlyButton`, `CalendlyInline`) is **never imported anywhere** — dead code; the popup mode is stubbed to external link anyway (`calendly-widget.tsx:44-59`).
- UTM cookies captured by `middleware.ts:8-19` are never appended to the Calendly URL nor sent to analytics.

## 5. ANALYTICS

Three systems in `app/layout.tsx:63-65`: PostHog (`<PostHogProvider/>`), `@vercel/analytics`, `@vercel/speed-insights`.

PostHog setup — `components/analytics/posthog-provider.tsx:12-25`: lazy `import('posthog-js')` only when `NEXT_PUBLIC_POSTHOG_KEY` is set; `capture_pageview: false` (manual `$pageview` on route change, lines 30-37), `capture_pageleave: true`, `autocapture: true`. Event wrapper `track()` in `lib/analytics.ts:20-27` no-ops without a key.

Custom events (complete list):

| Event | Where it fires | File:line |
|---|---|---|
| `$pageview` | every SPA route change | `posthog-provider.tsx:33-35` |
| `cta_click` `{cta:'booking', location, outbound:true}` | `BookingButton` clicks (hero, offer heroes/CTAs, final CTA) | `components/site/cta.tsx:37` |
| `cta_click` `{cta:'email', location}` | `EmailButton` clicks | `components/site/cta.tsx:64` |
| `outbound_click` `{href, location, outbound:true}` | `OutboundLink` (GitHub/LinkedIn/Loom etc.) | `components/site/cta.tsx:96` |
| `blog_block_viewed` `{slug, kind, label}` | H2/diagram/code ≥50% visible, once | `components/blog/engagement-tracker.tsx:37` |
| `blog_scroll_depth` `{slug, depth}` 25/50/75/100 | blog posts only | `engagement-tracker.tsx:59` |
| `blog_cta_click` `{slug}` | clicks on any calendly.com link inside a post page | `engagement-tracker.tsx:70` |
| `blog_crosslink_click` / `blog_casestudy_click` | in-post links to `/blog/*` / `/work/*` | `engagement-tracker.tsx:72,74` |

Coverage facts:
- **CTA clicks: tracked** on components using `BookingButton`/`EmailButton` with a `location` prop (`hero`, `offer_<id>_hero`, `offer_<id>_cta`, etc. — e.g. `offer-page.tsx:40,193`).
- **Outbound booking clicks: partially tracked** — the Calendly links in the sidebar/mobile shell (`app-shell.tsx:99,135`), `/about:118`, `/work/[slug]:145`, and `case-study-footer.tsx:39` fire **no custom event** (autocapture only). Blog post pages catch calendly clicks via the delegated listener (`engagement-tracker.tsx:70`).
- **Scroll depth: blog posts only.** No scroll-depth events on `/`, `/audit`, `/llm-cost-teardown`, `/fractional`.
- **Booking completion: not tracked at all.** Booking is an external Calendly link — no Calendly embed events, no webhook, no redirect/thank-you page, no UTM passthrough. The funnel ends at `cta_click`.
- **Newsletter submit: not tracked** — `components/lab/terminal-signup.tsx:22-36` posts to `/api/subscribe` with no `track()` call.
- Funnel drop-off visibility: `location` on `cta_click` makes a pageview→cta_click funnel per section buildable in PostHog; anything past the click (Calendly page → booked) is invisible.

## 6. EMAIL CAPTURE

- `app/api/subscribe/route.ts:11-55`: POST validates email (`:23`), and if `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` are unset **returns `{ok:true, stub:true}` — silent stub mode** (`:30-34`). Otherwise adds contact to **Resend Audiences** (`:36-46`). `force-dynamic`, nodejs runtime (`:3-4`).
- Form component: `components/lab/terminal-signup.tsx` ("KERNEL_PULSE" terminal-framed form; blurb line 12: "Deep-dives on autonomous AI agents, infrastructure, and cost engineering").
- Appears on exactly **one page**: `/blog` index (`app/blog/page.tsx:4,41`). Not on `/writing`, not on blog posts, not on home or offer pages.

## 7. SEO INFRA

- `app/sitemap.ts:26-101`: home 1.0; `/audit`, `/llm-cost-teardown`, `/fractional` 0.95; `/work` 0.9; `/about` 0.8; `/writing`, **`/resume` 0.7** (lines 76-80); case studies 0.7; `/blog` 0.6; posts 0.6; legal 0.3. `lastModified` is `new Date().toISOString()` for all non-post routes (changes every build).
- `app/robots.ts:7-36`: allow all; disallow `/api/`, `/_next/`, `/admin/`, `/private/`, `*.json`, `/tmp/`; **blocks GPTBot, Google-Extended, CCBot entirely** (lines 21-32); sitemap + host set.
- `app/feed.xml/route.ts`: `force-static` RSS 2.0 of all blog posts, `Cache-Control: public, max-age=3600` (line 46). Linked via `alternates.types` (`lib/seo.ts:119`) and footer `RSS_FEED` (`components/footer-legal.tsx:108-113`).
- Metadata: central factory `createMetadata()` in `lib/seo.ts:42-122` (OG, Twitter, robots, canonical, metadataBase). Static `export const metadata` on every static page (see §1 table); `generateMetadata` only on the two dynamic routes (`app/blog/[slug]/page.tsx:20`, `app/work/[slug]/page.tsx:20`).
- JSON-LD (`application/ld+json`) — all occurrences:
  - `Person` + `Organization` on **every page** via root layout (`app/layout.tsx:41-52`, schemas at `lib/seo.ts:181-247`; Organization includes UK registered address and email).
  - `Blog` on `/blog` (`app/blog/page.tsx:11-29`).
  - `BlogPosting` (`app/blog/[slug]/page.tsx:45-66`) + conditional `FAQPage` from `## FAQ` sections (`:70-81`, extractor `lib/blog-faq.ts`).
  - **None** on `/work/[slug]` case studies, and **no Service/Product/Offer/BreadcrumbList schema** on the three offer pages.
- Legacy redirects in `next.config.js:6-27` (`/case-studies*` → `/work*`, `/payments`, `/how-to-pay` → `/`).

## 8. 404

**No `not-found.tsx` exists anywhere in `app/`** (`find app -name "not-found*"` → 0 results; also no `error.tsx`/`loading.tsx`). `notFound()` is invoked at `app/blog/[slug]/page.tsx:35` and `app/work/[slug]/page.tsx:34`, so unknown slugs render **Next.js's default unstyled 404** — no branding, no links back to offers.

## 9. A11Y / UX

- Skip link: `app/layout.tsx:55-61` (`href="#main"`, class `.skip-to-content` `styles/globals.css:187-189`); `id="main"` set in both shell variants (`app-shell.tsx:52,146`).
- Focus styles: `styles/globals.css:92-96` — **bug**: `outline: 2px solid var(--ring)` where `--ring` is a raw HSL triplet `210 100% 52%` (`globals.css:31`), not wrapped in `hsl()`. The declaration is invalid CSS, so the intended brand-colored global focus ring never applies (individual components that use Tailwind `focus-visible:ring-*` classes, e.g. `navbar.tsx:54`, `globals.css:147`, still work).
- Reduced motion: global collapse at `styles/globals.css:141-143` (`animation-duration/transition-duration: 0.01ms !important`). The only scripted animation is `components/lab/reveal.tsx` (IntersectionObserver fade/translate; comment at lines 6-7 documents reliance on the global media query). **No framer-motion / GSAP / animation library** in `package.json`.
- ARIA: nav landmarks labeled (`app-shell.tsx:74` `aria-label="Primary"`, `navbar.tsx:46`), `aria-current="page"` (`app-shell.tsx:79`), `aria-expanded`/`aria-label` on menu toggles (`app-shell.tsx:117-118`, `navbar.tsx:94-96`), home links labeled (`app-shell.tsx:33`, `navbar.tsx:55`). CTAs are real `<a>` elements with visible text (`cta.tsx:31-47`).
- Smell: `navbar.tsx:73-79,149-155` uses `role="menubar"`/`role="menu"`/`role="menuitem"` for plain navigation links (menu roles imply application-menu keyboard semantics that aren't implemented).
- Smell: mobile menu in `navbar.tsx:141-145` hides via `max-h-0 opacity-0 overflow-hidden` + `aria-hidden`, but links remain in the DOM (focusable while visually hidden is mitigated only by `aria-hidden`, not `inert`/`display:none`). Same pattern is conditional-render (fine) in `app-shell.tsx:123`.

## 10. JS WEIGHT

Dependencies of note (`package.json:14-38`):
- **`mermaid` ^11.15.0** — the heaviest dep (multi-MB). Dynamically imported only in `components/blog/content-enhancers.tsx:34`; **all 7 blog posts contain ```mermaid fences**, so it loads on every blog-post view. Not loaded on money pages.
- **`highlight.js` ^11.11.1** — dynamically imported (`content-enhancers.tsx:23`), but its theme CSS is a **static import** (`content-enhancers.tsx:4` `import 'highlight.js/styles/github-dark.css'`) bundled into the blog-post route CSS regardless of code presence.
- **`posthog-js` ^1.393.0** — lazy-loaded only when key set (`posthog-provider.tsx:12-15`).
- **`lucide-react`** — 17 importing files, per-icon named imports (tree-shakeable).
- **`react-calendly` ^4.4.0** — **unused** (only importer `components/calendly-widget.tsx` is itself never imported).
- **`swr` ^2.3.6** — **unused** (zero imports in `app/`, `components/`, `lib/`).
- `@vercel/analytics` + `@vercel/speed-insights` on every page (`app/layout.tsx:3-4,64-65`).
- MDX toolchain (`@next/mdx`, `@mdx-js/*`, `rehype-*`) in deps though blog rendering uses the hand-rolled `markdownToHtml` (`app/blog/[slug]/page.tsx:248-383`); `gray-matter` used by `lib/case-studies.ts`/`lib/blog-posts.ts`.
- No chart libraries, no animation libraries. Dynamic imports: exactly the four listed above (`content-enhancers.tsx:23,34`; `posthog-provider.tsx:15,33`).

## 11. DESIGN SYSTEM

- Terminal/mono aesthetic: JetBrains Mono via `--font-mono` for `label-caps`, `code-md`, `metric-lg` utility classes (`styles/globals.css:116-131`); square corners globally — `--radius: 0px` (`globals.css:35`) mapped over all Tailwind radius steps (`tailwind.config.ts:56-61`); `blueprint-grid` background texture (`globals.css:134-139`); terminal-window chrome in `terminal-signup.tsx:45-50`; ALL-CAPS mono nav (`app-shell.tsx:11-17`, "SYSTEM STATUS: ONLINE" line 96).
- **Dark theme only, no toggle**: `className="dark …"` hardcoded on `<html>` (`app/layout.tsx:38`); `darkMode: 'class'` (`tailwind.config.ts:4`) with a single `:root` palette (`globals.css:8-37` — comment: "dark only"). No `prefers-color-scheme` handling, no theme switcher.
- Palette (HSL from `styles/globals.css:11-31`, hex equivalents for contrast checks):

| Token | HSL | Hex (computed) |
|---|---|---|
| `--background` | `220 23% 5%` | `#0A0C10` |
| `--foreground` (body text) | `223 27% 92%` | `#E5E8F1` |
| `--card` | `222 21% 8%` | `#101319` |
| `--muted-foreground` (most paragraph/secondary text) | `218 11% 59%` | `#8B93A2` |
| `--primary` (electric blue, CTAs/links) | `210 100% 52%` | `#0A85FF` |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` |
| `--border` | `220 23% 15%` | `#1D232F` |
| `--secondary` | `222 21% 12%` | `#181C25` |
| `--success` | `137 50% 49%` | `#3FBB61` |
| `--warning` | `38 71% 49%` | `#D68B24` |

  Key contrast pairs to check later: body copy on money pages is predominantly `text-muted-foreground` `#8B93A2` on `#0A0C10`/`#101319` (e.g. `offer-page.tsx:30,58,80`, `hero.tsx:23`); lower-opacity variants exist — `text-muted-foreground/70` (`stat.tsx:26`, `hero.tsx:50`) and `text-muted-foreground/60` (`colleagues.tsx:31`); white on `#0A85FF` for primary buttons (`cta.tsx:15`).

## 12. PLACEHOLDER / DEV CONTENT REACHABLE

Grep of `app/ components/ content/ lib/ data/` for `lorem|TODO|placeholder|example.com|your-|XXX`:
- `data/resume.json:6` — **`"phone": "+380 XX XXX XXXX"` placeholder, publicly served** by `app/api/resume/route.ts:12` (GET returns the whole file). The same file's summary (`resume.json:8`) claims "$150k business value… 99.5% accuracy… 1M+ requests/day 99.9% uptime" — unlabeled claims that conflict with the site's source-label rule (`lib/facts.ts:7-12`).
- `components/site/proof-of-method.tsx:11,18` — shipped placeholder statuses: "Available on request" (`VS-TODO:sample-report`), "Coming soon" (`VS-TODO:loom`) on the home page §04.
- `components/site/colleagues.tsx:22-42` — three placeholder testimonial cards rendering "Reference available on request." on the home page.
- `components/site/continuity.tsx:25` — `[VS-TODO:continuity-details]` copy live on home.
- `lib/facts.ts:21` (`VS-TODO:company-spelling`), `:110-111` (DW repo undefined → "coming soon" placeholder per `systems-built.tsx:9-10`).
- `app/blog/page.tsx:44-52` — "// Coming soon" empty state (not reachable: 7 posts exist).
- `components/lab/terminal-signup.tsx:66` — input `placeholder="you@domain.com"` (legitimate UI attr).
- No `lorem`, no `example.com`, no `your-` hits.

## 13. content/case-studies/

Three MDX files (`content/case-studies/`):

1. **`ascend-autonomous-agents.mdx`** — title "Ascend: Agent Orchestration Daemon"; `project_type: primary`, `impact_score: 96`, `featured: true`; metrics claimed: "27 agents (18 mature)", "L0-L4 trust gating", "4 live projects managed", "~2h/day automated"; outcomes include budget-guard auto-demotion; repo link `https://github.com/vitamin33` (profile, not a repo).
2. **`crest-signal-driven-platform.mdx`** — title "Crest: AI Content Platform with Signal-Driven Optimization"; `project_type: startup`, `impact_score: 94`; metrics: "6-stage LangGraph pipeline", "GPT-4o/3.5 model routing", "Thompson Sampling A/B", "91+ unit tests"; "Live production deployment with multi-platform publishing".
3. **`enterprise-multi-project.mdx`** — title "Full-Stack Architecture Across Healthcare, Web3, and AI"; `project_type: anonymized`, `impact_score: 89`; metrics: "3 production domains", "9+ repositories", "10k+ end users", "80-90% RPC cost reduction"; outcome "reduced setup time by ~40%".

Cross-file consistency note: Ascend metrics here ("27 agents (18 mature)") match `lib/facts.ts:44-46` but **conflict with `app/resume/page.tsx:166`** ("15-agent autonomous orchestration system") and the `/about` metadata "15-agent autonomous system" (`lib/seo.ts:144`).

## 14. /resume PAGE

- **Not linked from the main (lab-shell) nav**: sidebar NAV is AUDIT / COST_TEARDOWN / FRACTIONAL / WRITING / ABOUT only (`components/lab/app-shell.tsx:11-17`). The old `Navbar` that does list Resume (`components/navbar.tsx:19-22`) renders **only on `/resume` itself** (`app-shell.tsx:24-26,48-57`).
- Still publicly reachable: `/about` has a primary-styled "Download Resume" CTA → `/resume` (`app/about/page.tsx:110-116`); sitemap lists `/resume` at priority 0.7 (`app/sitemap.ts:76-80`); indexable (no `noIndex`, `lib/seo.ts:172-178`).
- **Reads as job-seeker content**, not vendor: full CV layout with "Professional Summary" (`app/resume/page.tsx:51-63`, "Senior engineer with 12+ years…"), skills sections including the heading **"MLOps & Platform (Learning)"** (`:85-87`), employment history 2013-2023 (`:188-233`), "Key Projects … Personal R&D" (`:248-249,276`), Education (`:352-377`). Title on page: "AI Systems Architect" (`:32`) vs site-wide "Agentic Systems Architect" (`lib/facts.ts:16`).
- Companion endpoint `/api/resume` (`app/api/resume/route.ts:4-20`) serves `data/resume.json` labeled "MLOps Engineer & LLM Specialist" with the placeholder phone and unlabeled claims (§12).
