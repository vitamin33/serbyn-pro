import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OFFERS, ADVISORY, UPSELL } from '@/lib/facts';

// Home §5 — OFFERS. Three priced cards, each linking to its own page. Advisory
// and the audit→retainer upsell are surfaced as a thin line beneath.
export function Offers() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            02_ways_to_work_together
          </p>
          <h2 className="headline-lg">Fixed-scope offers</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {OFFERS.map(offer => (
            <Link
              key={offer.id}
              href={offer.href as any}
              className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <h3 className="headline-sm mb-3 transition-colors group-hover:text-primary">
                {offer.name}
              </h3>
              <div className="mb-4">
                <span className="metric-lg text-foreground">{offer.price}</span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {offer.terms}
                </span>
              </div>
              <p className="body-md mb-5 flex-1 leading-relaxed text-muted-foreground">
                {offer.summary}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 body-md text-muted-foreground">
          Also available:{' '}
          <strong className="text-foreground">{ADVISORY.name}</strong> at{' '}
          {ADVISORY.price} ({ADVISORY.terms}). {UPSELL}
        </p>
      </div>
    </section>
  );
}
