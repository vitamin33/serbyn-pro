import { Stat } from '@/components/site/stat';
import { COST_CASE } from '@/lib/facts';

// Methodology example for the LLM Cost Teardown page: my OWN-platform bill,
// honestly labeled (never presented as a client result). Slotted into
// OfferPage's `extra` between the levers and the timeline.
export function CostCase() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <h2 className="headline-lg mb-2">Worked example — my own platform</h2>
        <p className="mb-8 max-w-2xl body-md text-muted-foreground">
          The same levers, run on my own agent platform. A small bill — but the
          mechanics are identical, and they scale with spend.
        </p>
        <div className="grid gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-[auto,1fr] sm:items-center">
          <Stat
            claim={{
              value: COST_CASE.delta,
              caption: `LLM bill: ${COST_CASE.before} → ${COST_CASE.after} / month`,
              label: COST_CASE.label,
            }}
          />
          <p className="body-md leading-relaxed text-muted-foreground">
            Multi-model routing plus caching did most of the work: cheap models
            for the easy hops, cached results for the repeats, and frontier
            models only where quality demanded them — with no drop in output
            quality. On a larger bill, the same moves free up real budget.
          </p>
        </div>
      </div>
    </section>
  );
}
