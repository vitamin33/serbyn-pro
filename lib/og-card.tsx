import { ImageResponse } from 'next/og';

// Shared 1200×630 dark social card for serbyn.io (F5). Replaces the square,
// transparent-background logo.png that previously stood in for every page's
// og:image. One generator, per-route eyebrow/title/price so link previews on
// LinkedIn / iMessage / Slack carry the name, the offer, and the price.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function ogCard({
  eyebrow,
  title,
  priceLine,
  footerLeft = 'serbyn.io',
}: {
  eyebrow: string;
  title: string;
  priceLine?: string;
  footerLeft?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0C10',
          backgroundImage:
            'radial-gradient(circle at 78% 18%, rgba(10,133,255,0.22), transparent 46%), radial-gradient(circle at 8% 92%, rgba(10,133,255,0.10), transparent 42%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#0A85FF',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          {eyebrow.toUpperCase()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#E6E9EF',
              maxWidth: '1040px',
            }}
          >
            {title}
          </div>
          {priceLine ? (
            <div
              style={{
                display: 'flex',
                marginTop: '28px',
                fontSize: 36,
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              {priceLine}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            color: '#8B93A1',
          }}
        >
          <div style={{ display: 'flex' }}>{footerLeft}</div>
          <div style={{ display: 'flex', color: '#E6E9EF' }}>
            Vitalii Serbyn · Agentic Systems Architect
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
