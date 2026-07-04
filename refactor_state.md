# serbyn.io — Consulting Refactor · State File

Refactor of serbyn.io from an engineer-portfolio into a consulting site for a
solo AI / Agentic Systems Architect (Vitalii Serbyn, EASELECT LTD... see note
in Decisions re: company name). Loop protocol: read this file → take topmost
unchecked task → implement → verify (build + Playwright) → mark done with
evidence → commit `refactor: <task-id> <summary>`. One task per commit.

Canonical source of truth for numbers/labels: `lib/facts.ts` (created T01).

---

## TASK CHECKLIST

- [x] **T00** Recon repo + create this state file. Evidence: baseline `npm run build` exit 0; recon notes in Decisions log.
- [x] **T01** Foundation: `lib/facts.ts` (canonical numbers + labels + contact + pricing), `components/site/stat.tsx` (labeled-claim component for T5), Playwright harness (`playwright.config.ts`, install chromium, `tests/refactor/` smoke test T1-home). Evidence: `npm run lint` clean; `tests/refactor/smoke.spec.ts` green (1 passed).
- [x] **T02** Home §1 HERO (new copy) + §2 rare-mixture credibility + §3 quantified results strip. Kill the animated MetricStrip counter. Wire into home; remove old HeroArchitect. Evidence: deleted `hero-architect.tsx` + `metric-strip.tsx` (only counter); lint clean; smoke green (build+serve OK). New H1 "I make AI agents reliable enough to run in production." live.
- [x] **T03** Home §4 SYSTEMS I'VE BUILT (Ascend / DW / Crest cards) + §5 OFFERS (3 priced cards linking to offer pages). Evidence: build exit 0; smoke green; static HTML contains 18+/1,178/101/0.94/$3,500/from $2,000/from $4,000/mo + "Systems I designed and built" header + DW "Repository — coming soon" placeholder; no standalone `>0<`.
- [x] **T04** Home §6 HOW I WORK (operator protocol) + §7 PROOF OF METHOD (VS-TODO placeholders) + §8 WHAT COLLEAGUES SAY (VS-TODO) + §9 CONTINUITY & TRUST. Evidence: verify.sh green (lint+build+serve); smoke green; static HTML has "How I work" / "See the method, not just claims" / "What colleagues say" / "How engagements are run"; §7/§8 render clean "Available on request"/"Coming soon" placeholders (no fabricated quotes).
- [x] **T05** Home §10 WRITING (from blog system) + §11 FINAL CTA. Assemble final home; remove TechStack / Capabilities / AboutSnippet / old CTASection from home. Add home tests T1/T2/T5. Evidence: home now §1–§11; `home.spec.ts` T1/T2/T5 + smoke all green (4 passed). Legacy home components orphaned (deleted in T11).
- [x] **T06** `/audit` page (AI Agent Production-Readiness Audit — $3,500). Evidence: shared `OfferPage` renderer + `AUDIT_CONTENT`; supported-stack scoping note included; `/audit` T1 + T8 ($3,500 once) green (6 passed).
- [x] **T07** `/llm-cost-teardown` page (from $2,000, six levers). Evidence: `TEARDOWN_CONTENT` + six levers (qualitative, no invented %); own-platform $82→$34 (−58%) case with honest label via `CostCase`; T1 + T8 (from $2,000 once) green (8 passed).
- [x] **T08** `/fractional` page (from $4,000/mo). Include Advisory $200/hr option. Evidence: `FRACTIONAL_CONTENT` + `AdvisoryNote` ($200/hr, 10-hr min); audit→retainer upsell (fee credited within 60 days) in FAQ; T1 + T8 (from $4,000/mo once) green (10 passed).
- [x] **T09** `/writing` page (reuse blog system) + `/methodology` DW note + nav updates (vendor nav). Add T6 (blog still works), T1 for offer/writing/methodology pages. Evidence: `/writing` + `/methodology` (DW run/pass definitions, linked from DW home card); sidebar nav → AUDIT/COST_TEARDOWN/FRACTIONAL/WRITING/ABOUT; T6 + T1 for all pages green (14 passed).
- [x] **T10** Measurement: CTA/outbound-click analytics events (existing PostHog), per-page meta/OG, README UTM convention. Evidence: `cta_click`/`outbound_click` events on all CTAs (cta.tsx); vendor site meta in `lib/seo.ts` (name/description/keywords/Person schema); `README.md` UTM convention + middleware cookie note; `meta.spec.ts` (title/desc/OG/canonical on 6 pages) green (20 passed).
- [x] **T11** Repo-wide number reconciliation to canonical set (about page, case studies, achievements.json, metrics.json); remove unused counter component; strip candidate/"available"/"hire" framing. Evidence: deleted 5 orphaned home components + dead `lib/site-metrics.ts` & `data/site/metrics.json` (removed 92%/13-54/10.2B conflicts); Ascend counts 19→27 / 12→18 in about + case study + achievements.json; repo-wide scan shows no `19 agents`/`12 mature`/`59x`/rendered `lorem`; no `open to work`/`hire me`. 20 passed.
- [x] **T12** Complete Playwright suite T1–T8 (JS-disabled numbers, forbidden strings, link crawl, labels, pricing-once, responsive screenshots). Green cumulatively. Evidence: T3 (forbidden.spec), T4 (links.spec crawl depth-2), T7 (responsive.spec, 390/1440, no overflow) added; full suite 32 passed; screenshots in `.playwright-artifacts/{home,audit}-{390,1440}.png`.
- [x] **T13** FINAL: single clean run of lint + build + full Playwright suite; write FINAL REPORT; leave committed-clean, unpushed. Evidence: lint ✓ + build ✓ + 32 Playwright passed in one final run; FINAL REPORT below; branch committed-clean, unpushed.

---

## Decisions log

- **T00 / R6 — Booking link is Calendly, not Cal.com.** Repo (and recent commit `eb25b20`) standardizes on `https://calendly.com/serbyn-vitalii/consulting`. Prompt said "Cal.com link from repo config or VS-TODO". A real booking link exists in repo → use it; NOT a VS-TODO.
- **T00 / R6 — Analytics already present.** PostHog (`components/analytics/posthog-provider.tsx` + `lib/analytics.ts` `track()`) + Vercel Analytics + SpeedInsights. Prompt allowed "Plausible OR keep existing analytics if present" → keep PostHog; add CTA/outbound events through existing `track()`. Not adding Plausible.
- **T00 / R6 — Company name.** Prompt APPROVED FACTS say "EASELECT LTD". Repo everywhere says "Easelect LTD" (footer, SEO schema, company no. 15983917, Manchester office). Same entity, spelling variant. Keeping repo spelling **"Easelect LTD"** for consistency with legal/registration data already in the footer. Logged as a VS-TODO to confirm exact legal spelling.
- **T00 / R6 — `/writing`.** Existing blog index is `/blog` (kept intact per R5). Adding `/writing` as a real page (200 + H1) reusing the blog listing, vendor-framed. `/blog` post routes untouched.
- **T00 / R6 — Existing design system reused.** "Kinetic Lab" dark-only palette, square corners, mono labels, utilities (`.container .section .headline-* .label-caps .metric-lg .blueprint-grid`), `StatusChip`, `Reveal`. Moving toward mxcl.dev direction via spacing/typography/section changes only (R4).
- **T00 — Animated counter located.** `components/lab/metric-strip.tsx` is the count-up counter (starts display at "0"); used only by `hero-architect.tsx`. Both retired in T02/T11 (R3).
- **T00 — No "59x" anywhere in repo** (grep clean). No "lorem". Good baseline for T3.
- **T00 — GitHub repo URLs in content:** Ascend → `https://github.com/vitamin33`; Crest → `https://github.com/vitamin33/threads-agent`. DW has no repo URL → VS-TODO for GitHub link.
- **T11 — Dead metric files deleted.** `getSiteMetrics`/`lib/site-metrics.ts`/`data/site/metrics.json` had no importers after the counter was killed and carried conflicting numbers (92% / 13-54 / 10.2B / FALLBACK 30-agents). Deleted rather than updated. `data/achievements.json` is also unrendered; updated its `12 mature`→`18 mature` for consistency but left in place (possible external consumer).
- **T00 — Existing conflicting numbers to reconcile (T11):** `capabilities.tsx` "19 agents / 4 projects", case study "19 agents (12 mature)", `metrics.json` "TRUST 13/54", "AUTONOMY 92% 72/78", `achievements.json` "27 agents 12 mature". Canonical: **18+ mature agents (27 total)**, **1,178 tests**.

---

## VS-TODO (human input required — Vitalii supplies)

Format: `[VS-TODO:<id>]` — what to provide · where it plugs in · expected format.

- **[VS-TODO:loom]** — 2–3 min Loom walkthrough of a real audit/method. Plugs in at `components/site/proof-of-method.tsx:18` (PROOFS[1]). Expected: a public Loom URL → turn the card into a link. Placeholder now: "Coming soon".
- **[VS-TODO:sample-report]** — Sanitized sample audit report PDF. Plugs in at `components/site/proof-of-method.tsx:11` (PROOFS[0]) + the `/audit` "written report" deliverable. Expected: a PDF in `/public` + link. Placeholder now: "Available on request".
- **[VS-TODO:linkedin-recs]** — 2–3 colleague quotes for Home §8. Plugs in at `components/site/colleagues.tsx:32` (replace the placeholder cards). Vitalii supplies EXACT quote text + name + role + LinkedIn URL. Do NOT auto-write quotes. Format: `{ quote, name, role, url }[]`.
- **[VS-TODO:dw-github]** — Public GitHub URL for DW. Plugs in at `lib/facts.ts:109` (SYSTEMS `dw.repo`, currently `undefined`); once set, `components/site/systems-built.tsx:58` "Repository — coming soon" auto-swaps to a GitHub link. Expected: repo URL string.
- **[VS-TODO:continuity-details]** — Specifics for §9 Continuity. Plugs in at `components/site/continuity.tsx:25` (Continuity TERMS). Expected: 1–2 sentences on Kyiv backup power/connectivity + DPA availability. Placeholder now: honest general statement.
- **[VS-TODO:company-spelling]** — Confirm legal spelling "Easelect LTD" vs "EASELECT LTD" and company no. 15983917 / Manchester office. Plugs in at `lib/facts.ts:21` (CONTACT.company) + `components/footer-legal.tsx` (office block). Expected: confirmed string.
- **[VS-TODO:dw-methodology-numbers]** — Confirm DW "101 logged runs, 0.94 pass rate" current. Plugs in at `lib/facts.ts:55` (RESULTS) + `lib/facts.ts:105` (SYSTEMS `dw.metric`) + `app/methodology/page.tsx`. Expected: confirmed integers, else updated values.

---

## FINAL REPORT

**Status: COMPLETE.** All checklist tasks T00–T13 done. Final single run:
`npm run lint` ✓ · `npm run build` ✓ (all routes prerendered) · Playwright
**32 passed** (T1–T8 + meta). Branch committed-clean, unpushed.

### Before → After — home section map

| Before (candidate/portfolio)                          | After (vendor/consulting)                                             |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| HeroArchitect + animated count-up MetricStrip         | §1 Hero — "I make AI agents reliable enough to run in production."    |
| FeaturedWork (case-study cards)                       | §2 Credibility stack · §3 Quantified results (labeled)               |
| Capabilities (CV bullets, "19 agents", 70% kill…)     | §4 Systems I designed and built (Ascend/DW/Crest, labeled metrics)   |
| TechStack (skills grid)                               | §5 Fixed-scope offers → §6 How I work → §7 Proof → §8 Colleagues     |
| AboutSnippet (photo placeholder + bio)                | §9 Continuity & trust                                                 |
| CTASection (newsletter + "Book an Architecture Review")| §10 Writing (from blog) · §11 Final CTA (booking + email)            |

**New pages:** `/audit` · `/llm-cost-teardown` · `/fractional` · `/writing` ·
`/methodology`. **Nav:** WORK/BLOG/ABOUT/RESUME → AUDIT/COST_TEARDOWN/FRACTIONAL/
WRITING/ABOUT. **Kept intact (R5):** `/blog` + posts, RSS `/feed.xml`, `/work` +
case studies, `/about` (numbers reconciled), `/resume`, `/legal/*`, sitemap.

### Removed / changed claims & numbers (and why)

- **Animated count-up counters** (`MetricStrip`, `hero-architect.tsx`) — deleted. Rendered "0" before animating and was wrong with JS off (R3). Now all metrics are plain server text.
- **`data/site/metrics.json` + `lib/site-metrics.ts`** — deleted. Carried unlabeled/uncanonical figures: AUTONOMY 92% (72/78), COMPUTE 10.2B tokens/$9.8K, TRUST 13/54, plus a FALLBACK "30 agents / 1,375 tests". Not in APPROVED FACTS, no importers after the counter died.
- **"19 agents (12 mature)" / "19 agents managing 4 live projects"** → **"27 agents (18 mature)"** in `app/about`, `content/case-studies/ascend-autonomous-agents.mdx`, `data/achievements.json`. Matches APPROVED FACTS ("18+ mature, 27 total"). Ascend "1,178 tests" added to the about line.
- **CV-style sections** (Capabilities, TechStack) removed from home — candidate framing (skills grids, "70% intake kill rate", "150+ personas", "26K→3K RPC", "24 services"). Project-specific descriptive numbers remain only inside `/work` case studies, employment-labeled.
- **"59x ROI"** — grep-clean across repo before and after; verified absent by T3. Never published.
- **LLM cost** presented only as own-platform **$82→$34 (−58%)** with the honest label "on my own platform — small bill, same levers scale with spend"; never as a client result. Per-lever impact stated qualitatively (no invented percentages).
- **Booking** — kept the existing Calendly link (Cal.com absent from repo, R6).

### Every published number now carries a source-label (R2)

18+ mature / 27 total agents · 1,178 tests → "on Ascend, a system I designed and
built". 101 runs / 0.94 pass → "on DW…". −58% ($82→$34) → "on my own platform".
100M+ downloads / Google Play Editor’s Choice · 80–90% RPC → "as engineer, in an
employed role". Enforced by the
`Stat` component + test T5.

### Diff stats

`eb25b20..HEAD`: **53 files changed, +2,416 / −591**. 14 task commits (T00–T13)
plus 1 sitemap follow-up. Never pushed, never merged.

### Screenshot index (regenerate via `npm run test:e2e`; dir is gitignored)

- `.playwright-artifacts/home-390.png` · `.playwright-artifacts/home-1440.png`
- `.playwright-artifacts/audit-390.png` · `.playwright-artifacts/audit-1440.png`

### Test suite — `tests/refactor/` (32 passed)

T1 pages 200 + H1 (smoke.spec) · T2 JS-disabled canonical numbers + no bare-0
(home.spec) · T3 forbidden strings (forbidden.spec) · T4 internal-link crawl
depth-2 (links.spec) · T5 every claim labeled (home.spec) · T6 blog still works
(blog.spec) · T7 responsive 390/1440 no overflow (responsive.spec) · T8 pricing
once per offer page (offers.spec) · meta/OG on every page (meta.spec).

### Suggested 5-step manual QA for Vitalii

1. **Booking + email:** on `/`, `/audit`, `/llm-cost-teardown`, `/fractional`, click "Book a 30-min systems call" → confirm Calendly opens the right event; click the email CTA → confirm it drafts to serbyn.vitalii@gmail.com.
2. **Fact-check the numbers:** confirm every APPROVED FACT is still current (18+ mature/27 total, 1,178 tests, DW 101/0.94, $82→$34). Anything drifted → edit `lib/facts.ts` (single source).
3. **Fill the VS-TODOs:** supply Loom, sample-report PDF, LinkedIn recs, DW GitHub, Kyiv continuity specifics, and confirm company spelling — each has a clean placeholder and a file:line anchor in the VS-TODO section above.
4. **Analytics:** with `NEXT_PUBLIC_POSTHOG_KEY` set, click a few CTAs → confirm `cta_click` / `outbound_click` events arrive in PostHog; open a `?utm_source=linkedin…` link and confirm the UTM cookie is set (see README).
5. **Cross-device pass:** open `/` and `/audit` on a phone and a wide monitor (no horizontal scroll); open `/blog`, one post, and `/writing` to confirm the blog system is untouched.
