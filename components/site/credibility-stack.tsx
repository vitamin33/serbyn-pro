import { ShieldCheck, Gauge, Layers } from 'lucide-react';
import { YEARS_EXPERIENCE } from '@/lib/facts';

// Home §2 — the rare mixture. Three capabilities that rarely sit in one person:
// agent reliability engineering, LLM cost engineering, and a long production
// track record. The third bullet carries the two labeled employment results
// inline (source-label rule R2).
const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Agent reliability engineering',
    body: 'Trajectory evals, false-green-rate metering, evidence-binding gates, and trust-tiered L0–L4 execution — the machinery that turns "seems fine" into a number you can gate on.',
  },
  {
    icon: Gauge,
    title: 'LLM cost engineering',
    body: 'Multi-model routing, semantic caching, and per-service cost tracking that cut the bill without lowering output quality — the same levers whether you spend hundreds or hundreds of thousands.',
  },
  {
    icon: Layers,
    title: `${YEARS_EXPERIENCE} years of production systems`,
    body: 'Long before agents: shipping software people depend on — including a healthcare app serving 10,000+ users and an 80–90% RPC cost reduction on a Web3 platform, both as an engineer in employed roles.',
  },
];

export function CredibilityStack() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            why this mixture is rare
          </p>
          <h2 className="headline-lg">
            Reliability and cost, held by the same hands
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PILLARS.map(p => (
            <div key={p.title} className="border-l-2 border-primary/40 pl-6">
              <p.icon
                className="mb-3 h-5 w-5 text-primary"
                strokeWidth={1.75}
              />
              <h3 className="headline-sm mb-2">{p.title}</h3>
              <p className="body-md leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
