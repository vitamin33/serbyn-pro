import { CONTACT } from '@/lib/facts';

// Home §9 — CONTINUITY & TRUST. Short, honest operating terms. Kyiv
// infrastructure specifics are a VS-TODO (continuity-details) — the general,
// truthful statement stands until Vitalii supplies exact numbers.
const TERMS = [
  {
    k: 'Contracting entity',
    v: `${CONTACT.company} (UK LTD). Invoiced in USD/GBP/EUR; standard contractor terms.`,
  },
  {
    k: 'IP & ownership',
    v: 'Full IP transfer on payment. Your code and findings are yours.',
  },
  {
    k: 'Access',
    v: 'Read-only access by default. Write access only when a change is agreed, scoped, and gated.',
  },
  {
    k: 'NDA / DPA',
    v: 'NDA on request; DPA available for engagements touching personal data.',
  },
  {
    k: 'Continuity',
    v: 'Based in Kyiv with backup power and connectivity in place to keep engagements on schedule.', // [VS-TODO:continuity-details]
  },
  {
    k: 'References',
    v: 'Client references handled privately, shared on request with permission.',
  },
];

export function Continuity() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            06_continuity_and_trust
          </p>
          <h2 className="headline-lg">How engagements are run</h2>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {TERMS.map(t => (
            <div key={t.k} className="bg-card p-5">
              <dt className="label-caps mb-1.5 text-primary/80">{t.k}</dt>
              <dd className="body-md leading-relaxed text-muted-foreground">
                {t.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
