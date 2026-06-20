'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { HeroMetric } from '@/lib/site-metrics';

function parseNum(
  value: string
): { prefix: string; num: number; suffix: string } | null {
  const m = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!m) return null;
  const num = parseInt(m[2].replace(/,/g, ''), 10);
  if (Number.isNaN(num)) return null;
  return { prefix: m[1], num, suffix: m[3] };
}

function MetricValue({ value }: { value: string }) {
  const parsed = parseNum(value);
  const [display, setDisplay] = useState(
    parsed ? `${parsed.prefix}0${parsed.suffix}` : value
  );
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 900);
          const cur = Math.round(parsed.num * (1 - Math.pow(1 - p, 3)));
          setDisplay(
            parsed.prefix + cur.toLocaleString('en-US') + parsed.suffix
          );
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -20% 0px' }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [parsed]);

  return (
    <p ref={ref} className="metric-lg mt-1 text-foreground">
      {display}
    </p>
  );
}

export function MetricStrip({
  metrics,
  className,
}: {
  metrics: HeroMetric[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4',
        className
      )}
    >
      {metrics.map(metric => (
        <div key={metric.label} className="bg-card p-4">
          <p className="label-caps text-muted-foreground">{metric.label}</p>
          <MetricValue value={metric.value} />
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {metric.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
