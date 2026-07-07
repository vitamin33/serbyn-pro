# Link Crawl — serbyn.io

Audit date: 2026-07-06. Method: `curl` (User-Agent: Mozilla/5.0) against 14 pages; every `href` (both `<a>` and `<link>`) extracted with python3 HTML parsing; each unique URL checked with `curl -sIL` (HEAD, GET fallback), redirects followed; GitHub targets verified via the GitHub API; Calendly verified via Calendly's booking lookup API.

## Pages crawled (all returned 200)

`/` (102,337 B), `/audit` (59,677 B), `/llm-cost-teardown` (62,955 B), `/fractional` (60,368 B), `/writing` (38,393 B), `/about` (35,595 B), `/work` (40,565 B), `/methodology` (31,488 B), `/resume` (43,532 B), `/legal/privacy` (37,658 B), `/legal/terms` (41,429 B), `/blog/the-arc-since-the-six-were-caught` (80,787 B), `/blog/the-calibration-ledger-58-runs-93-pass-n-is-small` (77,867 B), `/blog/six-false-greens-in-a-self-auditing-agent-pipeline` (94,828 B).

## All unique links (51)

"same" in Final URL = final URL identical to the requested URL (fragment stripped), 0 redirects. "all 14 pages" = every crawled page (these are header/footer/head links).

| URL | Found on | Final status | Final URL |
|---|---|---|---|
| `https://calendly.com/serbyn-vitalii/consulting` | 13 pages (all except /resume) | 200 | same |
| `https://github.com/vitamin33` | all 14 pages | 200 | same |
| `https://serbyn.io` | / | 200 | same (trailing slash) |
| `https://serbyn.io/` | all 14 pages | 200 | same |
| `https://serbyn.io/#main` | / | 200 | same |
| `https://serbyn.io/_next/static/chunks/webpack-6baa15a78829c5af.js` | all 14 pages | 200 | same |
| `https://serbyn.io/_next/static/css/5eacd01f773eed7f.css` | 3 blog posts | 200 | same |
| `https://serbyn.io/_next/static/css/dae3958bf0c98424.css` | all 14 pages | 200 | same |
| `https://serbyn.io/_next/static/media/bb3ef058b751a6ad-s.p.woff2` | all 14 pages | 200 | same |
| `https://serbyn.io/_next/static/media/e4af272ccee01ff0-s.p.woff2` | all 14 pages | 200 | same |
| `https://serbyn.io/about` | all 14 pages | 200 | same |
| `https://serbyn.io/about#main` | /about | 200 | same |
| `https://serbyn.io/apple-touch-icon.png` | all 14 pages | 200 | same |
| `https://serbyn.io/audit` | 13 pages (all except /resume) | 200 | same |
| `https://serbyn.io/audit#main` | /audit | 200 | same |
| `https://serbyn.io/blog` | 3 blog posts + /resume | 200 | same |
| `https://serbyn.io/blog/false-greens-three-structural-observations` | 3 blog posts + / + /writing | 200 | same |
| `https://serbyn.io/blog/one-sided-contracts-break-agent-pipelines` | 3 blog posts + / + /writing | 200 | same |
| `https://serbyn.io/blog/permissive-parsing-is-a-false-green-factory` | 3 blog posts + /writing | 200 | same |
| `https://serbyn.io/blog/qa-is-only-as-honest-as-its-coverage` | 3 blog posts + /writing | 200 | same |
| `https://serbyn.io/blog/six-false-greens-in-a-self-auditing-agent-pipeline` | 3 blog posts + /writing | 200 | same |
| `https://serbyn.io/blog/six-false-greens-in-a-self-auditing-agent-pipeline#main` | (self) | 200 | same |
| `https://serbyn.io/blog/the-arc-since-the-six-were-caught` | 3 blog posts + / + /writing | 200 | same |
| `https://serbyn.io/blog/the-arc-since-the-six-were-caught#main` | (self) | 200 | same |
| `https://serbyn.io/blog/the-calibration-ledger-58-runs-93-pass-n-is-small` | 3 blog posts + / + /writing | 200 | same |
| `https://serbyn.io/blog/the-calibration-ledger-58-runs-93-pass-n-is-small#main` | (self) | 200 | same |
| `https://serbyn.io/favicon.ico` | all 14 pages | 200 | same |
| `https://serbyn.io/feed.xml` | all 14 pages | 200 | same |
| `https://serbyn.io/fractional` | 13 pages (all except /resume) | 200 | same |
| `https://serbyn.io/fractional#main` | /fractional | 200 | same |
| `https://serbyn.io/legal/privacy` | all 14 pages | 200 | same |
| `https://serbyn.io/legal/privacy#main` | /legal/privacy | 200 | same |
| `https://serbyn.io/legal/terms` | all 14 pages | 200 | same |
| `https://serbyn.io/legal/terms#main` | /legal/terms | 200 | same |
| `https://serbyn.io/llm-cost-teardown` | 13 pages (all except /resume) | 200 | same |
| `https://serbyn.io/llm-cost-teardown#main` | /llm-cost-teardown | 200 | same |
| `https://serbyn.io/methodology` | /, /methodology | 200 | same |
| `https://serbyn.io/methodology#main` | /methodology | 200 | same |
| `https://serbyn.io/resume` | /about, /resume | 200 | same |
| `https://serbyn.io/resume#main` | /resume | 200 | same |
| `https://serbyn.io/site.webmanifest` | all 14 pages | 200 | same |
| `https://serbyn.io/work` | /resume, /work | 200 | same |
| `https://serbyn.io/work#main` | /work | 200 | same |
| `https://serbyn.io/work/ascend-autonomous-agents` | 3 blog posts + /work | 200 | same |
| `https://serbyn.io/work/crest-signal-driven-platform` | 3 blog posts + /work | 200 | same |
| `https://serbyn.io/work/enterprise-multi-project` | 3 blog posts + /work | 200 | same |
| `https://serbyn.io/writing` | 13 pages (all except /resume) | 200 | same |
| `https://serbyn.io/writing#main` | /writing | 200 | same |
| `https://usecrest.io` | / | 200 | same (trailing slash) |
| `https://www.linkedin.com/in/vitalii-serbyn-b517a083` | all 14 pages | 999 (LinkedIn bot block) | same |
| `mailto:serbyn.vitalii@gmail.com` | all 14 pages | n/a (mailto) | — |

Fragment check: every page contains exactly one `id="main"` element, so all `#main` skip-links resolve to a real anchor. The `#main` link listed for the 404 page also resolves (the 404 shell contains `id="main"`).

## External link details

### GitHub — `https://github.com/vitamin33`
- Anchor texts: "GITHUB" (footer, all pages) and "View on GitHub" (home page, on the **Ascend** proof card: "Multi-agent orchestration daemon: trust-tiered L0–L4 execution … 1,178 tests … 6-provider LLM fallback · 18+ mature agents (27 total)").
- Target: **user profile**, not a repo. API (`/users/vitamin33`): exists, public, name "Vitalii Serbyn", bio "AI Engineer & Architect | LangGraph, Multi-Agent Systems, RAG, LLMOps…", **70 public repos**, 3 followers, account created 2013-04-04.
- Repos are real (not empty/profile-only): most-recently pushed include `vitamin33.github.io` (pushed 2026-07-06), `serbyn-pro` (this site's repo, public, 697 KB, pushed 2026-07-04), `ascend-core` (Python, 86 KB, pushed 2026-03-10, desc "Trust-based agent orchestrator — executor, policy engine, trust levels, memory architecture"; root contains `ascend/`, `tests/`, `docs/`, `examples/`, `pyproject.toml`, README, LICENSE — real code).
- Promise-match note: the "View on GitHub" button sits on the Ascend card but lands on the **profile page**, not on `ascend-core` (or any repo). The relevant repo exists one click deeper, but the anchor does not link directly to the code it describes. Also, no public repo named exactly "Ascend" — the closest is `ascend-core` (86 KB, described as orchestrator core; the card's claims of "1,178 tests / 27 agents" are not verifiable from that repo's size alone; not assessed further — repo contents beyond root listing not audited).

### Calendly — `https://calendly.com/serbyn-vitalii/consulting`
- Anchor texts: "Book a Call", "Book a 30-min systems call", "Book Architecture Review", "CONTACT".
- Page returns 200 (JS shell, 2,126 B — content renders client-side).
- Verified real via Calendly booking lookup API (`/api/booking/event_types/lookup?event_type_slug=consulting&profile_slug=serbyn-vitalii`): returns event id **189503498**, duration **30 min**, booking_method "instant", timezone Europe/Helsinki, one optional custom question, guests allowed, no payment required. Control test: a bogus slug on the same profile returns HTTP **404** on both the page and the API, so the 200 for `/consulting` is meaningful. This is a live, bookable event.
- Note: pages/CTAs say "Cal.com" nowhere; the link is Calendly (matches anchor "Book a Call"). The "Book Architecture Review" anchor points at the same generic 30-min consulting event (no separate architecture-review event type).

### LinkedIn — `https://www.linkedin.com/in/vitalii-serbyn-b517a083`
- Anchor text: "LINKEDIN" (footer).
- HTTP 999 on both HEAD and GET — LinkedIn's standard anti-bot response; profile existence **cannot be verified via curl**. URL format is a personal profile (`/in/…`), not a company page. Not confirmed broken; not confirmed live.

### Crest — `https://usecrest.io`
- Anchor text: "Visit usecrest.io" (home page, Crest proof card).
- 200, real landing page. Title: "Crest — AI Content Marketing". Meta description: "Create authentic content 10x faster. AI that learns your voice and creates a week of content in minutes. Built for indie hackers." Matches the site's Crest case-study framing.

## sitemap.xml

`https://serbyn.io/sitemap.xml` → 200. Contains **22 URLs**, all verified **200** individually:

```
https://serbyn.io                                                         200
https://serbyn.io/audit                                                   200
https://serbyn.io/llm-cost-teardown                                       200
https://serbyn.io/fractional                                              200
https://serbyn.io/work                                                    200
https://serbyn.io/writing                                                 200
https://serbyn.io/methodology                                             200
https://serbyn.io/about                                                   200
https://serbyn.io/resume                                                  200
https://serbyn.io/blog                                                    200
https://serbyn.io/work/ascend-autonomous-agents                           200
https://serbyn.io/work/crest-signal-driven-platform                       200
https://serbyn.io/work/enterprise-multi-project                           200
https://serbyn.io/blog/the-arc-since-the-six-were-caught                  200
https://serbyn.io/blog/the-calibration-ledger-58-runs-93-pass-n-is-small  200
https://serbyn.io/blog/false-greens-three-structural-observations         200
https://serbyn.io/blog/one-sided-contracts-break-agent-pipelines          200
https://serbyn.io/blog/qa-is-only-as-honest-as-its-coverage               200
https://serbyn.io/blog/permissive-parsing-is-a-false-green-factory        200
https://serbyn.io/blog/six-false-greens-in-a-self-auditing-agent-pipeline 200
https://serbyn.io/legal/privacy                                           200
https://serbyn.io/legal/terms                                             200
```

## robots.txt

`https://serbyn.io/robots.txt` → 200:

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/
Disallow: *.json
Disallow: /tmp/

User-Agent: GPTBot
Disallow: /

User-Agent: Google-Extended
Disallow: /

User-Agent: CCBot
Disallow: /

Host: https://serbyn.io
Sitemap: https://serbyn.io/sitemap.xml
```

Facts: AI crawlers (GPTBot, Google-Extended, CCBot) fully disallowed. `Disallow: /_next/` while every page references `/_next/static/...` CSS/JS/fonts (blocked assets can affect how crawlers render pages; noted as data only). `Disallow: *.json` also matches `site.webmanifest`? No — manifest is `.webmanifest`, not `.json`, so not blocked.

## feed.xml

`https://serbyn.io/feed.xml` → 200, RSS 2.0, 3,959 B. Channel: "Vitalii Serbyn — Agentic Systems Architect", link `https://serbyn.io/blog`. Contains **7 items**, matching the 7 blog posts in the sitemap exactly; all item links verified 200:
1. /blog/the-arc-since-the-six-were-caught
2. /blog/the-calibration-ledger-58-runs-93-pass-n-is-small
3. /blog/false-greens-three-structural-observations
4. /blog/one-sided-contracts-break-agent-pipelines
5. /blog/qa-is-only-as-honest-as-its-coverage
6. /blog/permissive-parsing-is-a-false-green-factory
7. /blog/six-false-greens-in-a-self-auditing-agent-pipeline

## 404 page — `https://serbyn.io/nonexistent-page-xyz`

- HTTP status: **404** (correct status code), 26,852 B.
- `<title>`: `404: This page could not be found.`
- Body: the **default Next.js error component** ("404 | This page could not be found.", including Next's inline error styles) rendered **inside the full site shell** — header nav (AUDIT, COST_TEARDOWN, FRACTIONAL, WRITING, ABOUT, CONTACT) and full footer (Easelect LTD company details) are present.
- **Links back to offers: yes** — the 404 page links to `/audit`, `/llm-cost-teardown`, `/fractional`, `/writing`, `/about`, `/legal/privacy`, `/legal/terms`, `/`, `/feed.xml`, plus Calendly, GitHub, LinkedIn, mailto. There is no custom 404 copy or dedicated "page not found" CTA — the content area is Next.js's stock error block.

## Redirect behavior (http / www)

| Request | Hop 1 | Hop 2 | Final |
|---|---|---|---|
| `http://serbyn.io/` | 308 → `https://serbyn.io/` | — | 200 (1 redirect) |
| `http://serbyn.io/audit` | 308 → `https://serbyn.io/audit` | — | 200 (path preserved) |
| `http://www.serbyn.io/` | 308 → `https://www.serbyn.io/` | 308 → `https://serbyn.io/` | 200 (2 redirects) |
| `https://www.serbyn.io/` | 308 → `https://serbyn.io/` | — | 200 (1 redirect) |

Canonical host is `https://serbyn.io` (non-www). All redirects are 308 Permanent. The `http://www` entry takes a 2-hop chain (http→https on www, then www→apex).

## BROKEN OR SUSPICIOUS

Zero hard-broken links (no 4xx/5xx targets among the 51 unique links; no on-page redirect chains — every on-page link resolves in 0 redirects). Items of note:

1. **LinkedIn footer link — unverifiable (HTTP 999)**: `https://www.linkedin.com/in/vitalii-serbyn-b517a083` returns LinkedIn's 999 anti-bot status to curl on both HEAD and GET. Cannot confirm the profile exists from automation. On all 14 pages.
2. **"View on GitHub" lands on profile, not the code it captions**: the button on the home-page Ascend card (claims "1,178 tests", "27 agents") links to `https://github.com/vitamin33` (profile root), not to a repo. The nearest matching public repo is `vitamin33/ascend-core` (real, Python, has code, pushed 2026-03-10), but a visitor must find it among 70 repos; the specific claims on the card are not directly evidenced at the link target.
3. **404 page uses stock Next.js error content**: correct 404 status and full site shell with offer links in header/footer, but the content area is the default "404 | This page could not be found." block — no custom copy or recovery CTA.
4. **robots.txt disallows `/_next/`** while all pages load CSS/JS/fonts from `/_next/static/...` (blocked-resource situation for crawlers that honor it).
5. **`http://www.serbyn.io` needs 2 redirect hops** (308 → https://www → 308 → apex) before reaching the canonical origin.
6. **Two CTAs, one Calendly event**: "Book Architecture Review" and "Book a 30-min systems call" both point at the same single 30-minute `consulting` event type (event id 189503498 — live and bookable; verified against Calendly's API, bogus slug control returned 404).
7. **`https://serbyn.io/methodology` is only linked from `/` and itself; `/resume` is only linked from `/about` and itself** — both are in the sitemap and return 200, but are near-orphaned in on-page navigation across the 14 crawled pages.
