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
- [ ] **T09** `/writing` page (reuse blog system) + `/methodology` DW note + nav updates (vendor nav). Add T6 (blog still works), T1 for offer/writing/methodology pages.
- [ ] **T10** Measurement: CTA/outbound-click analytics events (existing PostHog), per-page meta/OG, README UTM convention.
- [ ] **T11** Repo-wide number reconciliation to canonical set (about page, case studies, achievements.json, metrics.json); remove unused counter component; strip candidate/"available"/"hire" framing.
- [ ] **T12** Complete Playwright suite T1–T8 (JS-disabled numbers, forbidden strings, link crawl, labels, pricing-once, responsive screenshots). Green cumulatively.
- [ ] **T13** FINAL: single clean run of lint + build + full Playwright suite; write FINAL REPORT; leave committed-clean, unpushed.

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
- **T00 — Existing conflicting numbers to reconcile (T11):** `capabilities.tsx` "19 agents / 4 projects", case study "19 agents (12 mature)", `metrics.json` "TRUST 13/54", "AUTONOMY 92% 72/78", `achievements.json` "27 agents 12 mature". Canonical: **18+ mature agents (27 total)**, **1,178 tests**.

---

## VS-TODO (human input required — Vitalii supplies)

Format: `[VS-TODO:<id>]` — what to provide · where it plugs in · expected format.

- **[VS-TODO:loom]** — 2–3 min Loom walkthrough of a real audit/method. Plugs into Home §7 Proof of Method card. Expected: a public Loom URL. (Placeholder: "Walkthrough — coming soon".)
- **[VS-TODO:sample-report]** — Sanitized sample audit report PDF. Plugs into Home §7 Proof of Method + `/audit` deliverables. Expected: a PDF in `/public` + link. (Placeholder: "Sample report — available on request".)
- **[VS-TODO:linkedin-recs]** — 2–3 colleague quotes for Home §8. Vitalii supplies EXACT quote text + name + role + LinkedIn URL. Do NOT auto-write quotes. (Placeholder: "References shared privately on request".)
- **[VS-TODO:dw-github]** — Public GitHub URL for DW (autonomous spec-driven dev pipeline). Plugs into Home §4 DW card. Expected: repo URL. (Placeholder: link hidden until supplied.)
- **[VS-TODO:continuity-details]** — Specifics for §9 Continuity (backup power/connectivity setup in Kyiv, DPA availability). Expected: 1–2 sentences of fact. (Placeholder: honest general statement only.)
- **[VS-TODO:company-spelling]** — Confirm legal spelling "Easelect LTD" vs "EASELECT LTD" and that company no. 15983917 / Manchester office are correct to publish.
- **[VS-TODO:dw-methodology-numbers]** — Confirm DW "101 logged runs, 0.94 pass rate" is current; methodology note at `/methodology` defines run/pass generically from repo content.

---

## FINAL REPORT

_(appended in T13)_
