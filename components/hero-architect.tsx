import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

export function HeroArchitect() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted-foreground)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="container relative">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-sm tracking-wide text-muted-foreground">
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
            and production AI infrastructure. 6 AI systems shipped in 18 months
            — from an AI content platform with a 6-stage LangGraph pipeline to a
            trust-gated orchestration daemon with 19 agents managing 4 live
            projects.
          </p>

          {/* Trust indicators */}
          <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-muted-foreground">
            <span>Easelect LTD (UK)</span>
            <span className="hidden text-border sm:inline" aria-hidden="true">
              /
            </span>
            <span>12+ years production</span>
            <span className="hidden text-border sm:inline" aria-hidden="true">
              /
            </span>
            <span>6 AI systems shipped</span>
          </div>

          {/* CTAs */}
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
      </div>
    </section>
  );
}
