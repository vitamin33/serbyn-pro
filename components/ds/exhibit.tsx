import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Chip, Eyebrow, SignoffStrip, Signature, Verdict } from './primitives';

// Exhibit frame and static data displays. "Every number is an exhibit": big
// value, unit in mono, bar on a quiet track, a direction chip, and a source
// label that is part of the design. Server components.

export type Series = 'claim' | 'baseline' | 'accent';
export const SERIES_VAR: Record<Series, string> = {
  claim: 'var(--claim)',
  baseline: 'var(--baseline)',
  accent: 'var(--accent)',
};

/**
 * The frame every exhibit shares: eyebrow + topic chip, title, meta line,
 * body, verdict, source, sign-off strip, signature.
 */
export function ExhibitFrame({
  eyebrow,
  topic,
  title,
  meta,
  headAside,
  children,
  verdict,
  source,
  strip,
  signature = true,
  size,
  className,
  ...rest
}: {
  eyebrow: ReactNode;
  topic?: ReactNode;
  title?: ReactNode;
  meta?: ReactNode;
  headAside?: ReactNode;
  children: ReactNode;
  verdict?: ReactNode;
  source?: ReactNode;
  strip?: readonly ReactNode[];
  signature?: boolean;
  size?: 'lg';
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <figure
      className={cn('ds-card ds-exhibit', className)}
      data-size={size}
      {...rest}
    >
      <div className="ds-exhibit-head">
        <div>
          <Eyebrow tone="fg">{eyebrow}</Eyebrow>
          {topic && <Chip variant="claim">{topic}</Chip>}
        </div>
        {headAside}
      </div>
      {title && (
        <div>
          <h3 className="ds-exhibit-title">{title}</h3>
          {meta && <p className="ds-exhibit-meta">{meta}</p>}
        </div>
      )}
      {children}
      {verdict && <Verdict>{verdict}</Verdict>}
      {source && <figcaption className="ds-src">{source}</figcaption>}
      {strip && <SignoffStrip items={strip} />}
      {signature && <Signature />}
    </figure>
  );
}

/** The inset "In the post · 0 of 40 · Lower is better" panel. */
export function ExhibitNumber({
  label,
  value,
  unit,
  direction,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  direction?: ReactNode;
}) {
  return (
    <div className="ds-exhibit-num">
      <div>
        <Eyebrow size="xs">{label}</Eyebrow>
        <div className="ds-display ds-num">
          {value}
          {unit && <small> {unit}</small>}
        </div>
      </div>
      {direction && <Chip>{direction}</Chip>}
    </div>
  );
}

export function Legend({
  items,
}: {
  items: { label: ReactNode; series: Series }[];
}) {
  return (
    <ul className="ds-legend">
      {items.map((it, i) => (
        <li key={i}>
          <i style={{ background: SERIES_VAR[it.series] }} aria-hidden="true" />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

export function Axis({
  ticks,
  labelWidth = 148,
  valueWidth = 64,
}: {
  ticks: readonly ReactNode[];
  labelWidth?: number;
  valueWidth?: number;
}) {
  return (
    <div
      className="ds-bar-row"
      style={
        {
          '--label-w': `${labelWidth}px`,
          '--value-w': `${valueWidth}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span />
      <div className="ds-axis">
        {ticks.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
      <span />
    </div>
  );
}

/* ── Column chart (D.1 chart style) ─────────────────────────────────────── */

export interface Column {
  /** 0..1 of the axis */
  value: number;
  /** interval as fractions, from wilson() */
  ci?: [number, number];
  series: Series;
  valueLabel: string;
  countLabel?: string;
}

export function ColumnChart({
  columns,
  groups,
  ariaLabel,
  yTicks = ['0%', '50%', '100%'],
}: {
  columns: Column[];
  /** one label per pair of columns, centred under it */
  groups?: ReactNode[];
  ariaLabel: string;
  yTicks?: string[];
}) {
  // columns come in pairs (A and B of one metric); each pair gets an equal
  // share of the plot, columns are 34% of that share with a 4% gap
  const n = columns.length;
  const share = 100 / Math.ceil(n / 2);
  const width = share * 0.34;
  const xOf = (i: number) =>
    Math.floor(i / 2) * share + share * 0.16 + (i % 2) * (width + share * 0.04);
  return (
    <div className="ds-cols" role="img" aria-label={ariaLabel}>
      <div className="ds-cols-plot">
        {yTicks.map((t, i) => (
          <span
            key={t}
            className="ds-ytick"
            style={{ bottom: `${(i / (yTicks.length - 1)) * 100}%` }}
          >
            {t}
          </span>
        ))}
        {columns.map((c, i) => {
          const left = xOf(i);
          const mid = left + width / 2;
          const top = c.ci ? c.ci[1] : c.value;
          return (
            <span key={i}>
              <span
                className="ds-col"
                style={
                  {
                    left: `${left}%`,
                    width: `${width}%`,
                    height: `${Math.max(c.value * 100, 0.8)}%`,
                    '--fill': SERIES_VAR[c.series],
                  } as React.CSSProperties
                }
              />
              {c.ci && (
                <span
                  className="ds-col-ci"
                  style={{
                    left: `${mid}%`,
                    bottom: `${c.ci[0] * 100}%`,
                    height: `${(c.ci[1] - c.ci[0]) * 100}%`,
                  }}
                />
              )}
              <span
                className="ds-col-val"
                style={{ left: `${mid}%`, bottom: `calc(${top * 100}% + 7px)` }}
              >
                {c.valueLabel}
              </span>
            </span>
          );
        })}
      </div>
      <div className="ds-cols-foot">
        {columns.map((c, i) =>
          c.countLabel ? (
            <span
              key={i}
              className="ds-mono ds-num"
              style={{
                left: `${xOf(i) + width / 2}%`,
                top: 6,
                fontSize: 10.5,
                color: 'var(--muted)',
              }}
            >
              {c.countLabel}
            </span>
          ) : null
        )}
        {groups?.map((g, i) => (
          <span
            key={`g${i}`}
            style={{
              left: `${(xOf(i * 2) + xOf(i * 2 + 1) + width) / 2}%`,
              top: 28,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Waffle (D.4) ───────────────────────────────────────────────────────── */

export function Waffle({
  total,
  on,
  cols = 20,
  ariaLabel,
}: {
  total: number;
  on: number;
  cols?: number;
  ariaLabel: string;
}) {
  return (
    <div
      className="ds-waffle"
      style={{ '--cols': cols } as React.CSSProperties}
      role="img"
      aria-label={ariaLabel}
    >
      {Array.from({ length: total }, (_, i) => (
        <i key={i} data-on={i < on ? undefined : 'false'} />
      ))}
    </div>
  );
}

/* ── Stat strip (post) ──────────────────────────────────────────────────── */

export function StatStrip({
  items,
  className,
}: {
  items: { value: ReactNode; label: ReactNode; warn?: boolean }[];
  className?: string;
}) {
  return (
    <dl
      className={cn('ds-stats', className)}
      style={{ '--cols': Math.min(items.length, 4) } as React.CSSProperties}
    >
      {items.map((it, i) => (
        <div key={i}>
          <dt>{it.label}</dt>
          <dd className="ds-num" data-tone={it.warn ? 'warn' : undefined}>
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Data table ─────────────────────────────────────────────────────────── */

export type Cell =
  | ReactNode
  | { v: ReactNode; num?: boolean; tone?: 'claim' | 'accent' };

const isCellObj = (
  c: Cell
): c is { v: ReactNode; num?: boolean; tone?: 'claim' | 'accent' } =>
  typeof c === 'object' && c !== null && 'v' in (c as object);

/** Mono caps header over a fg rule, hairline rows. Scrolls in its own frame. */
export function DataTable({
  head,
  rows,
  caption,
  compact,
  rowHeaders,
}: {
  head: ReactNode[];
  rows: Cell[][];
  caption?: ReactNode;
  compact?: boolean;
  /** first cell of each row is a row header (spec sheets) */
  rowHeaders?: boolean;
}) {
  return (
    <div className="ds-table-wrap">
      <table
        className="ds-table"
        data-density={compact ? 'compact' : undefined}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => {
                const o = isCellObj(c) ? c : { v: c };
                if (rowHeaders && ci === 0)
                  return (
                    <th key={ci} scope="row" className="ds-eyebrow">
                      {o.v}
                    </th>
                  );
                return (
                  <td
                    key={ci}
                    className={o.num ? 'ds-num' : undefined}
                    data-tone={o.tone}
                  >
                    {o.v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Mini exhibit (writing index thumbnails) ────────────────────────────── */

export type MiniExhibitData =
  | {
      kind: 'bars';
      rows: { value: number; max: number; label: string; series: Series }[];
      caption: string;
    }
  | {
      kind: 'cost';
      value: string;
      caption: string;
      bars: { fraction: number; series: Series }[];
    }
  | { kind: 'served'; requested: string; served: string; caption?: string }
  | { kind: 'split'; a: string; b: string; caption: string }
  | {
      kind: 'ledger';
      value: string;
      sub: string;
      fraction: number;
      caption: string;
    }
  | { kind: 'num'; value: string; caption: string; tone?: 'claim' | 'fg' };

export function MiniExhibit({
  data,
  ariaLabel,
}: {
  data: MiniExhibitData;
  ariaLabel?: string;
}) {
  const body = (() => {
    switch (data.kind) {
      case 'bars':
        return (
          <>
            {data.rows.map((r, i) => (
              <span className="ds-mini-bar" key={i}>
                <span
                  className="ds-mb"
                  style={{
                    width: r.value === 0 ? 3 : `${(r.value / r.max) * 100}%`,
                    background: SERIES_VAR[r.series],
                    animationDelay: `calc(${i} * var(--stagger))`,
                  }}
                />
                <span
                  style={
                    r.series === 'accent'
                      ? { color: 'var(--accent)', fontWeight: 500 }
                      : undefined
                  }
                >
                  {r.label}
                </span>
              </span>
            ))}
            <span className="ds-mini-cap">{data.caption}</span>
          </>
        );
      case 'cost':
        return (
          <>
            <span className="ds-mini-num">
              <b style={{ color: 'var(--claim-text)' }}>{data.value}</b>
              <span className="ds-mini-cap">{data.caption}</span>
            </span>
            {data.bars.map((b, i) => (
              <span
                key={i}
                className="ds-mb"
                style={{
                  width: `${b.fraction * 100}%`,
                  background: SERIES_VAR[b.series],
                }}
              />
            ))}
          </>
        );
      case 'served':
        return (
          <>
            <span className="ds-mini-kv">
              <span>requested</span>
              <span>{data.requested}</span>
            </span>
            <span className="ds-mini-kv" data-sep="">
              <span>served</span>
              <span style={{ color: 'var(--claim-text)', fontWeight: 500 }}>
                {data.served}
              </span>
            </span>
            {data.caption && (
              <span className="ds-mini-cap">{data.caption}</span>
            )}
          </>
        );
      case 'split':
        return (
          <>
            <span className="ds-mini-num">
              <b style={{ color: 'var(--baseline)' }}>{data.a}</b>
              <span
                className="ds-mono"
                style={{ fontSize: 12, color: 'var(--muted)' }}
              >
                vs
              </span>
              <b style={{ color: 'var(--claim-text)' }}>{data.b}</b>
            </span>
            <span className="ds-mini-cap">{data.caption}</span>
          </>
        );
      case 'ledger':
        return (
          <>
            <span className="ds-mini-num">
              <b>{data.value}</b>
              <span className="ds-mini-cap">{data.sub}</span>
            </span>
            <span
              style={{
                display: 'block',
                height: 8,
                background: 'var(--line)',
                borderRadius: 1,
                position: 'relative',
              }}
            >
              <span
                className="ds-mb"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: `${data.fraction * 100}%`,
                  background: 'var(--accent)',
                }}
              />
            </span>
            <span
              className="ds-mini-cap"
              style={{ color: 'var(--claim-text)' }}
            >
              {data.caption}
            </span>
          </>
        );
      case 'num':
        return (
          <span className="ds-mini-num" data-size="lg">
            <b
              style={{
                color: data.tone === 'fg' ? undefined : 'var(--claim-text)',
              }}
            >
              {data.value}
            </b>
            <span className="ds-mini-cap">{data.caption}</span>
          </span>
        );
    }
  })();
  return (
    <span
      className="ds-mini"
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    >
      {body}
    </span>
  );
}
