# serbyn.io — Conversion / Frontend / AEO Audit
**Date:** 2026-07-07 · **Mode:** BASELINE run (no prior baseline.json)
**Version check:** live buildId `Nf62vwdeTJ4wl7ShaEAI6` == repo HEAD `5f0ac20` (latest post 2026-06-23 live; "100M+ downloads" copy live). **No deploy lag; zero [DEPLOY-LAG] items.**
**Goal:** a qualified buyer books a paid-audit fit call. Path (a) warm DM (weight 2×), path (b) LinkedIn content.
Evidence: `.fable_audit/shots/` (59 screenshots), `metrics.json`, `links.md`, `html-harvest.md`, `repo-analysis.md`, `booking-flow.json`, `a11y.json`, `notes.md`.

---

## §1 Persona verdicts

| Persona | Verdict | Deciding element | Evidence |
|---|---|---|---|
| **P1 Pasha** (iGaming operator, warm DM, mobile, 8-sec, 2× weight) | **Lurks — replies to the DM instead of booking** | The proof section: he scrolls from strong fold → honest numbers → offers with prices, then hits §04/05 where **all three inspectable artifacts are promises** — sample report "Available on request", walkthrough "COMING SOON", references "on request". His question is "is he safe to pay?" and the site answers "trust me, ask me". The continuity section (UK LTD, IP transfer, read-only default, Kyiv backup power) is genuinely good and keeps him from disqualifying — but he books only if the DM itself carries the proof. | `shots/home-390-scroll-07..09.png`; `components/site/proof-of-method.tsx:11,18`; `components/site/colleagues.tsx:22-42` |
| **P2 LinkedIn founder** (agents lying in prod, won't DIY) | **Lurks / follows; books on a later touch** | Pain match is immediate ("I make AI agents reliable enough to run in production", false-greens language) and depth reads as proof, not tutorial (methods named, no how-to steps on money pages). What stops the booking: **every metric is about Vitalii's own systems** — zero client evidence anywhere — so the mental model is "brilliant builder, unproven vendor". | `shots/home-390-fold.png`; `lib/facts.ts:43-77`; `shots/home-390-scroll-09.png` |
| **P3 Skeptic verifier** (site + LinkedIn side-by-side) | **Bounces — trust kill** | Cross-checking numbers finds real contradictions: `/work` meta description and `/resume` say **"15-agent"** while home says **"18+ mature agents (27 total)"**; `/api/resume` publicly serves **placeholder phone `+380 XX XXX XXXX`** and **unlabeled** "$150k business value / 99.9% uptime" claims — on a site whose own rule is "claims that cannot cite their proof are treated as failures". Blog "58 runs, 93%" vs home "101 runs · 0.94" is reconcilable via visible dates, but the 15-vs-27 and resume.json are not. CRITICAL for a reliability consultant. | `lib/seo.ts:144`; `app/resume/page.tsx:166`; `data/resume.json:6,8`; `lib/facts.ts:44-46` |
| **P4 Recruiter** | **Reads "vendor" mostly — 5 candidate residues remain** | Residues: (1) `/resume` full CV page with Education + employment history; (2) heading **"MLOps & Platform (Learning)"** on it; (3) primary-styled **"Download Resume"** CTA on /about that visually outranks "Book a Call"; (4) `/resume` in sitemap at 0.7 priority, indexable; (5) resume meta "Download PDF or view online". | `app/resume/page.tsx:85-87,188-233,352-377`; `app/about/page.tsx:110-118`; `app/sitemap.ts:76-80`; `lib/seo.ts:172-178`; `shots/about-390-full.png` |
| **P5 Return visitor** (saw a post, second visit a week later) | **Bounces — visit 2 is identical to visit 1** | Nothing catches him: no email capture on `/`, `/writing`, or any offer page (the only signup form lives on `/blog`, which is not in the nav); no downloadable artifact; RSS is a footer whisper. Unless a new post shipped that exact week, the site has no memory of him and no hook. | `app/blog/page.tsx:41` (only TerminalSignup usage); nav list `components/lab/app-shell.tsx:11-17` |

---

## §2 CRITICAL list

1. **The proof layer is placeholders.** Under the headline "See the method, not just claims", all three artifacts are non-artifacts: sample report "Available on request" (`proof-of-method.tsx:11`, `VS-TODO:sample-report`), video "COMING SOON" (`:18`), and a "What colleagues say" section rendering **three empty cards** that each say "Reference available on request." (`colleagues.tsx:22-42`). A testimonial section with no testimonials is worse than no section. This is P1's deciding element on the primary path.
2. **The site violates its own evidence rule where a verifier will look.** "15-agent" survives in `/work` meta (`lib/seo.ts:144`) and on `/resume` (`app/resume/page.tsx:166`) vs "27 agents" everywhere else; `/api/resume` serves placeholder phone + unlabeled "$150k / 99.9% uptime / 1M+ req/day" claims (`data/resume.json:6,8`). Each is individually small; together they hand the skeptic exactly the false-green he's hunting for.
3. **The pre-click layer is broken on the primary channel.** All money pages share `og:image = logo.png` — a 1024×1024 **transparent-background black glyph** declared as 1200×630 (`lib/seo.ts:8,92-94`). In a DM (iMessage/WhatsApp/Slack dark mode) the preview is a black smudge on dark; on LinkedIn it's an anonymous molecule with no name, offer, or price. Meta descriptions bury the price at char 230+/165+ so SERP/preview truncation always cuts it (`shots/preclick-previews.png`). Ironically blog posts get proper generated OG cards; the $3,500 page doesn't.
4. **The booking handoff leaks at the moment of highest intent.** "Book a 30-min systems call" lands on a Calendly event literally titled **"Tech"** (`shots/booking-1-landing-390.png`), behind a cookie wall, with zero qualification fields (`booking-flow.json`) — and for a US-Eastern viewer the slots run **04:00–09:30 AM** (0 workable for US Pacific) against "I work with US, UK, and EU teams". No UTM passthrough, no completion tracking (`repo-analysis.md §4-5`): Vitalii cannot see this leak in PostHog.
5. **The AEO verification path is handicapped by config, not content.** `robots.txt` fully blocks GPTBot, Google-Extended, and CCBot (`app/robots.ts:21-32`) — excluding the site from OpenAI training corpora and **Gemini grounding** while assistants are how warm buyers vet vendors. No Service/Offer/FAQPage schema on the three offer pages, `llms.txt` 404, and Organization `sameAs` points to `linkedin.com/company/serbyn-solutions` — a different name than the org it describes ("Easelect LTD", `lib/seo.ts:245`).

---

## §3 Full findings table

| # | Finding | Evidence | Impact | Effort | Fix |
|---|---|---|---|---|---|
| F1 | 3 placeholder testimonial cards live on home | `colleagues.tsx:22-42`; `shots/home-390-scroll-09.png` | CRIT | S | Remove section until ≥1 real quote exists; keep one line in continuity: "References shared on the fit call." |
| F2 | Sample report + walkthrough are promises, not artifacts | `proof-of-method.tsx:11,18` | CRIT | M | Publish 6-page sanitized PDF; replace "COMING SOON" card with it until Loom exists |
| F3 | "15-agent" stale metric ×2 | `lib/seo.ts:144`; `app/resume/page.tsx:166` | CRIT | XS | Update both to "27 agents (18 mature)" |
| F4 | `/api/resume` serves placeholder phone + unlabeled claims | `data/resume.json:6,8`; route `app/api/resume/route.ts:12` | CRIT | XS | Fix phone, relabel/remove claims, or kill endpoint |
| F5 | og:image = square transparent glyph on all money pages; declared 1200×630 | `lib/seo.ts:8,92-94`; `shots/preclick-previews.png` | CRIT | S | Static 1200×630 dark card: name + "AI Agent Production-Readiness Audit · $3,500 · 2 weeks"; per-offer variants |
| F6 | Calendly event titled "Tech", no qualification Qs | `booking-flow.json`; `shots/booking-1-landing-390.png` | CRIT | XS | Rename "Agent systems fit call — 30 min (serbyn.io)"; add 2 required Qs (company/what agents run; prod status/spend) |
| F7 | US slots 04:00–09:30 ET only | ph-probe output (notes.md) | HIGH | XS | Extend availability into 16:00–19:00 EET (9–12 ET) or add "US afternoons available on request" to booking CTA row |
| F8 | Booking completion invisible; UTM cookies captured but never used | `repo-analysis.md §4-5`; `middleware.ts:8-19` | HIGH | S | Append `?utm_source=<cookie>` to Calendly URL; enable Calendly webhook→PostHog `booking_completed` |
| F9 | No email/lead capture on any money page (only /blog, off-nav) | `app/blog/page.tsx:41` | HIGH | S | Sample-report-by-email block on /audit + home §04 (doubles as F2 delivery + capture) |
| F10 | `/blog` and `/writing` are parallel duplicate listing pages, both canonical | curl both (notes.md); `app/blog/page.tsx`, `app/writing/page.tsx` | HIGH | S | 301 `/blog` → `/writing` (keep `/blog/[slug]`), move TerminalSignup to /writing + posts |
| F11 | robots blocks GPTBot/Google-Extended/CCBot | `app/robots.ts:21-32`; `links.md` | HIGH | XS | Delete the three blocks (deliberate choice? then document why) |
| F12 | No Service/FAQPage JSON-LD on offer pages | `html-harvest.md` cross-obs 2 | HIGH | S | Add per §5 below |
| F13 | Ascend "View on GitHub" → profile root; DW "Repository — coming soon" | `lib/facts.ts:98,110`; `links.md` item 2; `shots/home-390-scroll-04.png` | HIGH | XS | Deep-link `github.com/vitamin33/ascend-core`; for DW link the methodology page instead of a dead promise |
| F14 | 404 = stock white Next.js block on a dark site | no `not-found.tsx` (repo-analysis §8); `shots/404page-390-fold.png` | MED | S | Branded not-found.tsx routing to /audit, /writing |
| F15 | Keyboard focus invisible on links (invalid `outline: … var(--ring)`) | `styles/globals.css:31,92-96`; a11y.json (all sampled: outline-style none, no box-shadow) | MED | XS | `outline: 2px solid hsl(var(--ring))` |
| F16 | Fonts double-loaded: next/font self-host + render-blocking Google CSS `@import` | `styles/globals.css:5-6`; `app/layout.tsx:14-26` | MED | XS | Delete the two `@import` lines |
| F17 | PostHog cookie + autocapture with no consent UI; privacy page claims UK GDPR | ph-probe: `ph_*` cookie on .serbyn.io, no banner; `posthog-provider.tsx` | MED | M | Cookieless/memory persistence mode, or add consent gate |
| F18 | Offer pages never link the evidence corpus (0 blog links on /audit) | curl /audit hrefs (notes.md) | MED | XS | "Method, demonstrated" strip on /audit → 2 posts + methodology |
| F19 | Identity fragmentation: "Agentic Systems Architect" vs resume "AI Systems Architect" vs resume.json "MLOps Engineer & LLM Specialist" | `lib/facts.ts:16`; `app/resume/page.tsx:32`; `data/resume.json` | MED | XS | One title everywhere; align LinkedIn headline to it |
| F20 | Blog JS 539 KB vs 315 KB money pages — mermaid on every post; hljs CSS always shipped | `metrics.json`; `content-enhancers.tsx:4,23,34` | MED | M | Pre-render mermaid to SVG at build; scope hljs CSS |
| F21 | Tap targets 16-20 px tall on mobile (View on GitHub, footer links, email) | a11y.json tapTargets | LOW | S | `py-2` + larger hit area on mono text links |
| F22 | `role="menubar"/menu/menuitem"` on plain nav; hidden mobile menu links focusable (aria-hidden only) | `navbar.tsx:73-79,141-155` (repo-analysis §9) | LOW | XS | Plain `<nav><ul>`; add `inert` when closed |
| F23 | "UPDATED JULY 2026" 12 px at 0.7 alpha ≈ 3.8:1 contrast | `hero.tsx:50`; a11y.json | LOW | XS | Drop the alpha |
| F24 | sitemap `lastModified = new Date()` for all static routes — freshness noise every build | `app/sitemap.ts:26-101` | LOW | XS | Hardcode real dates / derive from git |
| F25 | Dead deps: react-calendly, swr; dead component calendly-widget.tsx | repo-analysis §10, §4 | LOW | XS | Remove |
| F26 | `favicon-16x16.png` is an 11-byte "placeholder" text file, live | `public/favicon-16x16.png`; curl 200/11b | LOW | XS | Delete or replace (unreferenced by markup; only direct fetches see it) |
| F27 | Newsletter POST returns `{ok:true}` even in stub mode — silent-loss risk if Resend keys unset in prod | `app/api/subscribe/route.ts:30-34`; live POST test | LOW* | XS | Verify RESEND keys in Vercel env; make stub return `{ok:false}` |
| F28 | gmail.com contact vs UK LTD invoicing (no domain email) | `lib/facts.ts:17`; footer | LOW | S | `vitalii@serbyn.io` forwarding |
| F29 | 2 of 3 sampled posts render duplicate H1 (header + markdown body) | html-harvest §blog; `shots/blog-arc-390-fold.png` | LOW | XS | Strip leading `# title` in markdownToHtml |
| F30 | "SYSTEM STATUS: ONLINE" is static decoration on an evidence-binding brand | `app-shell.tsx:96` | LOW | XS | Make it real (last deploy/uptime ping) or drop |

*F27 severity jumps to HIGH if keys are in fact unset — check takes 1 minute.

Performance findings that did NOT survive (kill log): LCP 268–552 ms, CLS 0.000 everywhere, TTFB ~40 ms, zero console errors on all 12 pages × 2 viewports (`metrics.json`) — performance is a strength, not a finding. All internal links 200; sitemap/RSS/robots present and valid; skip link works; reduced-motion honored globally (`globals.css:141`).

---

## §4 Trust Artifact Ledger

| Trust element | State | Evidence | Verdict for a paying buyer |
|---|---|---|---|
| Quantified results strip w/ source labels (18+/27, 1,178 tests, 101 runs · 0.94, −58%, 100M+, 80–90%) | **real** | `lib/facts.ts:43-77`; SSR-verified (html-harvest); `shots/home-390-scroll-02.png` | **BUILDS** — the labeling discipline ("a system I designed and built", "in an employed role") is the site's best trust asset |
| Methodology page (what counts as run/pass) | **real** | `/methodology` 200; H2s "What counts as a run/pass" | **BUILDS** |
| Blog corpus (7 dated field reports, FAQ schema) | **real** | content/blog/*; BlogPosting+FAQPage JSON-LD | **BUILDS** |
| Continuity & terms section (Easelect LTD + company number, IP transfer on payment, read-only default, NDA/DPA, Kyiv backup power, invoicing currencies) | **real** | `shots/home-390-scroll-09/10.png`; footer company no. 15983917 | **BUILDS** — quietly excellent; answers "what happens after payment" |
| Pricing clarity (all three offers + advisory, on page and in meta) | **real** | offer pages fold; `lib/facts.ts:138-171` | **BUILDS** |
| Sanitized sample audit report | **placeholder** ("Available on request") | `proof-of-method.tsx:11` `VS-TODO:sample-report` | **UNDERMINES** — the single most requested artifact for a $3,500 sight-unseen purchase |
| Method walkthrough video (2–3 min) | **placeholder** ("COMING SOON" badge) | `proof-of-method.tsx:18`; `shots/home-390-scroll-08.png` | **UNDERMINES** |
| Testimonials "What colleagues say" | **placeholder** ×3 ("Reference available on request.") | `colleagues.tsx:22-42`; `shots/home-390-scroll-09.png` | **UNDERMINES** — empty quote-cards read as "nobody would vouch" |
| Ascend GitHub link ("View on GitHub") | **broken-promise** (lands on profile root; real repo `ascend-core` exists but unlinked, 1 of 70 repos) | `lib/facts.ts:98`; links.md item 2 | **UNDERMINES** (mildly — one URL edit from BUILDS) |
| DW repository | **placeholder** ("Repository — coming soon") | `lib/facts.ts:110`; `shots/home-390-scroll-04.png` | **UNDERMINES** |
| Crest link → usecrest.io | **real** (live product landing) | links.md | **BUILDS** |
| GitHub profile (70 public repos, real code) | **real** | links.md (API-verified) | **BUILDS** |
| LinkedIn profile link | **real** (999 to bots = LinkedIn anti-bot, fine for humans) | links.md item 1 | **BUILDS** (unverifiable by assistants — see §5) |
| Booking link (Calendly, live, bookable) | **real but mislabeled** (event = "Tech") | booking-flow.json | **UNDERMINES** at the last step |
| NDA / references-on-request claims | **real-but-deferred** | continuity section | neutral — defensible in the continuity list, corrosive as empty cards |
| "UPDATED JULY 2026" freshness chip | **real** (hand-bumped const) | `lib/facts.ts:27` | **BUILDS** (fragile — goes anti-trust the month it's forgotten) |
| /resume + /api/resume | **placeholder-contaminated** (phone `+380 XX XXX XXXX`, unlabeled $150k/99.9% claims, "(Learning)") | `data/resume.json:6,8`; repo-analysis §14 | **UNDERMINES** |
| og:image / link-preview card | **broken-promise** (square transparent glyph declared 1200×630) | `lib/seo.ts:8,92-94`; `shots/preclick-previews.png` | **UNDERMINES** before the visit even starts |
| Org schema sameAs → `linkedin.com/company/serbyn-solutions` | **broken-promise** (name ≠ Easelect LTD; page existence unverifiable to bots) | `lib/seo.ts:245` | **UNDERMINES** (entity noise) |
| Twitter `@VitaliiSerbyn` in twitter:creator | **unverified** (no link to it anywhere on site) | `lib/seo.ts:107-108` | neutral — remove or verify |

**Score: 10 BUILDS / 9 UNDERMINES.** Every UNDERMINES except the OG card is a placeholder the site itself chose to ship — the fix is subtraction, not construction.

---

## §5 AEO / GEO

### A. Verification path — simulated assistant answers (synthesized ONLY from fetched content)

**Q: "Who is Vitalii Serbyn?"** (retrieves /, /about, Person JSON-LD)
> Vitalii Serbyn is a Kyiv-based "Agentic Systems Architect" who makes AI agents reliable enough for production. He has 12+ years of engineering experience (EPAM, GlobalLogic), built Android apps with 100M+ downloads, and since 2024 has designed AI systems including Ascend (27-agent orchestration daemon), DW (autonomous dev pipeline), and Crest (content engine). He contracts through UK company Easelect LTD and offers fixed-scope audits from $3,500.
*Quality: GOOD — entity data is coherent. Gaps: no third-party source corroborates any of it (LinkedIn 999-blocks bots; no press/podcast/OSS-org mentions); assistant must caveat "according to his own site".*

**Q: "Is serbyn.io legit / reviews?"** (retrieves site + searches for external mentions)
> serbyn.io is the professional site of Vitalii Serbyn… The site states client references are "handled privately, shared on request" and shows no client names, testimonials, or case studies with named companies. I found no independent reviews. The business is Easelect LTD, UK company number 15983917, which can be verified at Companies House.
*Quality: WEAK — the honest answer is "no independent evidence exists". The company number is the only externally verifiable fact. This is the verification path's hole, and it's a content problem (no named references, no external footprint), not a markup problem.*

**Q: "What is the agent production-readiness audit on serbyn.io?"** (retrieves /audit)
> A fixed-scope, ~2-week audit for $3,500 flat that measures whether AI agents are safe for production: trajectory evaluation suite, false-green-rate metering, evidence-binding gap analysis, trust-tier review, prioritized fix list, and a readout call with a written report. Read-only access by default; runs on mainstream Python/TS agent stacks (LangChain/LangGraph, OpenAI/Anthropic/Vercel AI SDKs). If the audit finds nothing serious, "that's a finding you can take to production planning." Audit fee is credited against a retainer started within 60 days.
*Quality: EXCELLENT — /audit is fully extractable without inference. Best page on the site for AEO.*

**Q: "Vitalii Serbyn AI consultant Kyiv"** (retrieves /, /about, schema)
> …based in Kyiv, Ukraine, working remotely with US, UK, and EU teams through UK-registered Easelect LTD, with continuity measures (backup power/connectivity) for engagements…
*Quality: GOOD — location + entity are unambiguous (Person schema has addressLocality Kyiv; Organization has the Manchester registered office). One LLM-visible contradiction: the Organization is "Easelect LTD" but its `sameAs` LinkedIn URL says "serbyn-solutions"; an assistant reconciling entities may treat them as two different companies.*

**Cross-page contradictions an assistant WILL surface:** "15-agent autonomous system" (`/work` meta, /resume) vs "27 agents (18 mature)" (home, /about, case study) — counts double per the audit spec; resume.json's "MLOps Engineer & LLM Specialist" title vs "Agentic Systems Architect"; blog "58 runs, ~93%" vs home "101 runs · 0.94" (mitigated by visible dates, but only if the assistant reads them).

### B. Entity / schema gaps — exact JSON-LD to add

1. **Service schema on each offer page** (example for /audit; adapt price/name for the other two):
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://serbyn.io/audit#service",
  "name": "AI Agent Production-Readiness Audit",
  "serviceType": "AI agent reliability audit",
  "description": "A flat-fee, two-week audit that measures AI agents the way production will — trajectory evals, false-green metering, evidence-binding — and delivers a prioritized fix list.",
  "provider": { "@id": "https://serbyn.io/#person" },
  "areaServed": ["US", "GB", "EU"],
  "offers": {
    "@type": "Offer",
    "price": "3500",
    "priceCurrency": "USD",
    "url": "https://serbyn.io/audit",
    "priceSpecification": { "@type": "PriceSpecification", "price": "3500", "priceCurrency": "USD" }
  }
}
```
2. **FAQPage on the three offer pages** — the FAQs already exist as `<dt>/<dd>`; mirror them (reuse `lib/blog-faq.ts` extractor pattern already proven on blog posts).
3. **Stitch entities with `@id`:** give Person `"@id": "https://serbyn.io/#person"` (`lib/seo.ts:181`), reference it from Organization `founder`, BlogPosting `author` (`app/blog/[slug]/page.tsx:45-66`), and Service `provider` — today each page carries disconnected copies.
4. **Fix Organization** (`lib/seo.ts:218-247`): remove `sameAs: linkedin.com/company/serbyn-solutions` (or create/rename that page to Easelect LTD); remove empty `telephone: ""`; add `"identifier": {"@type":"PropertyValue","propertyID":"UK Companies House","value":"15983917"}` — the one machine-verifiable trust fact the site has.
5. **Add WebSite schema** with `publisher: {"@id": "…#person"}`; **remove or verify** `twitter:creator @VitaliiSerbyn` (`lib/seo.ts:107`).
6. **Unblock** GPTBot / Google-Extended / CCBot in `app/robots.ts:21-32` (F11) — no schema matters to engines that are told to leave.

### C. Extractability failures per page

- **/** — no price-per-offer in one node, but offer cards do render "$3,500 flat · ~2 weeks · fixed scope" adjacent (passes); stat numbers and labels split across sibling `<span>`s (`1,178` / `automated tests`) — extractors that read text nodes independently lose the pairing; `−58%` uses U+2212 (breaks naive numeric parsing). H2s: 0 of 10 question-shaped.
- **/audit, /llm-cost-teardown, /fractional** — best pages: price+terms in one visual unit, deliverables as lists, FAQ present. Failures: FAQ questions are `<dt>`, not headings with anchor IDs (no deep-linkable `#what-access-do-you-need`); H2s generic ("What you get" ×3 pages — an extractor citing a heading can't tell which offer it belongs to); no question-shaped H2s except "Ready to start?".
- **/fractional** — "from $4,000/mo" and "~1 day/week · 3-month minimum" render as separate spans; Advisory `$200/hr` + "10-hour minimum block" adjacent (passes).
- **/about** — 12-paragraph biography, zero H2 structure until "Design principles"; agent counts appear in prose only.
- **/work** — zero H2s at all (html-harvest); case-study titles unreachable as structure.
- **Blog posts** — strong (dates in `<time>`, FAQPage schema, self-contained openers) except duplicate H1s (F29) and no visible author byline in the body.

### D. llms.txt draft (serve at /llms.txt)

```markdown
# Vitalii Serbyn — serbyn.io

> Agentic Systems Architect. I make AI agents reliable enough to run in
> production. Agent reliability engineering + LLM cost engineering for
> US/UK/EU teams, via Easelect LTD (UK, Companies House no. 15983917),
> remote from Kyiv, Ukraine. Contact: serbyn.vitalii@gmail.com

## Offers (canonical pricing)
- [AI Agent Production-Readiness Audit](https://serbyn.io/audit): $3,500 flat,
  ~2 weeks, fixed scope. Trajectory evals, false-green metering,
  evidence-binding gaps, prioritized fix list. Read-only access by default.
- [LLM Cost Teardown](https://serbyn.io/llm-cost-teardown): from $2,000, ~1 week.
  Six cost levers; worked example: −58% ($82→$34/mo) on my own platform.
- [Fractional AI Architect](https://serbyn.io/fractional): from $4,000/mo,
  ~1 day/week, 3-month minimum. Advisory: $200/hr, 10-hour minimum block.
- Audit fee credited against a retainer started within 60 days.

## Canonical facts
- Ascend: multi-agent orchestration daemon I designed and built — 27 agents
  (18 mature), 1,178 automated tests, trust-tiered L0–L4 execution.
- DW: autonomous spec-driven dev pipeline — 101 logged runs, 0.94 pass rate
  (methodology: https://serbyn.io/methodology).
- Employed-role history: consumer app with 100M+ downloads (Google Play
  Editor's Choice); 80–90% RPC cost reduction on a Web3 platform.
- Every quantified claim carries its source label; no client metrics are borrowed.

## Key writing
- [Six False-Greens in a Self-Auditing Agent Pipeline](https://serbyn.io/blog/six-false-greens-in-a-self-auditing-agent-pipeline)
- [The Calibration Ledger: 58 Runs, 93% Pass, n Is Small](https://serbyn.io/blog/the-calibration-ledger-58-runs-93-pass-n-is-small)
- [The Arc Since the Six Were Caught](https://serbyn.io/blog/the-arc-since-the-six-were-caught)
- Full index: https://serbyn.io/writing · RSS: https://serbyn.io/feed.xml

## Verification
- GitHub: https://github.com/vitamin33 (Ascend core: /vitamin33/ascend-core)
- LinkedIn: https://www.linkedin.com/in/vitalii-serbyn-b517a083
- UK Companies House: 15983917 (Easelect LTD)
```
*(Adoption of llms.txt is contested — treat as cheap upside, not a channel.)*

### E. Five question-shaped titles to write next (mapped to existing evidence)

1. **"Why do my AI agents pass every test and still fail in production?"** — direct remap of the six-false-greens corpus; the highest-intent buyer query in this niche.
2. **"How much does an AI agent audit cost?"** — nobody with his evidence publishes pricing content; he can anchor the market ($3,500 flat) and own the SERP/answer box. Maps to /audit + UPSELL terms.
3. **"How do I measure whether an AI agent actually did the work it claims?"** — calibration-ledger + evidence-binding posts, reframed from the buyer's side.
4. **"How do I cut my LLM bill without making the product worse?"** — six levers + the honest −58% worked example.
5. **"What should be in an AI agent production-readiness checklist?"** — extracts the audit's six deliverables into the query LLMs get asked constantly; every answer cites the audit page.

**Ranking for the verification path:** F11 robots unblock → entity stitching + Organization fix (§B.3-4) → Service+FAQPage schema → named external proof (the "legit" query is unanswerable until one named reference or external mention exists) → llms.txt → question titles.

---

## §6 Unknown-unknowns — 5 survivors (of 15; kill log in notes.md)

| # | Hypothesis | Impact × confidence | Cheapest test |
|---|---|---|---|
| 1 | **Calendar contradicts the promise.** "US/UK/EU teams" but a New-York viewer gets 04:00–09:30 AM slots; US-Pacific gets zero workable times. Warm US leads hit this at peak intent. | H × confirmed (tested live, `notes.md`) | Open Calendly with viewer TZ America/Los_Angeles; count slots after 08:00 local (already done for ET: 4 of 12 usable) |
| 2 | **Identity fragmentation.** Three concurrent self-titles (Agentic Systems Architect / AI Systems Architect / "MLOps Engineer & LLM Specialist") + two company identities (Easelect LTD / "serbyn-solutions") — humans shrug, entity resolvers and skeptics don't. | H × confirmed | `grep -r "Architect\|MLOps Engineer" app/ lib/ data/` (done); check LinkedIn headline matches `lib/facts.ts:16` |
| 3 | **The money pages are sealed off from the proof corpus.** /audit contains zero links to the 7 field reports or /methodology — the buyer deciding on the $3,500 page never sees the evidence that would close him; assistants summarizing /audit can't cite it either. | M-H × confirmed (0 blog hrefs on /audit) | Already tested: `curl /audit \| grep 'href="/blog'` → empty |
| 4 | **Analytics without consent on a GDPR-flagged site.** PostHog autocapture + `ph_*` cookie, no consent UI, while /legal/privacy claims UK GDPR compliance — a UK/EU buyer's DPO (or a skeptic reading the privacy page next to devtools) catches it; PECR exposure for a UK LTD. | M-H × confirmed (cookie observed, banner absent) | Done: load page, inspect cookies + body text for consent UI |
| 5 | **The blog corpus reads as "the vendor's own agents lied six times."** Every post is a failure report about his own pipeline; the discipline IS the product, but /writing never says so — a skimming founder sees six confessions, not a methodology. | M × plausible (titles listed on /writing with no reframe line; unkillable from harvest data alone) | 5-user title-only test: show /writing list, ask "would you hire this person to fix your agents?"; or A/B one framing sentence atop /writing |

---

## §7 Funnel seam map

```
DM / LinkedIn post
   │  SEAM 1: link preview — black transparent glyph, no name/offer/price;
   │  price truncated out of every snippet (F5). Lost: click-through intent,
   │  especially dark-mode DMs (primary path!). Exists: nothing. 
   ▼
Landing (/ or /audit)
   │  SEAM 2: fold → scroll. Strong: H1, price, trust chips, LCP<600ms.
   │  Lost: almost nothing. Best seam on the funnel.
   ▼
Scroll → proof
   │  SEAM 3: "See the method" → three placeholder cards (F1/F2).
   │  Lost: the skeptical majority. Exists to catch: continuity section
   │  (good but below the damage).
   ▼
Offer page
   │  SEAM 4: complete and extractable, BUT no links to evidence corpus
   │  (§6.3) and no capture for "interested, not today" (F9) —
   │  book-or-vanish. Lost: ~everyone not booking today. Exists: nothing.
   ▼
Booking (Calendly)
   │  SEAM 5 ⟵ WEAKEST: cookie wall → event titled "Tech" → EU-hours
   │  slots for US buyers → zero qualification → no UTM/context carried
   │  (F6/F7/F8). Lost: highest-intent buyers at the last click, invisibly.
   ▼
Confirmation → show-up
   │  SEAM 6: Calendly default confirmation; no sample report attached,
   │  no agenda, no "bring your trace logs" pre-frame → free-call no-show
   │  baseline (30-50%) applies in full. Exists: nothing.
   ▼
Measurement (cross-cutting): PostHog events stop at cta_click; booking
completion, newsletter submits, and 6 hardcoded Calendly links are
invisible; UTM cookies set but never read (F8). Vitalii cannot see any
of seams 5-6 in data.
```

**Single weakest seam: #5, the site→Calendly handoff.** On the 2×-weighted warm-DM path, the buyer arrives pre-sold and the site's job is merely not to fumble — yet the last click delivers a generic "Tech" event, pre-dawn slots for US buyers, and no context transfer, and none of the loss is measured. (Largest total-volume loss is seam 4's book-or-vanish, but those are colder, path-b visitors.)

---

## §8 Top-10 changes ranked by booked-calls ÷ effort

1. **Rename + requalify the Calendly event** (F6, P1-path). Event name: "Agent systems fit call — 30 min · serbyn.io". Two required questions: "What do your agents do, roughly?" / "Are they in production today? What breaks or costs too much?". Extend or annotate US-friendly hours (F7). *Effort: 15 min, no code.*
2. **Kill the placeholder proof cards** (F1, P1-path). `components/site/colleagues.tsx`: delete section; add one line to the continuity grid: "References — named recommendations shared on the fit call, with links to originals." `proof-of-method.tsx`: drop the "COMING SOON" card. *Effort: 30 min.*
3. **Publish the sanitized sample report** (F2, P1-path). One real (anonymized DW/Ascend self-audit is fine — it's the exact deliverable format) 6-page PDF at `/sample-audit-report.pdf`, linked from home §04 + /audit "What you get". Gate optionally by email later (pairs with #7). *Effort: half a day of sanitizing an existing report.*
4. **Fix the two "15-agent" strings + resume.json** (F3/F4, P3 kill-switch). `lib/seo.ts:144`, `app/resume/page.tsx:166` → "27 agents (18 mature)"; `data/resume.json` phone → real or removed, unlabeled claims relabeled with the facts.ts convention or deleted. *Effort: 20 min.*
5. **Ship real OG cards for money pages** (F5, both paths). 1200×630 dark PNG per offer: name, role, offer, "$3,500 · 2 weeks". Set in `lib/seo.ts` per page (the blog already proves the `opengraph-image.tsx` pattern — reuse it for static routes). Move the price into the first 150 chars of meta descriptions for / and /audit. *Effort: 2-3 h.*
6. **Deep-link Ascend to `vitamin33/ascend-core`; replace DW's "coming soon" with a link to /methodology** (F13). `lib/facts.ts:98,110`. *Effort: 5 min.*
7. **UTM passthrough + booking completion event** (F8). Append stored `utm_*` cookie values to the Calendly URL in `components/site/cta.tsx:32`; add Calendly webhook → PostHog `booking_completed` (or at minimum a `?redirect` thank-you page that fires the event). Route the 6 hardcoded Calendly links through `BookingButton`. *Effort: 2-4 h; unlocks all future measurement.*
8. **Unblock AI crawlers + add Service/FAQPage schema + llms.txt** (F11/F12, §5 drafts ready). `app/robots.ts:21-32` delete three blocks; JSON-LD from §5.B; llms.txt from §5.D. *Effort: 2 h.*
9. **Merge /blog into /writing and put capture where people are** (F9/F10, P5/P2 path). 301 `/blog` → `/writing` (keep post slugs); move `TerminalSignup` to /writing + post footers; add "Get the sample report by email" block on /audit. *Effort: 3-4 h.*
10. **Branded 404 + visible focus + font dedupe** (F14/F15/F16 bundle — polish that protects the "top-1% frontend" claim). `app/not-found.tsx` with links to /audit and /writing; `hsl(var(--ring))` fix; delete the two `@import` lines. *Effort: 1-2 h.*

*(P1-path items 1-4 outrank higher-effort items despite similar scores, per the 2× weighting.)*

---

## §9 If Vitalii does only THREE things this week

**First**, spend the 15 no-code minutes on Calendly: rename "Tech" to "Agent systems fit call — 30 min", add the two qualification questions, and open afternoon EET slots so US buyers see human hours — the highest-intent click on the whole funnel currently lands on the least-considered artifact. **Second**, delete the three "Reference available on request." cards and the "COMING SOON" video card, and put the sanitized sample report PDF live in their place — one real inspectable artifact beats three promises, and it's the exact thing a warm DM lead asks for before paying $3,500. **Third**, purge the self-contradictions a skeptic can find in five minutes: the two "15-agent" strings, the placeholder phone and unlabeled claims in resume.json, and the Ascend link that lands on a profile instead of the repo — this site sells evidence-binding, and right now its own claims don't all cite their proof.

---

## §10 Baseline

Written to `.fable_audit/baseline.json` (this run). **DIFF-MODE rules for future runs:** CWV changes within ±10% = noise, not regression. Must-report: any trust-ledger state change (real/placeholder/broken-promise), any new non-200 link, any new console/hydration error, any persona verdict flip, JS weight change >15%, robots/schema regressions, booking-flow field changes.
