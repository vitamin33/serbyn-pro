import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Branded 404 (F14). Renders inside the AppShell (root layout) in the site theme and routes
// visitors back to the offer and the writing — never a dead end.
export default function NotFound() {
  return (
    <div className="section">
      <div className="container max-w-2xl">
        <p className="label-caps mb-2 text-primary">error / 404</p>
        <h1 className="headline-lg mb-4">This page doesn’t exist</h1>
        <p className="body-lg mb-8 text-muted-foreground">
          The link may be broken or the page has moved. Here’s where most people
          are headed:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/audit"
            className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <h2 className="headline-sm mb-1.5">
              AI Agent Production-Readiness Audit
            </h2>
            <p className="mb-4 flex-1 body-md text-muted-foreground">
              Find out where your agents will fail in production — $3,500, fixed
              scope.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-primary group-hover:underline">
              See the audit
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/writing"
            className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <h2 className="headline-sm mb-1.5">Writing</h2>
            <p className="mb-4 flex-1 body-md text-muted-foreground">
              Field notes on agent reliability and LLM cost engineering.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-primary group-hover:underline">
              Read the field reports
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        <p className="mt-8">
          <Link
            href="/"
            className="font-mono text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
