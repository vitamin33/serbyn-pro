'use client';

import { useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';

type State = 'idle' | 'loading' | 'ok' | 'error';

// /audit email-capture for the sample report (F9). Rendered only when the PDF
// exists (gated at the page level, see lib/assets). Captures the email via the
// existing subscribe API, then reveals the download — so an interested-but-not-
// booking-today visitor is caught instead of bouncing.
export function SampleReportCTA({ href }: { href: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tag: 'sample-report' }),
      });
      setState(res.ok ? 'ok' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <section className="section border-t border-border">
      <div className="container max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="headline-sm mb-2">
            See the deliverable before you book
          </h2>
          <p className="body-md mb-5 text-muted-foreground">
            Get the sanitized sample audit report — the exact format you
            receive: findings, severity, evidence, and a prioritized fix list.
          </p>

          {state === 'ok' ? (
            <a
              href={href}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Download the sample report
              <ArrowDownToLine className="h-4 w-4" />
            </a>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {state === 'loading' ? '…' : 'Send it'}
              </button>
            </form>
          )}
          {state === 'error' && (
            <p className="code-md mt-2 text-warning">
              something went wrong — email serbyn.vitalii@gmail.com and
              I&apos;ll send it.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
