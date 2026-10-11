'use client';

import { useState } from 'react';
import { Eyebrow } from '@/components/ds';

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
    <section className="ds-sec" data-size="offer" aria-labelledby="h-sample">
      <div className="ds-wrap">
        <div
          className="ds-card"
          style={{ padding: 28, display: 'grid', gap: 14, maxWidth: 680 }}
        >
          <Eyebrow>Sample report</Eyebrow>
          <h2 id="h-sample" className="ds-h3">
            See the deliverable before you book
          </h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Get the sanitized sample audit report — the exact format you
            receive: findings, severity, evidence, and a prioritized fix list.
          </p>
          {state === 'ok' ? (
            <a
              href={href}
              download
              className="ds-btn"
              style={{ justifySelf: 'start' }}
            >
              Download the sample report ↓
            </a>
          ) : (
            <form className="ds-field" onSubmit={onSubmit}>
              <label htmlFor="sample-email" className="sr-only">
                Email
              </label>
              <input
                id="sample-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
              <button
                type="submit"
                className="ds-btn"
                disabled={state === 'loading'}
              >
                {state === 'loading' ? 'sending…' : 'Send it'}
              </button>
              {state === 'loading' && (
                <span className="ds-field-scan" aria-hidden="true" />
              )}
            </form>
          )}
          {state === 'error' && (
            <p className="ds-field-err" role="alert">
              something went wrong — email serbyn.vitalii@gmail.com and
              I&apos;ll send it.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
