# serbyn.pro Redesign — Overview, Architecture Decision & Plan

> **Design source:** Google Stitch export "Kinetic Lab" — `~/Downloads/stitch_ai_systems_architect_portfolio/` (home, work_index, blog, article × desktop+mobile + `kinetic_lab/DESIGN.md`).
> **Aesthetic:** "Engineered Minimalism / Lab Notebook" — dark, hairline borders, JetBrains-Mono metadata, system-ID labels, status chips, a live metric strip, sidebar nav.
> **Stack (unchanged):** Next.js 14 App Router, MDX, Tailwind, shadcn, Vercel.
> **Spec set:** `01_DESIGN_SYSTEM.md` · `02_DATA_MODEL_AND_GAPS.md` · `03_PUBLISHING_PIPELINE.md`.

---

## 1. Goal

Re-skin serbyn.pro to the Kinetic Lab design **driven by real data**, ship an SEO-optimized blog, and stand up an **artifact → SEO blog → publish** pipeline fed by Vitalii's real dev work. End state: live on production (Vercel), self-updating from Ascend data.

## 2. The design needs more structured data than the site holds today

The Stitch screens render a "system dashboard" — every project card has a system-ID (`01_ARCH_001`), status chips (`95% RELIABLE`, `THROUGHPUT`, `ZERO-TRUST`), an impact score, and a cover image; the home hero shows a 4-metric live strip + an availability badge; articles have a numbered essay-map TOC + a sticky code panel; the blog has thumbnails, a terminal newsletter signup, and an RSS feed.

Full element-by-element mapping is in `02_DATA_MODEL_AND_GAPS.md`. Summary:

| Bucket | HAVE (use directly) | DERIVE (transform existing) | NEW (must create) |
|---|---|---|---|
| Hero metric strip | agents, mature count, tests, trust levels, value saved (Ascend state) | single rollup number formatting | `data/site/metrics.json` rollup + build-time read; availability flag |
| Work cards | category, impact_score, tech, description, outcomes, highlight_metrics | status chips from highlight_metrics; system-ID from category+index | cover images; 4-category taxonomy alignment; `relevance` sort key |
| Article | MDX body, readingTime, date, author | essay-map TOC from H2s (rehype-slug present); code panel from first fenced block | optional `featured_code` frontmatter; cover |
| Blog index | post list, category, readingTime, description, keywords | thumbnails via OG-cards | **RSS feed**, **newsletter signup + /api/subscribe (Resend)**, pagination |
| Chrome | social links | sidebar category counts from metrics.json | sidebar nav component; RSS footer link; "system status" indicator |

**Nothing is a blocker.** The only truly-missing *content* is cover images (solvable with generated OG-style cards) and blog posts (the pipeline produces them).

## 3. Architecture decision — where the publishing brain lives

**Recommendation: Ascend orchestrates; Crest (optionally) generates prose.** This matches the existing ADR split (Ascend = WHAT/WHY/data + orchestration; Crest = generate/score/publish).

| Concern | Ascend (local, launchd) — RECOMMENDED | Crest (cloud, api.serbyn.pro) |
|---|---|---|
| Writes blog MDX → serbyn-pro git | ✅ already does (portfolio-analyzer commits there); `scripts/blog_publisher.py` built + tested | needs GitHub API push plumbing |
| Reads the metric rollup (trust.db, sprint-state, value_log) | ✅ native — the data lives in Ascend | ❌ can't reach local DBs (per infra note) |
| Generates SEO prose | `seo-writer` skill (claude-code engine) | `crest_claude_write` (voice-tuned) — callable from Ascend via MCP |
| Dedup (blog↔LinkedIn) | ✅ `semantic_dedup` + `topic_history_dedup` already here | — |
| Runs without the laptop | ❌ launchd = local only | ✅ true cloud |

**Default:** keep the pipeline in **Ascend** — it reuses everything already built (`blog_publisher.py`, `newsletter_assembler.py`, seo-writer, dedup, experience_atoms) and the metric rollup comes from Ascend's own state. Generation can call Crest's `crest_claude_write` for voice quality.

**Cloud-independence path (later, optional):** if you want it to run without the laptop, migrate the *intake + generation* to Crest and let Crest commit to serbyn-pro via the GitHub API, with Ascend pushing a nightly `metrics.json` snapshot to the repo. Deferred — only if machine-independence becomes a requirement. See `03_PUBLISHING_PIPELINE.md §6`.

## 4. Phased plan (each phase independently shippable; prod deploy is the final gate)

| Phase | Scope | Output | Verify |
|---|---|---|---|
| **P0 — Design system** | Adopt Kinetic Lab tokens in `tailwind.config.ts` + `globals.css`; build primitive components (sidebar, metric-strip, status-chip, system-id label, card, terminal-signup). | restyled primitives, no data wiring | Storybook-less: a `/style` preview page; `npm run build` |
| **P1 — Data layer** | `data/site/metrics.json` rollup + Ascend generator script; extend `CaseStudyMeta` (system_id, status_chips, cover); category taxonomy; generate cover OG-cards. | real data feeding cards + hero | metrics.json present; type-check |
| **P2 — Screens** | Rebuild home, work index (sidebar+filters+sort), article layout (essay-map TOC + code panel), with P0 components + P1 data. | full visual redesign | build + Lighthouse ≥ current |
| **P3 — Blog + growth** | RSS feed (`app/feed.xml`), Resend newsletter signup + `/api/subscribe`, blog index thumbnails + pagination, per-page OG (done). | SEO blog live-ready | feed validates; signup round-trips |
| **P4 — Publishing pipeline** | Artifact inbox → enrich (atoms/git-stories) → dedup → seo-writer/Crest gen → `blog_publisher` commit → Vercel deploy; newsletter assembler wired to Resend broadcast. | one artifact → live post | dry-run a real artifact end-to-end |
| **P5 — Production** | Merge to `main`, push, verify Vercel deploy, smoke-test live URLs, confirm OG/RSS/sitemap. | **live on serbyn.pro** | **human gate — you test prod** |

**Prod-deploy gate (P5):** pushing `main` auto-deploys Vercel. I will **not** push to prod without your explicit go. Everything up to P4 lands on a branch + Vercel **preview** URL you can review first.

## 5. Risks & decisions to confirm

- **Token conflict in DESIGN.md:** the YAML frontmatter auto-generated a *grayish* `primary: #c6c6cc` + blue `secondary`, but the prose spec (and the screenshots, and the current site) use **electric blue `hsl(210 100% 52%)`** as the accent. → Spec follows the **prose + screenshots** (electric blue). Flagged in `01_DESIGN_SYSTEM.md`.
- **Category taxonomy:** design sidebar uses Architecture / Infrastructure / Optimization / Research; current `category` enum is platform / infrastructure / optimization / feature. → Realign (see `02`).
- **Covers:** generate branded OG-style cards (next/og) as default; swap real screenshots later.
- **ESP:** Resend (decided). Free tier; capture + broadcast.
- **Effort:** ~P0-P3 are frontend (Claude Code in-repo); P4 reuses built Ascend scripts. Realistic multi-session build; I'll ship per-phase to preview.
