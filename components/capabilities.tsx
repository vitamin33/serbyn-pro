import { Bot, Gauge, Server } from 'lucide-react';

const capabilities = [
  {
    icon: Bot,
    title: 'Multi-Agent Orchestration',
    description:
      'I design systems where AI agents collaborate autonomously — with trust layers, policy gates, and human escalation built in. Ascend runs 19 agents across 4 production projects.',
    deliverables: [
      'Trust-gated execution (L0-L4) with auto-demotion on budget limits',
      'LangGraph pipelines with observable state transitions',
      'Custom MCP servers (Code-RAG with ChromaDB + embeddings)',
      'Multi-agent dev pipelines with gate systems (70% intake kill rate)',
    ],
  },
  {
    icon: Gauge,
    title: 'MLOps & AI Reliability',
    description:
      'Production AI needs quality gates and observability. I build MLflow-tracked pipelines, Thompson Sampling optimization, and full Prometheus/Grafana/Jaeger stacks.',
    deliverables: [
      'MLflow experiment tracking and model registry',
      'Thompson Sampling for variant optimization (150+ personas)',
      'Prometheus + Grafana dashboards + Jaeger distributed tracing',
      'Signal-gated feature pipelines — 5 quality gates before production',
    ],
  },
  {
    icon: Server,
    title: 'FinOps & Infrastructure',
    description:
      'AI costs compound fast. I build multi-model routing, Redis caching layers, and per-service cost tracking. Reduced RPC costs 80-90% on a Web3 platform.',
    deliverables: [
      'Multi-model routing (GPT-4o for hooks, GPT-3.5 for bodies — 70% savings)',
      'Redis caching + bot detection (26K→3K daily RPC calls)',
      'Docker microservice orchestration (24 services in Crest)',
      'RAG pipelines with Qdrant, pgvector, hybrid retrieval',
    ],
  },
];

export function Capabilities() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-12">
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            {'// What I do'}
          </p>
          <h2 className="text-3xl font-bold tracking-tight">Capabilities</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {capabilities.map(cap => (
            <div key={cap.title} className="border-l-2 border-primary/40 pl-6">
              <cap.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">{cap.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {cap.description}
              </p>
              <ul className="space-y-1.5">
                {cap.deliverables.map(d => (
                  <li key={d} className="text-sm text-muted-foreground">
                    <span className="mr-2 text-primary">-</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
