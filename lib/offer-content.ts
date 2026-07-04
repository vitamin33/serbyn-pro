// Content model for the three offer pages (/audit, /llm-cost-teardown,
// /fractional). Prices/terms are pulled from `OFFERS`/`ADVISORY` in facts.ts so
// they stay canonical and render exactly once (in the hero) per page (T8).

export interface Deliverable {
  title: string;
  detail: string;
}
export interface MethodItem {
  name: string;
  detail: string;
}
export interface TimelinePhase {
  phase: string;
  when: string;
  detail: string;
}
export interface Faq {
  q: string;
  a: string;
}

export interface OfferPageContent {
  offerId: string; // key into OFFERS
  kicker: string;
  h1: string;
  promise: string;
  deliverablesHeading: string;
  deliverables: Deliverable[];
  methodHeading: string;
  methodIntro?: string;
  method: MethodItem[];
  timeline: TimelinePhase[];
  forYou: string[];
  notForYou: string[];
  scopingNote?: string;
  faq: Faq[];
}

export const AUDIT_CONTENT: OfferPageContent = {
  offerId: 'audit',
  kicker: 'ai agent production-readiness audit',
  h1: 'Find out where your agents will fail in production — before your users do.',
  promise:
    'A fixed-scope, two-week audit that measures your agents the way production will: real trajectories, real pass/fail, real cost — and hands you a prioritized, evidence-backed fix list.',
  deliverablesHeading: 'What you get',
  deliverables: [
    {
      title: 'Trajectory evaluation suite',
      detail:
        'A set of replayable evals over your agents’ real execution paths, so “it works on my machine” becomes a measured pass rate.',
    },
    {
      title: 'False-green-rate report',
      detail:
        'Where your pipeline reports success it hasn’t earned — the silent failures that pass CI and break in production.',
    },
    {
      title: 'Evidence-binding gap analysis',
      detail:
        'Every “green” checked against the evidence that should back it; claims that can’t cite their proof are flagged.',
    },
    {
      title: 'Trust-tier & permission review',
      detail:
        'What your agents are allowed to do vs. what they should be gated on — mapped to an L0–L4 trust model.',
    },
    {
      title: 'Prioritized fix list',
      detail:
        'Findings ranked by production risk and effort, each with a concrete remediation — not a wall of observations.',
    },
    {
      title: 'Readout call + written report',
      detail:
        'A live walkthrough plus the sanitized written report you can circulate to your team and stakeholders.',
    },
  ],
  methodHeading: 'How the audit runs',
  methodIntro:
    'The same operator protocol every engagement uses — measure first, gate on evidence.',
  method: [
    {
      name: 'Ground-truth audit first',
      detail:
        'I instrument your agents and capture what they actually do before proposing a single change.',
    },
    {
      name: 'Evals before opinions',
      detail:
        'I build trajectory and false-green evals so findings are numbers you can re-run, not vibes.',
    },
    {
      name: 'Evidence-binding',
      detail:
        'Each result is tied to the evidence that earned it; unsupported greens are treated as failures.',
    },
    {
      name: 'Gated remediation plan',
      detail:
        'The fix list is sequenced for a gated rollout — trust tiers and budget guards, with a fast path back.',
    },
  ],
  timeline: [
    {
      phase: 'Phase 0 — Kickoff & access',
      when: 'Days 1–2',
      detail:
        'Scope confirmation, read-only access, and a shared definition of “production-ready” for your system.',
    },
    {
      phase: 'Phase 1 — Instrument & measure',
      when: 'Week 1',
      detail:
        'Capture real trajectories, build the eval suite, and meter false-greens and cost.',
    },
    {
      phase: 'Phase 2 — Analyze & report',
      when: 'Week 2',
      detail:
        'Findings, severity, evidence, and the prioritized fix list — delivered as a written report and a readout call.',
    },
  ],
  forYou: [
    'You run LLM agents in — or close to — production and need to trust them.',
    'You have a mainstream Python or TypeScript agent stack.',
    'You want a fixed price and a fixed scope, not an open-ended engagement.',
  ],
  notForYou: [
    'You’re at the idea stage with no working agent to measure yet.',
    'You want implementation capacity — this is an audit, not a build.',
    'You’re looking only for prompt tweaks rather than reliability engineering.',
  ],
  scopingNote:
    'The flat price covers mainstream Python/TS agent stacks (LangChain/LangGraph, custom orchestrators, OpenAI/Anthropic/Vercel AI SDKs). Custom or unusual stacks require a short scoping call first so the fixed scope stays honest.',
  faq: [
    {
      q: 'What access do you need?',
      a: 'Read-only by default: the repository, run logs/traces, and a way to replay representative agent runs. Write access is only requested if we later agree on a change, and it stays scoped and gated.',
    },
    {
      q: 'What if the audit finds nothing serious?',
      a: 'That’s a valid — and reassuring — outcome. You still get the eval suite and the report documenting what was tested and why it holds, which is exactly what you want to show stakeholders.',
    },
    {
      q: 'How long does it take?',
      a: 'About two weeks end to end, on the phased timeline above. Scheduling depends on access being ready at kickoff.',
    },
    {
      q: 'What happens after the audit?',
      a: 'Most teams take the fix list and run it themselves. If you’d rather I own the reliability and cost work ongoing, the audit fee is credited against a Fractional AI Architect retainer started within 60 days.',
    },
  ],
};

export const TEARDOWN_CONTENT: OfferPageContent = {
  offerId: 'llm-cost-teardown',
  kicker: 'llm cost teardown',
  h1: 'Cut your LLM bill with six levers — without lowering output quality.',
  promise:
    'A one-week teardown of where your LLM spend actually goes, which of six levers move it, and how much each is worth against your own traffic and quality bar — no guesswork, no quality regressions.',
  deliverablesHeading: 'What you get',
  deliverables: [
    {
      title: 'Spend map',
      detail:
        'Your LLM cost broken down by service, model, and route, so the expensive paths stop hiding inside one monthly total.',
    },
    {
      title: 'Per-lever opportunity assessment',
      detail:
        'Each of the six levers modeled against your actual traffic — what it would save you, not a headline number from someone else’s workload.',
    },
    {
      title: 'Quality-guardrail plan',
      detail:
        'The evals and checks that keep output quality fixed while cost comes down, so savings don’t quietly cost you accuracy.',
    },
    {
      title: 'Routing & caching recommendations',
      detail:
        'Concrete model-routing and semantic-caching changes, sequenced by savings-per-effort.',
    },
    {
      title: 'Prioritized savings roadmap',
      detail:
        'A ranked plan you can hand to your team — highest-impact, lowest-risk levers first.',
    },
    {
      title: 'Readout call',
      detail:
        'A live walkthrough of the findings and roadmap, plus the written teardown.',
    },
  ],
  methodHeading: 'The six levers',
  methodIntro:
    'Public benchmarks put each lever’s savings in a broad range — but the only number that matters is yours, so I model each one against your real traffic and quality bar instead of quoting a headline percentage.',
  method: [
    {
      name: '1 · Model routing',
      detail:
        'Send each call to the cheapest model that clears the quality bar for that step; reserve frontier models for the hard hops.',
    },
    {
      name: '2 · Semantic caching',
      detail:
        'Cache on meaning, not exact strings, so near-duplicate requests never hit the model twice.',
    },
    {
      name: '3 · Prompt compression',
      detail:
        'Trim system prompts, context, and few-shot bloat that silently inflate every single call.',
    },
    {
      name: '4 · Batch / async pricing',
      detail:
        'Move latency-tolerant work onto batch and async tiers that price well below interactive rates.',
    },
    {
      name: '5 · Provider arbitrage',
      detail:
        'Price the same capability across providers and route by current cost, not by habit.',
    },
    {
      name: '6 · Fallback chains',
      detail:
        'Degrade gracefully to cheaper providers on error or overload instead of paying a premium to retry.',
    },
  ],
  timeline: [
    {
      phase: 'Phase 0 — Instrument spend',
      when: 'Days 1–2',
      detail:
        'Read-only access to billing and logs; build the spend map by service, model, and route.',
    },
    {
      phase: 'Phase 1 — Model the levers',
      when: 'Days 3–4',
      detail:
        'Estimate each lever against your real traffic and define the quality guardrails that protect output.',
    },
    {
      phase: 'Phase 2 — Roadmap & readout',
      when: 'Day 5',
      detail:
        'Deliver the prioritized savings roadmap and walk through it live.',
    },
  ],
  forYou: [
    'Your monthly LLM bill is large enough that a week of engineering pays for itself.',
    'You need savings that don’t come at the cost of output quality.',
    'You want a concrete roadmap, not a vendor pitch.',
  ],
  notForYou: [
    'Your spend is trivial and not worth optimizing yet.',
    'You want someone to implement every change for you this week — the teardown is analysis and a roadmap.',
    'You’re unwilling to define a quality bar to protect.',
  ],
  faq: [
    {
      q: 'Will cutting cost hurt quality?',
      a: 'No — that’s the whole point of doing it as engineering rather than blunt downgrades. Every lever is modeled against a quality bar you define, and the guardrail plan keeps output fixed while cost moves.',
    },
    {
      q: 'How much can I actually save?',
      a: 'It depends entirely on your traffic mix, so I won’t quote a made-up percentage. Published ranges for these levers are wide; the teardown replaces them with a number modeled on your own usage. See the own-platform example above for how the levers compound.',
    },
    {
      q: 'What access do you need?',
      a: 'Read-only: your billing/usage export and enough logs or traces to see the cost distribution across models and routes.',
    },
    {
      q: 'What’s the deliverable?',
      a: 'A written teardown — spend map, per-lever assessment, quality-guardrail plan, and a prioritized roadmap — plus a live readout.',
    },
  ],
};
