import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AUDIT_CONTENT } from '@/lib/offer-content';
import {
  ADVISORY,
  COST_CASE,
  OFFERS,
  PROTOCOL,
  RESULTS,
  SYSTEMS,
  TRUST_CHIPS,
  UPSELL,
} from '@/lib/facts';
import {
  Arrow,
  BarChart,
  Callout,
  CapIcon,
  CapabilityColumns,
  Chain,
  Chip,
  ClaimCheck,
  ColumnChart,
  CostExhibit,
  DataTable,
  Deliverables,
  DiscussCta,
  Eyebrow,
  ExhibitFrame,
  ExhibitNumber,
  Faq,
  FieldReportCard,
  FinalCta,
  FitBoxes,
  GiantNumber,
  HeadToHead,
  InterimTag,
  KeyNumber,
  Legend,
  MarginNote,
  Mark,
  Masthead,
  NoteRow,
  OfferColumns,
  PostWall,
  Price,
  PriceCard,
  ProofLink,
  ProofOfMethodCard,
  PullQuote,
  RelatedList,
  ResultTiles,
  SectionHeader,
  SeriesNav,
  ShortVersion,
  SignoffStrip,
  SiteFooter,
  SiteHeader,
  SourceLabel,
  StatStrip,
  SystemCard,
  TermsList,
  TextLink,
  Tier,
  TierBadge,
  TimelineBar,
  Toc,
  Verdict,
  Waffle,
  Wordmark,
  buttonProps,
  wilson,
  type PostSummary,
} from '@/components/ds';

// Internal gallery for the design system (docs/design/design-system.md).
// Mirrors the Claude Design boards section by section, light and dark.
// Not linked from the site, not in the sitemap, noindex.
export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
};

/* ── gallery scaffolding ────────────────────────────────────────────────── */

function Board({
  id,
  n,
  title,
  note,
  children,
}: {
  id: string;
  n: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 24,
        paddingTop: 72,
      }}
    >
      <div style={{ display: 'grid', gap: 6 }}>
        <Eyebrow>{n}</Eyebrow>
        <h2
          id={`${id}-h`}
          className="ds-h2"
          style={{ fontSize: 34, marginTop: 0 }}
        >
          {title}
        </h2>
        {note && (
          <p className="ds-intro" style={{ marginTop: 4, fontSize: 15.5 }}>
            {note}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Both({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${cols === 2 ? 520 : 900}px, 100%), 1fr))`,
        gap: 24,
      }}
    >
      {(['light', 'dark'] as const).map(t => (
        <div
          key={t}
          data-theme={t}
          data-gallery-theme={t}
          style={{
            padding: 20,
            borderRadius: 8,
            border: '1px solid var(--line)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 16,
            alignContent: 'start',
            minWidth: 0,
          }}
        >
          <Eyebrow size="xs">{t}</Eyebrow>
          {children}
        </div>
      ))}
    </div>
  );
}

function Lab({ children }: { children: ReactNode }) {
  return (
    <p className="ds-note" style={{ margin: '0 0 -8px' }}>
      {children}
    </p>
  );
}

/* ── data (lib/facts, docs/design/claude-design-brief.md Appendix D) ───── */

const TOKENS: [string, string, string, string][] = [
  ['--bg', '#f5f3ee', '#151513', 'page — paper / darkroom'],
  ['--surface', '#fdfbf6', '#1d1c1a', 'cards, tables, figures'],
  ['--fg', '#1c1b19', '#ece8df', 'text · 15.5:1 / 15:1'],
  [
    '--muted',
    '#6b665d',
    '#a39d92',
    'secondary text, source labels · 5.1:1 / 6.8:1',
  ],
  ['--line', '#e5e0d7', '#2e2c28', 'hairlines, bar tracks, gridlines'],
  ['--line-strong', '#d3ccbf', '#403c36', 'button outlines, axes'],
  ['--chip', '#ebe6dc', '#2a2825', 'neutral chip fill, hover rows'],
  [
    '--accent',
    '#496a62',
    '#7fb3a4',
    'proven · primary action · links · 5.4:1 / 7.7:1',
  ],
  ['--accent-soft', '#dfe8e3', '#1f302b', 'callout fill, proven pill'],
  ['--on-accent', '#ffffff', '#121211', 'text on primary button · 6:1 / 8.9:1'],
  [
    '--claim',
    '#cc7c5e',
    '#e0906f',
    'claim / before / failure — fills and borders only',
  ],
  [
    '--claim-text',
    '#9e5136',
    '#e0906f',
    'terracotta as text or chip outline · 5.1:1 / 7.3:1',
  ],
  [
    '--baseline',
    '#4f5b77',
    '#8f9fc6',
    'baseline / comparison arm · 6.1:1 / 6.9:1',
  ],
];

const TYPE: [string, string, ReactNode][] = [
  [
    'Giant numeral',
    'Manrope 800 · clamp(96, 13vw, 200) · −0.06em',
    <GiantNumber key="g" value="0" unit="of 40" className="!text-[120px]" />,
  ],
  [
    'H1',
    'Manrope 800 · clamp(42, 5vw, 72) / 1.02',
    <span key="1" className="ds-display" style={{ fontSize: 52 }}>
      Find out where your agents will fail.
    </span>,
  ],
  [
    'H2',
    'Manrope 800 · clamp(30, 3.2vw, 46) / 1.06',
    <span
      key="2"
      className="ds-display"
      style={{ fontSize: 36, letterSpacing: '-.03em' }}
    >
      The numbers, each with its context
    </span>,
  ],
  [
    'H3',
    'Manrope 800 · 22 / 1.2',
    <span key="3" className="ds-h3">
      Evidence-binding
    </span>,
  ],
  [
    'Verdict',
    'Newsreader italic · clamp(22, 2.2vw, 30) / 1.3',
    <Verdict key="v" as="span">
      It was who decided when to look.
    </Verdict>,
  ],
  [
    'Lede',
    'Plex Sans 400 · 19 / 1.6',
    <span key="l" style={{ fontSize: 19 }}>
      A fixed-scope, two-week audit that measures your agents the way production
      will.
    </span>,
  ],
  [
    'Body',
    'Plex Sans 400 · 16.5 / 1.62 · 70ch',
    <span key="b">
      Every “green” has to point at the evidence that earned it. Claims that
      cannot cite their proof are treated as failures.
    </span>,
  ],
  [
    'Eyebrow · label',
    'Plex Mono 500 · 12 · +0.08em caps',
    <Eyebrow key="e">Quantified results</Eyebrow>,
  ],
  [
    'Source label',
    'Plex Mono 400 · 12 / 1.5 · muted',
    <SourceLabel
      key="s"
      marker="hook"
      claimLabel={false}
      label="on Ascend, a system I designed and built"
    />,
  ],
];

const proofFor = (i: number) =>
  i < 2
    ? { href: 'https://github.com/vitamin33/ascend-core', external: true }
    : i === 2
      ? { href: '/methodology', text: 'methodology' }
      : undefined;
const RESULT_TILES = RESULTS.filter(r => r.value !== COST_CASE.delta).map(
  (r, i) => ({ ...r, proof: proofFor(i) })
);

const CHECKPOINT_BARS = [
  {
    label: 'No checkpoint',
    series: 'claim' as const,
    k: 22,
    n: 40,
    display: '22 / 40',
  },
  {
    label: 'Optional tool',
    sub: '1.94x cost · used 38/40',
    series: 'baseline' as const,
    k: 6,
    n: 40,
    display: '6 / 40',
  },
  {
    label: 'Forced checkpoint',
    sub: '1.00x cost',
    series: 'accent' as const,
    k: 0,
    n: 40,
    display: '0 / 40',
    tone: 'accent' as const,
  },
];

const POSTS: { month: string; posts: PostSummary[] }[] = [
  {
    month: 'September 2026',
    posts: [
      {
        slug: 'enforced-checkpoint-0-of-40-silent-failures-vs-22-of-40',
        title:
          'The Check the Agent Cannot Skip: 0 of 40 Silent Failures vs 22 of 40',
        date: '2026-09-30',
        category: 'architecture',
        exhibitLabel:
          'Silent failures per 40 runs: no checkpoint 22, optional 6, forced 0',
        exhibit: {
          kind: 'bars',
          caption: 'Silent failures / 40 runs',
          rows: [
            { value: 22, max: 40, label: '22', series: 'claim' },
            { value: 6, max: 40, label: '6', series: 'baseline' },
            { value: 0, max: 40, label: '0', series: 'accent' },
          ],
        },
      },
      {
        slug: 'self-verification-cost-1-64x-and-caught-nothing',
        title: 'Self-Verification Cost 1.64x and Caught Nothing',
        date: '2026-09-22',
        category: 'architecture',
        exhibit: {
          kind: 'cost',
          value: '1.64x',
          caption: 'cost · 0 catches',
          bars: [
            { fraction: 0.2004 / 0.3285, series: 'baseline' },
            { fraction: 1, series: 'claim' },
          ],
        },
      },
      {
        slug: 'the-api-served-a-different-model-and-my-check-passed',
        title: 'The API Served a Different Model and My Check Passed',
        date: '2026-09-22',
        category: 'architecture',
        exhibit: {
          kind: 'served',
          requested: 'deepseek-v4-flash',
          served: 'deepseek-flash',
          caption: '200 / 200 responses · requested ≠ served',
        },
      },
      {
        slug: 'nine-times-the-eval-tried-to-lie-to-me',
        title: 'Nine Times the Eval Tried to Lie to Me',
        date: '2026-09-08',
        category: 'architecture',
        exhibit: { kind: 'num', value: '9', caption: 'eval defects' },
      },
      {
        slug: 'same-model-0-and-100-where-the-verifier-gap-actually-lives',
        title: 'When an AI Agent Says Done: 0% vs 100% False Greens',
        date: '2026-09-06',
        category: 'architecture',
        exhibit: {
          kind: 'split',
          a: '0%',
          b: '100%',
          caption: 'false greens · one answer vs trajectory',
        },
      },
    ],
  },
  {
    month: 'June 2026',
    posts: [
      {
        slug: 'the-calibration-ledger-58-runs-93-pass-n-is-small',
        title: 'The Calibration Ledger: 58 Runs, 93% Pass, n Is Small',
        date: '2026-06-17',
        category: 'architecture',
        exhibit: {
          kind: 'ledger',
          value: '~93%',
          sub: '~58 runs',
          fraction: 0.93,
          caption: 'n is small',
        },
      },
      {
        slug: 'false-greens-three-structural-observations',
        title: 'False Greens: Three Structural Observations',
        date: '2026-06-12',
        category: 'architecture',
      },
    ],
  },
];

/* ── page ───────────────────────────────────────────────────────────────── */

export default function DesignSystemGallery() {
  const d1 = (k: number, n: number) => wilson(k, n);
  return (
    <div className="ds-wrap" style={{ paddingBottom: 120 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 40,
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--fg)',
          padding: '64px 0 28px',
        }}
      >
        <div>
          <Eyebrow>serbyn.io · design system v1 · lab</Eyebrow>
          <h1
            className="ds-display"
            style={{ fontSize: 64, margin: '10px 0 0' }}
          >
            Claim vs. proof
          </h1>
        </div>
        <p style={{ margin: 0, maxWidth: '46ch', color: 'var(--muted)' }}>
          Two colors argue, one color settles. Terracotta is the claim under
          test, slate is the baseline, evergreen is what got proven. Paper,
          hairlines, no shadows, no gradients. Source:{' '}
          <code>components/ds</code>, spec:{' '}
          <code>docs/design/design-system.md</code>.
        </p>
      </header>

      <nav
        aria-label="Gallery sections"
        className="ds-mono"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 18px',
          fontSize: 12,
          padding: '16px 0',
          borderBottom: '1px solid var(--line)',
        }}
      >
        {[
          'mark',
          'color',
          'tokens',
          'type',
          'controls',
          'exhibits',
          'charts',
          'motion',
          'home',
          'offer',
          'writing',
          'post',
          'shell',
        ].map(s => (
          <a key={s} href={`#${s}`} className="ds-link" data-tone="muted">
            {s}
          </a>
        ))}
      </nav>

      {/* 01 Mark */}
      <Board
        id="mark"
        n="01 · Mark"
        title="The proven tick"
        note="A tick whose vertex lands on a ledger rule: the claim only counts once it touches the record. Works from 16px up; the wordmark pairs Manrope 800 with a mono “.io”."
      >
        <Both>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              flexWrap: 'wrap',
            }}
          >
            <Wordmark href={null} size={40} className="!text-[32px]" />
            <Mark size={16} />
            <Mark size={32} />
            <Mark size={64} />
          </div>
        </Both>
      </Board>

      {/* 02 Semantic color */}
      <Board
        id="color"
        n="02 · Semantic color"
        title="One mapping, every page"
        note="Learn it once on the home page; read every chart, diagram and card after that."
      >
        <Both>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {[
              [
                '--claim',
                'The claim',
                'Under test, the failure, “before”, A-side bars. Fills and borders only.',
              ],
              [
                '--baseline',
                'The baseline',
                'The comparison arm, “after”, B-side bars.',
              ],
              [
                '--accent',
                'Proven',
                'Verified, fixed, the action to take. Buttons, links, ticks, focus.',
              ],
            ].map(([v, name, body]) => (
              <div
                key={v}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <div
                  style={{
                    height: 96,
                    borderRadius: 6,
                    background: `var(${v})`,
                  }}
                />
                <span className="ds-mono" style={{ fontSize: 12 }}>
                  {v}
                </span>
                <b>{name}</b>
                <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                  {body}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {(['A', 'B', 'C', 'D'] as const).map(t => (
              <TierBadge key={t} tier={t} size="sm" />
            ))}
            <span>
              Inline: a claim graded <Tier tier="D" /> or <Tier tier="A" />.
            </span>
          </div>
        </Both>
      </Board>

      {/* 03 Tokens */}
      <Board
        id="tokens"
        n="03 · Tokens"
        title="Light paper, darkroom"
        note="Theme applies via prefers-color-scheme, via <html data-theme>, and via data-theme on any element so a figure can force its own theme."
      >
        <DataTable
          head={['Token', 'Light', 'Dark', 'Role · contrast on bg']}
          rows={TOKENS.map(([n, l, d, r]) => [
            { v: <code>{n}</code> },
            {
              v: (
                <span
                  className="ds-mono"
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    fontSize: 12.5,
                  }}
                >
                  <i
                    style={{
                      width: 40,
                      height: 26,
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,.08)',
                      background: l,
                    }}
                  />
                  {l}
                </span>
              ),
            },
            {
              v: (
                <span
                  className="ds-mono"
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    fontSize: 12.5,
                  }}
                >
                  <i
                    style={{
                      width: 40,
                      height: 26,
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,.08)',
                      background: d,
                    }}
                  />
                  {d}
                </span>
              ),
            },
            { v: <span style={{ color: 'var(--muted)' }}>{r}</span> },
          ])}
        />
        <DataTable
          compact
          head={['Motion token', 'Value', 'Use']}
          rows={[
            ['--dur-instant', '80ms', 'press, tap feedback'],
            ['--dur-quick', '160ms', 'hover, focus ring, underline draw'],
            ['--dur-base', '260ms', 'entrances, chips, badges'],
            ['--dur-slow', '420ms', 'bars, scans, morphs, theme'],
            [
              '--dur-story',
              '900ms (700–1200)',
              'hero and signature sequences only',
            ],
            [
              '--ease-settle',
              'cubic-bezier(.2,0,0,1)',
              'most entrances: fast start, soft landing',
            ],
            [
              '--ease-scan',
              'linear',
              'the scan line only: reads like a machine',
            ],
            [
              '--ease-stamp',
              'cubic-bezier(.34,1.56,.64,1)',
              'tier badges, ticks, chips · ~8% overshoot',
            ],
            [
              '--ease-exit',
              'cubic-bezier(.4,0,1,1)',
              'exits, always faster than entrances',
            ],
            ['--stagger', '50ms (40–60)', 'lists, bars, ledger rows'],
            [
              '--travel',
              '6px (4–8)',
              'max entrance distance: nothing flies in',
            ],
          ].map(([a, b, c]) => [
            { v: <code>{a}</code> },
            { v: b, num: true },
            c,
          ])}
        />
      </Board>

      {/* 04 Type */}
      <Board
        id="type"
        n="04 · Type"
        title="Grotesk for verdicts in numbers, serif for verdicts in words"
      >
        <div className="ds-rule-top">
          {TYPE.map(([name, spec, sample]) => (
            <div
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(120px, 170px) minmax(140px, 220px) minmax(0, 1fr)',
                gap: 24,
                alignItems: 'baseline',
                padding: '16px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span className="ds-mono" style={{ fontSize: 12 }}>
                {name}
              </span>
              <span
                className="ds-mono"
                style={{ fontSize: 11.5, color: 'var(--muted)' }}
              >
                {spec}
              </span>
              <div style={{ minWidth: 0, overflow: 'hidden' }}>{sample}</div>
            </div>
          ))}
        </div>
        <p className="ds-note">
          Space: 4px base — 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 88 · 120.
          Radius: 2 bars · 3 chips · 4 small controls · 6 cards and buttons · 8
          palette. Layout: 1240 container · 70ch reading · 1000px breakout ·
          margin column ≥ 1200.
        </p>
      </Board>

      {/* 06 Controls */}
      <Board id="controls" n="06 · Controls" title="Buttons, chips, links">
        <Both>
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <a href="#controls" {...buttonProps()}>
              Book a 30-min systems call <Arrow />
            </a>
            <a href="#controls" {...buttonProps({ variant: 'secondary' })}>
              serbyn.vitalii@gmail.com
            </a>
            <button type="button" {...buttonProps({ variant: 'inverse' })}>
              Check the claim
            </button>
            <a href="#controls" {...buttonProps({ size: 'sm' })}>
              Contact
            </a>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Chip>Lower is better</Chip>
            <Chip>Higher is better</Chip>
            <Chip variant="claim">LLM cost engineering</Chip>
            <Chip variant="accent">Proven</Chip>
            <Chip variant="dashed">claimed · unchecked</Chip>
            <span>
              110 turns
              <InterimTag />
            </span>
            <ProofLink href="#controls">proof</ProofLink>
            <TextLink href="#controls" strong>
              Underline draws on hover
            </TextLink>
          </div>
          <SignoffStrip items={TRUST_CHIPS} />
          <pre className="ds-code">
            <code>
              <span className="hljs-comment">
                # illustrative, for the syntax theme only
              </span>
              {'\n'}
              <span className="hljs-keyword">def</span>{' '}
              <span className="hljs-title function_">is_proven</span>(ledger):
              {'\n'}
              {'    '}last_edit = ledger.
              <span className="hljs-title function_">last</span>(
              <span className="hljs-string">&quot;Edit&quot;</span>){'\n'}
              {'    '}
              <span className="hljs-keyword">return</span> ledger.
              <span className="hljs-title function_">any_after</span>(last_edit,
              passed=<span className="hljs-literal">True</span>)
            </code>
          </pre>
        </Both>
      </Board>

      {/* Exhibits */}
      <Board
        id="exhibits"
        n="Components · exhibits"
        title="Every number is an exhibit"
        note="Big value, unit in mono, bar on a quiet track, a direction chip, and a source label that is part of the design. Pick an arm on the head-to-head to dim the other."
      >
        <Both>
          <HeadToHead
            eyebrow="Head-to-head · same model, two jobs"
            topic="False greens"
            title="Single answer vs. trajectory"
            meta="deepseek-v4-flash · one month · 680 runs"
            arms={{
              A: { name: 'single answer', series: 'baseline' },
              B: { name: 'trajectory', series: 'claim' },
            }}
            won={{ label: 'Rows won', text: 'A 2 · B 0', aShare: 1 }}
            metrics={[
              {
                name: 'False-green rate',
                direction: 'Lower is better',
                a: { k: 0, n: 50, display: '0% · 0/50' },
                b: { k: 45, n: 45, display: '100% · 45/45' },
              },
              {
                name: 'Caught the planted fault',
                direction: 'Higher is better',
                a: { k: 50, n: 50, display: '100% · 50/50' },
                b: { k: 8, n: 70, display: '11% · 8/70' },
              },
            ]}
            boxes={{
              A: ['Good reviewer of', 'a single answer'],
              B: ['Poor auditor of', 'its own multi-step work'],
            }}
            verdict="“…the model is a good reviewer of a single answer and a poor auditor of its own multi-step work.”"
            source={
              <>
                ↳ When an AI Agent Says Done: 0% vs 100% False Greens{' '}
                <ProofLink href="/blog/same-model-0-and-100-where-the-verifier-gap-actually-lives">
                  post
                </ProofLink>
              </>
            }
            strip={['680 runs', 'All runs $3.13', 'Wilson 95% intervals']}
          />
        </Both>
        <Both>
          <ExhibitFrame
            eyebrow="Exhibit · silent failures"
            topic="Enforced checkpoint"
            title="The check the agent cannot skip"
            verdict="The difference was never whether the agent had access to the truth. It was who decided when to look."
            source={
              <>
                ↳ deepseek-flash · 160 runs at the final stage, 40 per arm ·
                whole experiment $3.67{' '}
                <ProofLink href="/blog/enforced-checkpoint-0-of-40-silent-failures-vs-22-of-40">
                  post
                </ProofLink>
              </>
            }
            strip={['160 runs', '40 per arm', '$3.67 total']}
          >
            <ExhibitNumber
              label="In the post · forced checkpoint"
              value="0"
              unit="of 40"
              direction="Lower is better"
            />
            <BarChart
              data={CHECKPOINT_BARS}
              motion="grow"
              axis={['0', '10', '20', '30', '40 runs']}
            />
          </ExhibitFrame>
        </Both>
      </Board>

      {/* Charts D.1–D.5 */}
      <Board
        id="charts"
        n="Chart style · D.1 to D.5"
        title="One palette, five real charts"
        note="Numbers from the posts (brief Appendix D). Intervals are computed from the counts with wilson(); none is typed in."
      >
        <Both>
          <ExhibitFrame
            eyebrow="D.1 · verifier-gap contrast"
            title="Same model: 0% false greens on one answer, 100% on its own trajectory"
            signature={false}
            source={
              <span>
                deepseek-v4-flash · one month · 680 runs · all runs $3.13 ·
                Wilson 95% intervals
              </span>
            }
          >
            <Legend
              items={[
                { label: 'single answer', series: 'baseline' },
                { label: 'trajectory (12 steps)', series: 'claim' },
              ]}
            />
            <ColumnChart
              ariaLabel="False-green rate: single answer 0 of 50, trajectory 45 of 45. Caught planted fault: single answer 50 of 50, trajectory 8 of 70."
              columns={[
                {
                  value: 0,
                  ci: d1(0, 50),
                  series: 'baseline',
                  valueLabel: '0%',
                  countLabel: '0 / 50',
                },
                {
                  value: 1,
                  ci: d1(45, 45),
                  series: 'claim',
                  valueLabel: '100%',
                  countLabel: '45 / 45',
                },
                {
                  value: 1,
                  ci: d1(50, 50),
                  series: 'baseline',
                  valueLabel: '100%',
                  countLabel: '50 / 50',
                },
                {
                  value: 8 / 70,
                  ci: d1(8, 70),
                  series: 'claim',
                  valueLabel: '11%',
                  countLabel: '8 / 70',
                },
              ]}
              groups={[
                <span key="a">
                  False-green rate <Chip size="sm">lower</Chip>
                </span>,
                <span key="b">
                  Caught planted fault <Chip size="sm">higher</Chip>
                </span>,
              ]}
            />
          </ExhibitFrame>
          <ExhibitFrame
            eyebrow="D.3 · self-verification cost"
            title="The self-check cost 1.64x and caught nothing"
            signature={false}
            source={
              <span>
                50 tasks per arm · 0 catches · 5 of 50 correct solutions wrongly
                rejected
              </span>
            }
          >
            <BarChart
              labelWidth={100}
              data={[
                {
                  label: 'Baseline',
                  sub: '$0.00409 / correct',
                  series: 'baseline',
                  fraction: 0.2004 / 0.35,
                  display: '$0.2004',
                  inline: true,
                },
                {
                  label: 'Self-check',
                  sub: '$0.00657 / correct',
                  series: 'claim',
                  fraction: 0.3285 / 0.35,
                  display: '$0.3285',
                  inline: true,
                },
              ]}
              axis={['$0', '$0.10', '$0.20', '$0.30', '$0.35']}
            />
            <StatStrip
              items={[
                { value: '0', label: 'catches' },
                { value: '37%', label: 'of spend on 5 false alarms' },
              ]}
            />
          </ExhibitFrame>
          <ExhibitFrame
            eyebrow="D.4 · served vs. requested model"
            title="Every response came from a different model than requested"
            signature={false}
            source={<span>one square = one response · rerun cost $0.6972</span>}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                gap: 24,
                alignItems: 'center',
              }}
            >
              <div
                className="ds-mono"
                style={{ display: 'grid', gap: 10, fontSize: 13 }}
              >
                <div>
                  <Eyebrow size="xs">requested</Eyebrow>
                  <div>deepseek-v4-flash</div>
                </div>
                <div
                  style={{
                    borderTop: '1.5px dashed var(--claim)',
                    paddingTop: 10,
                  }}
                >
                  <Eyebrow size="xs">served</Eyebrow>
                  <div style={{ color: 'var(--claim-text)', fontWeight: 500 }}>
                    deepseek-flash
                  </div>
                </div>
                <GiantNumber
                  value="200"
                  unit="of 200"
                  className="!text-[40px]"
                />
              </div>
              <Waffle
                total={200}
                on={200}
                ariaLabel="200 of 200 responses served by a different model"
              />
            </div>
          </ExhibitFrame>
          <ExhibitFrame
            eyebrow="D.5 · calibration ledger"
            title="~58 runs, ~93% autonomous pass"
            headAside={<Chip variant="claim">n is small</Chip>}
            signature={false}
            source={
              <span>
                ~58 runs · the “~” is in the source · no interval drawn: the
                post gives none
              </span>
            }
          >
            <BarChart
              labelWidth={120}
              valueWidth={60}
              data={[
                {
                  label: 'Autonomous pass',
                  series: 'accent',
                  fraction: 0.93,
                  display: '~93%',
                },
              ]}
            />
            <Verdict>
              “…the most important thing I can tell you about that number is
              what it does not prove.”
            </Verdict>
          </ExhibitFrame>
        </Both>
      </Board>

      {/* Motion */}
      <Board
        id="motion"
        n="Motion · claim → scan → proof → settle"
        title="Three motions that prove something"
        note="Numbers never count up: they arrive whole and get verified. Each sequence plays once on first view and has a replay. Reduced motion and no-JS show the settled state."
      >
        <Lab>
          Claim check (home hero): check, then switch the ending to see D turn
          into A.
        </Lab>
        <Both>
          <ClaimCheck
            ledger={[
              { tool: 'Edit', target: 'src/orders.py' },
              {
                tool: 'Bash',
                target: (
                  <>
                    pytest → <span data-result="fail">3 failed</span>
                  </>
                ),
              },
              { tool: 'Edit', target: 'src/orders.py' },
            ]}
            passRow={{
              tool: 'Bash',
              target: (
                <>
                  pytest → <span data-result="pass">42 passed</span>
                </>
              ),
            }}
            passLabel="+ pytest → 42 passed"
            rule="Rule: a claim counts as proven only if a passing test run happened after the last code edit. Tiers A (proven) → D (no proof). From proof-of-green."
          />
        </Both>
        <Lab>Error bars shrink to the measured interval (post key number).</Lab>
        <Both cols={1}>
          <KeyNumber
            value="0"
            unit="of 40"
            caption="silent failures with the forced checkpoint, at 1.00x cost"
            bars={CHECKPOINT_BARS.map(b => ({ ...b, sub: undefined }))}
            axis={['0', '10', '20', '30', '40']}
            note="↳ deepseek-flash · 40 runs per arm · Wilson 95% intervals"
          />
        </Both>
      </Board>

      {/* Home sections */}
      <Board
        id="home"
        n="Home · sections"
        title="Results, cost exhibit, systems, offers, protocol, terms"
      >
        <SectionHeader
          eyebrow="Quantified results"
          title="The numbers, each with its context"
          aside={
            <Verdict
              tone="muted"
              className="!max-w-[40ch] !text-[clamp(19px,1.7vw,23px)]"
            >
              Every figure below says where it came from — a system I built, my
              own platform, or an employed role. No borrowed client metrics.
            </Verdict>
          }
        />
        <ResultTiles items={RESULT_TILES} />
        <CostExhibit
          before={{ value: 82, label: COST_CASE.before }}
          after={{ value: 34, label: COST_CASE.after }}
          max={90}
          ticks={['$0', '$30', '$60', '$90 / mo']}
          delta={COST_CASE.delta}
          caption={`LLM bill: ${COST_CASE.before} → ${COST_CASE.after} / month`}
          sourceLabel={COST_CASE.label}
          proof={{ href: '/llm-cost-teardown', text: 'worked example' }}
          verdict="On a larger bill, the same moves free up real budget."
          strip={[
            'Multi-model routing',
            'Caching',
            'No drop in output quality',
          ]}
        />
        <CapabilityColumns
          items={[
            {
              icon: CapIcon.shield,
              title: 'Agent reliability engineering',
              body: 'Trajectory evals, false-green-rate metering, evidence-binding gates, and trust-tiered L0–L4 execution.',
            },
            {
              icon: CapIcon.gauge,
              title: 'LLM cost engineering',
              body: 'Multi-model routing, semantic caching, and per-service cost tracking that cut the bill without lowering output quality.',
            },
            {
              icon: CapIcon.layers,
              title: 'Production systems',
              body: 'Shipping software people depend on, long before agents. Years figure comes from lib/facts at implementation.',
            },
          ]}
        />
        <div className="ds-cards">
          {SYSTEMS.map(s => (
            <SystemCard
              key={s.id}
              name={s.name}
              kind={
                s.id === 'ascend'
                  ? 'daemon'
                  : s.id === 'dw'
                    ? 'pipeline'
                    : 'content engine'
              }
              tagline={s.tagline}
              metric={s.metric}
              links={
                s.repo
                  ? [
                      {
                        href: s.repo,
                        label: s.linkLabel ?? 'View on GitHub',
                        external: true,
                      },
                    ]
                  : [
                      {
                        href: '/methodology',
                        label: 'How runs & passes are counted',
                      },
                    ]
              }
            />
          ))}
        </div>
        <OfferColumns
          offers={OFFERS.map(o => ({
            ...o,
            kind:
              o.id === 'audit'
                ? 'Audit'
                : o.id === 'fractional'
                  ? 'Retainer'
                  : 'Cost',
          }))}
          footnote={
            <>
              Also available: <strong>{ADVISORY.name}</strong> at{' '}
              {ADVISORY.price} ({ADVISORY.terms}). {UPSELL}
            </>
          }
        />
        <Chain
          steps={PROTOCOL.map((p, i) => ({
            k: String(i + 1).padStart(2, '0'),
            title: p.step,
            body: p.detail,
          }))}
        />
        <TermsList
          items={[
            {
              term: 'Contracting entity',
              detail:
                'Easelect LTD (UK LTD). Invoiced in USD/GBP/EUR; standard contractor terms.',
            },
            {
              term: 'Access',
              detail:
                'Read-only access by default. Write access only when a change is agreed, scoped, and gated.',
            },
          ]}
        />
        <div
          className="ds-cards"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          }}
        >
          <ProofOfMethodCard
            kind="report"
            title="Sanitized sample audit report"
            body="Renders only when public/sample-audit-report.pdf exists."
            href="#home"
            cta="Download the sample report ↓"
          />
          <ProofOfMethodCard
            kind="video"
            title="Method walkthrough (2–3 min)"
            body="Renders only when PROOF_LOOM_URL is set."
            href="#home"
            cta="Watch the walkthrough ↗"
          />
        </div>
      </Board>
      <FinalCta
        title="Get a straight read on your agents"
        body="A 30-minute systems call: tell me what your agents do and where they worry you, and I'll tell you whether an audit, a cost teardown, or a retainer is the right next step."
        location="lab"
        trust={TRUST_CHIPS}
      />

      {/* Offer */}
      <Board
        id="offer"
        n="/audit · offer template"
        title="Pages that sell stay still"
        note="Price exactly once per page (T8): the hero card. Everything below is static."
      >
        <Both>
          <PriceCard
            price={OFFERS[0].price}
            terms={OFFERS[0].terms}
            location="lab"
            trust={TRUST_CHIPS}
          />
          <Price
            price={OFFERS[2].price}
            terms={OFFERS[2].terms}
            size="compact"
          />
        </Both>
        <Deliverables
          items={AUDIT_CONTENT.deliverables.map(d => ({
            title: d.title,
            body: d.detail,
          }))}
        />
        <TimelineBar />
        <Chain
          rule={false}
          keyTone="muted"
          steps={AUDIT_CONTENT.timeline.map(t => ({
            k: t.when,
            title: t.phase,
            body: t.detail,
          }))}
        />
        <FitBoxes
          forYou={AUDIT_CONTENT.forYou}
          notFit={AUDIT_CONTENT.notForYou}
        />
        {AUDIT_CONTENT.scopingNote && (
          <NoteRow label="Scope">{AUDIT_CONTENT.scopingNote}</NoteRow>
        )}
        <Faq
          items={AUDIT_CONTENT.faq.map((f, i) => ({
            id: `faq-${i}`,
            q: f.q,
            a: f.a,
          }))}
        />
        <div
          className="ds-cards"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          }}
        >
          <FieldReportCard
            href="/blog/six-false-greens-in-a-self-auditing-agent-pipeline"
            kind="Field report"
            title="Six False-Greens in a Self-Auditing Agent Pipeline"
            figure="6"
            figureTone="claim"
            cta="Read the field report"
          />
          <FieldReportCard
            href="/blog/the-calibration-ledger-58-runs-93-pass-n-is-small"
            kind="Field report"
            title="The Calibration Ledger: 58 Runs, 93% Pass, n Is Small"
            figure="~58 runs · ~93%"
            cta="Read the field report"
          />
          <FieldReportCard
            href="/methodology"
            kind="Methodology"
            title="How runs & passes are counted"
            figure="101 · 0.94"
            cta="See the methodology"
          />
        </div>
        <DataTable
          rowHeaders
          head={['', ...OFFERS.map(o => o.name)]}
          rows={[
            [
              'Price',
              ...OFFERS.map(o => ({
                v: (
                  <span className="ds-display" style={{ fontSize: 22 }}>
                    {o.price}
                  </span>
                ),
              })),
            ],
            ['Duration', ...OFFERS.map(o => ({ v: o.terms, num: true }))],
            [
              'Scope',
              ...OFFERS.map(o => ({
                v: <span style={{ color: 'var(--muted)' }}>{o.summary}</span>,
              })),
            ],
          ]}
        />
        <Lab>
          Offer comparison spec sheet: home or /work only, never on an offer
          page (T8).
        </Lab>
      </Board>

      {/* Writing */}
      <Board
        id="writing"
        n="/writing · wall of exhibits"
        title="Each post shows its number"
        note="Mini exhibits come from post frontmatter at implementation (exhibit:). Posts without one show none."
      >
        <Both>
          <Masthead location="lab_writing" id="nl-light-dark" />
          <Masthead variant="card" location="lab_card" id="nl-card" />
        </Both>
        <PostWall groups={POSTS} />
      </Board>

      {/* Post */}
      <Board
        id="post"
        n="/blog/[slug] · post template"
        title="Reading column, margin notes, key number"
      >
        <div className="ds-read" style={{ gridTemplateColumns: undefined }}>
          <Toc
            items={[
              { id: 'post', title: 'The short version' },
              { id: 'shell', title: 'Shell' },
            ]}
            jumpTo="key-number"
          />
          <article className="ds-flow">
            <ShortVersion>
              <p>
                Three arms, 40 runs each with a planted error. With no
                checkpoint 22 finished wrong and claimed success; with a forced
                checkpoint, 0.
              </p>
            </ShortVersion>
            <MarginNote>
              n = 40 runs per arm, each with a planted error. 160 runs at the
              final stage.
            </MarginNote>
            <p>
              Body copy sits in a 70ch column at 17px / 1.65. A margin note sits
              beside the paragraph it qualifies at 1200px and up, and inline
              above it below that.
            </p>
            <StatStrip
              items={[
                { value: '160', label: 'runs, final stage' },
                { value: '40', label: 'per arm' },
                { value: '1.94x', label: 'optional tool cost' },
                { value: '$3.67', label: 'whole experiment' },
              ]}
            />
            <DataTable
              compact
              head={['Arm', 'Silent failures', 'Cost', 'Checkpoint used']}
              rows={[
                [
                  'No checkpoint',
                  { v: '22 / 40', num: true, tone: 'claim' },
                  { v: '—', num: true },
                  { v: '—', num: true },
                ],
                [
                  'Checkpoint as an optional tool',
                  { v: '6 / 40', num: true },
                  { v: '1.94x', num: true },
                  { v: '38 / 40', num: true },
                ],
                [
                  'Forced checkpoint',
                  { v: '0 / 40', num: true, tone: 'accent' },
                  { v: '1.00x', num: true },
                  { v: 'forced', num: true },
                ],
              ]}
            />
            <MarginNote tone="claim">
              Model deepseek-flash. The whole experiment cost $3.67.
            </MarginNote>
            <PullQuote>
              The difference was never whether the agent had access to the
              truth. It was who decided when to look.
            </PullQuote>
            <Callout>
              <p>
                Pick one recent coding-agent session and find its last “tests
                pass”. Then look for a test run after the last code edit.
              </p>
            </Callout>
            <SeriesNav
              name="False Greens"
              index={6}
              total={7}
              prev={{
                href: '/blog/self-verification-cost-1-64x-and-caught-nothing',
                title: 'Self-Verification Cost 1.64x and Caught Nothing',
              }}
            />
          </article>
          <span />
        </div>
        <div className="ds-cards" style={{ gap: 48 }}>
          <RelatedList
            title="Related case studies"
            metaAt="end"
            items={[
              {
                href: '/work/ascend-autonomous-agents',
                title: 'Ascend: Agent Orchestration Daemon',
                meta: 'R&D',
              },
            ]}
          />
          <RelatedList
            title="More posts"
            items={[
              {
                href: '/blog/nine-times-the-eval-tried-to-lie-to-me',
                title: 'Nine Times the Eval Tried to Lie to Me',
                meta: '2026-09-08',
              },
            ]}
          />
        </div>
        <DiscussCta
          body="I help teams build autonomous agent systems and production AI infrastructure."
          location="lab_post"
          secondary={{
            href: '/audit',
            label: 'or see the audit this method comes from',
          }}
        />
        <Masthead variant="footer" location="lab_post_footer" id="nl-footer" />
      </Board>

      {/* Shell */}
      <Board
        id="shell"
        n="Shell"
        title="Header, mobile menu, ⌘K, footer"
        note="Resize below 920px for the MENU sheet (a <details>, works without JavaScript). ⌘K or Ctrl+K opens the palette."
      >
        <div
          style={{
            border: '1px solid var(--line)',
            borderRadius: 8,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <SiteHeader path="/audit" />
        </div>
        <div
          style={{
            border: '1px solid var(--line)',
            borderRadius: 8,
            position: 'relative',
          }}
        >
          <SiteHeader reading={{ minutes: 9 }} />
        </div>
        <SiteFooter />
      </Board>
    </div>
  );
}
