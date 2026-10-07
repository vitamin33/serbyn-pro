import type { ReactNode } from 'react';
import { arrowHead, labelSpot, pointsAttr, r1, type Pt } from './geometry';
import { asLines } from './metrics';

// Server components only: no hooks, no context, no client JS. Every color comes
// from a dg-* class in styles/diagram.css.

export type Tone = 'default' | 'accent' | 'muted' | 'ledger';
export type Tier = 'a' | 'b' | 'c' | 'd';
export type Encoding =
  | 'default'
  | 'accent'
  | 'muted'
  | 'dashed'
  | 'edge-accent'
  | 'edge-dashed'
  | `tier-${Tier}`;

export type LegendItem = { encoding: Encoding; label: string };

const BOX_CLASS: Record<Tone, string> = {
  default: 'dg-b',
  accent: 'dg-b-acc',
  muted: 'dg-b-mut',
  ledger: 'dg-b-led',
};

// ── Diagram: figure + frame + svg + legend + caption ──────────────────────

export function Diagram({
  label,
  caption,
  width = 960,
  height,
  minWidth,
  legend,
  usage,
  className,
  children,
}: {
  /** Becomes the svg aria-label. Say what the picture shows, in a sentence. */
  label: string;
  /** States the claim the diagram supports. */
  caption?: ReactNode;
  width?: number;
  height: number;
  /** Below this width the frame scrolls instead of shrinking the text. */
  minWidth?: number;
  legend?: LegendItem[];
  /** Encoding counts from a preset; legend items used fewer than 2 times are dropped. */
  usage?: Partial<Record<Encoding, number>>;
  className?: string;
  children: ReactNode;
}) {
  const items =
    usage && legend
      ? legend.filter(l => (usage[l.encoding] ?? 0) >= 2)
      : (legend ?? []);
  return (
    <figure
      className={['dg-figure', 'wide', className].filter(Boolean).join(' ')}
    >
      {/* tabIndex: a region that can scroll sideways must be reachable by keyboard */}
      <div className="dg-frame" tabIndex={0}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={label}
          style={{ minWidth: minWidth ?? Math.round(width * 0.79) }}
        >
          {children}
        </svg>
      </div>
      {items.length > 0 && (
        <ul className="dg-legend" aria-label="Legend">
          {items.map(i => (
            <li key={i.encoding + i.label}>
              <span
                className="dg-swatch"
                data-enc={i.encoding}
                aria-hidden="true"
              />
              {i.label}
            </li>
          ))}
        </ul>
      )}
      {caption && <figcaption className="dg-caption">{caption}</figcaption>}
    </figure>
  );
}

// ── Text ──────────────────────────────────────────────────────────────────

type TextClass = 't' | 't-s' | 't-m' | 't-mm' | 't-acc' | 't-h';

export function Text({
  x,
  y,
  children,
  cls = 't',
  anchor,
  halo,
}: {
  x: number;
  y: number;
  children: ReactNode;
  cls?: TextClass;
  anchor?: 'start' | 'middle' | 'end';
  halo?: boolean;
}) {
  return (
    <text
      x={r1(x)}
      y={r1(y)}
      textAnchor={anchor === 'start' ? undefined : anchor}
      className={`dg-${cls}${halo ? ' dg-halo' : ''}`}
    >
      {children}
    </text>
  );
}

/** Uppercase mono label for a region of the drawing ("in the session"). */
export function SectionLabel({
  x,
  y,
  children,
  anchor,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <Text x={x} y={y} cls="t-h" anchor={anchor}>
      {children}
    </Text>
  );
}

/** Free annotation; one string per line, 14px apart. */
export function Note({
  x,
  y,
  lines,
  tone = 'muted',
  anchor,
  halo,
}: {
  x: number;
  y: number;
  lines: string | string[];
  tone?: 'muted' | 'fg' | 'accent';
  anchor?: 'start' | 'middle' | 'end';
  halo?: boolean;
}) {
  const cls: TextClass =
    tone === 'accent' ? 't-acc' : tone === 'fg' ? 't-m' : 't-mm';
  return (
    <>
      {asLines(lines).map((l, i) => (
        <Text
          key={i}
          x={x}
          y={y + i * 14}
          cls={cls}
          anchor={anchor}
          halo={halo}
        >
          {l}
        </Text>
      ))}
    </>
  );
}

// ── Box ───────────────────────────────────────────────────────────────────

export function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  tone = 'default',
  mono,
  rx = 4,
  titleY,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  /** One string per line under the title. */
  sub?: string | string[];
  tone?: Tone;
  /** Title in mono (technical names). */
  mono?: boolean;
  rx?: number;
  /** Override the title baseline (relative to y). */
  titleY?: number;
}) {
  const subs = asLines(sub);
  const span = title
    ? 18 * Math.min(subs.length, 1) + 14 * Math.max(subs.length - 1, 0)
    : 14 * Math.max(subs.length - 1, 0);
  const firstBaseline = titleY ?? h / 2 - span / 2 + (title ? 6 : 4);
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={r1(x)}
        y={r1(y)}
        width={r1(w)}
        height={r1(h)}
        rx={rx}
        className={BOX_CLASS[tone]}
      />
      {title && (
        <Text
          x={cx}
          y={y + firstBaseline}
          cls={mono ? 't-m' : 't'}
          anchor="middle"
        >
          {title}
        </Text>
      )}
      {subs.map((s, i) => (
        <Text
          key={i}
          x={cx}
          y={y + firstBaseline + (title ? 18 : 0) + i * 14}
          cls="t-s"
          anchor="middle"
        >
          {s}
        </Text>
      ))}
    </g>
  );
}

/** Dashed container for a boundary ("harness: Claude Code"). */
export function Boundary({
  x,
  y,
  w,
  h,
  label,
  tone = 'default',
  rx = 6,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  tone?: 'default' | 'accent' | 'muted';
  rx?: number;
}) {
  const cls =
    tone === 'accent' ? 'dg-ln-acc' : tone === 'muted' ? 'dg-ln-mfg' : 'dg-ln';
  return (
    <g>
      <rect
        x={r1(x)}
        y={r1(y)}
        width={r1(w)}
        height={r1(h)}
        rx={rx}
        className={`${cls} dg-dash`}
      />
      {label && (
        <Text x={x + 12} y={y + 20} cls={tone === 'accent' ? 't-acc' : 't-mm'}>
          {label}
        </Text>
      )}
    </g>
  );
}

// ── Arrow ─────────────────────────────────────────────────────────────────

export function Arrow({
  points,
  curve,
  tone = 'default',
  dashed,
  head = true,
  label,
  labelAt,
  labelAnchor,
  labelTone,
  halo,
}: {
  /** Polyline points; the head sits on the last one. */
  points: Pt[];
  /** Quadratic control point (only with exactly 2 points). */
  curve?: Pt;
  tone?: 'default' | 'accent' | 'muted';
  dashed?: boolean;
  head?: boolean;
  /** One string per line. */
  label?: string | string[];
  labelAt?: Pt;
  labelAnchor?: 'start' | 'middle' | 'end';
  labelTone?: 'muted' | 'accent';
  halo?: boolean;
}) {
  const sw = tone === 'accent' ? 1.6 : tone === 'muted' ? 1.2 : 1.3;
  const cls =
    tone === 'accent' ? 'dg-ln-acc' : tone === 'muted' ? 'dg-ln-mfg' : 'dg-ln';
  const ah =
    tone === 'accent' ? 'dg-ah-acc' : tone === 'muted' ? 'dg-ah-mfg' : 'dg-ah';
  const end = points[points.length - 1];
  const tail = curve && points.length === 2 ? curve : points[points.length - 2];
  const spot = labelAt
    ? { x: labelAt[0], y: labelAt[1], anchor: labelAnchor ?? 'start' }
    : curve
      ? {
          x: 0.25 * points[0][0] + 0.5 * curve[0] + 0.25 * end[0],
          y: 0.25 * points[0][1] + 0.5 * curve[1] + 0.25 * end[1],
          anchor: labelAnchor ?? 'middle',
        }
      : {
          ...labelSpot(points),
          ...(labelAnchor ? { anchor: labelAnchor } : {}),
        };
  const lines = asLines(label);
  // An explicit labelAt is the first baseline. Auto labels stack upward above a
  // horizontal segment and center on a vertical one.
  const lineShift = labelAt
    ? 0
    : spot.anchor === 'start'
      ? ((lines.length - 1) / 2) * 14
      : (lines.length - 1) * 14;
  const lineCls = `${cls}${dashed ? ' dg-dash' : ''}`;
  return (
    <g>
      {curve && points.length === 2 ? (
        <path
          d={`M${r1(points[0][0])} ${r1(points[0][1])} Q${r1(curve[0])} ${r1(curve[1])} ${r1(end[0])} ${r1(end[1])}`}
          className={lineCls}
        />
      ) : points.length === 2 ? (
        <line
          x1={r1(points[0][0])}
          y1={r1(points[0][1])}
          x2={r1(end[0])}
          y2={r1(end[1])}
          className={lineCls}
        />
      ) : (
        <polyline points={pointsAttr(points)} className={lineCls} />
      )}
      {head && <polygon points={arrowHead(tail, end, sw)} className={ah} />}
      {lines.map((l, i) => (
        <Text
          key={i}
          x={spot.x}
          y={spot.y + i * 14 - lineShift}
          cls={labelTone === 'accent' ? 't-acc' : 't-mm'}
          anchor={spot.anchor}
          halo={halo}
        >
          {l}
        </Text>
      ))}
    </g>
  );
}

// ── Lanes, markers, badges, pills ─────────────────────────────────────────

/** A muted horizontal track with its label at the left. */
export function Lane({
  y,
  x1,
  x2,
  label,
  labelX = 16,
  emphasis,
}: {
  y: number;
  x1: number;
  x2: number;
  label?: string;
  labelX?: number;
  emphasis?: boolean;
}) {
  return (
    <g>
      {label && (
        <Text x={labelX} y={y + 4} cls={emphasis ? 't-acc' : 't-s'}>
          {label}
        </Text>
      )}
      <line
        x1={r1(x1)}
        y1={r1(y)}
        x2={r1(x2)}
        y2={r1(y)}
        className={emphasis ? 'dg-ln-acc' : 'dg-ln-mut'}
      />
    </g>
  );
}

/** Vertical accent line across lanes ("last code edit"). */
export function Marker({
  x,
  y1,
  y2,
  label,
  labelY,
}: {
  x: number;
  y1: number;
  y2: number;
  label?: string;
  labelY?: number;
}) {
  return (
    <g>
      <line
        x1={r1(x)}
        y1={r1(y1)}
        x2={r1(x)}
        y2={r1(y2)}
        className="dg-ln-acc dg-dash"
      />
      {label && (
        <Text x={x} y={labelY ?? y1 - 10} cls="t-acc" anchor="middle">
          {label}
        </Text>
      )}
    </g>
  );
}

/** Filled circle with a letter: tier A–D, or accent/fg. */
export function Badge({
  cx,
  cy,
  r = 16,
  label,
  tier,
}: {
  cx: number;
  cy: number;
  r?: number;
  label: string;
  tier?: Tier | 'fg';
}) {
  return (
    <g>
      <circle
        cx={r1(cx)}
        cy={r1(cy)}
        r={r}
        className={tier && tier !== 'fg' ? `dg-f${tier}` : 'dg-fg'}
      />
      <text
        x={r1(cx)}
        y={r1(cy + 5)}
        textAnchor="middle"
        className="dg-badge-t"
      >
        {label}
      </text>
    </g>
  );
}

/** Rounded run pill ("full run ✓ 42"), stroked by tier, or muted. */
export function Pill({
  x,
  y,
  w,
  h = 24,
  label,
  tier,
  tone = 'default',
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  tier?: Tier;
  tone?: 'default' | 'muted' | 'accent';
}) {
  const cls =
    tone === 'muted'
      ? 'dg-run-mut'
      : tone === 'accent'
        ? 'dg-run-acc'
        : `dg-run ${tier ? `dg-s${tier}` : 'dg-sfg'}`;
  return (
    <g>
      <rect
        x={r1(x)}
        y={r1(y)}
        width={r1(w)}
        height={h}
        rx={h / 2}
        className={cls}
      />
      <Text
        x={x + w / 2}
        y={y + h / 2 + 4}
        cls={tone === 'muted' ? 't-mm' : 't-m'}
        anchor="middle"
      >
        {label}
      </Text>
    </g>
  );
}

/** Small rotated square: an event on a lane (a code edit). */
export function Diamond({
  cx,
  cy,
  size = 14,
  tone = 'default',
}: {
  cx: number;
  cy: number;
  size?: number;
  tone?: 'default' | 'accent';
}) {
  return (
    <rect
      x={r1(cx - size / 2)}
      y={r1(cy - size / 2)}
      width={size}
      height={size}
      transform={`rotate(45 ${r1(cx)} ${r1(cy)})`}
      className={tone === 'accent' ? 'dg-b-acc' : 'dg-b'}
    />
  );
}

/** Dashed horizontal rule between bands of a drawing. */
export function Divider({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <line x1={x1} y1={y} x2={x2} y2={y} className="dg-ln-mut dg-dash" />;
}

/** Plain <g>, optionally translated, to move a hand-placed cluster as one. */
export function Group({
  x = 0,
  y = 0,
  children,
}: {
  x?: number;
  y?: number;
  children: ReactNode;
}) {
  return (
    <g transform={x || y ? `translate(${x} ${y})` : undefined}>{children}</g>
  );
}
