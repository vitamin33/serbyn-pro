'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type State = 'idle' | 'loading' | 'ok' | 'error';

// Terminal-framed newsletter capture ("Kernel Pulse"). Posts to /api/subscribe
// (Resend). Degrades gracefully if the endpoint is a stub.
export function TerminalSignup({
  title = 'KERNEL_PULSE',
  blurb = 'Deep-dives on autonomous AI agents, infrastructure, and cost engineering. No fluff, just systems.',
  className,
}: {
  title?: string;
  blurb?: string;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? 'ok' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setState('error');
    }
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card',
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="label-caps ml-2 text-muted-foreground">{title}</span>
      </div>
      <div className="p-5">
        <p className="body-md mb-4 text-muted-foreground">
          <span className="text-primary">$</span> {blurb}
        </p>
        {state === 'ok' ? (
          <p className="code-md text-success">
            ✓ subscribed — check your inbox to confirm.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {state === 'loading' ? '…' : 'JOIN'}
            </button>
          </form>
        )}
        {state === 'error' && (
          <p className="code-md mt-2 text-warning">
            something went wrong — try again.
          </p>
        )}
      </div>
    </div>
  );
}
