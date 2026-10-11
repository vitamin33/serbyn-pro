import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BookingCta, EmailCta, OutboundCta } from './cta';
import {
  Card,
  Eyebrow,
  SignoffStrip,
  SourceLabel,
  TextLink,
} from './primitives';

// Blocks for the selling pages and the home sections around them. Pages that
// sell stay still: nothing here animates beyond hover, press and focus.
// Server components (the CTAs inside are client islands).

/* ── Steps (operator protocol, method, timeline) ────────────────────────── */

export interface Step {
  /** "01", "Days 1–2", "Week 1" */
  k: string;
  title: string;
  body: ReactNode;
}

/** Steps joined by ▶ connectors (▼ when stacked on phones). */
export function Chain({
  steps,
  rule = true,
  keyTone,
  className,
}: {
  steps: Step[];
  rule?: boolean;
  keyTone?: 'muted';
  className?: string;
}) {
  return (
    <ol className={cn('ds-chain', className)} data-rule={rule ? '' : undefined}>
      {steps.map(s => (
        <li className="ds-step" key={s.k}>
          <span className="ds-step-k" data-tone={keyTone}>
            {s.k}
          </span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Proportional phase bar above a timeline chain (2 : 5 : 5 by default). */
export function TimelineBar({ weights = [2, 5, 5] }: { weights?: number[] }) {
  return (
    <div
      className="ds-timeline-bar"
      style={{ gridTemplateColumns: weights.map(w => `${w}fr`).join(' ') }}
      aria-hidden="true"
    >
      {weights.map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

/** Numbered deliverables grid ("What you get"). */
export function Deliverables({
  items,
}: {
  items: { title: string; body: ReactNode }[];
}) {
  return (
    <ol className="ds-deliv">
      {items.map((it, i) => (
        <li key={it.title}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Evergreen = for you, terracotta = not a fit. */
export function FitBoxes({
  forYou,
  notFit,
  forTitle = 'This is for you if…',
  notTitle = 'Not a fit if…',
}: {
  forYou: ReactNode[];
  notFit: ReactNode[];
  forTitle?: string;
  notTitle?: string;
}) {
  return (
    <div className="ds-fit">
      <div className="ds-fit-box">
        <Eyebrow>{forTitle}</Eyebrow>
        <ul>
          {forYou.map((t, i) => (
            <li key={i}>
              <span aria-hidden="true">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="ds-fit-box" data-kind="not">
        <Eyebrow>{notTitle}</Eyebrow>
        <ul>
          {notFit.map((t, i) => (
            <li key={i}>
              <span aria-hidden="true">✗</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** "Scope" label + paragraph between two hairlines. */
export function NoteRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="ds-note-row">
      <Eyebrow>{label}</Eyebrow>
      <p>{children}</p>
    </div>
  );
}

/* ── Price ──────────────────────────────────────────────────────────────── */

/**
 * The price, as it must appear: exactly once per offer page (T8). `price` is
 * the canonical string from lib/facts OFFERS ("$3,500", "from $2,000",
 * "from $4,000/mo"); "from" and "/mo" are set small and muted.
 */
export function Price({
  price,
  terms,
  size,
}: {
  price: string;
  terms: string;
  size?: 'hero' | 'card' | 'compact';
}) {
  const m = price.match(/^(from )?(.+?)(\/mo)?$/);
  const [, from, amount, per] = m ?? [null, undefined, price, undefined];
  return (
    <div className="ds-price" data-size={size}>
      <span className="ds-price-v ds-num">
        {from && <small>from </small>}
        {amount}
        {per && <small>/mo</small>}
      </span>
      <span className="ds-price-t">{terms}</span>
    </div>
  );
}

/** Offer hero card: price, booking, email, trust strip. */
export function PriceCard({
  price,
  terms,
  location,
  trust,
}: {
  price: string;
  terms: string;
  location: string;
  trust: readonly string[];
}) {
  return (
    <Card className="ds-price-card">
      <Price price={price} terms={terms} size="hero" />
      <BookingCta location={location} />
      <EmailCta location={location} />
      <SignoffStrip items={trust} cols={2} />
    </Card>
  );
}

/* ── Offers ─────────────────────────────────────────────────────────────── */

export interface OfferSummary {
  kind: string;
  name: string;
  price: string;
  terms: string;
  summary: string;
  href: string;
}

/** Home "Fixed-scope offers": three columns, the whole column is the link. */
export function OfferColumns({
  offers,
  footnote,
}: {
  offers: OfferSummary[];
  footnote?: ReactNode;
}) {
  return (
    <>
      <div className="ds-offers">
        {offers.map(o => (
          <a key={o.href} href={o.href} className="ds-offer">
            <Eyebrow size="sm">{o.kind}</Eyebrow>
            <h3>{o.name}</h3>
            <Price price={o.price} terms={o.terms} size="card" />
            <p>{o.summary}</p>
            <span className="ds-link">Learn more →</span>
          </a>
        ))}
      </div>
      {footnote && <p className="ds-also">{footnote}</p>}
    </>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */

const Chevron = () => (
  <svg
    className="ds-chev"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** <details> list: works without JavaScript, each question is linkable. */
export function Faq({
  items,
  openFirst = true,
}: {
  items: { id: string; q: string; a: ReactNode }[];
  openFirst?: boolean;
}) {
  return (
    <div className="ds-faq">
      {items.map((it, i) => (
        <details key={it.id} id={it.id} open={openFirst && i === 0}>
          <summary>
            {it.q}
            <span>
              <a
                className="ds-anchor"
                href={`#${it.id}`}
                aria-label="Link to this question"
              >
                #
              </a>
              <Chevron />
            </span>
          </summary>
          <p className="ds-ans">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Definition grid ("How engagements are run"). */
export function TermsList({
  items,
}: {
  items: { term: string; detail: ReactNode }[];
}) {
  return (
    <dl className="ds-terms">
      {items.map(it => (
        <div key={it.term}>
          <Eyebrow as="dt">{it.term}</Eyebrow>
          <dd>{it.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Cards ──────────────────────────────────────────────────────────────── */

/** A system I designed and built: name, kind, tagline, one labeled metric. */
export function SystemCard({
  name,
  kind,
  tagline,
  metric,
  links,
}: {
  name: string;
  kind: string;
  tagline: string;
  metric: { value: string; caption: string; label: string };
  links: {
    href: string;
    label: string;
    external?: boolean;
    location?: string;
  }[];
}) {
  return (
    <article className="ds-card ds-system" data-claim={metric.value}>
      <div className="ds-system-head">
        <h3>{name}</h3>
        <Eyebrow size="sm">{kind}</Eyebrow>
      </div>
      <p>{tagline}</p>
      <div className="ds-system-metric">
        <span className="ds-display ds-num" data-claim-value="">
          {metric.value}
        </span>
        <span>{metric.caption}</span>
        <SourceLabel marker="hook" label={metric.label} />
      </div>
      <div className="ds-system-links">
        {links.map(l =>
          l.external ? (
            <OutboundCta
              key={l.href}
              href={l.href}
              location={l.location ?? `systems_${name.toLowerCase()}`}
              className="ds-link"
            >
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                {l.label} ↗
              </span>
            </OutboundCta>
          ) : (
            <TextLink key={l.href} href={l.href} strong>
              {l.label} →
            </TextLink>
          )
        )}
      </div>
    </article>
  );
}

/** Three capability columns with a line icon ("Why this mixture is rare"). */
export function CapabilityColumns({
  items,
}: {
  items: { icon: ReactNode; title: string; body: ReactNode }[];
}) {
  return (
    <div className="ds-caps">
      {items.map(it => (
        <div className="ds-cap" key={it.title}>
          {it.icon}
          <h3 className="ds-h3">{it.title}</h3>
          <p>{it.body}</p>
        </div>
      ))}
    </div>
  );
}

/** Lucide-style line icons used by CapabilityColumns (stroke from CSS). */
export const CapIcon = {
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  gauge: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  ),
};

/** "Method, demonstrated": a field report with its headline number. */
export function FieldReportCard({
  href,
  kind,
  title,
  figure,
  figureTone,
  cta,
}: {
  href: string;
  kind: string;
  title: string;
  /** the post's number: "6", "~58 runs · ~93%" */
  figure: string;
  figureTone?: 'claim';
  cta: string;
}) {
  const big = figure.length <= 3;
  return (
    <a className="ds-card ds-report" href={href}>
      <div className="ds-report-head">
        <Eyebrow size="sm">{kind}</Eyebrow>
        {big ? (
          <span
            className="ds-display"
            style={{
              fontSize: 44,
              color: figureTone === 'claim' ? 'var(--claim-text)' : undefined,
            }}
          >
            {figure}
          </span>
        ) : (
          <span className="ds-mono" style={{ fontSize: 13 }}>
            {figure}
          </span>
        )}
      </div>
      <span className="ds-report-title">{title}</span>
      <span className="ds-link">{cta} →</span>
    </a>
  );
}

/** Closing call to action: big line, one paragraph, booking + email, strip. */
export function FinalCta({
  title,
  body,
  location,
  trust,
  id = 'final-cta',
}: {
  title: string;
  body: ReactNode;
  location: string;
  trust?: readonly string[];
  id?: string;
}) {
  return (
    <section className="ds-final" aria-labelledby={id}>
      <div className="ds-wrap">
        <h2 id={id} className="ds-display">
          {title}
        </h2>
        <p>{body}</p>
        <div className="ds-actions">
          <BookingCta location={location} />
          <EmailCta location={location} />
        </div>
        {trust && (
          <SignoffStrip items={trust} className="w-full max-w-[760px]" />
        )}
      </div>
    </section>
  );
}

/**
 * Proof-of-method preview card. Render it only when the artifact exists
 * (sample PDF on disk, Loom URL set); absent means invisible, never a
 * placeholder.
 */
export function ProofOfMethodCard({
  kind,
  title,
  body,
  href,
  cta,
}: {
  kind: 'report' | 'video';
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <a
      className="ds-card ds-pom"
      href={href}
      style={{ textDecoration: 'none', color: 'var(--fg)' }}
    >
      {kind === 'report' ? (
        <div className="ds-pom-thumb" data-kind="report" aria-hidden="true">
          <span style={{ height: 6, width: '50%', background: 'var(--fg)' }} />
          <span
            style={{
              height: 4,
              width: '80%',
              background: 'var(--line-strong)',
            }}
          />
          <span
            style={{
              height: 4,
              width: '70%',
              background: 'var(--line-strong)',
            }}
          />
          <span style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            <span
              style={{ height: 12, width: 16, background: 'var(--tier-d)' }}
            />
            <span
              style={{ height: 12, width: 16, background: 'var(--claim)' }}
            />
            <span
              style={{
                height: 12,
                width: 16,
                background: 'var(--line-strong)',
              }}
            />
          </span>
        </div>
      ) : (
        <div className="ds-pom-thumb" data-kind="video" aria-hidden="true">
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1.5px solid #ece8df',
              display: 'grid',
              placeItems: 'center',
              color: '#ece8df',
              fontSize: 14,
            }}
          >
            ▶
          </span>
        </div>
      )}
      <span className="ds-pom-title">{title}</span>
      <p>{body}</p>
      <span className="ds-link" style={{ fontWeight: 600, fontSize: 14 }}>
        {cta}
      </span>
    </a>
  );
}
