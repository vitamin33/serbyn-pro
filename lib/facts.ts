// ─────────────────────────────────────────────────────────────────────────
// Canonical facts for serbyn.io — the SINGLE source of publishable numbers,
// claims, prices, and their honest source-labels. Nothing quantified should be
// hard-coded in a component; import it from here so the whole site stays
// consistent (one canonical set) and every claim carries its context label.
//
// SOURCE-LABEL RULE: every quantified claim carries `label`:
//   - self-built systems  → "systems I designed and built" / "on <system>, a
//                            system I designed and built"
//   - employment results  → "as engineer at <employer>" / "in an employed role"
//   - own-platform savings → "on my own platform"
// ─────────────────────────────────────────────────────────────────────────

export const CONTACT = {
  name: 'Vitalii Serbyn',
  role: 'Agentic Systems Architect',
  email: 'serbyn.vitalii@gmail.com',
  booking: 'https://calendly.com/serbyn-vitalii/consulting',
  github: 'https://github.com/vitamin33',
  linkedin: 'https://www.linkedin.com/in/vitalii-serbyn-b517a083',
  company: 'Easelect LTD', // UK LTD — see VS-TODO:company-spelling
  location: 'Kyiv, Ukraine',
} as const;

// Freshness cue — bump when content is materially refreshed. Today: 2026-07.
export const UPDATED = 'July 2026';

// Trust chips shown under the hero CTA.
export const TRUST_CHIPS = [
  'Fixed-scope audits',
  'Read-only by default',
  'NDA on request',
  'US/UK/EU remote',
] as const;

// ── Quantified results (each carries an inline source-label per R2) ──────────
export interface Claim {
  value: string;
  caption: string;
  label: string;
}

export const RESULTS: Claim[] = [
  {
    value: '18+',
    caption: 'mature agents (27 total)',
    label: 'on Ascend, a system I designed and built',
  },
  {
    value: '1,178',
    caption: 'automated tests',
    label: 'on Ascend, a system I designed and built',
  },
  {
    value: '101',
    caption: 'logged pipeline runs · 0.94 pass rate',
    label: 'on DW, a system I designed and built',
  },
  {
    value: '−58%',
    caption: 'LLM bill: $82 → $34 / month',
    label: 'on my own platform — small bill, same levers scale with spend',
  },
  {
    value: '10,000+',
    caption: 'users on a healthcare app I shipped',
    label: 'as engineer, in an employed role',
  },
  {
    value: '80–90%',
    caption: 'RPC cost reduction on a Web3 platform',
    label: 'as engineer, in an employed role',
  },
];

// ── Systems I designed and built (Home §4) ───────────────────────────────────
export interface BuiltSystem {
  id: string;
  name: string;
  tagline: string;
  metric: Claim; // one hard metric, labeled
  repo?: string; // undefined → VS-TODO placeholder
  repoTodo?: string;
}

export const SYSTEMS: BuiltSystem[] = [
  {
    id: 'ascend',
    name: 'Ascend',
    tagline:
      'Multi-agent orchestration daemon: trust-tiered L0–L4 execution, policy gates, budget guards, and audit logging across live projects.',
    metric: {
      value: '1,178 tests',
      caption: '6-provider LLM fallback · 18+ mature agents (27 total)',
      label: 'a system I designed and built',
    },
    repo: CONTACT.github,
  },
  {
    id: 'dw',
    name: 'DW',
    tagline:
      'Autonomous spec-driven development pipeline: a spec goes in, working change comes out, gated by acceptance checks before it lands.',
    metric: {
      value: '101 runs · 0.94 pass',
      caption: 'logged runs, methodology defined',
      label: 'a system I designed and built',
    },
    repo: undefined, // [VS-TODO:dw-github]
    repoTodo: 'VS-TODO:dw-github',
  },
  {
    id: 'crest',
    name: 'Crest',
    tagline:
      'LangGraph-based content engine: multi-stage pipeline with multi-model routing and multi-platform publishing.',
    metric: {
      value: 'LangGraph',
      caption: 'multi-stage content engine',
      label: 'a system I designed and built',
    },
    repo: 'https://github.com/vitamin33/threads-agent',
  },
];

// ── Offers / pricing (canonical — publish exactly) ───────────────────────────
export interface Offer {
  id: string;
  name: string;
  price: string;
  terms: string;
  summary: string;
  href: string;
}

export const OFFERS: Offer[] = [
  {
    id: 'audit',
    name: 'AI Agent Production-Readiness Audit',
    price: '$3,500',
    terms: 'flat · ~2 weeks · fixed scope',
    summary:
      'A ground-truth read on whether your agents are safe to run in production: trajectory evals, false-green metering, evidence-binding gaps, and a prioritized fix list.',
    href: '/audit',
  },
  {
    id: 'llm-cost-teardown',
    name: 'LLM Cost Teardown',
    price: 'from $2,000',
    terms: '~1 week',
    summary:
      'A line-by-line teardown of where your LLM spend goes and the six levers that bring it down — without lowering output quality.',
    href: '/llm-cost-teardown',
  },
  {
    id: 'fractional',
    name: 'Fractional AI Architect',
    price: 'from $4,000/mo',
    terms: '~1 day/week · 3-month minimum',
    summary:
      'Ongoing architectural ownership of your agent platform: reliability, cost, and the gated rollout discipline to keep both in line as you scale.',
    href: '/fractional',
  },
];

// Advisory is a lighter engagement without its own page (surfaced on /fractional).
export const ADVISORY = {
  name: 'Advisory',
  price: '$200/hr',
  terms: '10-hour minimum block',
  summary:
    'Direct architectural advice on agent reliability and LLM cost, booked in a 10-hour block.',
} as const;

// Upsell wording (audit → retainer, NOT audit → build).
export const UPSELL =
  'Audit fee credited against a retainer started within 60 days.';

// ── Own-platform cost case (methodology example, honest label) ───────────────
export const COST_CASE = {
  before: '$82',
  after: '$34',
  delta: '−58%',
  label: 'on my own platform — small bill, same levers scale with spend',
} as const;

// Six LLM-cost levers (qualitative only — no invented percentages; cite impact
// only as "typical published ranges").
export const COST_LEVERS = [
  {
    name: 'Model routing',
    detail:
      'Send each call to the cheapest model that clears the quality bar for that step; reserve frontier models for the hard hops.',
  },
  {
    name: 'Semantic caching',
    detail:
      'Cache on meaning, not exact strings, so near-duplicate requests never hit the model twice.',
  },
  {
    name: 'Prompt compression',
    detail:
      'Trim system prompts, context, and few-shot bloat that silently inflate every single call.',
  },
  {
    name: 'Batch / async pricing',
    detail:
      'Move latency-tolerant work onto batch and async tiers that price well below interactive rates.',
  },
  {
    name: 'Provider arbitrage',
    detail:
      'Price the same capability across providers and route by current cost, not by habit.',
  },
  {
    name: 'Fallback chains',
    detail:
      'Degrade gracefully to cheaper providers on error or overload instead of paying a premium to retry.',
  },
] as const;

// ── How I work — operator protocol (Home §6) ─────────────────────────────────
export const PROTOCOL = [
  {
    step: 'Ground-truth audit first',
    detail:
      'Before changing anything, I measure what your agents actually do — real trajectories, real pass/fail, real cost — not what the dashboard claims.',
  },
  {
    step: 'Evals before changes',
    detail:
      'I build the trajectory and false-green evals that turn "seems fine" into a number, so every later change is judged against a fixed bar.',
  },
  {
    step: 'Evidence-binding',
    detail:
      'Every "green" has to point at the evidence that earned it. Claims that cannot cite their proof are treated as failures.',
  },
  {
    step: 'Gated rollout',
    detail:
      'Changes ship behind trust tiers and budget guards, promoting only when the evals and cost metrics hold — with a fast path back.',
  },
] as const;

export const YEARS_EXPERIENCE = '12+';
