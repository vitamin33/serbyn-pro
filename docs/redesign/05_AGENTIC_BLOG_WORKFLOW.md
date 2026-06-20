# 05 — Agentic Blog Workflow (artifacts → SEO blog + LinkedIn newsletter)

> Goal: drop a few **artifact files** describing the week's real insights →
> produce an **SEO-optimized long-form blog post** (serbyn.pro, canonical) **and**
> a **LinkedIn Newsletter issue** (derivative), in the voice of an **AI-engineering
> expert applying top-1% AI-lab approaches to solo agentic development**.
>
> Impl home: **Ascend** (orchestration) — see `03_PUBLISHING_PIPELINE.md` for the
> Crest-vs-Ascend decision. Voice config: `ascend/config/blog_voice.md`.

## 1. Positioning & audience (the through-line of every post)

- **Author identity:** a solo AI engineer running an autonomous agent fleet
  (Ascend, 31 agents) + a content platform (Crest) — applying **frontier-lab
  practices** (evals-as-ground-truth, trust/policy gating, bandits/Thompson
  Sampling, reflexion/memory, structured tool-use, context engineering,
  observability, cost engineering) at **solo scale**.
- **Differentiator:** "what AI labs do with teams, I do solo + agents." Every
  post = **frontier technique → concrete solo implementation → real metric**.
- **Audience:** US-remote AI/MLOps hiring managers + senior AI engineers who
  respect rigor. They reward specificity and citable practice, punish fluff.
- **Outcome:** the blog is a credibility showcase; the newsletter is distribution.

## 2. Voice (full spec in `ascend/config/blog_voice.md`)

First-person, precise, evidence-backed, opinionated, tradeoff-honest. Mono for
numbers/labels. **No hashtags. No fabricated metrics. No "AI is transforming…"
fluff.** Cite the lab practice by name, then show your solo implementation and
the measured result. Confident, not promotional.

## 3. Inputs — the artifact(s) you author

Drop one or more files into `ascend/data/blog_inbox/` (manual trigger — your
chosen mode). Multiple artifacts can be fused into one post.

```markdown
---
date: 2026-06-20
project: ascend                 # ascend|crest|vitelle|assisterr
commit_range: daf1f44..HEAD     # auto-pulls atoms + git story
thesis: "One falsifiable sentence the post argues."
audience: middle                # inner|middle|outer
angle: build_in_public          # contrarian|data|story|build_in_public|teaching
category: architecture          # architecture|infrastructure|optimization|research
lab_practice: "evals-as-ground-truth"   # the frontier technique this maps to
---
## Problem        — the real constraint, your words
## What I did     — mechanism, named systems, the tradeoff
## Numbers        — before/after/saved (must be real)
## Lesson         — why it generalizes
```

Prompt files (free-form `.md`) are also accepted — the ingester treats any
`## Problem/What I did/Numbers/Lesson`-ish structure leniently and fills gaps
from enrichment.

## 4. Pipeline (Ascend; ✅ = built, ◑ = partial, ⬜ = to build)

| Step | Component | Status |
|---|---|---|
| 1. Ingest inbox artifact(s) | `scripts/blog_from_artifact.py::build_blog_mdx` | ✅ structural |
| 2. Enrich w/ real numbers | `experience_atom_extractor.py` + `git_story_miner.py` for `commit_range` | ◑ (snapshots exist; wire into ingest) |
| 3. Voice + lab-practice generation | **SEAM** → `seo-writer` (claude-code) or Crest `crest_claude_write`, injecting `blog_voice.md` + cited lab corpus | ⬜ (seam present, LLM call not wired) |
| 4. Dedup gate | `semantic_dedup` vs published blog MDX **and** `content.db` (LinkedIn) | ◑ (exists for content.db; ⬜ index blog MDX) |
| 5. Validate + write blog | `scripts/blog_publisher.py` → `content/blog/<slug>.mdx` + git commit | ✅ (8 tests) |
| 6. Newsletter issue | `scripts/newsletter_assembler.py` → paste-ready + Resend body | ✅ (5 tests) |
| 7. LinkedIn condense | Crest `crest_adapt_multiplatform` / condense step (hook-first, links to canonical) | ⬜ |
| 8. Publish blog → prod | push serbyn-pro `main` → Vercel auto-deploy | ◑ (manual; wire push) |
| 9. Refresh metrics | `scripts/site_metrics_rollup.py` → `data/site/metrics.json` | ✅ |
| 10. Trigger glue | one CLI/daemon command chaining 1→9 | ⬜ |

**All 4 scripts now live in the main ascend worktree; 32 tests pass.**

## 5. Dual-target adaptation

- **Blog (canonical, SEO):** 1500–2500 words, H2 hierarchy, FAQ block (AEO),
  internal links to case studies, 1–2% keyword density, frontmatter incl.
  optional `system_id`/`status_chips`/`cover`/`featured_code`.
- **LinkedIn Newsletter (derivative):** condensed, hook-first, ~600–900 words,
  links back to the canonical blog URL. Generated from the same artifact, voice
  preserved. Published via the one-click "Publish as newsletter" path (no API).
- **Email (Resend broadcast):** the assembler output → Resend audience.

Canonical = blog; everything links back → no duplicate-content penalty, satisfies
the dedup requirement.

## 6. To make it runnable end-to-end (ordered)

1. **Ship the redesign to prod** (the blog renderer lives only on the redesign
   branch — prerequisite for any live post). ← do first.
2. Wire step 3 generation (seo-writer or Crest) with `blog_voice.md` + lab corpus.
3. Build step 10 trigger (`blog_from_artifact --publish --commit` + push) and the
   inbox convention.
4. Wire step 7 LinkedIn condense + step 4 blog-MDX dedup index.
5. Add Resend keys to Vercel + Ascend env (step 6 email).

## 7. Additional research / data to collect (to sound top-1%)

Commission these (deep-research / existing research agents) before/while wiring:

1. **Frontier-lab practice corpus** — curate citable 2026 sources (Anthropic
   "building effective agents" + eng blog, OpenAI cookbook/agents, DeepMind,
   ICLR ReasoningBank, eval methodology papers) into a KB the generator cites.
   Reuse `arxiv_scanner` + `rss_aggregator` + `tech_radar`. → credibility.
2. **SEO keyword + SERP map** — real search demand for "solo AI agent
   development", "AI agent evals", "production agent orchestration", "context
   engineering", "LLM cost optimization", etc. Build a keyword→weekly-topic
   calendar. (Free: autocomplete, People-Also-Ask, competitor newsletters.)
3. **Voice corpus** — mine the author's top LinkedIn posts via Crest
   `crest_get_voice_profile` / `crest_get_top_posts` → voice markers for step 3.
4. **Peer/competitor newsletter analysis** — cadence, hook formats, what AI-eng
   newsletters do well in 2026 → positioning + format library.
5. **Fresh-metrics guarantee** — ensure `experience_atoms.json` is regenerated on
   a cron so every post has current verified numbers (today it can be stale).
6. **Engagement feedback** — LinkedIn golden-hour + hook performance (Crest) to
   learn what resonates and feed back into topic selection.

## 8. Suggested deep-research topics (one-shot, to unblock specs)

- "2026 frontier-lab agent-engineering practices that a solo dev can credibly
  cite and implement — mapped to concrete techniques + sources."
- "SEO/SERP analysis for the solo-agentic-development / AI-agent-engineering
  niche — keywords, intent, difficulty, content gaps."
- "What top AI-engineering LinkedIn newsletters do in 2026 — cadence, structure,
  hooks, growth levers."

These three feed §7.1, §7.2, §7.4 and finalize the generation prompt + calendar.
