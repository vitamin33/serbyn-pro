'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Evidence threads (board "Motion lab" 02): a bracket drawn from a number to
// the source label that earns it. Decorative only: the label is always visible
// text, the SVG is aria-hidden. getBoundingClientRect of both ends, one path
// with pathLength="1", recomputed on resize. No library.

export interface Thread {
  d: string;
  x: number;
  y: number;
  delay: number;
  id: number;
}

let counter = 0;

/** A rounded bracket that leaves the number to the left and enters the label. */
export function bracketPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  minX: number
) {
  const bx = Math.max(Math.min(x1, x2) - 12, minX);
  const r = Math.max(
    2,
    Math.min(6, x1 - bx - 2, x2 - bx - 2, Math.abs(y2 - y1) / 2)
  );
  return `M ${x1} ${y1} H ${bx + r} Q ${bx} ${y1} ${bx} ${y1 + r} V ${y2 - r} Q ${bx} ${y2} ${bx + r} ${y2} H ${x2}`;
}

/**
 * `measure(i)` returns the two elements for thread i. `show(ids)` draws them
 * (staggered when several), `clear()` removes them.
 */
export function useThreads<H extends HTMLElement>(
  measure: (i: number) => { from: Element | null; to: Element | null } | null,
  opts: { minX?: number; fromY?: number } = {}
) {
  const hostRef = useRef<H | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const active = useRef<number[]>([]);

  const compute = useCallback(
    (ids: number[], stagger: number) => {
      const host = hostRef.current;
      if (!host) return [];
      const b = host.getBoundingClientRect();
      const out: Thread[] = [];
      ids.forEach((i, k) => {
        const m = measure(i);
        if (!m?.from || !m.to) return;
        const n = m.from.getBoundingClientRect();
        const s = m.to.getBoundingClientRect();
        const x1 = n.left - b.left - 8;
        const y1 = n.top - b.top + n.height * (opts.fromY ?? 0.5);
        const x2 = s.left - b.left - 4;
        const y2 = s.top - b.top + Math.min(9, s.height / 2);
        out.push({
          d: bracketPath(x1, y1, x2, y2, opts.minX ?? -12),
          x: x1,
          y: y1,
          delay: k * stagger,
          id: ++counter,
        });
      });
      return out;
    },
    [measure, opts.minX, opts.fromY]
  );

  const show = useCallback(
    (ids: number[], stagger = 120) => {
      active.current = ids;
      setThreads(compute(ids, stagger));
    },
    [compute]
  );
  const clear = useCallback(() => {
    active.current = [];
    setThreads([]);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (active.current.length) setThreads(compute(active.current, 0));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [compute]);

  return { hostRef, threads, show, clear };
}

export function ThreadLayer({ threads }: { threads: Thread[] }) {
  if (!threads.length) return null;
  return (
    <svg className="ds-threads" aria-hidden="true">
      {threads.map(t => (
        <g
          key={t.id}
          style={{ '--delay': `${t.delay}ms` } as React.CSSProperties}
        >
          <path className="ds-thr" d={t.d} pathLength={1} />
          <circle
            className="ds-thr-dot"
            cx={t.x}
            cy={t.y}
            r={3}
            style={{ transformOrigin: `${t.x}px ${t.y}px` }}
          />
        </g>
      ))}
    </svg>
  );
}
