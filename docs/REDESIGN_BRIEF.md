# serbyn.pro Redesign Brief — Design-First Pipeline

> Pipeline: **Google Stitch (explore look)** → optional **v0 (hard sections)** →
> **Claude Code + `frontend-design` skill (implement in-repo)**. The MDX/content
> backend (`lib/`, `content/`, loaders) stays untouched — only `app/`,
> `components/`, `styles/` change.

---

## 0. Ground truth (do not regenerate these)

- **Stack:** Next.js 14 App Router, TypeScript, Tailwind, shadcn (`new-york`, base `neutral`), MDX via `gray-matter`. Vercel.
- **Theme:** dark-only (`darkMode: 'class'`). Primary `hsl(210 100% 52%)` (bright blue) on near-black. Fonts: **Inter** (sans) + **JetBrains Mono** (mono accents). Radius `0.75rem`.
- **Routes to redesign:** `/` (home), `/about`, `/work`, `/work/[slug]`, `/blog`, `/blog/[slug]`, `/resume`.
- **Positioning:** "AI Systems Architect" — 12+ yrs production, agent orchestration. Audience: US remote AI/MLOps hiring managers + potential consulting clients.
- **Funnel goal:** drive to (a) Calendly booking and (b) a NEW email/newsletter capture.

---

## 1. PROMPT FOR GOOGLE STITCH (paste into Stitch, generate 3–5 directions)

```
Design a dark-mode personal site for an "AI Systems Architect" — a senior
engineer who builds autonomous AI agent systems. Audience: US remote AI hiring
managers and consulting clients. Tone: precise, engineered, confident, not
flashy. Think "staff engineer's lab notebook meets premium SaaS landing."

Brand:
- Dark only. Near-black background (#0a0c10-ish), bright electric blue accent
  (hsl 210 100% 52%), cool gray neutrals.
- Typography: Inter for UI/body, JetBrains Mono for code, labels, numbers, and
  metric callouts (lean into the monospace for a technical signature).
- Generous whitespace, 12px corner radius, thin hairline borders, subtle grid /
  blueprint texture in the hero only.

Screens to design:
1. HOME — hero (name, one-line positioning, 2 CTAs: "View Work" + "Book a Call"),
   a strip of 3-4 hard metrics in monospace (e.g. "30 agents", "$0/run engine",
   "1,375 tests"), a featured-work grid (3 cards with tech-stack chips), a short
   about teaser, and a footer CTA band with an EMAIL CAPTURE field + Calendly.
2. WORK INDEX — filterable grid of case-study cards (category chips, impact
   score badge, hover lift).
3. CASE STUDY / BLOG POST — long-form reading layout: sticky table of contents,
   metric "before/after" callout block, code blocks, a related-posts rail, and a
   bottom CTA ("Discuss this architecture").
4. BLOG INDEX — clean list with date, reading time, category tag, and a
   newsletter-signup card pinned at top.

Motion intent (describe, don't animate): scroll-reveal on sections, magnetic
hover on cards, animated number count-up on the metric strip, smooth page
transitions. Keep it tasteful — one signature moment in the hero, calm elsewhere.

Deliver: high-fidelity dark UI for all 4 screens, desktop + mobile. Export the
design tokens (colors, type scale, spacing) as DESIGN.md.
```

After generating: pick ONE direction, export the **DESIGN.md tokens** (and Figma if you refine), and drop them next to this file as `docs/DESIGN.md`.

---

## 2. PROMPT FOR CLAUDE CODE (open a session IN the serbyn-pro repo, then paste)

```
Redesign serbyn.pro using the chosen direction in docs/DESIGN.md. Use the
frontend-design skill to avoid generic AI aesthetics.

HARD CONSTRAINTS:
- Do NOT touch lib/, content/, or the MDX loaders (blog-posts.ts,
  case-studies.ts) or the frontmatter schema. The content backend is frozen.
- Only edit app/**, components/**, styles/**, tailwind.config.ts.
- Preserve all existing routes, metadata (lib/seo.ts), JSON-LD, sitemap.ts,
  robots.ts. SEO must not regress.
- Keep shadcn primitives; restyle via tokens, don't rip out the component lib.

SCOPE:
1. Adopt the DESIGN.md tokens in globals.css + tailwind.config.ts (colors, type
   scale). Stay dark-only.
2. Rebuild hero-architect, featured-work (make it QUERY case-studies.ts instead
   of the hardcoded array), cta-section, navbar, and the blog/work card
   components to the new design.
3. Build a NEW <NewsletterSignup/> component (email field + success state) and a
   reusable <MetricStrip/> with count-up animation. Place signup in the footer
   CTA band and at the top of /blog.
4. Animations: add `motion` (Framer Motion) for scroll-reveal + card hover, and
   the View Transitions API for route changes. Add GSAP ScrollTrigger ONLY for
   the hero signature moment. Respect prefers-reduced-motion.
5. Per-page dynamic OG images via @vercel/og (next/og) — replace the static
   logo.png OG for /work/[slug] and /blog/[slug].

VERIFY before finishing: `npm run build` passes, `npm run type-check` clean,
Lighthouse (perf + a11y) not worse than current, no console errors. Show me a
diff summary grouped by file, and list any new dependencies added.
```

---

## 3. Notes

- The email capture needs a backend (route handler + a store). Cheapest: a
  `/app/api/subscribe/route.ts` writing to a Vercel KV / Upstash list, or
  forwarding to an ESP (Buttondown/Resend Audiences). Decide before wiring the
  component — the component can ship with a stubbed handler first.
- GLM-5.2 is a viable cheaper generator if you want to A/B a second visual
  direction, but Claude Code (Max plan, $0 marginal) is the integration path.
