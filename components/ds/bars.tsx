'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SERIES_VAR, type Series } from './exhibit';
import { useReveal } from './motion';
import { pct, wilson } from './stats';

// Horizontal bars on a quiet track, with Wilson 95% whiskers when the datum is
// a count out of n. Motion (board "Motion lab" 03):
//   interval: bars at 35% contrast, whiskers span the whole axis ("we don't
//             know"), a scan sweeps the plot, the whiskers contract to what n
//             supports (80ms stagger), bars reach full contrast, labels land.
//   grow:     bars grow in rank order, 50ms stagger.
//   none:     static (offer pages, tables).
// The settled state is what the server renders.

export interface BarDatum {
  label: ReactNode;
  /** second line under the label, mono muted ("1.94x cost · used 38/40") */
  sub?: ReactNode;
  series: Series;
  /** count out of n: draws the bar at k/n and a Wilson interval */
  k?: number;
  n?: number;
  /** or a plain fraction of the axis, 0..1 (no interval) */
  fraction?: number;
  /** right-hand value text ("22 / 40") */
  display: ReactNode;
  tone?: 'accent' | 'claim';
  /** value printed inside the track after the fill instead of on the right */
  inline?: boolean;
}

export function BarChart({
  data,
  motion = 'none',
  labelWidth = 148,
  valueWidth = 64,
  trackHeight,
  axis,
  note,
  replayKey,
  ariaLabel,
  className,
}: {
  data: BarDatum[];
  motion?: 'none' | 'grow' | 'interval';
  labelWidth?: number;
  valueWidth?: number;
  trackHeight?: number;
  axis?: readonly ReactNode[];
  note?: ReactNode;
  /** change to restart the sequence (KeyNumber replay) */
  replayKey?: number;
  ariaLabel?: string;
  className?: string;
}) {
  const { ref, revealProps } = useReveal<HTMLDivElement>(0.4);
  const vars = {
    '--label-w': `${labelWidth}px`,
    '--value-w': `${valueWidth}px`,
    ...(trackHeight ? { '--track-h': `${trackHeight}px` } : {}),
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      key={replayKey}
      className={cn('ds-bars', className)}
      data-motion={motion === 'none' ? undefined : motion}
      style={vars}
      role={ariaLabel ? 'group' : undefined}
      aria-label={ariaLabel}
      {...(motion === 'none' ? {} : revealProps)}
    >
      {data.map((d, i) => {
        const frac = d.fraction ?? (d.k !== undefined && d.n ? d.k / d.n : 0);
        const ci = d.k !== undefined && d.n ? wilson(d.k, d.n) : undefined;
        const zero = frac === 0;
        return (
          <div
            className="ds-bar-row"
            key={i}
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className="ds-bar-label">
              {d.label}
              {d.sub && <small>{d.sub}</small>}
            </span>
            <div className="ds-track">
              <span
                className="ds-fill"
                data-zero={zero ? '' : undefined}
                style={
                  {
                    width: zero ? 3 : pct(frac),
                    '--fill': SERIES_VAR[d.series],
                  } as React.CSSProperties
                }
              />
              {ci && (
                <>
                  <span
                    className="ds-ci"
                    style={
                      {
                        '--lo': ci[0],
                        '--w': ci[1] - ci[0],
                        '--d': `${700 + i * 80}ms`,
                      } as React.CSSProperties
                    }
                  />
                  <span
                    className="ds-ci-cap"
                    data-end="lo"
                    style={
                      {
                        '--lo': ci[0],
                        '--d': `${700 + i * 80}ms`,
                      } as React.CSSProperties
                    }
                  />
                  <span
                    className="ds-ci-cap"
                    data-end="hi"
                    style={
                      {
                        '--hi': ci[1],
                        '--d': `${700 + i * 80}ms`,
                      } as React.CSSProperties
                    }
                  />
                </>
              )}
              {d.inline && (
                <span
                  className="ds-fill-label"
                  style={
                    frac > 0.85
                      ? { right: 8, color: '#1c1b19', fontWeight: 500 }
                      : { left: `calc(${pct(frac)} + 8px)` }
                  }
                >
                  {d.display}
                </span>
              )}
            </div>
            {d.inline ? (
              <span />
            ) : (
              <span className="ds-bar-value ds-late" data-tone={d.tone}>
                {d.display}
              </span>
            )}
          </div>
        );
      })}
      {axis && (
        <div className="ds-bar-row" aria-hidden="true">
          <span />
          <div className="ds-axis">
            {axis.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
          <span />
        </div>
      )}
      {motion === 'interval' && (
        <div className="ds-scan-x" aria-hidden="true" />
      )}
      {note && <p className="ds-note ds-late">{note}</p>}
    </div>
  );
}
