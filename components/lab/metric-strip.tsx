import { cn } from '@/lib/utils';
import type { HeroMetric } from '@/lib/site-metrics';

// The home-hero "live system metrics" strip. Static render (count-up animation
// is layered in P2 with motion). Data from data/site/metrics.json.
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
          <p className="metric-lg mt-1 text-foreground">{metric.value}</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {metric.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
