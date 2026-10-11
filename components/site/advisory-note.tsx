import { Eyebrow, Price } from '@/components/ds';
import { ADVISORY } from '@/lib/facts';

// Advisory option surfaced on the /fractional page — a lighter, no-commitment
// alternative. The $200/hr price is distinct from the fractional retainer price
// so the per-page pricing check (T8, which asserts the offer's own price once)
// is unaffected.
export function AdvisoryNote() {
  return (
    <section className="ds-sec" data-size="offer" aria-labelledby="h-adv">
      <div className="ds-wrap">
        <div
          className="ds-card"
          style={{
            padding: 28,
            borderStyle: 'dashed',
            display: 'grid',
            gap: 14,
            maxWidth: 760,
          }}
        >
          <Eyebrow tone="accent">Prefer something lighter?</Eyebrow>
          <h2 id="h-adv" className="ds-h3" style={{ fontSize: 26 }}>
            {ADVISORY.name}
          </h2>
          <Price price={ADVISORY.price} terms={ADVISORY.terms} size="card" />
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            {ADVISORY.summary} No monthly commitment — a direct line to
            architectural advice on agent reliability and LLM cost when you need
            it.
          </p>
        </div>
      </div>
    </section>
  );
}
