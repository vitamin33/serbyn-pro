'use client';

import { useState } from 'react';
import { track } from '@/lib/analytics';
import { Eyebrow } from './primitives';

// "False Green": the newsletter as a masthead (double rule, Newsreader italic
// name). States: idle -> checking (a scan line runs under the field) ->
// subscribed, or an error line in terracotta. Posts { email } to /api/subscribe
// like the current signup.

export const NEWSLETTER = {
  name: 'False Green',
  blurb:
    'measured notes from running AI agent systems in production: what broke, what it cost, what the data showed. 1-2 emails a month.',
  cadence: '1-2 emails a month',
} as const;

type State = 'idle' | 'checking' | 'done' | 'error';

export function Masthead({
  variant,
  location,
  endpoint = '/api/subscribe',
  tag = NEWSLETTER.cadence,
  id = 'newsletter',
}: {
  /** default: index masthead; card: framed (component board); footer: end of post */
  variant?: 'card' | 'footer';
  location: string;
  endpoint?: string;
  tag?: string;
  id?: string;
}) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const inputId = `${id}-email`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('checking');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState('done');
        setEmail('');
        track('newsletter_subscribe', { location });
      } else setState('error');
    } catch {
      setState('error');
    }
  }

  const name = <span className="ds-masthead-name">{NEWSLETTER.name}</span>;
  const form =
    state === 'done' ? (
      <p className="ds-field-done" role="status">
        <span aria-hidden="true">✓</span>subscribed — check your inbox to
        confirm.
      </p>
    ) : (
      <form className="ds-field" onSubmit={onSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Email
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          className="ds-btn"
          type="submit"
          disabled={state === 'checking'}
        >
          {state === 'checking' ? 'checking…' : 'Subscribe'}
        </button>
        {state === 'checking' && (
          <span className="ds-field-scan" aria-hidden="true" />
        )}
      </form>
    );
  const err = state === 'error' && (
    <p className="ds-field-err" role="alert">
      something went wrong — try again.
    </p>
  );

  if (variant === 'footer') {
    return (
      <section
        className="ds-masthead"
        data-variant="footer"
        aria-labelledby={id}
      >
        <div>
          <h2 id={id} className="ds-masthead-bar" style={{ margin: 0 }}>
            {name}
          </h2>
          <p>{NEWSLETTER.blurb}</p>
        </div>
        <div>
          {form}
          {err}
        </div>
      </section>
    );
  }

  return (
    <section
      className="ds-masthead"
      data-variant={variant}
      aria-labelledby={id}
    >
      <div className="ds-masthead-bar">
        <h2 id={id} style={{ margin: 0 }}>
          {name}
        </h2>
        <Eyebrow size="xs">{tag}</Eyebrow>
      </div>
      <div className="ds-masthead-body">
        <p>{NEWSLETTER.blurb}</p>
        {form}
        {err}
      </div>
    </section>
  );
}
