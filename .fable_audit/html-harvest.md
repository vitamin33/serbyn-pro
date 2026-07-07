# Raw-HTML Harvest — serbyn.io

Fetched 2026-07-06 with `curl` (UA `Mozilla/5.0 (compatible; AuditBot/1.0)`), no JS execution. All values below are exact quotes from the raw server-rendered HTML. Server: Vercel, `x-vercel-cache: HIT` on `/`.

---

## Global facts (identical across all 11 pages)

### JSON-LD Person + Organization (byte-identical on every page)

Every page ships exactly these two JSON-LD blocks (blogs add BlogPosting + FAQPage on top):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Vitalii Serbyn",
  "jobTitle": "Agentic Systems Architect",
  "description": "I make AI agents reliable enough to run in production. Agent reliability engineering and LLM cost engineering for US, UK, and EU teams — fixed-scope audits, teardowns, and fractional architecture.",
  "url": "https://serbyn.io",
  "image": "https://serbyn.io/logo.png",
  "sameAs": [
    "https://www.linkedin.com/in/vitalii-serbyn-b517a083",
    "https://github.com/vitamin33"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Easelect LTD",
    "url": "https://serbyn.io"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "UA",
    "addressLocality": "Kyiv",
    "addressRegion": "Kyiv"
  },
  "knowsAbout": [
    "Agent Orchestration",
    "Autonomous Agent Systems",
    "Trust-Layered AI",
    "Multi-Agent Systems",
    "MLOps",
    "AI Infrastructure",
    "Cost Engineering",
    "Production AI Systems"
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Easelect LTD",
  "url": "https://serbyn.io",
  "logo": "https://serbyn.io/logo.png",
  "description": "AI systems architecture consulting. Autonomous agent orchestration, trust layers, and production AI infrastructure.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Office 12, Initial Business Centre, Wilson Business Park",
    "addressLocality": "Manchester",
    "postalCode": "M40 8WN",
    "addressCountry": "GB"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "",
    "email": "serbyn.vitalii@gmail.com",
    "contactType": "customer service",
    "availableLanguage": ["English", "Ukrainian", "Russian"]
  },
  "founder": { "@type": "Person", "name": "Vitalii Serbyn" },
  "sameAs": ["https://linkedin.com/company/serbyn-solutions"]
}
```

### Schema-type inventory (whole site, all 11 pages)

| @type | Present on |
|---|---|
| Person | all 11 pages (identical block; `sameAs`: LinkedIn profile + GitHub) |
| Organization | all 11 pages (identical block; `sameAs`: LinkedIn company page) |
| BlogPosting | 3 blog posts only |
| FAQPage | 3 blog posts only (5 Q&As each) |
| Service / Offer / Product | **none, anywhere** — /audit, /llm-cost-teardown, /fractional have no Service or Offer schema despite fixed prices in the copy |
| BreadcrumbList | **none, anywhere** |
| WebSite / WebPage | **none, anywhere** |
| FAQPage on offer pages | **absent** — /audit, /llm-cost-teardown, /fractional each have a visible FAQ section, marked up as `<dl>`/`<dt>`/`<dd>` with no FAQPage JSON-LD |

### og:image

- All 8 non-blog pages use `og:image = https://serbyn.io/logo.png`, declared `og:image:width=1200`, `og:image:height=630`, `og:image:type=image/png`.
- **Actual file**: HTTP 200, `image/png`, 7,317 bytes, **actual dimensions 1024×1024** — the declared 1200×630 does not match the real image, and 7.3 KB at 1024×1024 is a logo, not a social card.
- Blog posts use per-post generated images, e.g. `https://serbyn.io/blog/the-arc-since-the-six-were-caught/opengraph-image?909f280fe4c196fc` — HTTP 200, PNG, **actual 1200×630** (135–144 KB). Declared dims match.

### Twitter card (all pages)

`twitter:card = summary_large_image`, `twitter:site = @VitaliiSerbyn`, `twitter:creator = @VitaliiSerbyn`. Non-blog pages point `twitter:image` at the same 1024×1024 `logo.png`.

### llms.txt

- `https://serbyn.io/llms.txt` → **HTTP 404** (body is the site's custom 404 page)
- `https://serbyn.io/llms-full.txt` → **HTTP 404**

### Page-size / script-count table

| Page | Raw HTML bytes | `<script>` tags | of which ld+json |
|---|---|---|---|
| / | 102,337 | 19 | 2 |
| /audit | 59,677 | 18 | 2 |
| /llm-cost-teardown | 62,955 | 18 | 2 |
| /fractional | 60,368 | 18 | 2 |
| /writing | 38,393 | 18 | 2 |
| /about | 35,595 | 18 | 2 |
| /methodology | 31,488 | 18 | 2 |
| /work | 40,565 | 18 | 2 |
| /blog/the-arc-since-the-six-were-caught | 80,787 | 24 | 4 |
| /blog/the-calibration-ledger-…-n-is-small | 77,867 | 24 | 4 |
| /blog/permissive-parsing-…-factory | 76,155 | 24 | 4 |

All pages also carry `<meta name="author" content="Vitalii Serbyn">` and a shared `<meta name="keywords">` list beginning "Agent Reliability,AI Agent Audit,Agentic Systems Archite…".

---

## / (home)

- **Title** (42 chars): `Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (253 chars): `Agentic Systems Architect. I make AI agents reliable enough to run in production — agent reliability engineering (trajectory evals, false-green metering, evidence-binding, trust-tiered execution) and LLM cost engineering. Fixed-scope audits from $3,500.`
- **Canonical**: `<link rel="canonical" href="https://serbyn.io"/>` (no trailing slash)
- **OG**: og:title = title; og:description = meta description; `og:url = https://serbyn.io`; `og:site_name = Vitalii Serbyn — Agentic Systems Architect`; `og:locale = en_US`; `og:type = website`; og:image block per Global facts (logo.png, declared 1200×630, actual 1024×1024).
- **JSON-LD**: Person + Organization only. No WebSite, no Service/Offer, no BreadcrumbList, no FAQPage.
- **H1**: `I make AI agents reliable enough to run in production.`
- **H2s** (10, none question-shaped): `Reliability and cost, held by the same hands` · `The numbers, each with its context` · `Systems I designed and built` · `Fixed-scope offers` · `How I work` · `See the method, not just claims` · `What colleagues say` · `How engagements are run` · `Notes on agent reliability` · `Get a straight read on your agents`
- **First sentences of body**: "I make AI agents reliable enough to run in production. I'm Vitalii Serbyn — I work with US, UK, and EU teams to get agent systems production-ready."

### SSR verification (raw HTML, no JS)

All five target strings render server-side. Number and label are **sibling `<span>`s** in metric cards (number alone in one span, label in the next), but each metric phrase itself sits in ONE text node:

1. **"18+ mature agents"** — FOUND, one text node inside a span (composite label):
```html
<div data-claim="true" class="flex flex-col mb-5"><span class="metric-lg text-foreground">1,178 tests</span><span class="mt-1 body-md text-muted-foreground">6-provider LLM fallback · 18+ mature agents (27 total)</span><span data-claim-label="true" class="mt-2 font-mono text-[11px] leading-tight text-muted-foreground/70">a system I designed and built</span></div>
```
2. **"1,178 automated tests"** — FOUND but **split across two spans**: number `1,178` in one text node, label `automated tests` in the next:
```html
<div data-claim="true" class="flex flex-col"><span class="metric-lg text-foreground">1,178</span><span class="mt-1 body-md text-muted-foreground">automated tests</span><span data-claim-label="true" ...>on Ascend, a system I designed and built</span></div>
```
3. **"0.94 pass rate"** — FOUND; the phrase `logged pipeline runs · 0.94 pass rate` is one text node, but the count `101` is a separate span:
```html
<div data-claim="true" class="flex flex-col"><span class="metric-lg text-foreground">101</span><span class="mt-1 body-md text-muted-foreground">logged pipeline runs · 0.94 pass rate</span><span data-claim-label="true" ...>on DW, a system I designed and built</span></div>
```
4. **"−58% LLM bill"** — FOUND with Unicode minus `−58%` (U+2212, not ASCII hyphen). `−58%` and `LLM bill: $82 → $34 / month` are **two separate spans**; the exact string "−58% LLM bill" never appears as one node:
```html
<div data-claim="true" class="flex flex-col"><span class="metric-lg text-foreground">−58%</span><span class="mt-1 body-md text-muted-foreground">LLM bill: $82 → $34 / month</span><span data-claim-label="true" ...>on my own platform — small bill, same levers scale with spend</span></div>
```
5. **"100M+ downloads"** — FOUND inside a single prose text node:
```html
<p class="body-md leading-relaxed text-muted-foreground">Long before agents: shipping software people depend on — including a consumer app with 100M+ downloads and a Google Play Editor’s Choice award, and an 80–90% RPC cost reduction on a Web3 platform, both as an engineer in employed roles.</p>
```

### Prices on home (SSR, raw fragments)

Offer-card pattern: price in one span, terms in a sibling span:
```html
<h3 class="headline-sm mb-3 ...">AI Agent Production-Readiness Audit</h3><div class="mb-4"><span class="metric-lg text-foreground">$3,500</span><span class="ml-2 font-mono text-xs text-muted-foreground">flat · ~2 weeks · fixed scope</span></div>
```
```html
<h3 ...>LLM Cost Teardown</h3><div class="mb-4"><span class="metric-lg text-foreground">from $2,000</span><span class="ml-2 font-mono text-xs text-muted-foreground">~1 week</span></div>
```
```html
<h3 ...>Fractional AI Architect</h3><div class="mb-4"><span class="metric-lg text-foreground">from $4,000/mo</span><span class="ml-2 font-mono text-xs text-muted-foreground">~1 day/week · 3-month minimum</span></div>
```
Advisory line is fragmented by React comment nodes (`<!-- -->`), though `$200/hr` itself is one text node:
```html
<p class="mt-8 body-md text-muted-foreground">Also available:<!-- --> <strong class="text-foreground">Advisory</strong> at<!-- --> <!-- -->$200/hr<!-- --> (<!-- -->10-hour minimum block<!-- -->). <!-- -->Audit fee credited against a retainer started within 60 days.</p>
```
(Note: in the RSC flight payload the same prices appear as `$$3,500` etc. — RSC `$`-escaping, not a rendering bug.)

---

## /audit

- **Title** (80 chars): `AI Agent Production-Readiness Audit | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (199 chars): `A flat-fee, two-week audit that measures your AI agents the way production will — trajectory evals, false-green metering, evidence-binding — and hands you a prioritized fix list. $3,500, fixed scope.`
- **Canonical**: `https://serbyn.io/audit`
- **OG/Twitter**: mirror title/description; `og:type = website`; og:image = logo.png (1024×1024 actual). No product/offer-specific og:type.
- **JSON-LD**: Person + Organization only. **No Service, no Offer, no FAQPage** (FAQ section exists in HTML as `<dt>`/`<dd>`), no BreadcrumbList.
- **H1**: `Find out where your agents will fail in production — before your users do.`
- **H2s** (6): `What you get` · `How the audit runs` · `Timeline` · `Who it’s for` · `FAQ` · `Ready to start?` (question-shaped: `Ready to start?`; FAQ questions like `What access do you need?` are `<dt>` elements, not headings)
- **First sentences**: "Find out where your agents will fail in production — before your users do. A fixed-scope, two-week audit that measures your agents the way production will: real trajectories, real pass/fail, real cost — and hands you a prioritized, evidence-backed fix list."

### SSR: price + timeline + deliverables (all render without JS)

Price — number in one span, terms in sibling span:
```html
...hands you a prioritized, evidence-backed fix list.</p><div class="mt-8 flex flex-wrap items-baseline gap-3"><span class="metric-lg text-foreground">$3,500</span><span class="font-mono text-sm text-muted-foreground">flat · ~2 weeks · fixed scope</span></div><div class="mt-8 flex flex-wrap gap-3"><a href="https://calendly.com/serbyn-vitalii/consulting" ...
```
Timeline (SSR, plain text): `Phase 0 — Kickoff & access, Days 1–2` → `Phase 1 — Instrument & measure, Week 1` → `Phase 2 — Analyze & report, Week 2`. FAQ states "About two weeks end to end."

Deliverables list (SSR, 6 items under "What you get"): Trajectory evaluation suite · False-green-rate report · Evidence-binding gap analysis · Trust-tier & permission review · Prioritized fix list · Readout call + written report.

---

## /llm-cost-teardown

- **Title** (62 chars): `LLM Cost Teardown | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (244 chars): `A one-week teardown of where your LLM spend goes and the six levers that bring it down — model routing, semantic caching, prompt compression, batch pricing, provider arbitrage, and fallback chains — without lowering output quality. From $2,000.`
- **Canonical**: `https://serbyn.io/llm-cost-teardown`
- **OG/Twitter**: mirror title/description; `og:type = website`; og:image = logo.png. No Service/Offer schema.
- **JSON-LD**: Person + Organization only. No FAQPage despite HTML FAQ section. No BreadcrumbList.
- **H1**: `Cut your LLM bill with six levers — without lowering output quality.`
- **H2s** (7): `What you get` · `The six levers` · `Worked example — my own platform` · `Timeline` · `Who it’s for` · `FAQ` · `Ready to start?` (question-shaped: `Ready to start?`)
- **First sentences**: "Cut your LLM bill with six levers — without lowering output quality. A one-week teardown of where your LLM spend actually goes, which of six levers move it, and how much each is worth against your own traffic and quality bar — no guesswork, no quality regressions."

### SSR: price + timeline

```html
...no guesswork, no quality regressions.</p><div class="mt-8 flex flex-wrap items-baseline gap-3"><span class="metric-lg text-foreground">from $2,000</span><span class="font-mono text-sm text-muted-foreground">~1 week</span></div><div class="mt-8 flex flex-wrap gap-3"><a href="https://calendly.com/serbyn-vitalii/consulting" ...
```
`from $2,000` is a single text node; `~1 week` sits in the sibling span. Timeline (SSR): `Phase 0 — Instrument spend, Days 1–2` → `Phase 1 — Model the levers, Days 3–4` → `Phase 2 — Roadmap & readout, Day 5`.

The −58% worked example also renders SSR here, same two-span structure as home:
```html
<div data-claim="true" class="flex flex-col"><span class="metric-lg text-foreground">−58%</span><span class="mt-1 body-md text-muted-foreground">LLM bill: $82 → $34 / month</span><span data-claim-label="true" ...>on my own platform — small bill, same levers scale with spend</span></div>
```

---

## /fractional

- **Title** (68 chars): `Fractional AI Architect | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (200 chars): `Ongoing architectural ownership of your agent platform — reliability, LLM cost, and gated-rollout discipline, about one day a week. From $4,000/mo, 3-month minimum. Advisory also available at $200/hr.`
- **Canonical**: `https://serbyn.io/fractional`
- **OG/Twitter**: mirror title/description; `og:type = website`; og:image = logo.png. No Service/Offer schema.
- **JSON-LD**: Person + Organization only. No FAQPage despite HTML FAQ. No BreadcrumbList.
- **H1**: `Keep your agent platform reliable and cheap as it scales — with an architect on the hook.`
- **H2s** (7): `What you get` · `What ongoing ownership looks like` · `Advisory` · `Timeline` · `Who it’s for` · `FAQ` · `Ready to start?` (question-shaped: `Ready to start?`)
- **First sentences**: "Keep your agent platform reliable and cheap as it scales — with an architect on the hook. Ongoing architectural ownership of your agent platform, about one day a week: I hold the reliability and cost lines so quality and spend stay in control while your team keeps shipping."

### SSR: price / retainer terms

Retainer — price one text node, terms in sibling span:
```html
...quality and spend stay in control while your team keeps shipping.</p><div class="mt-8 flex flex-wrap items-baseline gap-3"><span class="metric-lg text-foreground">from $4,000/mo</span><span class="font-mono text-sm text-muted-foreground">~1 day/week · 3-month minimum</span></div><div class="mt-8 flex flex-wrap gap-3"><a href="https://calendly.com/serbyn-vitalii/consulting" ...
```
Advisory block:
```html
<p class="label-caps mb-2 text-primary/80">prefer something lighter?</p><h2 class="headline-md mb-3">Advisory</h2><div class="mb-3 flex flex-wrap items-baseline gap-3"><span class="metric-lg text-foreground">$200/hr</span><span class="font-mono text-sm text-muted-foreground">10-hour minimum block</span></div>
```
Retainer terms in SSR text: "three-month minimum", "About one day a week", "audit fee is credited against a retainer started within 60 days" (in FAQ), Timeline: `Month 1 — Baseline (Weeks 1–2)` → `Ongoing — Weekly cadence (Every week)` → `Quarterly — Direction (Each quarter)`.

---

## /writing

- **Title** (52 chars): `Writing | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (134 chars): `Field notes on agent reliability and LLM cost engineering — false greens, evidence-binding, trajectory evals, and multi-model routing.`
- **Canonical**: `https://serbyn.io/writing`
- **OG/Twitter**: mirror; `og:type = website`; og:image = logo.png.
- **JSON-LD**: Person + Organization only. No Blog/ItemList/CollectionPage schema.
- **H1**: `Writing on agent reliability and LLM cost`
- **H2s** (7 — the post titles): `The Arc Since the Six Were Caught` · `The Calibration Ledger: 58 Runs, 93% Pass, n Is Small` · `False Greens: Three Structural Observations` · `One-Sided Contracts Break Agent Pipelines` · `QA Is Only as Honest as Its Coverage` · `Permissive Parsing Is a False-Green Factory` · `Six False-Greens in a Self-Auditing Agent Pipeline` (none question-shaped)
- **First sentences**: "Writing on agent reliability and LLM cost. How I think about making agents trustworthy and affordable in production — the same methods behind the audits and teardowns."

---

## /about

- **Title** (50 chars): `About | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (133 chars): `12+ years shipping production systems. From mobile apps at EPAM/GlobalLogic to autonomous AI agent orchestration. Kyiv-based, UK LTD.`
- **Canonical**: `https://serbyn.io/about`
- **OG/Twitter**: mirror; `og:type = website`; og:image = logo.png. (An About page with `og:type=website` and no `profile` type; Person schema is the same generic site-wide block.)
- **JSON-LD**: Person + Organization only.
- **H1**: `Vitalii Serbyn`
- **H2s** (1): `Design principles` (not question-shaped)
- **First sentences**: "I've been shipping production systems for 12+ years. Started building Android apps at EPAM and GlobalLogic — one of them (Magisto) hit 100M+ users and won a Google Play award."

---

## /methodology

- **Title** (93 chars): `DW methodology — how runs and passes are counted | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (152 chars): `What counts as a run and a pass for DW, the autonomous spec-driven development pipeline: 101 logged runs at a 0.94 pass rate, measured on my own system.`
- **Canonical**: `https://serbyn.io/methodology`
- **OG/Twitter**: mirror; `og:type = website`; og:image = logo.png.
- **JSON-LD**: Person + Organization only.
- **H1**: `How DW runs and passes are counted`
- **H2s** (3): `What counts as a run` · `What counts as a pass` · `Why the honesty matters` (none end in "?", though the first two are definitional/question-adjacent)
- **First sentences**: "DW is an autonomous, spec-driven development pipeline I designed and built. A short definition of the numbers so they mean something." (Followed by SSR metric `101 · 0.94 — logged runs · pass rate`.)

---

## /work

- **Title** (49 chars): `Work | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (154 chars): `Real projects: 15-agent autonomous system, signal-driven AI platform, multi-project enterprise delivery. Architecture case studies with authentic metrics.`
- **Canonical**: `https://serbyn.io/work`
- **OG/Twitter**: mirror; `og:type = website`; og:image = logo.png.
- **JSON-LD**: Person + Organization only. No ItemList/CreativeWork for the case studies.
- **H1**: `High-performance AI systems & infrastructure`
- **H2s**: **none** (0 H2 tags on the page; case-study titles are rendered in other elements)
- **First sentences**: "High-performance AI systems & infrastructure. Real projects with authentic metrics — from autonomous agent orchestration to multi-project enterprise delivery."
- Note: meta description says "15-agent autonomous system" while the home page says "18+ mature agents (27 total)".

---

## /blog/the-arc-since-the-six-were-caught

- **Title** (78 chars): `The Arc Since the Six Were Caught | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (153 chars): `After fixing six agent failure modes, the system graduated from outcome checking to path checking. A field report on trajectory evals and generalization.`
- **Canonical**: `https://serbyn.io/blog/the-arc-since-the-six-were-caught`
- **OG**: `og:type = article`; `article:published_time = 2026-06-23`; `article:modified_time = 2026-06-23`; `article:author = Vitalii Serbyn` (plain string, not URL); 8 `article:tag` values (`trajectory evaluation`, `false green agent failures`, `autonomous agent reliability`, `agent eval depth`, `fail-closed gate`, `tool_uses grounding signal`, `operational seams`, `agent trust gating`); `og:image = https://serbyn.io/blog/the-arc-since-the-six-were-caught/opengraph-image?909f280fe4c196fc` (200, PNG, actual 1200×630); `og:image:alt = Article — Vitalii Serbyn`.
- **Twitter**: `summary_large_image` + same per-post image with width/height/alt/type.
- **JSON-LD** (4 blocks): Person, Organization (site-wide), **BlogPosting**, **FAQPage** (5 questions).

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Arc Since the Six Were Caught",
  "description": "After fixing six agent failure modes, the system graduated from outcome checking to path checking. A field report on trajectory evals and generalization.",
  "datePublished": "2026-06-23",
  "dateModified": "2026-06-23",
  "author": { "@type": "Person", "name": "Vitalii Serbyn", "url": "https://serbyn.io" },
  "publisher": { "@type": "Organization", "name": "Easelect LTD", "url": "https://serbyn.io" },
  "url": "https://serbyn.io/blog/the-arc-since-the-six-were-caught",
  "keywords": "trajectory evaluation, false green agent failures, autonomous agent reliability, agent eval depth, fail-closed gate, tool_uses grounding signal, operational seams, agent trust gating",
  "wordCount": 2106,
  "timeRequired": "PT11M"
}
```
BlogPosting.author is an inline Person with name+url only — it does not use `@id` to link to the site-wide Person entity (the two Person nodes are unconnected duplicates). FAQPage questions: `What does `tool_uses == 0` actually catch that a stage presence check does not?` · `How do you keep the ledger honest when the sample size is small?` · `What separates an operational seam failure from a false green?` · `Why build trajectory eval through the same pipeline it evaluates?` · `What does "two codebases, second one proven by smoke" actually mean?`

- **H1**: **two H1 tags in the visible DOM** — `<h1 class="mb-4 text-3xl ...">The Arc Since the Six Were Caught</h1>` (page header) and a second bare `<h1>The Arc Since the Six Were Caught</h1>` inside `<article>` (the markdown body repeats the title).
- **H2s** (11): `The Eval-Depth Problem, Closed` · `The Generalization Claim, Now Earned` · `A New Cluster: Operational Seams, Not False Greens` · `The Flywheel That Is Actually the Product` · `What Did Not Work` · `FAQ` · `The Transferable Lesson` · `In this series` · `Related case studies` · `More posts` · `Want to discuss this further?` (question-shaped: last one only; FAQ questions are not H2s)
- **Visible date**: yes, SSR — `<time dateTime="2026-06-23">June 23, 2026</time>` in the post header.
- **Visible author**: **no author byline in the rendered body**. "Vitalii Serbyn" appears in `<body>` only once — inside the BlogPosting JSON-LD. No `rel="author"`.
- **First sentences** (post body): "Six ways the agent lied about the outcome were caught and fixed. What I built the week after is where the story actually closes — because catching a lie about the result turns out to be the easie[st]…" (preceded by a blockquote: "Part of the series: Six False-Greens: Field Notes from a Self-Auditing Agent Pipeline").

---

## /blog/the-calibration-ledger-58-runs-93-pass-n-is-small

- **Title** (98 chars): `The Calibration Ledger: 58 Runs, 93% Pass, n Is Small | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (141 chars): `58 runs, ~93% autonomous pass, and why that number is honest evidence — not a reliability proof. A field report on agent evals at solo scale.`
- **Canonical**: `https://serbyn.io/blog/the-calibration-ledger-58-runs-93-pass-n-is-small`
- **OG**: `og:type = article`; `article:published_time = 2026-06-17`; `article:modified_time = 2026-06-17`; `article:author = Vitalii Serbyn`; 8 article:tags; per-post og:image (200, PNG, actual 1200×630).
- **JSON-LD**: Person, Organization, BlogPosting (`headline` as above, `datePublished/Modified: 2026-06-17`, author inline Person name+url — no `@id` link, publisher Easelect LTD, `wordCount: 1918`, `timeRequired: PT10M`), FAQPage (5 Qs: `What is an agent calibration ledger?` · `What does "false green" mean in agent evals?` · `Why is ~58 runs not enough to claim a false-green rate below a given threshold?` · `What is a fail-closed gate in an agent trust system?` · `What would it take to add trajectory-level evals?`).
- **H1**: **two H1 tags** — page-header H1 plus bare `<h1>` repeated in the markdown body (same text).
- **H2s** (11): `Why an Agent Needs a Calibration Ledger` · `The Four Gaps I Know About` · `What the Ledger Actually Catches` · `The Architecture Decision I Stand Behind` · `The Honest Summary` · `FAQ` · `The Transferable Lesson` · `In this series` · `Related case studies` · `More posts` · `Want to discuss this further?` (question-shaped: last one)
- **Visible date**: yes, SSR — `<time dateTime="2026-06-17">June 17, 2026</time>`.
- **Visible author**: none in rendered body; "Vitalii Serbyn" in `<body>` only inside JSON-LD. No `rel="author"`.
- **First sentences**: "The calibration ledger holds ~58 runs at ~93% autonomous pass — and the most important thing I can tell you about that number is what it does not prove. Most agent benchmarks co…"

---

## /blog/permissive-parsing-is-a-false-green-factory

- **Title** (88 chars): `Permissive Parsing Is a False-Green Factory | Vitalii Serbyn — Agentic Systems Architect`
- **Meta description** (147 chars): `How a silent None from an AI agent registered as a pass — and the fail-closed contract that fixed it. A field report from a production agent fleet.`
- **Canonical**: `https://serbyn.io/blog/permissive-parsing-is-a-false-green-factory`
- **OG**: `og:type = article`; `article:published_time = 2026-05-30`; `article:modified_time = 2026-05-30`; `article:author = Vitalii Serbyn`; 8 article:tags; per-post og:image (200, PNG, actual 1200×630).
- **JSON-LD**: Person, Organization, BlogPosting (`datePublished/Modified: 2026-05-30`, inline author Person — no `@id` link, publisher Easelect LTD, `wordCount: 1905`, `timeRequired: PT10M`), FAQPage (5 Qs: `What is a false-green in an agent eval pipeline?` · `What does fail-closed mean at the contract boundary?` · `Why parse the last fenced JSON block instead of the first?` · `Doesn't a strict parser make evals noisier?` · `How do you triage contract boundary stops versus explicit agent failures?`).
- **H1**: one H1 only (this post's markdown body does not repeat the title): `Permissive Parsing Is a False-Green Factory`
- **H2s** (12): `The Failure Mode Nobody Warns You About` · `What the Walker Actually Does` · `Why "Be Permissive" Feels Right and Isn't` · `The Fix: Fail-Closed at the Contract Boundary` · `What This Changes About Eval Trustworthiness` · `Operational Consequences and Tradeoffs` · `FAQ` · `The Transferable Lesson` · `In this series` · `Related case studies` · `More posts` · `Want to discuss this further?` (question-shaped: last one)
- **Visible date**: yes, SSR — `<time dateTime="2026-05-30">May 30, 2026</time>`.
- **Visible author**: none in rendered body; JSON-LD only. No `rel="author"`.
- **First sentences**: "How a silent None from an AI agent registered as a pass — and the fail-closed contract that fixed it. A field report from a production agent fleet." (dek), body then opens under "The Failure Mode Nobody Warns You About".

---

## Cross-page observations (factual)

1. `og:image` on all 8 non-blog pages is `logo.png`: actual 1024×1024 / 7.3 KB, while every page declares `og:image:width=1200, og:image:height=630`.
2. No Service, Offer, Product, WebSite, or BreadcrumbList schema anywhere; offer pages (/audit, /llm-cost-teardown, /fractional) carry only the generic Person+Organization blocks; their FAQ sections have no FAQPage JSON-LD (blogs do have FAQPage).
3. All key metrics and prices ARE server-rendered (visible to non-JS crawlers), but metric numbers and their labels are split across sibling `<span>`s in the stat cards; "−58%" uses Unicode minus U+2212.
4. `/llms.txt` and `/llms-full.txt` both 404.
5. Blog posts: publish dates SSR via `<time>`; no visible author byline in the body (author exists only in meta/JSON-LD); BlogPosting.author is an inline Person without `@id` linkage to the site-wide Person entity; two of three posts render duplicate H1s (header + markdown body).
6. Organization `sameAs` points to `https://linkedin.com/company/serbyn-solutions` while the Organization name is "Easelect LTD"; Organization `contactPoint.telephone` is an empty string.
7. Home canonical and og:url are `https://serbyn.io` (no trailing slash).
