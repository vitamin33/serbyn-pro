# Fix State — serbyn.io audit implementation

Branch: `fix/audit-implementation` (never push, never touch main).
Source of truth: `.fable_audit/AUDIT.md` + `.fable_audit/baseline.json`.
Protocol: re-read this file → topmost unchecked task → implement → verify → mark done with evidence → commit `fix(<id>): <summary>`. One task per commit.

**Build/verify cadence decision (D-build):** Playwright suite runs `next build && next start` (~4min). Building per-commit is prohibitive. Cadence: `tsc --noEmit` (type-check) after each code commit; full `npm run lint && npm run build && npm run test:e2e` at each WAVE boundary and once at completion (C2). Logged, not re-asked.

## WAVE CHECKLIST

### WAVE 1 — TRUTH FIXES
- [x] 1.1 F3 — "15-agent" → "27 agents (18 mature)" — resume/page.tsx:166, seo.ts:144; grep now CLEAN
- [x] 1.2 F4 — data/resume.json rewritten to canonical-only: phone removed, achievements_summary (fabricated) removed, fake AdTech + 404 project URLs replaced with real Ascend/DW from facts.ts, title→Agentic Systems Architect. grep CLEAN.
- [x] 1.3 F19 — title unified to "Agentic Systems Architect": resume h2:32 + work:155, blog+work OG images, resume meta seo.ts:176, footer discipline line. grep for title-form "AI Systems Architect" now empty.
- [x] 1.4 F13 — Ascend repo → github.com/vitamin33/ascend-core (verified 200); DW placeholder removed, card keeps /methodology link; systems-built.tsx else-branch dropped.
- [x] 1.5 F26 — deleted public/favicon-16x16.png (11-byte "placeholder" text, unreferenced); also fixed site.webmanifest 4th stale title + light theme_color→dark #0A0C10.
- [x] 1.6 F30 — removed "SYSTEM STATUS: ONLINE" static block from app-shell.tsx sidebar (green dot + label). CONTACT const string noted for Wave 3.1 routing.
- [x] T9 (v1) — tests/refactor/truth.spec.ts source-grep guard: 15-agent/15 agent/XX XXX/stale resume title/total_business_value all absent. EXTEND in Wave 2 with coming-soon + available-on-request once colleagues/proof-of-method cleaned.

### WAVE 2 — TRUST LAYER
- [ ] 2.1 F1/D3 — delete colleagues.tsx + usage; add continuity references line
- [ ] 2.2 F2 — gated sample-report block (renders only if public/sample-audit-report.pdf exists)
- [ ] 2.3 F5 — OG cards per money page (1200×630 dark); price in first 150 chars of / and /audit meta
- [ ] T10 — Playwright: og:image of 4 money pages = 200, image, 1200×630, non-transparent

### WAVE 3 — FUNNEL PLUMBING
- [ ] 3.1 F8 — BookingButton appends utm_* cookies; route all 6 hardcoded Calendly links through it
- [ ] 3.2 F8b — booking_completed via Calendly postMessage (embed) or [VS-TODO:calendly-webhook]
- [ ] 3.3 F9/F10 — 301 /blog→/writing (keep /blog/[slug]); TerminalSignup→/writing+post footers; gated sample-report-by-email on /audit
- [ ] 3.4 F27 — subscribe stub → {ok:false, stub:true} + log; [VS-TODO:resend-keys]
- [ ] 3.5 F18 — /audit "Method, demonstrated" strip → 2 posts + /methodology
- [ ] T11 — /blog 301→/writing; /blog/<slug> still 200. T12 — /audit HTML ≥2 links to /blog/ posts

### WAVE 4 — AEO
- [ ] 4.1 F11/D2 — robots.ts unblock GPTBot/Google-Extended/CCBot
- [ ] 4.2 F12 — Service + FAQPage JSON-LD on 3 offer pages
- [ ] 4.3 Entity stitching — Person @id; Org founder/author/provider ref it; Org fixes; WebSite schema; twitter:creator
- [ ] 4.4 F—  llms.txt served at /llms.txt (§5.D draft)
- [ ] 4.5 F24 — sitemap lastModified → real dates (no new Date())
- [ ] 4.6 Extractability — FAQ dt→h3 anchors; unique offer H2s; metric number+label one node; U+2212→ASCII
- [ ] T13 — each offer page: exactly 1 Service + 1 FAQPage JSON-LD, parseable, price matches. T14 — /llms.txt 200 text/markdown

### WAVE 5 — FRONTEND POLISH
- [ ] 5.1 F14 — branded app/not-found.tsx (dark, links /audit + /writing)
- [ ] 5.2 F15 — globals.css focus-visible: hsl(var(--ring))
- [ ] 5.3 F16 — delete 2 Google Fonts @import lines
- [ ] 5.4 F21 — tap targets min 44px on mono text links
- [ ] 5.5 F22 — navbar drop menu roles; inert closed mobile menu
- [ ] 5.6 F23 — hero UPDATED chip remove alpha (≥4.5:1)
- [ ] 5.7 F29 — markdownToHtml strip duplicate leading H1
- [ ] 5.8 F25 — remove react-calendly, swr, calendly-widget.tsx (verify unused)
- [ ] 5.9 F20 — (time-permitting) pre-render mermaid→SVG; scope hljs CSS
- [ ] 5.10 F17 — PostHog cookieless (persistence:'memory')
- [ ] 5.11 D1 — /resume cleanup (noindex, drop sitemap, remove (Learning) + Education, demote Download Resume)
- [ ] T15 — Playwright: 404 dark + /audit link; focus outline non-none; no fonts.googleapis.com request

## Decisions log
- D-build: verify cadence = type-check per commit, full build+suite per wave (see above).
- D1/D2/D3: pre-approved defaults from loop prompt; applied in 5.11 / 4.1 / 2.1.

## VS-TODO (human input required — never a visible placeholder)
(populated as encountered)

- [VS-TODO:resume-phone] data/resume.json had placeholder "+380 XX XXX XXXX". Removed. If Vitalii wants a phone in the machine-readable resume, add `"phone"` back to basics with a real number. Plugs in: data/resume.json basics. Auto: served via /api/resume.
- Decision (F4): data/resume.json was stale fake-positioning-era data (fabricated $150k/99.9%/1M+, "AdTech Startup" employment contradicting real EPAM/GlobalLogic history, two 404 GitHub project URLs). Per ZERO FABRICATION, rewrote the whole file to mirror the real /resume page narrative + lib/facts.ts canonical numbers with source labels. Only consumer is /api/resume (raw JSON); the /resume page uses hardcoded JSX, unaffected.

- [VS-TODO:linkedin-headline] Site title now uniformly "Agentic Systems Architect". Align the LinkedIn headline (linkedin.com/in/vitalii-serbyn-b517a083) manually to match. No code hook.
- [VS-TODO-none / self-note] public/og.png.svg is an orphaned stale OG source (fabricated 10M+/45%/99.9%). Delete during Wave 2.3 (F5) OG regeneration.
