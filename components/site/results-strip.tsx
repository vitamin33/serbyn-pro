import { Stat } from '@/components/site/stat';
import { RESULTS } from '@/lib/facts';

// Home §3 — QUANTIFIED RESULTS STRIP. Plain server-rendered band; every number
// carries its source-label via the Stat component (R2 / testable T5). No
// counters — correct with JavaScript disabled (T2).
export function ResultsStrip() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            quantified results
          </p>
          <h2 className="headline-lg">The numbers, each with its context</h2>
          <p className="mt-3 max-w-2xl body-md text-muted-foreground">
            Every figure below says where it came from — a system I built, my
            own platform, or an employed role. No borrowed client metrics.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {RESULTS.map(claim => (
            <div key={claim.caption} className="bg-card p-5">
              <Stat claim={claim} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
