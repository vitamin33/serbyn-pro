'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { BarChart, type BarDatum } from './bars';
import {
  Chip,
  Eyebrow,
  SignoffStrip,
  Signature,
  SourceLabel,
  TierBadge,
  TIER_NAME,
  Verdict,
  ProofLink,
} from './primitives';
import { ExhibitFrame, SERIES_VAR, type Series } from './exhibit';
import { prefersReducedMotion, useReplay, useReveal } from './motion';
import { ThreadLayer, useThreads } from './threads';
import { minus, pct } from './stats';

// The signature components: the ones that carry the "claim -> scan -> proof ->
// settle" motion. Each renders its settled state on the server; the sequence
// runs once on first view (or on an explicit action) and can be replayed.

const ReplayIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export function ReplayButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="ds-kbtn"
      onClick={onClick}
      aria-label={label}
    >
      <ReplayIcon />
      replay
    </button>
  );
}

/* ── Result tiles ───────────────────────────────────────────────────────── */

export interface ResultItem {
  value: string;
  caption: string;
  /** source label from lib/facts */
  label: string;
  proof?: { href: string; text?: string; external?: boolean };
}

/**
 * The quantified-results row. On first view the numbers arrive at 55%
 * contrast, a scan crosses each tile, the source lands and its tick draws.
 * Hover or focus a tile to trace a thread from the number to its source.
 */
export function ResultTiles({
  items,
  layout,
}: {
  items: ResultItem[];
  layout?: 'rows';
}) {
  const { ref, revealProps } = useReveal<HTMLDivElement>(0.35);
  const [lit, setLit] = useState<number | null>(null);
  const measure = useCallback(
    (i: number) => {
      const t = ref.current?.querySelectorAll('.ds-tile')[i];
      return t
        ? {
            from: t.querySelector('.ds-tile-v'),
            to: t.querySelector('.ds-src'),
          }
        : null;
    },
    [ref]
  );
  const { hostRef, threads, show, clear } = useThreads<HTMLDivElement>(measure);
  const enter = (i: number) => () => {
    if (lit === i) return;
    setLit(i);
    show([i]);
  };
  const leave = () => {
    setLit(null);
    clear();
  };

  return (
    <div className="ds-tiles-host" ref={hostRef}>
      <div className="ds-tiles" ref={ref} data-layout={layout} {...revealProps}>
        {items.map((it, i) => (
          <div
            key={it.value}
            className="ds-tile"
            data-claim={it.value}
            data-lit={lit === i ? '' : undefined}
            onMouseEnter={enter(i)}
            onMouseLeave={leave}
            onFocus={enter(i)}
            onBlur={leave}
          >
            <span className="ds-scan-x" aria-hidden="true" />
            <span className="ds-tile-v" data-claim-value="">
              {minus(it.value)}
            </span>
            <span className="ds-tile-cap">{it.caption}</span>
            <SourceLabel label={it.label} />
            {it.proof && (
              <ProofLink href={it.proof.href} external={it.proof.external}>
                {it.proof.text ?? 'proof'}
              </ProofLink>
            )}
          </div>
        ))}
      </div>
      <ThreadLayer threads={threads} />
    </div>
  );
}

/* ── Cost exhibit (−58%) ────────────────────────────────────────────────── */

/**
 * Before/after with the removed spend kept visible as a hatched ghost.
 * Sequence on first view (35% visible), once, with replay: scan passes, the
 * "after" bar shrinks from the "before" length and turns from terracotta to
 * evergreen, the ghost and difference land, the direction chip stamps, the
 * source lands, then a thread ties the number to its source.
 */
export function CostExhibit({
  before,
  after,
  max,
  ticks,
  delta,
  caption,
  sourceLabel,
  proof,
  verdict,
  strip,
  topic = 'LLM cost engineering',
  eyebrow = 'Exhibit · LLM bill',
  still = false,
}: {
  before: { value: number; label: string };
  after: { value: number; label: string };
  max: number;
  ticks: string[];
  delta: string;
  caption: string;
  sourceLabel: string;
  proof?: { href: string; text: string };
  verdict?: ReactNode;
  strip?: string[];
  topic?: string;
  eyebrow?: string;
  /** pages that sell stay still: settled state, no sequence, no replay */
  still?: boolean;
}) {
  const { ref, seen, revealProps } = useReveal<HTMLElement>(0.35);
  const { run, replay } = useReplay();
  const measure = useCallback(
    () => ({
      from: ref.current?.querySelector('.ds-giant') ?? null,
      to: ref.current?.querySelector('.ds-cx-src') ?? null,
    }),
    [ref]
  );
  const { hostRef, threads, show, clear } = useThreads<HTMLElement>(measure, {
    minX: 8,
    fromY: 0.45,
  });

  useEffect(() => {
    if (!seen || still) return;
    clear();
    const t = window.setTimeout(
      () => show([0]),
      prefersReducedMotion() ? 0 : 1900
    );
    return () => window.clearTimeout(t);
  }, [seen, run, show, clear, still]);

  const b = before.value / max;
  const a = after.value / max;
  const diff = before.value - after.value;

  return (
    <figure
      ref={el => {
        ref.current = el;
        hostRef.current = el;
      }}
      className="ds-card ds-exhibit ds-cx"
      data-size="lg"
      data-claim={delta}
      style={{ '--from': before.value / after.value } as React.CSSProperties}
      {...(still ? {} : revealProps)}
    >
      <div className="ds-exhibit-head">
        <div>
          <Eyebrow tone="fg">{eyebrow}</Eyebrow>
          <Chip variant="claim">{topic}</Chip>
        </div>
        {!still && (
          <ReplayButton onClick={replay} label="Replay the cost exhibit" />
        )}
      </div>
      <div className="ds-cx-grid" key={run}>
        <div className="ds-cx-num">
          <span className="ds-giant" data-claim-value="">
            {minus(delta)}
          </span>
          <div className="ds-cx-num-line">
            <Chip className="ds-cx-chip">Lower is better</Chip>
            <b>{caption}</b>
          </div>
        </div>
        <div
          className="ds-cx-bars"
          role="img"
          aria-label={`${caption}. ${sourceLabel}.`}
        >
          <div className="ds-cx-row">
            <Eyebrow size="sm">Before</Eyebrow>
            <div className="ds-track">
              <div
                className="ds-cx-bar"
                style={{ width: pct(b), background: 'var(--claim)' }}
              />
              <span
                className="ds-cx-val"
                style={{ left: `calc(${pct(b)} + 10px)` }}
              >
                {before.label}
              </span>
            </div>
          </div>
          <div className="ds-cx-row">
            <Eyebrow size="sm">After</Eyebrow>
            <div className="ds-track">
              <div
                className="ds-ghost"
                style={{ left: pct(a), width: pct(b - a) }}
              >
                <span className="ds-late">−${diff}</span>
              </div>
              <div
                className="ds-cx-bar ds-cx-after"
                style={{ width: pct(a), background: 'var(--accent)' }}
              >
                <span className="ds-cx-tint" />
              </div>
              <span
                className="ds-cx-val ds-late"
                style={{ left: `calc(${pct(a)} + 10px)` }}
              >
                {after.label}
              </span>
            </div>
          </div>
          <div className="ds-cx-row" aria-hidden="true">
            <span />
            <div className="ds-axis">
              {ticks.map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="ds-cx-scanwrap" aria-hidden="true">
            <div className="ds-scan-x" />
          </div>
        </div>
      </div>
      <div className="ds-cx-foot ds-late">
        <p
          className="ds-src ds-cx-src"
          data-claim-label=""
          style={{ fontSize: 12.5 }}
        >
          <span className="ds-hook">↳</span> {sourceLabel}
          {proof && <ProofLink href={proof.href}>{proof.text}</ProofLink>}
        </p>
        {verdict && <Verdict>{verdict}</Verdict>}
      </div>
      {strip && <SignoffStrip items={strip} />}
      <Signature />
      <ThreadLayer threads={threads} />
    </figure>
  );
}

/* ── Head-to-head (D.1) ─────────────────────────────────────────────────── */

export interface H2HMetric {
  name: string;
  direction: string;
  a: { k: number; n: number; display: string };
  b: { k: number; n: number; display: string };
}

/** Two arms of one experiment. Pick an arm to dim the other. */
export function HeadToHead({
  eyebrow,
  topic,
  title,
  meta,
  arms,
  won,
  metrics,
  boxes,
  verdict,
  source,
  strip,
}: {
  eyebrow: string;
  topic: string;
  title: string;
  meta: string;
  arms: {
    A: { name: string; series: Series };
    B: { name: string; series: Series };
  };
  won?: { label: string; text: string; aShare: number };
  metrics: H2HMetric[];
  boxes?: { A: [string, string]; B: [string, string] };
  verdict?: ReactNode;
  source?: ReactNode;
  strip?: string[];
}) {
  const [hl, setHl] = useState<'A' | 'B' | null>(null);
  const pick = (arm: 'A' | 'B') => setHl(h => (h === arm ? null : arm));
  const bar = (arm: 'A' | 'B', m: H2HMetric): BarDatum => ({
    label: arm,
    series: arms[arm].series,
    k: m[arm === 'A' ? 'a' : 'b'].k,
    n: m[arm === 'A' ? 'a' : 'b'].n,
    display: m[arm === 'A' ? 'a' : 'b'].display,
  });

  return (
    <ExhibitFrame
      eyebrow={eyebrow}
      topic={topic}
      title={title}
      meta={meta}
      verdict={verdict}
      source={source}
      strip={strip}
      className="ds-h2h"
      data-hl={hl ?? undefined}
    >
      <div className="ds-arms">
        {(['A', 'B'] as const).map(arm => (
          <button
            key={arm}
            type="button"
            className="ds-arm-btn"
            aria-pressed={hl === arm}
            onClick={() => pick(arm)}
          >
            <span
              className="ds-swatch"
              style={{ background: SERIES_VAR[arms[arm].series] }}
            />
            {arm} · {arms[arm].name}
          </button>
        ))}
      </div>
      {won && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Eyebrow size="xs">{won.label}</Eyebrow>
            <span className="ds-mono ds-num" style={{ fontSize: 12 }}>
              {won.text}
            </span>
          </div>
          <div className="ds-meter">
            <span
              className="ds-arm"
              data-arm="A"
              style={{
                width: pct(won.aShare),
                background: SERIES_VAR[arms.A.series],
              }}
            />
            <span
              className="ds-arm"
              data-arm="B"
              style={{
                width: pct(1 - won.aShare),
                background: SERIES_VAR[arms.B.series],
              }}
            />
          </div>
        </div>
      )}
      {metrics.map(m => (
        <div className="ds-exhibit-block" key={m.name}>
          <div className="ds-exhibit-block-head">
            <b>{m.name}</b>
            <Chip>{m.direction}</Chip>
          </div>
          {(['A', 'B'] as const).map(arm => (
            <div key={arm} className="ds-arm" data-arm={arm}>
              <BarChart
                data={[bar(arm, m)]}
                labelWidth={22}
                valueWidth={96}
                trackHeight={18}
              />
            </div>
          ))}
        </div>
      ))}
      <span className="ds-note" style={{ fontSize: 10.5 }}>
        axis 0–100% · whiskers = Wilson 95% intervals
      </span>
      {boxes && (
        <div className="ds-split">
          {(['A', 'B'] as const).map(arm => (
            <div
              key={arm}
              className="ds-box ds-arm"
              data-arm={arm}
              style={{ borderColor: SERIES_VAR[arms[arm].series] }}
            >
              <Eyebrow size="xs">{boxes[arm][0]}</Eyebrow>
              <b>{boxes[arm][1]}</b>
            </div>
          ))}
        </div>
      )}
    </ExhibitFrame>
  );
}

/* ── Key number (post hero figure) ──────────────────────────────────────── */

export function KeyNumber({
  value,
  unit,
  caption,
  direction = 'Lower is better',
  bars,
  axis,
  note,
}: {
  value: string;
  unit?: string;
  caption: string;
  direction?: string;
  bars: BarDatum[];
  axis?: string[];
  note: ReactNode;
}) {
  const { run, replay } = useReplay();
  return (
    <figure id="key-number" className="ds-card ds-keynum">
      <div className="ds-keynum-num">
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Eyebrow tone="fg">Key number</Eyebrow>
          <Chip>{direction}</Chip>
        </div>
        <span className="ds-display">
          {minus(value)}
          {unit && <small> {unit}</small>}
        </span>
        <b>{caption}</b>
      </div>
      <ReplayButton onClick={replay} label="Replay the interval animation" />
      <BarChart
        data={bars}
        motion="interval"
        replayKey={run}
        labelWidth={140}
        valueWidth={60}
        axis={axis}
        note={note}
      />
    </figure>
  );
}

/* ── Claim check ("Check this claim") ───────────────────────────────────── */

export interface LedgerRow {
  tool: string;
  target: ReactNode;
}

/**
 * The home hero. A claim, the session ledger behind it, and the rule. "Check
 * the claim": the marker drops on the last code edit, a scan reads the rows
 * after it, and either finds nothing (the claim is struck through, D stamps)
 * or finds a passing run (the claim is underlined, A stamps).
 * Without JavaScript the settled D verdict is shown and the controls hide.
 */
export function ClaimCheck({
  claim = '“All tests pass. Done.”',
  ledger,
  passRow,
  passLabel,
  rule,
}: {
  claim?: string;
  ledger: LedgerRow[];
  /** the row a passing ending appends after the last edit */
  passRow: LedgerRow;
  /** segmented-control label for that ending ("+ pytest → 42 passed") */
  passLabel: string;
  rule: ReactNode;
}) {
  const [checked, setChecked] = useState(false);
  const [ending, setEnding] = useState<'none' | 'pass'>('none');
  const [run, setRun] = useState(0);
  const [from, setFrom] = useState<'bad' | 'ok' | null>(null);

  const pass = ending === 'pass';
  const state = !checked ? 'pending' : pass ? 'ok' : 'bad';
  const tier = pass ? 'A' : 'D';

  // `from` lets the strike retract when a D turns into an A
  const go = (nextEnding: 'none' | 'pass', check: boolean) => {
    setFrom(state === 'pending' ? null : state);
    setEnding(nextEnding);
    if (check) setChecked(true);
    setRun(r => r + 1);
  };

  const verdict = (t: 'A' | 'D', animated: boolean) => (
    <div className="ds-pc-verdict" key={animated ? `v${run}` : 'static'}>
      <div className={animated ? 'ds-stampwrap' : undefined}>
        <TierBadge tier={t} />
      </div>
      <div className={animated ? 'ds-late' : undefined}>
        <Eyebrow size="sm" className={`ds-tier-${t.toLowerCase()}`}>
          Tier {t} · {TIER_NAME[t]}
        </Eyebrow>
        <b>
          {t === 'A'
            ? 'A passing test run after the last edit.'
            : 'No test run after the last edit.'}
        </b>
      </div>
    </div>
  );

  return (
    <div
      className="ds-card ds-pc"
      data-state={state}
      data-from={state === 'ok' && from === 'bad' ? 'bad' : undefined}
    >
      <div className="ds-pc-head">
        <Eyebrow tone="fg">Check this claim</Eyebrow>
        <Chip>Example</Chip>
      </div>
      <div className="ds-pc-claim">
        <div>
          <Eyebrow size="sm">agent ›</Eyebrow>
          <span className="ds-pc-q" key={`q${run}`}>
            <span>{claim}</span>
            <span className="ds-pc-strike" aria-hidden="true" />
            <span className="ds-pc-under" aria-hidden="true" />
          </span>
        </div>
        <span className="ds-pc-state" key={`s${run}`} aria-live="polite">
          {state === 'pending'
            ? 'claimed · unchecked'
            : state === 'ok'
              ? 'proven'
              : 'not proven'}
        </span>
      </div>
      <div className="ds-pc-ledger">
        <div className="ds-pc-ledger-head">
          <Eyebrow size="sm">Session ledger</Eyebrow>
          <Eyebrow size="sm">tool · result</Eyebrow>
        </div>
        {ledger.map((r, i) => (
          <div className="ds-lrow" data-pre="" key={i}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <span>{r.tool}</span>
            <span>{r.target}</span>
          </div>
        ))}
        {checked && (
          <div className="ds-marker" key={`m${run}`}>
            <Chip variant="claim" size="sm">
              Last code edit
            </Chip>
          </div>
        )}
        <div className="ds-pc-after">
          {pass ? (
            <div className="ds-lrow" data-tail="">
              <span>{String(ledger.length + 1).padStart(2, '0')}</span>
              <span>{passRow.tool}</span>
              <span>{passRow.target}</span>
            </div>
          ) : (
            <div className="ds-lrow" data-tail="">
              <span>—</span>
              <span />
              <span data-result="none">
                {checked ? 'nothing after the last edit' : 'end of session'}
              </span>
            </div>
          )}
          {checked && (
            <div className="ds-scan-y" key={`scan${run}`} aria-hidden="true" />
          )}
        </div>
      </div>
      {checked ? (
        verdict(tier, true)
      ) : (
        <noscript>{verdict('D', false)}</noscript>
      )}
      <div className="ds-pc-controls">
        <button
          type="button"
          className="ds-btn"
          data-variant="inverse"
          onClick={() => go(ending, true)}
        >
          {checked ? 'Check again' : 'Check the claim'}
        </button>
        <div className="ds-segline" role="group" aria-label="Session ending">
          <button
            type="button"
            aria-pressed={!pass}
            onClick={() => go('none', false)}
          >
            ends after edit
          </button>
          <button
            type="button"
            aria-pressed={pass}
            onClick={() => go('pass', false)}
          >
            {passLabel}
          </button>
        </div>
      </div>
      <p className="ds-pc-rule">{rule}</p>
    </div>
  );
}
