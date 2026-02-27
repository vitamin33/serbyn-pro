import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata.blog();

export default function BlogPage() {
  return (
    <div className="py-16">
      <div className="container max-w-2xl">
        <p className="mb-2 font-mono text-sm text-muted-foreground">
          {'// Blog'}
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Technical writing
        </h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Writing about agent orchestration, trust layers, cost engineering, and
          lessons from building production AI systems.
        </p>

        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            {'// Coming soon'}
          </p>
          <p className="text-muted-foreground">
            First article:{' '}
            <em>
              &quot;Trust Levels in Agent Orchestration: Why L0-L4 Matters&quot;
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}
