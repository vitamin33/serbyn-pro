import { ADVISORY } from '@/lib/facts';

// Advisory option surfaced on the /fractional page — a lighter, no-commitment
// alternative. The $200/hr price is distinct from the fractional retainer price
// so the per-page pricing check (T8, which asserts the offer's own price once)
// is unaffected.
export function AdvisoryNote() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="rounded-lg border border-dashed border-border bg-card p-6">
          <p className="label-caps mb-2 text-primary/80">
            prefer something lighter?
          </p>
          <h2 className="headline-md mb-3">{ADVISORY.name}</h2>
          <div className="mb-3 flex flex-wrap items-baseline gap-3">
            <span className="metric-lg text-foreground">{ADVISORY.price}</span>
            <span className="font-mono text-sm text-muted-foreground">
              {ADVISORY.terms}
            </span>
          </div>
          <p className="max-w-2xl body-md leading-relaxed text-muted-foreground">
            {ADVISORY.summary} No monthly commitment — a direct line to
            architectural advice on agent reliability and LLM cost when you need
            it.
          </p>
        </div>
      </div>
    </section>
  );
}
