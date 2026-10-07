import {
  Arrow,
  Badge,
  Diagram,
  Diamond,
  Lane,
  Marker,
  Pill,
  SectionLabel,
  Text,
  type Tier,
} from '../primitives';
import { textWidth } from '../metrics';
import { MARGIN, minW, Usage, type PresetBase } from './shared';

export type LaneEvent = {
  id?: string;
  /** Position in domain units. */
  at: number;
  /** pill: a test run; box: a message or artifact; diamond: an instant (an edit); text: a note. */
  kind?: 'pill' | 'box' | 'diamond' | 'text';
  label?: string;
  /** Width in px; default fits the label. */
  w?: number;
  tier?: Tier;
  muted?: boolean;
};

export type SwimlaneDiagramProps = PresetBase & {
  /** Time range the track spans, in any unit. */
  domain: [number, number];
  lanes: {
    id: string;
    label: string;
    events: LaneEvent[];
    outcome?: { tier: Tier; label: string };
  }[];
  /** Column headers above the lanes, at domain positions. */
  columns?: { label: string; at: number }[];
  /** Header over the outcome badges. */
  outcomeLabel?: string;
  /** Vertical line across every lane. */
  marker?: { at: number; label: string };
  /** Label under the time axis. */
  axis?: string;
  /** Override the track's x range in px (default: fit lane labels). */
  track?: [number, number];
  laneGap?: number;
};

/** Several lanes against one time axis, with a marker line ("last code edit"). */
export function SwimlaneDiagram({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  domain,
  lanes,
  columns = [],
  outcomeLabel,
  marker,
  axis,
  track,
  laneGap = 55,
}: SwimlaneDiagramProps) {
  const W = width;
  const hasOutcome = lanes.some(l => l.outcome);
  const labelW = Math.max(...lanes.map(l => textWidth(l.label, 't-s')));
  const x1 = track?.[0] ?? Math.max(120, Math.ceil(MARGIN + labelW + 24));
  const x2 = track?.[1] ?? W - MARGIN - (hasOutcome ? 74 : 0);
  const ox = x2 + 38;
  const sx = (at: number) =>
    x1 + ((at - domain[0]) / (domain[1] - domain[0])) * (x2 - x1);

  const hasHeader = columns.length > 0 || !!marker || !!outcomeLabel;
  const headerY = 24;
  const firstY = hasHeader ? 68 : 32;
  const laneY = (i: number) => firstY + i * laneGap;
  const lastY = laneY(lanes.length - 1);
  const axisY = lastY + 47;
  const H = axis ? axisY + 20 : lastY + 30;

  const usage = new Usage();
  const emph = (id?: string) => !!id && !!emphasis?.includes(id);

  const body = (
    <>
      {marker && (
        <Marker
          x={sx(marker.at)}
          y1={headerY + 10}
          y2={lastY + 29}
          label={marker.label}
          labelY={headerY}
        />
      )}
      {columns.map(c => (
        <SectionLabel key={c.label} x={sx(c.at)} y={headerY} anchor="middle">
          {c.label}
        </SectionLabel>
      ))}
      {outcomeLabel && hasOutcome && (
        <SectionLabel x={ox} y={headerY} anchor="middle">
          {outcomeLabel}
        </SectionLabel>
      )}
      {lanes.map((lane, i) => {
        const y = laneY(i);
        if (lane.outcome) usage.add(`tier-${lane.outcome.tier}`);
        return (
          <g key={lane.id}>
            <Lane
              y={y}
              x1={x1}
              x2={x2}
              label={lane.label}
              emphasis={emph(lane.id)}
            />
            {lane.events.map((ev, j) => {
              const x = sx(ev.at);
              const kind = ev.kind ?? 'pill';
              const key = ev.id ?? `${lane.id}-${j}`;
              if (kind === 'diamond')
                return (
                  <Diamond
                    key={key}
                    cx={x}
                    cy={y}
                    tone={emph(ev.id) ? 'accent' : 'default'}
                  />
                );
              if (kind === 'text')
                return (
                  <Text key={key} x={x} y={y + 4} cls="t-mm" anchor="middle">
                    {ev.label}
                  </Text>
                );
              const w =
                ev.w ?? Math.ceil(textWidth(ev.label ?? '', 't-m') + 28);
              if (kind === 'box') {
                const tone = emph(ev.id) ? 'accent' : 'default';
                usage.tone(tone);
                return (
                  <g key={key}>
                    <rect
                      x={x - w / 2}
                      y={y - 12}
                      width={w}
                      height={24}
                      rx={4}
                      className={tone === 'accent' ? 'dg-b-acc' : 'dg-b'}
                    />
                    <Text x={x} y={y + 4} cls="t-m" anchor="middle">
                      {ev.label}
                    </Text>
                  </g>
                );
              }
              const tone = emph(ev.id)
                ? 'accent'
                : ev.muted
                  ? 'muted'
                  : 'default';
              usage.tone(tone);
              if (ev.tier) usage.add(`tier-${ev.tier}`);
              return (
                <Pill
                  key={key}
                  x={x - w / 2}
                  y={y - 12}
                  w={w}
                  label={ev.label ?? ''}
                  tier={ev.tier}
                  tone={tone}
                />
              );
            })}
            {lane.outcome && (
              <Badge
                cx={ox}
                cy={y}
                label={lane.outcome.label}
                tier={lane.outcome.tier}
              />
            )}
          </g>
        );
      })}
      {axis && (
        <>
          <Arrow
            points={[
              [x1, axisY],
              [x2 + 10, axisY],
            ]}
          />
          <Text x={x1} y={axisY + 16} cls="t-mm">
            {axis}
          </Text>
        </>
      )}
    </>
  );

  return (
    <Diagram
      label={label}
      caption={caption}
      width={W}
      height={H}
      minWidth={minW(W)}
      legend={legend}
      usage={usage.counts}
    >
      {body}
    </Diagram>
  );
}
