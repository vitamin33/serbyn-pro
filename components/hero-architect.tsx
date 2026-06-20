import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getSiteMetrics } from '@/lib/site-metrics';
import { MetricStrip } from '@/components/lab/metric-strip';
import { StatusChip } from '@/components/lab/status-chip';

export function HeroArchitect() {
  const metrics = getSiteMetrics();

  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="container relative">
        <div className="max-w-3xl">
          {metrics.availability.open && (
            <StatusChip
              label={metrics.availability.label}
              variant="active"
              className="mb-6"
            />
          )}

          <p className="label-caps mb-4 text-muted-foreground">
            {'// AI Systems Architect'}
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            I architect{' '}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              production AI agent systems
            </span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            I design and ship multi-agent orchestration, LangGraph pipelines,
            and production AI infrastructure — from a 6-stage content platform
            to a trust-gated orchestration daemon running a fleet of agents
            across live projects.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={'/work' as any}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View My Work
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://calendly.com/serbyn-vitalii/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Book a Call
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <MetricStrip
          metrics={metrics.hero_metrics}
          className="mt-14 max-w-4xl"
        />
      </div>
    </section>
  );
}
