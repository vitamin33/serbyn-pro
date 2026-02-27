const groups = [
  {
    label: 'Agent & LLM',
    items: [
      'LangChain',
      'LangGraph',
      'OpenAI API',
      'Claude API',
      'Ollama',
      'vLLM',
      'RAG',
      'BLIP-2',
    ],
  },
  {
    label: 'MLOps & Platform',
    items: [
      'MLflow',
      'SLO-gated CI',
      'Thompson Sampling',
      'Experiment Tracking',
      'YAML Policies',
      'Canary Deploy',
    ],
  },
  {
    label: 'Backend & Data',
    items: [
      'Python',
      'FastAPI',
      'Celery',
      'PostgreSQL',
      'Redis',
      'Qdrant',
      'SQLite',
      'aiohttp',
    ],
  },
  {
    label: 'Cloud & Infra',
    items: [
      'Kubernetes',
      'Docker',
      'AWS ECS/EKS',
      'GCP/GKE',
      'GitHub Actions',
      'Terraform',
      'Prometheus',
      'Grafana',
    ],
  },
];

export function TechStack() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-12">
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            {'// Tools I use'}
          </p>
          <h2 className="text-3xl font-bold tracking-tight">Tech stack</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(group => (
            <div key={group.label}>
              <h3 className="mb-3 font-mono text-sm font-medium text-muted-foreground">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(item => (
                  <span
                    key={item}
                    className="rounded bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
