import { Arrow, Diagram, Text } from '../primitives';
import { textWidth } from '../metrics';
import { arrowHead, r1, type Pt } from '../geometry';
import { isBack, layered, routeEdge, type Direction } from './layered';
import {
  edgeId,
  MARGIN,
  minW,
  Usage,
  type EdgeData,
  type PresetBase,
} from './shared';

export type State = {
  id: string;
  label: string;
  initial?: boolean;
  final?: boolean;
  mono?: boolean;
};

export type StateMachineProps = PresetBase & {
  states: State[];
  transitions: EdgeData[];
  direction?: Direction;
};

const START = '__start';
const STATE_H = 36;

/** States as pills, transitions as labeled arrows; self-loops arc above. */
export function StateMachine({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  states,
  transitions,
  direction = 'LR',
}: StateMachineProps) {
  const initial = states.find(s => s.initial);
  const sizes = new Map(
    states.map(s => [
      s.id,
      {
        w: Math.ceil(textWidth(s.label, s.mono ? 't-m' : 't') + 40),
        h: STATE_H,
      },
    ])
  );
  const layoutEdges = transitions.map(e => ({
    key: edgeId(e),
    from: e.from,
    to: e.to,
    label: e.label,
  }));
  const layoutNodes = states.map(s => ({ id: s.id, ...sizes.get(s.id)! }));
  if (initial) {
    layoutNodes.unshift({ id: START, w: 12, h: 12 });
    layoutEdges.unshift({
      key: `${START}->${initial.id}`,
      from: START,
      to: initial.id,
      label: undefined,
    });
  }
  const hasSelf = transitions.some(t => t.from === t.to);
  const layout = layered(layoutNodes, layoutEdges, {
    direction,
    margin: 0,
    ranksep: 64,
    nodesep: 44,
  });
  const top = hasSelf ? 46 : 0;
  let back = 0;
  const routes = new Map(
    layoutEdges
      .filter(e => e.from !== e.to)
      .map(e => {
        const r = routeEdge(layout, e.key, e.from, e.to, direction, {
          backLevel: back,
        });
        if (isBack(layout, e, direction)) back++;
        return [e.key, r];
      })
  );
  const reach = Math.max(0, ...Array.from(routes.values()).map(r => r.extent));
  const contentW =
    direction === 'TB' ? Math.max(layout.width, reach) : layout.width;
  const contentH =
    direction === 'LR' ? Math.max(layout.height, reach) : layout.height;
  const W = Math.ceil(Math.max(width, contentW + 2 * MARGIN));
  const H = Math.ceil(contentH + 2 * MARGIN + top);
  const ox = (W - contentW) / 2;
  const usage = new Usage();
  const emph = (id: string) => !!emphasis?.includes(id);

  const arrows = layoutEdges.map(e => {
    const t = transitions.find(x => edgeId(x) === e.key);
    const tone = emph(e.key) ? 'accent' : (t?.tone ?? 'default');
    usage.edge(tone, t?.dashed);
    if (e.from === e.to) {
      const r = layout.nodes[e.from];
      const cx = r.x + r.w / 2;
      const p0: Pt = [cx - 14, r.y];
      const p1: Pt = [cx + 14, r.y - 2];
      return (
        <g key={e.key}>
          <path
            d={`M${r1(p0[0])} ${r1(p0[1])} C${r1(cx - 34)} ${r1(r.y - 40)} ${r1(cx + 34)} ${r1(r.y - 40)} ${r1(p1[0])} ${r1(p1[1])}`}
            className={`${tone === 'accent' ? 'dg-ln-acc' : 'dg-ln'}${t?.dashed ? ' dg-dash' : ''}`}
          />
          <polygon
            points={arrowHead(
              [cx + 34, r.y - 40],
              p1,
              tone === 'accent' ? 1.6 : 1.3
            )}
            className={tone === 'accent' ? 'dg-ah-acc' : 'dg-ah'}
          />
          {e.label && (
            <Text
              x={cx}
              y={r.y - 36}
              cls={tone === 'accent' ? 't-acc' : 't-mm'}
              anchor="middle"
              halo
            >
              {e.label as string}
            </Text>
          )}
        </g>
      );
    }
    const r = routes.get(e.key)!;
    return (
      <Arrow
        key={e.key}
        points={r.points}
        tone={tone}
        dashed={t?.dashed}
        label={e.label}
        labelAt={r.label ? [r.label.x, r.label.y] : undefined}
        labelAnchor={r.label?.anchor}
        labelTone={tone === 'accent' ? 'accent' : 'muted'}
        halo
      />
    );
  });

  const nodes = states.map(s => {
    const r = layout.nodes[s.id];
    const acc = emph(s.id);
    usage.tone(acc ? 'accent' : 'default');
    return (
      <g key={s.id}>
        <rect
          x={r1(r.x)}
          y={r1(r.y)}
          width={r1(r.w)}
          height={r.h}
          rx={r.h / 2}
          className={acc ? 'dg-b-acc' : 'dg-b'}
        />
        {s.final && (
          <rect
            x={r1(r.x + 3.5)}
            y={r1(r.y + 3.5)}
            width={r1(r.w - 7)}
            height={r.h - 7}
            rx={(r.h - 7) / 2}
            className={acc ? 'dg-ln-acc' : 'dg-ln'}
          />
        )}
        <Text
          x={r.x + r.w / 2}
          y={r.y + r.h / 2 + 4.5}
          cls={s.mono ? 't-m' : 't'}
          anchor="middle"
        >
          {s.label}
        </Text>
      </g>
    );
  });

  const start = initial ? layout.nodes[START] : null;

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
      <g transform={`translate(${r1(ox)} ${MARGIN + top})`}>
        {arrows}
        {start && (
          <circle
            cx={r1(start.x + 6)}
            cy={r1(start.y + 6)}
            r={6}
            className="dg-fg"
          />
        )}
        {nodes}
      </g>
    </Diagram>
  );
}
