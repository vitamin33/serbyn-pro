# Fix State — serbyn.io audit implementation

Branch: `fix/audit-implementation` (never push, never touch main).
Source of truth: `.fable_audit/AUDIT.md` + `.fable_audit/baseline.json`.
Protocol: re-read this file → topmost unchecked task → implement → verify → mark done with evidence → commit `fix(<id>): <summary>`. One task per commit.

**Build/verify cadence decision (D-build):** Playwright suite runs `next build && next start` (~4min). Building per-commit is prohibitive. Cadence: `tsc --noEmit` (type-check) after each code commit; full `npm run lint && npm run build && npm run test:e2e` at each WAVE boundary and once at completion (C2). Logged, not re-asked.

## WAVE CHECKLIST

### WAVE 1 — TRUTH FIXES ✅ (boundary: 37/37 green)
- [x] 1.1 F3 — "15-agent" → "27 agents (18 mature)" — resume/page.tsx:166, seo.ts:144; grep now CLEAN
- [x] 1.2 F4 — data/resume.json rewritten to canonical-only: phone removed, achievements_summary (fabricated) removed, fake AdTech + 404 project URLs replaced with real Ascend/DW from facts.ts, title→Agentic Systems Architect. grep CLEAN.
- [x] 1.3 F19 — title unified to "Agentic Systems Architect": resume h2:32 + work:155, blog+work OG images, resume meta seo.ts:176, footer discipline line. grep for title-form "AI Systems Architect" now empty.
- [x] 1.4 F13 — Ascend repo → github.com/vitamin33/ascend-core (verified 200); DW placeholder removed, card keeps /methodology link; systems-built.tsx else-branch dropped.
- [x] 1.5 F26 — deleted public/favicon-16x16.png (11-byte "placeholder" text, unreferenced); also fixed site.webmanifest 4th stale title + light theme_color→dark #0A0C10.
- [x] 1.6 F30 — removed "SYSTEM STATUS: ONLINE" static block from app-shell.tsx sidebar (green dot + label). CONTACT const string noted for Wave 3.1 routing.
- [x] T9 (v1) — tests/refactor/truth.spec.ts source-grep guard: 15-agent/15 agent/XX XXX/stale resume title/total_business_value all absent. EXTEND in Wave 2 with coming-soon + available-on-request once colleagues/proof-of-method cleaned.

### WAVE 2 — TRUST LAYER ✅ (boundary: 44/44 green)
- [x] 2.1 F1/D3 — deleted colleagues.tsx (3 empty "Reference available on request" cards) + home usage; upgraded continuity References row to D3 line ("Named recommendations… shared on the fit call with links to the originals").
- [x] 2.2 F2 — proof-of-method.tsx now gated: sample-report card renders only if public/sample-audit-report.pdf exists (build-time fs check); walkthrough only if PROOF_LOOM_URL set (facts.ts, undefined). Section omitted entirely when neither exists. No placeholder copy. T9 extended (coming soon / available on request / reference available, scoped to components/).
- [x] 2.3 F5 — added lib/og-card.tsx + 5 opengraph-image.tsx routes (root default, home, 3 offers), all 1200×630 dark cards w/ price line. createMetadata default image→null (no more square logo.png og:image anywhere). Front-loaded price in / and /audit meta descriptions. Deleted stale public/og.png.svg.
- [x] T10 — tests/refactor/og.spec.ts: 4 money pages, og:image 200 + image/* + 1200×630 + opaque dark corner. PASS.

### WAVE 3 — FUNNEL PLUMBING ✅ (boundary: 47/47 green)
- [x] 3.1 F8 — lib/booking.ts appendUtmParams; BookingButton appends utm_* cookies via useEffect. Routed all 5 hardcoded Calendly LINKS through BookingButton (about, blog/[slug], work/[slug], case-study-footer, app-shell ×2 sidebar+mobile) — now UTM-tagged AND fire cta_click. Remaining calendly.com refs: facts.ts:18 canonical, engagement-tracker detector, calendly-widget (dead, removed 5.8).
- [x] 3.2 F8b — no embed → built app/api/calendly-webhook/route.ts (invitee.created → server-side PostHog booking_completed, HMAC-verified, fails closed w/o key). [VS-TODO:calendly-webhook] to configure.
- [x] 3.3 F9/F10 — 301(308) /blog→/writing in next.config (kept /blog/[slug]); removed /blog from sitemap; TerminalSignup now on /writing + every blog-post footer; gated SampleReportCTA (email→subscribe→reveal download) on /audit via lib/assets.sampleAuditReportExists(). T11 added.
- [x] 3.4 F27 — subscribe stub now fails closed: {ok:false,stub:true} 503 + console.warn (was silent {ok:true}). app/api/subscribe/route.ts:32-38.
- [x] 3.5 F18 — components/site/method-demonstrated.tsx on /audit: links six-false-greens + calibration-ledger posts + /methodology. T12 added.
- [x] T11 — tests/refactor/funnel.spec.ts: /blog→308→/writing, /blog/<slug> 200. (T12 added in 3.5)

### WAVE 4 — AEO ✅ (boundary: 51/51 green)
- [x] 4.1 F11/D2 — robots.ts: removed GPTBot/Google-Extended/CCBot disallow blocks; AI crawlers now allowed under the * rule.
- [x] 4.2 F12 — generateServiceSchema + generateFaqSchema in lib/seo.ts (price from canonical OFFERS); emitted as 2 ld+json blocks in OfferPage → all 3 offer pages. Built FAQPage from structured content.faq (cleaner than parsing dt/dd). T13 added.
- [x] 4.3 Entity stitching — Person @id=serbyn.io/#person; Org @id=#organization; Person.worksFor→@id Org; Org.founder→@id Person; BlogPosting author/publisher→@id refs; Service.provider→@id Person (from 4.2). Org: dropped serbyn-solutions sameAs + empty telephone, added Companies House identifier 15983917. Added WebSite schema (publisher→Person) in layout. Removed unverified twitter:creator/site.
- [x] 4.4 — app/llms.txt/route.ts serves §5.D draft as text/markdown, generated from lib/facts (offers/prices/identity stay canonical). Kept gmail (VS-TODO:domain-email). T14 added.
- [x] 4.5 F24 — sitemap.ts: replaced new Date() build-time timestamp with stable siteUpdated=2026-07-07 for static routes+case studies; posts keep post.date. No more per-build churn.
- [x] 4.6 Extractability — offer FAQ dt→h3 with stable anchor ids (#faq-slug, scroll-mt); unique deliverables H2s per offer (audit/teardown/retainer); stat.tsx value+caption wrapped in one <p> block for contiguous extraction; U+2212→ASCII hyphen in facts.ts −58% (×2).
- [x] T13 — schema.spec.ts: each offer page = exactly 1 Service (price matches 3500/2000/4000) + 1 FAQPage. (T14 in 4.4)

### WAVE 5 — FRONTEND POLISH ✅ (final suite: 54/54 green; F20 deferred)
- [x] 5.1 F14 — app/not-found.tsx: branded dark 404 inside AppShell, cards linking /audit + /writing + home. (was stock white Next.js block)
- [x] 5.2 F15 — globals.css:93 outline now hsl(var(--ring)) (was invalid raw triplet → ring never rendered).
- [x] 5.3 F16 — deleted 2 render-blocking Google Fonts @import lines from globals.css (next/font already self-hosts).
- [x] 5.4 F21 — min-h-[44px] hit areas on footer legal links, footer social (GITHUB/LINKEDIN/RSS), footer email, and systems-built repo/methodology mono links.
- [x] 5.5 F22 — navbar.tsx: removed role=menubar/menu/menuitem/none (plain nav>ul>li>Link); added inert to collapsed mobile menu so hidden links leave the tab order.
- [x] 5.6 F23 — hero "Updated" chip: dropped /70 alpha → full muted-foreground (~6.3:1, meets AA).
- [x] 5.7 F29 — markdownToHtml strips a leading "# …" body H1 that duplicated the page title (blog/[slug]/page.tsx:243).
- [x] 5.8 F25 — removed unused deps react-calendly + swr (0 live imports) and dead components/calendly-widget.tsx; lockfile synced.
- [~] 5.9 F20 — DEFERRED (time-permitting flag). Mermaid→SVG build pre-render needs a headless-browser build step (high risk to blog pipeline) for a blog-only weight issue; money pages already exclude mermaid+hljs (loaded only by content-enhancers on posts). hljs theme CSS is already blog-route-scoped. Deferred as out-of-safe-scope for this loop.
- [x] 5.10 F17 — PostHog cookieless: persistence:memory + disable_persistence in posthog-provider.tsx init (no cookie, no consent UI needed).
- [x] 5.11 D1 — /resume: noIndex in pageMetadata.resume (seo.ts); removed from sitemap; "(Learning)" dropped from skills heading; Education section removed; /about "Download Resume" primary button demoted to a small "View résumé" text link below the primary Book a Call.
- [x] T15 — frontend.spec.ts: 404 dark + /audit link; keyboard-focused nav link outline non-none; no fonts.googleapis/gstatic requests.

## Decisions log
- D-build: verify cadence = type-check per commit, full build+suite per wave (see above).
- D1/D2/D3: pre-approved defaults from loop prompt; applied in 5.11 / 4.1 / 2.1.

## VS-TODO (human input required — never a visible placeholder)
(populated as encountered)

- [VS-TODO:resume-phone] data/resume.json had placeholder "+380 XX XXX XXXX". Removed. If Vitalii wants a phone in the machine-readable resume, add `"phone"` back to basics with a real number. Plugs in: data/resume.json basics. Auto: served via /api/resume.
- Decision (F4): data/resume.json was stale fake-positioning-era data (fabricated $150k/99.9%/1M+, "AdTech Startup" employment contradicting real EPAM/GlobalLogic history, two 404 GitHub project URLs). Per ZERO FABRICATION, rewrote the whole file to mirror the real /resume page narrative + lib/facts.ts canonical numbers with source labels. Only consumer is /api/resume (raw JSON); the /resume page uses hardcoded JSX, unaffected.

- [VS-TODO:linkedin-headline] Site title now uniformly "Agentic Systems Architect". Align the LinkedIn headline (linkedin.com/in/vitalii-serbyn-b517a083) manually to match. No code hook.
- [VS-TODO-none / self-note] public/og.png.svg is an orphaned stale OG source (fabricated 10M+/45%/99.9%). Delete during Wave 2.3 (F5) OG regeneration.

- [VS-TODO:sample-report-pdf] Drop a sanitized 6-page audit report at public/sample-audit-report.pdf. Auto: the "Sanitized sample audit report" download card appears on home §04 (proof-of-method.tsx) AND the /audit email-capture block (Wave 3.3) activates, on next build. No code change needed.
- [VS-TODO:loom] Set PROOF_LOOM_URL in lib/facts.ts to a real Loom/video URL. Auto: the "Method walkthrough" card appears on home §04 on next build.

- [VS-TODO:calendly-webhook] app/api/calendly-webhook/route.ts is built and inert. Activate: (1) Calendly (Pro+) → create webhook subscription for `invitee.created` → https://serbyn.io/api/calendly-webhook; (2) set CALENDLY_WEBHOOK_SIGNING_KEY and NEXT_PUBLIC_POSTHOG_KEY in Vercel env. Auto: fires server-side PostHog `booking_completed` per booking, closing the funnel past cta_click. Fails closed (401) until signing key set.

- [VS-TODO:resend-keys] Set RESEND_API_KEY + RESEND_AUDIENCE_ID in Vercel env. Until then /api/subscribe fails closed (503 {ok:false,stub:true}) and the signup forms show their error state — honest, no silent drops. Auto: once set, real captures flow to Resend Audiences.

- Decision (4.2): offer FAQ is already structured (content.faq {q,a}[]) so FAQPage JSON-LD is built directly from it rather than parsing rendered dt/dd via lib/blog-faq — same result, no HTML round-trip. blog-faq extractor stays for markdown posts.

- [VS-TODO:twitter-handle] Removed unverified twitter:creator/site '@VitaliiSerbyn' (not linked anywhere). If a real handle exists, re-add creator/site in lib/seo.ts createMetadata twitter block.

- [VS-TODO:domain-email] llms.txt + site use serbyn.vitalii@gmail.com (current truth). If a domain email (vitalii@serbyn.io) is set up, update CONTACT.email in lib/facts.ts — propagates everywhere including llms.txt.

- Decision (F17): chose cookieless (persistence:'memory' + disable_persistence) over a consent gate — zero UI, GDPR/PECR-clean, no persistent identifiers. Trade-off: loses cross-session person stitching. Right default for a UK/EU-facing site that claims data-rights on /legal/privacy. Only active once NEXT_PUBLIC_POSTHOG_KEY is set.

---

# FINAL REPORT

**Branch:** `fix/audit-implementation` (unpushed) · **Base:** `main` @ 5f0ac20
**Diff:** 58 files, +1374 / −521 · **36 commits** (one task per commit)
**Verification:** `npm run lint` clean · `npm run build` green · full Playwright suite **54/54** (T1–T15) in one run.
**No code on `main` touched. No push.**

## C4 — Per-finding status (F1–F30)

| # | Finding | Status | Where |
|---|---|---|---|
| F1 | Placeholder testimonial cards | ✅ fixed | deleted colleagues.tsx; continuity References line (2.1) |
| F2 | Sample report / walkthrough = promises | ✅ fixed (gated) | proof-of-method gates on real asset (2.2) · PDF+Loom = VS-TODO |
| F3 | "15-agent" contradiction | ✅ fixed | seo.ts:144, resume:166 → 27 (18 mature) (1.1) |
| F4 | resume.json placeholders/fabrications | ✅ fixed | rewritten canonical-only (1.2) |
| F5 | og:image square transparent glyph | ✅ fixed | 5 opengraph-image routes, 1200×630 (2.3) |
| F6 | Calendly event "Tech", no qualification | ⏳ VS-TODO | Calendly dashboard (human) |
| F7 | US slots 04:00–09:30 only | ⏳ VS-TODO | Calendly availability (human) |
| F8 | Booking completion invisible / no UTM | ✅ fixed | UTM passthrough (3.1) + webhook receiver (3.2) · webhook config = VS-TODO |
| F9 | No capture on money pages | ✅ fixed | signup on /writing+posts, gated /audit block (3.3) |
| F10 | /blog vs /writing duplicate | ✅ fixed | 308 redirect, sitemap prune (3.3) |
| F11 | robots blocks AI crawlers | ✅ fixed | robots.ts (4.1) |
| F12 | No Service/FAQPage schema | ✅ fixed | generate*Schema in OfferPage (4.2) |
| F13 | Ascend→profile / DW "coming soon" | ✅ fixed | facts.ts (1.4) |
| F14 | Stock white 404 | ✅ fixed | app/not-found.tsx (5.1) |
| F15 | Invisible keyboard focus | ✅ fixed | globals.css hsl(var(--ring)) (5.2) |
| F16 | Fonts double-loaded | ✅ fixed | dropped @imports (5.3) |
| F17 | PostHog cookie, no consent UI | ✅ fixed | cookieless persistence:memory (5.10) |
| F18 | Offer pages don't link corpus | ✅ fixed | MethodDemonstrated on /audit (3.5) |
| F19 | Identity fragmentation (titles) | ✅ fixed | single title + manifest (1.3, 1.5) · LinkedIn = VS-TODO |
| F20 | Blog JS weight (mermaid) | ⚠️ deferred | headless-browser build step, high risk, blog-only weight (5.9) |
| F21 | Tap targets 16–20px | ✅ fixed | min-h-[44px] on footer/repo links (5.4) |
| F22 | Menu roles / hidden focusable | ✅ fixed | plain nav + inert (5.5) |
| F23 | "UPDATED" chip contrast | ✅ fixed | dropped /70 alpha (5.6) |
| F24 | sitemap lastModified = new Date() | ✅ fixed | stable siteUpdated (4.5) |
| F25 | Dead deps react-calendly/swr | ✅ fixed | removed + component (5.8) |
| F26 | favicon-16 placeholder text file | ✅ fixed | deleted + manifest fix (1.5) |
| F27 | Subscribe silent {ok:true} | ✅ fixed | fails closed 503 (3.4) · resend keys = VS-TODO |
| F28 | gmail vs domain email | ⏳ VS-TODO | domain-email (human); gmail = current truth |
| F29 | Duplicate blog H1 | ✅ fixed | markdownToHtml strips leading H1 (5.7) |
| F30 | "SYSTEM STATUS: ONLINE" theater | ✅ fixed | removed (1.6) |

**AEO (§5 findings, non-F-numbered):** entity stitching via @id + Companies House identifier + WebSite schema (4.3) ✅ · /llms.txt (4.4) ✅ · extractability: FAQ h3 anchors, unique offer H2s, joined stat nodes, ASCII minus (4.6) ✅.

**Tally: 25 fixed · 4 VS-TODO (human/config only: F6, F7, F28 + partial F2/F8/F19/F27) · 1 deferred (F20).** Every finding that could be closed in code is closed.

## C3 — VS-TODO ledger (what Vitalii supplies → where → what auto-happens)

| id | Supply | Plugs in | Auto-effect on next build/deploy |
|---|---|---|---|
| sample-report-pdf | Sanitized 6-page PDF at `public/sample-audit-report.pdf` | lib/assets.ts fs check | Home §04 download card + /audit email-capture block appear |
| loom | Real URL → `PROOF_LOOM_URL` in lib/facts.ts | proof-of-method.tsx | Walkthrough card appears |
| calendly-event-config (F6/F7) | Rename Calendly event "Tech"→"Agent systems fit call — 30 min"; add 2 qualification Qs; open US-afternoon (EET) slots | Calendly dashboard | Booking handoff stops leaking (no code) |
| calendly-webhook (F8) | Calendly webhook → /api/calendly-webhook + `CALENDLY_WEBHOOK_SIGNING_KEY` + `NEXT_PUBLIC_POSTHOG_KEY` (Vercel) | app/api/calendly-webhook/route.ts | Server-side `booking_completed` per booking |
| resend-keys (F27) | `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` (Vercel) | app/api/subscribe/route.ts | Signups flow to Resend (else 503 fail-closed) |
| linkedin-headline (F19) | Set LinkedIn headline = "Agentic Systems Architect" | LinkedIn (human) | Entity coherence for verifiers |
| domain-email (F28) | `vitalii@serbyn.io` → `CONTACT.email` in lib/facts.ts | facts.ts | Propagates sitewide incl. llms.txt |
| twitter-handle | Verified handle → twitter creator/site in lib/seo.ts | seo.ts createMetadata | twitter:creator restored |
| resume-phone | Optional real phone → resume.json basics | data/resume.json | Served via /api/resume |
| dw-github | DW public repo URL → SYSTEMS.dw.repo | lib/facts.ts | DW card renders GitHub link |
| company-spelling | Confirm "Easelect LTD" spelling (pre-existing note) | lib/facts.ts:21 | — |

## C4 — Re-run the audit in DIFF mode

The baseline is on disk at `.fable_audit/baseline.json` (untracked). Re-run the **original audit prompt** in this repo — Step 0 detects the existing baseline and runs the whole audit in **DIFF MODE**, reporting regressions/improvements vs baseline first. DIFF rules: CWV ±10% = noise; any trust-ledger state change, new broken link, new console error, persona verdict flip, JS weight >15%, or robots/schema regression = must-report.

Fast local regression check (no full audit): `npm run test:e2e` (T1–T15, ~20s after build). Expect **54/54**.

## Completion checklist
- [x] C1 all waves done or blocked-by-VS-TODO (F20 deferred w/ reason)
- [x] C2 lint + build green; full suite T1–T15 green in one run (54/54)
- [x] C3 VS-TODO ledger complete
- [x] C4 per-finding table + diff stats + DIFF re-run command
- [x] no `main` changes, branch unpushed
