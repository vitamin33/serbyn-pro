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
