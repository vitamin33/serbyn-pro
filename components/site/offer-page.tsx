import { Check, X, ChevronRight } from 'lucide-react';
import { BookingButton, EmailButton } from '@/components/site/cta';
import { OFFERS, TRUST_CHIPS } from '@/lib/facts';
import type { OfferPageContent } from '@/lib/offer-content';

// Shared renderer for the offer pages. The canonical price renders EXACTLY ONCE
// (in the hero), pulled from OFFERS by id, so T8 holds. `extra` slots in
// offer-specific content (e.g. the own-platform cost case on the teardown page)
// between method and timeline.
export function OfferPage({
  content,
  extra,
}: {
  content: OfferPageContent;
  extra?: React.ReactNode;
}) {
  const offer = OFFERS.find(o => o.id === content.offerId)!;

  return (
    <div>
      {/* HERO — quantified-mechanism promise + price (once) */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="container relative">
          <div className="max-w-3xl">
            <p className="label-caps mb-5 text-primary">{content.kicker}</p>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              {content.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {content.promise}
            </p>
            <div className="mt-8 flex flex-wrap items-baseline gap-3">
              <span className="metric-lg text-foreground">{offer.price}</span>
              <span className="font-mono text-sm text-muted-foreground">
                {offer.terms}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookingButton location={`offer_${content.offerId}_hero`} />
              <EmailButton location={`offer_${content.offerId}_hero`} />
            </div>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              {TRUST_CHIPS.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section border-t border-border">
        <div className="container">
          <h2 className="headline-lg mb-8">{content.deliverablesHeading}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {content.deliverables.map(d => (
              <div key={d.title} className="border-l-2 border-primary/40 pl-6">
                <h3 className="headline-sm mb-1.5">{d.title}</h3>
                <p className="body-md leading-relaxed text-muted-foreground">
                  {d.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD / LEVERS */}
      <section className="section border-t border-border">
        <div className="container">
          <h2 className="headline-lg mb-2">{content.methodHeading}</h2>
          {content.methodIntro && (
            <p className="mb-8 max-w-2xl body-md text-muted-foreground">
              {content.methodIntro}
            </p>
          )}
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {content.method.map(m => (
              <div key={m.name} className="bg-card p-5">
                <h3 className="headline-sm mb-1.5 font-mono">{m.name}</h3>
                <p className="body-md leading-relaxed text-muted-foreground">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {extra}

      {/* TIMELINE */}
      <section className="section border-t border-border">
        <div className="container">
          <h2 className="headline-lg mb-8">Timeline</h2>
          <ol className="space-y-px overflow-hidden rounded-lg border border-border bg-border">
            {content.timeline.map((t, i) => (
              <li
                key={t.phase}
                className="flex flex-col gap-1 bg-card p-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="metric-lg shrink-0 text-primary/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="headline-sm">{t.phase}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {t.when}
                    </span>
                  </div>
                  <p className="mt-1 body-md leading-relaxed text-muted-foreground">
                    {t.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHO IT'S FOR / NOT FOR */}
      <section className="section border-t border-border">
        <div className="container">
          <h2 className="headline-lg mb-8">Who it’s for</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ul className="space-y-3">
              {content.forYou.map(f => (
                <li
                  key={f}
                  className="flex gap-3 body-md text-muted-foreground"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    strokeWidth={2}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {content.notForYou.map(f => (
                <li
                  key={f}
                  className="flex gap-3 body-md text-muted-foreground"
                >
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-warning"
                    strokeWidth={2}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {content.scopingNote && (
            <p className="mt-8 rounded-lg border border-border bg-card p-5 body-md leading-relaxed text-muted-foreground">
              <span className="label-caps mr-2 text-primary/80">Scope</span>
              {content.scopingNote}
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="section border-t border-border">
        <div className="container">
          <h2 className="headline-lg mb-8">FAQ</h2>
          <dl className="space-y-6">
            {content.faq.map(f => (
              <div key={f.q} className="border-l-2 border-primary/40 pl-6">
                <dt className="headline-sm mb-1.5 flex items-start gap-2">
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  {f.q}
                </dt>
                <dd className="body-md leading-relaxed text-muted-foreground">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA (no price — keeps pricing to exactly one occurrence) */}
      <section className="section border-t border-border">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="headline-lg mb-4">Ready to start?</h2>
            <p className="mb-8 body-lg text-muted-foreground">
              Book a 30-minute systems call and we’ll confirm scope and timing.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <BookingButton location={`offer_${content.offerId}_cta`} />
              <EmailButton location={`offer_${content.offerId}_cta`} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
