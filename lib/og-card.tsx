import { readFileSync } from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';

// Social cards, 1200×630, from the "OG templates" board of the design system
// (docs/design/design-system.md): home, offer and case study on paper, posts
// in the darkroom with their key number. next/og needs literal colors and
// TTF fonts, so the palette is repeated here and the fonts live in
// lib/og-fonts (Manrope 800, IBM Plex Mono 400/500, SIL OFL).
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const PALETTE = {
  light: {
    bg: '#f5f3ee',
    surface: '#fdfbf6',
    fg: '#1c1b19',
    muted: '#6b665d',
    line: '#e5e0d7',
    lineStrong: '#d3ccbf',
    accent: '#496a62',
    claim: '#cc7c5e',
    claimText: '#9e5136',
    baseline: '#4f5b77',
  },
  dark: {
    bg: '#151513',
    surface: '#1d1c1a',
    fg: '#ece8df',
    muted: '#a39d92',
    line: '#2e2c28',
    lineStrong: '#403c36',
    accent: '#7fb3a4',
    claim: '#e0906f',
    claimText: '#e0906f',
    baseline: '#8f9fc6',
  },
} as const;
type Pal = (typeof PALETTE)['light'] | (typeof PALETTE)['dark'];

const fontFile = (f: string) =>
  readFileSync(path.join(process.cwd(), 'lib/og-fonts', f));

function fonts() {
  return [
    {
      name: 'Manrope',
      data: fontFile('manrope-800.ttf'),
      weight: 800 as const,
      style: 'normal' as const,
    },
    {
      name: 'Plex Mono',
      data: fontFile('plex-mono-400.ttf'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Plex Mono',
      data: fontFile('plex-mono-500.ttf'),
      weight: 500 as const,
      style: 'normal' as const,
    },
  ];
}

const SERIES = (c: Pal) => ({
  claim: c.claim,
  baseline: c.baseline,
  accent: c.accent,
});

function Wordmark({ c }: { c: Pal }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="40" height="40" viewBox="0 0 28 28">
        <path d="M2 23h24" stroke={c.fg} strokeWidth="1.5" fill="none" />
        <path
          d="M6.5 14.5 11 23 23 5"
          stroke={c.accent}
          strokeWidth="2.8"
          fill="none"
        />
      </svg>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'Manrope',
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: '-0.03em',
            color: c.fg,
          }}
        >
          serbyn
        </span>
        <span
          style={{
            fontFamily: 'Plex Mono',
            fontWeight: 400,
            fontSize: 25,
            color: c.muted,
          }}
        >
          .io
        </span>
      </div>
    </div>
  );
}

function Eyebrow({ c, children }: { c: Pal; children: string }) {
  return (
    <span
      style={{
        fontFamily: 'Plex Mono',
        fontWeight: 500,
        fontSize: 18,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: c.muted,
      }}
    >
      {children}
    </span>
  );
}

function Strip({
  c,
  items,
  signature,
}: {
  c: Pal;
  items: string[];
  signature?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        borderTop: `1.5px solid ${c.lineStrong}`,
        marginTop: 'auto',
      }}
    >
      {items.map((it, i) => (
        <span
          key={it}
          style={{
            padding: i === 0 ? '14px 20px 0 0' : '14px 20px 0',
            borderLeft: i === 0 ? 'none' : `1.5px solid ${c.lineStrong}`,
            fontFamily: 'Plex Mono',
            fontSize: 16,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.muted,
          }}
        >
          {it}
        </span>
      ))}
      {signature && (
        <span
          style={{
            marginLeft: 'auto',
            padding: '14px 0 0',
            fontFamily: 'Plex Mono',
            fontSize: 16,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.muted,
          }}
        >
          serbyn.io · field report
        </span>
      )}
    </div>
  );
}

function Frame({
  c,
  top,
  children,
}: {
  c: Pal;
  top: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: c.bg,
        padding: '64px 72px 48px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Wordmark c={c} />
        {top}
      </div>
      {/* satori lays fragments out as a row: wrap the body in a column */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
}

const display = (c: Pal, size: number) => ({
  fontFamily: 'Manrope',
  fontWeight: 800 as const,
  fontSize: size,
  letterSpacing: '-0.035em',
  lineHeight: 1.04,
  color: c.fg,
});

export type OgCard =
  | { kind: 'home'; eyebrow: string; title: string; strip: string[] }
  | {
      kind: 'offer';
      eyebrow: string;
      title: string;
      price: string;
      terms: string;
      strip: string[];
    }
  | {
      kind: 'post';
      meta: string;
      title: string;
      keyNumber?: {
        value: string;
        unit?: string;
        caption: string;
        bars: { fraction: number; series: 'claim' | 'baseline' | 'accent' }[];
      };
      strip: string[];
    }
  | {
      kind: 'case';
      badge: string;
      eyebrow: string;
      title: string;
      strip: string[];
    };

export function ogCard(card: OgCard) {
  const c: Pal = card.kind === 'post' ? PALETTE.dark : PALETTE.light;
  let body: React.ReactNode;

  if (card.kind === 'home') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div
          style={{
            display: 'flex',
            ...display(c, 82),
            marginTop: 56,
            maxWidth: 880,
          }}
        >
          {card.title}
        </div>
        <Strip c={c} items={card.strip} />
      </div>
    );
  } else if (card.kind === 'offer') {
    const m = card.price.match(/^(from )?(.+?)(\/mo)?$/);
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div
          style={{
            display: 'flex',
            gap: 48,
            alignItems: 'flex-end',
            marginTop: 44,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 628,
              gap: 16,
            }}
          >
            <Eyebrow c={c}>{card.eyebrow}</Eyebrow>
            <div style={{ display: 'flex', ...display(c, 56) }}>
              {card.title}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 380,
              borderTop: `2px solid ${c.fg}`,
              paddingTop: 16,
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                ...display(c, m?.[1] ? 72 : 84),
                letterSpacing: '-0.05em',
              }}
            >
              {m?.[1] && (
                <span
                  style={{ fontSize: 28, letterSpacing: 0, color: c.muted }}
                >
                  from&nbsp;
                </span>
              )}
              {m?.[2] ?? card.price}
              {m?.[3] && (
                <span
                  style={{ fontSize: 28, letterSpacing: 0, color: c.muted }}
                >
                  /mo
                </span>
              )}
            </div>
            <span
              style={{ fontFamily: 'Plex Mono', fontSize: 18, color: c.muted }}
            >
              {card.terms}
            </span>
          </div>
        </div>
        <Strip c={c} items={card.strip} signature />
      </div>
    );
  } else if (card.kind === 'post') {
    const kn = card.keyNumber;
    const series = SERIES(c);
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div
          style={{
            display: 'flex',
            gap: 48,
            alignItems: 'center',
            marginTop: 44,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: kn ? 668 : 1056,
              ...display(c, kn ? 54 : 64),
            }}
          >
            {card.title}
          </div>
          {kn && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 340,
                gap: 12,
                padding: '24px 26px',
                backgroundColor: c.surface,
                border: `1.5px solid ${c.line}`,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  ...display(c, 116),
                  letterSpacing: '-0.06em',
                  lineHeight: 0.9,
                }}
              >
                {kn.value}
                {kn.unit && (
                  <span
                    style={{
                      fontSize: 32,
                      letterSpacing: '-0.02em',
                      color: c.muted,
                    }}
                  >
                    &nbsp;{kn.unit}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {kn.bars.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      height: 12,
                      width:
                        b.fraction === 0
                          ? 4
                          : `${Math.round(b.fraction * 100)}%`,
                      backgroundColor: series[b.series],
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: 'Plex Mono',
                  fontSize: 15,
                  color: c.muted,
                }}
              >
                {kn.caption}
              </span>
            </div>
          )}
        </div>
        <Strip c={c} items={card.strip} signature />
      </div>
    );
  } else {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', marginTop: 48 }}>
          <Eyebrow c={c}>{card.eyebrow}</Eyebrow>
        </div>
        <div
          style={{
            display: 'flex',
            ...display(c, 72),
            marginTop: 14,
            maxWidth: 960,
          }}
        >
          {card.title}
        </div>
        <Strip c={c} items={card.strip} />
      </div>
    );
  }

  const top =
    card.kind === 'case' ? (
      <span
        style={{
          fontFamily: 'Plex Mono',
          fontSize: 16,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '5px 12px',
          border: `1.5px solid ${c.claimText}`,
          color: c.claimText,
          borderRadius: 4,
        }}
      >
        {card.badge}
      </span>
    ) : (
      <Eyebrow c={c}>
        {card.kind === 'post'
          ? card.meta
          : card.kind === 'home'
            ? card.eyebrow
            : 'Fixed-scope offer'}
      </Eyebrow>
    );

  return new ImageResponse(
    (
      <Frame c={c} top={top}>
        {body}
      </Frame>
    ),
    { ...OG_SIZE, fonts: fonts() }
  );
}
