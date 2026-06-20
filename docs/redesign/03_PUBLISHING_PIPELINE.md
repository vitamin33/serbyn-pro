# 03 — Publishing Pipeline (artifact → SEO blog → live) + Newsletter

> Home: **Ascend** (orchestration) reusing built pieces — `scripts/blog_publisher.py` (✅ shipped, tested), `scripts/newsletter_assembler.py` (✅ shipped, tested), `seo-writer` skill, `semantic_dedup` + `topic_history_dedup`, `experience_atom_extractor.py`, `git_story_miner.py`. Generation may call Crest `crest_claude_write` for voice.

## 1. Flow

```
YOU (during real dev work)            ASCEND (manual trigger / launchd)
─────────────────────────            ─────────────────────────────────
drop artifact .md into     ──────►   1. INGEST artifact (thesis + facts + commit_range)
  ascend/data/blog_inbox/            2. ENRICH: pull experience_atoms + git_stories for commit_range
                                     3. DEDUP gate: semantic_dedup vs published blog MDX
                                        AND content.db (LinkedIn) — block >0.78 cosine
                                     4. GENERATE: seo-writer (claude-code) or crest_claude_write
                                        → MDX (frontmatter incl. system_id/status_chips/cover)
                                     5. VALIDATE + PUBLISH: blog_publisher.py → commit to
                                        serbyn-pro/content/blog/<slug>.mdx
                                     6. DEPLOY: push branch → Vercel preview (prod = your gate)
                                     7. (weekly) newsletter_assembler → Resend broadcast +
                                        LinkedIn "publish as newsletter" paste (one click)
```

## 2. Artifact schema (you author this, nothing else)

`ascend/data/blog_inbox/<date>-<slug>.md`:
```markdown
---
date: 2026-06-20
project: ascend                 # ascend|crest|vitelle|assisterr
commit_range: daf1f44..HEAD     # auto-pulls atoms + git story for this range
thesis: "One falsifiable sentence the post argues."
audience: middle                # inner|middle|outer
angle: build_in_public          # contrarian|data|story|build_in_public|teaching
category: architecture          # maps to public taxonomy
---
## Problem
…the real constraint, your words.
## What I did
…mechanism, named systems, the tradeoff.
## Numbers (must be real)
- before: X   - after: Y   - saved: Z
## Lesson
…why it generalizes.
```
The artifact is the **seed**: it sets thesis/voice; atoms+git-stories supply verified numbers; the LLM only assembles. Anti-hallucination by construction (Crest V4 `specificity_markers`/`key_numbers`).

## 3. Components to build (Ascend)

| Component | Status | Spec |
|---|---|---|
| `scripts/blog_publisher.py` | ✅ built+tested | validate MDX vs schema → write `content/blog/<slug>.mdx` → git commit |
| `scripts/newsletter_assembler.py` | ✅ built+tested | recent posts → paste-ready issue (also Resend-broadcast body) |
| `scripts/blog_from_artifact.py` | **NEW** | ingest inbox → enrich → dedup → gen (seo-writer/Crest) → call blog_publisher → push branch |
| `scripts/site_metrics_rollup.py` | **NEW** | read sprint-state/trust.db/value_log → write `serbyn-pro/data/site/metrics.json` → commit |
| dedup cross-surface upgrade | **NEW** | index `serbyn-pro/content/blog/*.mdx` into `semantic_dedup` so artifacts dedupe vs blog too |
| daemon route / skill | **NEW (thin)** | `POST /blog/from-artifact` (manual trigger, per user's "inbox + manual trigger" choice) |

## 4. `site_metrics_rollup.py` (the data the design needs)

- Inputs: `.sprint-state.json` (agents, mature, tests), `trust.db` (trust dist, L4 count, success rate), `value_log.md` (hours saved), case-study count by category, an availability flag from a small Ascend config (e.g. `config/site.yaml: availability: {open: true, label: "…"}`).
- Output: `serbyn-pro/data/site/metrics.json` (schema in `02 §5`).
- Commit + (optional) push. $0/run (pure read). Cron: daily or on-demand. Reuses `blog_publisher`'s git helper.

## 5. SEO checklist (P3)

- Blog post = **canonical**; LinkedIn + newsletter link back (no duplicate-content penalty).
- Per-page dynamic OG (✅ done for work+blog slug).
- **RSS** `app/feed.xml` (route handler over `getAllBlogPosts()`), linked in `<head>` + footer (`RSS_FEED`).
- JSON-LD: BlogPosting (present) + add `BreadcrumbList` + `CreativeWork` for case studies.
- Sitemap already includes blog (verified in working tree). FAQ blocks for AEO (seo-writer already emits).
- 1 H1, H2 hierarchy, internal links to case studies, keyword density 1–2% (seo-writer enforces).

## 6. Crest-vs-Ascend (decision detail)

**Now: Ascend-local (launchd).** Lowest effort, reuses all built pieces, metrics come from Ascend's own DBs, already commits to serbyn-pro. Generation calls Crest MCP for voice when wanted.

**Later (optional) cloud-independence:** move intake+generation to Crest (cloud, api.serbyn.pro); Crest commits to serbyn-pro via GitHub API; Ascend pushes nightly `metrics.json` to the repo so Crest/Vercel can read it. Choose this only if running without the laptop becomes a hard requirement. No code is wasted — `blog_publisher`/`newsletter_assembler` are pure and portable.

## 7. Deploy (P5 — your gate)

- All phases land on a feature branch → **Vercel preview URL** (auto per push). You review there.
- Prod = push to `main` (auto-deploys). **I will not push to `main` without your explicit go.**
- Smoke test on preview: home metric strip renders from metrics.json; work cards have chips+covers; an article shows essay-map+code panel; `/feed.xml` validates; newsletter signup round-trips; OG images resolve; Lighthouse ≥ current.
