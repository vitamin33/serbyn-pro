import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    slug: 'ascend-autonomous-agents',
    type: 'Orchestration',
    title: 'Ascend: Agent Orchestration Daemon',
    description:
      'Self-hosted orchestration daemon with trust-gated execution (L0-L4), policy engine, and audit logging. 19 agents managing 4 live projects — code review, deployments, monitoring, client reports, all automated.',
    metrics: [
      '19 agents (12 mature)',
      'Trust levels L0-L4',
      'Manages 4 live projects',
    ],
    tech: ['Python', 'aiohttp', 'SQLite', 'YAML policies'],
  },
  {
    slug: 'crest-signal-driven-platform',
    type: 'AI Platform',
    title: 'Crest: AI Content Platform',
    description:
      '6-stage LangGraph AI pipeline with Thompson Sampling for variant optimization, multi-model routing (GPT-4o/3.5), and multi-platform publishing. Live production deployment with 91+ tests.',
    metrics: [
      '6-stage LangGraph pipeline',
      'GPT-4o/3.5 routing',
      'Thompson Sampling A/B',
    ],
    tech: ['Python', 'FastAPI', 'LangGraph', 'Docker', 'MLflow'],
  },
  {
    slug: 'enterprise-multi-project',
    type: 'Client Work',
    title: 'Enterprise: Healthcare, Web3, and AI',
    description:
      'Healthcare (Flutter/Firebase, 10k+ users), Web3 token launchpad (Solana, real-time blockchain indexing, 80-90% RPC cost reduction), and AI content platform across 9+ repositories.',
    metrics: ['3 production domains', '9+ repositories', '80-90% RPC cost cut'],
    tech: ['Flutter', 'NestJS', 'Solana', 'AWS ECS', 'Redis'],
  },
];

export function FeaturedWork() {
  return (
    <section className="section">
      <div className="container">
        <div className="mb-12">
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            {'// Selected work'}
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Systems I&apos;ve shipped
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map(project => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}` as any}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
                {project.type}
              </span>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                {project.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {/* Metrics */}
              <ul className="mb-4 space-y-1">
                {project.metrics.map(metric => (
                  <li
                    key={metric}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    <span className="mr-2 text-primary">-</span>
                    {metric}
                  </li>
                ))}
              </ul>

              {/* Tech badges */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.tech.map(t => (
                  <span
                    key={t}
                    className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read case study
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
