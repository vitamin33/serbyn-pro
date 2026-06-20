# 06 — Content Plan (synthesis of the 3 research reports)

> Bridges research → the agentic workflow (`05`). Sources:
> `research/01_frontier_lab_corpus.md` · `research/02_seo_serp_map.md` ·
> `research/03_newsletter_playbook.md`. Read those for full detail + citations.

## Positioning (locked)

**"Frontier-lab practice, applied solo."** Every post: a top-1% AI-lab technique →
the concrete solo implementation on the agent fleet → a real measured number →
the honest tradeoff. The winnable SEO gap (all 3 reports agree): **first-person,
production-grounded writing with real numbers** — generic head terms are
saturated by vendor domains and thin reposts.

## The 3 front-loaded pillars (most shareable + winnable)

1. **Evals as ground truth** — cite Anthropic "Demystifying evals" (Jan 2026) +
   LLM-as-judge. Metric needed: your eval suite size, judge agreement, regression
   catches.
2. **Production-failure math** — what breaks agents in prod + the numbers. Metric:
   failure categories from `audit.jsonl`, recovery rate, retry stats.
3. **Cost-to-$0 engineering** — model routing / script engine. Cite RouteLLM
   (arXiv 2406.18665). Metric: $/run before-after, provider mix, $0 script engine.

Then: framework build-vs-buy, context engineering (Anthropic Sep 2025),
agent design patterns (Building Effective AI Agents, Dec 2024), Claude Code
workflow, agents-from-scratch, trust levels (your L0–L4), and a hiring-manager
conversion piece (→ About/Services, not a blog post).

## Citable corpus — load-bearing anchors (from report 01)

Anthropic *Demystifying evals* (2026-01) · *Building Effective AI Agents*
(2024-12) · *Effective context engineering* (2025-09) · *Multi-agent research
system* (2025-06) · Google *ReasoningBank* (arXiv 2509.25140) · Thompson Sampling
tutorial (Russo et al.) · *RouteLLM* (arXiv 2406.18665).

⚠️ **Accuracy flags to honor in generation** (the voice bans fake metrics):
- ReasoningBank k=1-vs-k=4 ablation numbers are **UNVERIFIED** — don't quote
  without re-checking the v2 PDF.
- "Context Rot" is a **vendor** (Chroma) study, not a lab — frame accordingly.
- OpenAI Structured Outputs page was bot-blocked — cross-confirm before citing.

## 12-week content calendar (hub-and-spoke)

| Wk | Blog post (canonical) | Cites | Real metric you must supply |
|----|----|----|----|
| 1 | How I run evals as ground truth (solo) | Anthropic evals | suite size, judge agreement |
| 2 | The production-failure math of agents | (your audit) | failure cats, recovery % |
| 3 | Getting agent cost to ~$0 | RouteLLM | $/run before→after |
| 4 | Build vs buy: agent frameworks | Building Effective Agents | what you cut + why |
| 5 | Context engineering for long-horizon agents | Anthropic context | token budget, lost-in-middle fix |
| 6 | Agent design patterns I actually use | Building Effective Agents | which patterns + outcomes |
| 7 | My Claude Code dev-loop | (your dev-workflow) | tokens/feature, pass rate |
| 8 | Trust levels for autonomous agents (L0–L4) | (your trust engine) | promotion/demotion data |
| 9 | Memory & reflexion for agents | ReasoningBank (careful) | exemplar/reflection counts |
| 10 | Thompson Sampling for content decisions | TS tutorial | variant lift |
| 11 | Multi-agent orchestration, solo | Anthropic multi-agent | fan-out wall-clock |
| 12 | What hiring managers should ask AI engineers | — | → About/Services CTA |

Front-load 1–3 (evals/failures/cost) — highest shareability. Each blog post →
1 newsletter issue (digest) + 1–2 repurposed LinkedIn feed posts (atomic).

## Per-post recipe (the workflow encodes this)

artifact (your week) → enrich (atoms/git-stories → real numbers) → generate with
`blog_voice.md` + the cited anchor for that week's pillar → FAQ (answer the
People-Also-Ask Qs in report 02) → internal-link to case studies → dedup →
publish blog (canonical) → condense to newsletter (links back).

## Newsletter cadence & format (from report 03)

- **Bi-weekly**, Tue–Wed 10:00–12:00. One idea per issue, lead with the insight.
- **400–800 words**, condensed digest of the canonical blog post, links back.
- 6-section template + 8-pattern hook library in report 03; single CTA;
  subject-line = the specific claim, not clickbait.
- No-API growth levers (LinkedIn has no newsletter API): trailer feed-posts,
  guest editions, repurposed atomic posts, owned-list mirroring.
- ⚠️ Treat vendor "+50–150 subs per trailer" type numbers as hypotheses to A/B,
  not facts.

## What this unblocks

The generation step (`05` step 3) now has: the voice, the cited corpus per
pillar, the keyword/title/H2 targets, the FAQ questions, and the per-post metric
requirements. Remaining to run end-to-end is purely wiring (generation call +
trigger glue + prod ship) — no more research needed to start.
