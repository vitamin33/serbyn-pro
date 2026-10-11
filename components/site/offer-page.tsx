import {
  Chain,
  Deliverables,
  Eyebrow,
  Faq,
  FitBoxes,
  NoteRow,
  PriceCard,
  SectionHeader,
  TimelineBar,
} from '@/components/ds';
import { BookingCta, EmailCta } from '@/components/ds/cta';
import { OFFERS, TRUST_CHIPS } from '@/lib/facts';
import { generateServiceSchema, generateFaqSchema } from '@/lib/seo';
import { slugify } from '@/lib/toc';
import type { OfferPageContent } from '@/lib/offer-content';

// Shared renderer for the offer pages (board "/audit · offer template").
// Pages that sell stay still: no entrance motion, price and scope are there at
// once. The canonical price renders EXACTLY ONCE, in the hero card, pulled
// from OFFERS by id (T8). `extra` slots offer-specific content between the
// method and the timeline; `after` goes before the closing call to action.

// Proportional phase bar above the timeline, only where the phases are
// stretches of one fixed engagement.
const TIMELINE_WEIGHTS: Record<string, number[]> = {
  audit: [2, 5, 5],
  'llm-cost-teardown': [2, 2, 1],
};

export function OfferPage({
  content,
  extra,
  after,
}: {
  content: OfferPageContent;
  extra?: React.ReactNode;
  after?: React.ReactNode;
}) {
  const offer = OFFERS.find(o => o.id === content.offerId)!;
  const serviceSchema = generateServiceSchema(content.offerId);
  const faqSchema = generateFaqSchema(content.faq);
  const loc = (where: string) => `offer_${content.offerId}_${where}`;
  const weights = TIMELINE_WEIGHTS[content.offerId];
  const numbered = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <div>
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="ds-offer-hero" aria-labelledby="h-offer">
        <div className="ds-wrap">
          <a className="ds-link ds-mono" data-tone="muted" href="/#h-off">
            <span style={{ fontSize: 12.5 }}>← Offers</span>
          </a>
          <div className="ds-offer-hero-grid">
            <div className="ds-stack" style={{ gap: 24 }}>
              <Eyebrow>{content.kicker}</Eyebrow>
              <h1 id="h-offer" className="ds-h1" data-size="offer">
                {content.h1}
              </h1>
              <p className="ds-lede">{content.promise}</p>
            </div>
            <PriceCard
              price={offer.price}
              terms={offer.terms}
              location={loc('hero')}
              trust={TRUST_CHIPS}
            />
          </div>
        </div>
      </section>

      <section className="ds-sec" data-size="offer" aria-labelledby="h-deliv">
        <div className="ds-wrap">
          <SectionHeader
            id="h-deliv"
            eyebrow="01 · Deliverables"
            title={content.deliverablesHeading}
          />
          <div className="ds-mt-40">
            <Deliverables
              items={content.deliverables.map(d => ({
                title: d.title,
                body: d.detail,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="ds-sec" data-size="offer" aria-labelledby="h-method">
        <div className="ds-wrap">
          <SectionHeader
            id="h-method"
            eyebrow="02 · Method"
            title={content.methodHeading}
            intro={content.methodIntro}
          />
          <div className="ds-mt-40">
            {content.method.length <= 4 ? (
              <Chain
                steps={content.method.map((m, i) => ({
                  k: numbered(i),
                  title: m.name,
                  body: m.detail,
                }))}
              />
            ) : (
              <Deliverables
                items={content.method.map(m => ({
                  title: m.name,
                  body: m.detail,
                }))}
              />
            )}
          </div>
        </div>
      </section>

      {extra}

      <section className="ds-sec" data-size="offer" aria-labelledby="h-time">
        <div className="ds-wrap">
          <SectionHeader id="h-time" eyebrow="03 · Timeline" title="Timeline" />
          {weights && <TimelineBar weights={weights} />}
          <div style={{ marginTop: weights ? 4 : 40 }}>
            <Chain
              rule={!weights}
              keyTone="muted"
              steps={content.timeline.map(t => ({
                k: t.when,
                title: t.phase,
                body: t.detail,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="ds-sec" data-size="offer" aria-labelledby="h-fit">
        <div className="ds-wrap">
          <SectionHeader id="h-fit" eyebrow="04 · Fit" title="Who it’s for" />
          <div className="ds-mt-40">
            <FitBoxes forYou={content.forYou} notFit={content.notForYou} />
          </div>
          {content.scopingNote && (
            <div style={{ marginTop: 24 }}>
              <NoteRow label="Scope">{content.scopingNote}</NoteRow>
            </div>
          )}
        </div>
      </section>

      <section className="ds-sec" data-size="offer" aria-labelledby="h-faq">
        <div
          className="ds-wrap"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 48,
          }}
        >
          <SectionHeader id="h-faq" eyebrow="05 · FAQ" title="FAQ" />
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <Faq
              items={content.faq.map(f => ({
                id: `faq-${slugify(f.q)}`,
                q: f.q,
                a: f.a,
              }))}
            />
          </div>
        </div>
      </section>

      {after}

      {/* closing CTA: no price, so the price stays at exactly one occurrence */}
      <section className="ds-final" aria-labelledby="h-start">
        <div className="ds-wrap">
          <h2 id="h-start" className="ds-display">
            Ready to start?
          </h2>
          <p>
            Book a 30-minute systems call and we’ll confirm scope and timing.
          </p>
          <div className="ds-actions">
            <BookingCta location={loc('cta')} />
            <EmailCta location={loc('cta')} />
          </div>
        </div>
      </section>
    </div>
  );
}
