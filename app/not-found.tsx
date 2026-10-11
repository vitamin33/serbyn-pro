import { Eyebrow } from '@/components/ds';

// Branded 404 (F14). Renders inside the site shell in the site theme and routes
// visitors back to the offer and the writing — never a dead end.
export default function NotFound() {
  return (
    <div style={{ padding: '96px 0 120px' }}>
      <div className="ds-wrap" style={{ maxWidth: 900 }}>
        <Eyebrow tone="claim">Error / 404 · no proof</Eyebrow>
        <h1 className="ds-h1" data-size="index" style={{ marginTop: 16 }}>
          This page doesn’t exist
        </h1>
        <p className="ds-lede" style={{ color: 'var(--muted)', marginTop: 20 }}>
          The link may be broken or the page has moved. Here’s where most people
          are headed:
        </p>

        <div
          className="ds-cards"
          style={{
            marginTop: 40,
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 16,
          }}
        >
          <a className="ds-card ds-report" href="/audit">
            <Eyebrow size="sm">Offer</Eyebrow>
            <span className="ds-report-title">
              AI Agent Production-Readiness Audit
            </span>
            <span style={{ color: 'var(--muted)' }}>
              Find out where your agents will fail in production — $3,500, fixed
              scope.
            </span>
            <span className="ds-link">See the audit →</span>
          </a>
          <a className="ds-card ds-report" href="/writing">
            <Eyebrow size="sm">Writing</Eyebrow>
            <span className="ds-report-title">Field reports</span>
            <span style={{ color: 'var(--muted)' }}>
              Field notes on agent reliability and LLM cost engineering.
            </span>
            <span className="ds-link">Read the field reports →</span>
          </a>
        </div>

        <p style={{ marginTop: 32 }}>
          <a className="ds-link ds-mono" data-tone="muted" href="/">
            <span style={{ fontSize: 13 }}>← Back to home</span>
          </a>
        </p>
      </div>
    </div>
  );
}
