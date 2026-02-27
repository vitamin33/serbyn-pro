import Link from 'next/link';
import { ExternalLink, Download } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata.about();

const principles = [
  {
    title: 'Trust layers',
    description:
      'Every agent action flows through a trust level (L0-L4). No autonomous system should operate without explicit permission boundaries and escalation paths.',
  },
  {
    title: 'FinOps from day one',
    description:
      'AI costs compound fast. Token budgets, multi-model routing, and per-tenant cost dashboards are first-class infrastructure — not afterthoughts.',
  },
  {
    title: 'Production discipline',
    description:
      '12 years of production systems taught me: SLOs, evaluation gates, rollback plans, and observability matter more than the model you choose.',
  },
];

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <p className="mb-2 font-mono text-sm text-muted-foreground">
          {'// About'}
        </p>
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Vitalii Serbyn
        </h1>

        {/* Narrative */}
        <div className="mb-16 space-y-6 text-muted-foreground">
          <p className="text-lg">
            I&apos;ve been shipping production systems for 12+ years. Started
            building Android apps at EPAM and GlobalLogic — one of them
            (Magisto) hit 100M+ users and won a Google Play award. Led teams of
            2-6 engineers, owned release trains, and learned the production
            discipline that I now apply to AI systems.
          </p>
          <p>
            Since 2024, I&apos;ve designed and shipped 6 production AI systems
            through my UK company (Easelect LTD). Ascend is an orchestration
            daemon with 19 agents managing 4 live projects — code review,
            deployments, monitoring, and client reports, all trust-gated with
            L0-L4 policy enforcement. Crest is an AI content platform with a
            6-stage LangGraph pipeline, Thompson Sampling for variant
            optimization, multi-model routing, and multi-platform publishing —
            deployed live with 91+ tests.
          </p>
          <p>
            On the client side, I solo-architected a Web3 token launchpad on
            Solana (Next.js + NestJS + FastAPI, real-time blockchain indexing,
            80-90% RPC cost reduction through Redis caching and bot detection)
            and a healthcare platform serving 10k+ users across 4 Flutter apps.
            PersonSearch is a 30-agent autonomous OSINT platform with dynamic
            sub-agent spawning. Forge UI is a 6-agent development system with 38
            MCP tools for the full Flutter dev lifecycle.
          </p>
          <p>
            Across all projects, I build the same infrastructure: multi-model
            routing by task complexity (GPT-4o for critical decisions, GPT-3.5
            for bulk work — 70% cost reduction), full observability with
            Prometheus/Grafana/Jaeger/Sentry, and cost controls from day one.
            Every system has health checks, circuit breakers, and graceful
            degradation built in.
          </p>
          <p>
            I also build my own AI development tooling. Every project runs on a
            custom MCP (Model Context Protocol) stack — I built semantic
            Code-RAG servers using ChromaDB and Sentence-Transformers for
            codebase-wide pattern search before writing new code. My development
            workflow uses multi-agent pipelines: a 9-agent system handles intake
            → research → spec → implementation → QA → review, with a gate system
            that kills 70% of feature ideas at signal validation before any code
            is written. Across Assisterr, 3 parallel agents coordinate across 8+
            repositories using shared memory with strict namespace isolation. I
            don&apos;t just build AI systems — I use AI agents to build them.
          </p>
          <p>
            I work remotely from Kyiv. Easelect LTD is structured for
            international contracts (UK-registered, W-8BEN-E for US clients).
          </p>
        </div>

        {/* Principles */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Design principles
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {principles.map(p => (
              <div
                key={p.title}
                className="rounded-lg border border-border bg-card p-6"
              >
                <h3 className="mb-2 font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="flex flex-wrap gap-4">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Download Resume
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
        </section>
      </div>
    </div>
  );
}
