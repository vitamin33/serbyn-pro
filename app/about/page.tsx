import { pageMetadata } from '@/lib/seo';
import { Chain, Eyebrow, SectionHeader, TextLink } from '@/components/ds';
import { BookingCta } from '@/components/ds/cta';

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
      '13 years of production systems taught me: SLOs, evaluation gates, rollback plans, and observability matter more than the model you choose.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ padding: '80px 0 120px' }}>
      <div className="ds-wrap">
        <div className="ds-stack" style={{ gap: 20 }}>
          <Eyebrow>About</Eyebrow>
          <h1 className="ds-h1" data-size="index">
            Vitalii Serbyn
          </h1>
        </div>

        <div className="ds-about-flow">
          <p className="ds-lede" style={{ maxWidth: 'none' }}>
            I&apos;ve been shipping production systems for 13+ years. Started
            building Android apps at EPAM and GlobalLogic — one of them
            (Magisto) hit 100M+ users and won a Google Play award. Led teams of
            2-6 engineers, owned release trains, and learned the production
            discipline that I now apply to AI systems.
          </p>
          <p>
            Since 2024, I&apos;ve designed and shipped production AI systems
            through my UK company (Easelect LTD). Ascend is an orchestration
            daemon with 27 agents (18 mature) and 1,178 automated tests,
            managing code review, deployments, monitoring, and client reports —
            all trust-gated with L0-L4 policy enforcement. Crest is an AI
            content platform with a 6-stage LangGraph pipeline, Thompson
            Sampling for variant optimization, multi-model routing, and
            multi-platform publishing — deployed live with 91+ tests.
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

        <section className="ds-mt-56" aria-labelledby="h-principles">
          <SectionHeader
            id="h-principles"
            eyebrow="Principles"
            title="Design principles"
          />
          <div className="ds-mt-40">
            <Chain
              steps={principles.map((p, i) => ({
                k: String(i + 1).padStart(2, '0'),
                title: p.title,
                body: p.description,
              }))}
            />
          </div>
        </section>

        {/* booking is primary; the résumé is a text link (D1) */}
        <section
          className="ds-actions ds-mt-56"
          style={{ alignItems: 'center', gap: 24 }}
        >
          <BookingCta location="about" label="Book a Call" />
          <TextLink href="/resume" className="ds-mono">
            <span style={{ fontSize: 13 }}>View résumé →</span>
          </TextLink>
        </section>
      </div>
    </div>
  );
}
