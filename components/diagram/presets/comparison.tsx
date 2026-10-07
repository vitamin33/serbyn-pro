import { Arrow, Box, Diagram, SectionLabel } from '../primitives';
import { fitBox } from '../metrics';
import { isBack, layered, routeEdge, type Direction } from './layered';
import {
  edgeId,
  MARGIN,
  minW,
  nodeTone,
  Usage,
  type EdgeData,
  type NodeData,
  type PresetBase,
} from './shared';

export type ComparisonDiagramProps = PresetBase & {
  /** Drawn at the same position in both panels. */
  nodes: NodeData[];
  before: { title: string; edges: EdgeData[] };
  after: { title: string; edges: EdgeData[] };
  direction?: Direction;
};

/**
 * Before vs after (or option A vs B). Nodes sit at identical positions in both
 * panels, so the eye goes to what differs: edges only in `after` are accented,
 * edges only in `before` are dashed and muted.
 */
export function ComparisonDiagram({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  nodes,
  before,
  after,
  direction = 'LR',
}: ComparisonDiagramProps) {
  const fits = new Map(
    nodes.map(n => [n.id, fitBox(n.title, n.sub, { mono: n.mono })])
  );
  const beforeIds = new Set(before.edges.map(edgeId));
  const afterIds = new Set(after.edges.map(edgeId));
  const union = new Map<string, EdgeData>();
  for (const e of [...before.edges, ...after.edges]) union.set(edgeId(e), e);
  const layout = layered(
    nodes.map(n => ({ id: n.id, ...fits.get(n.id)! })),
    Array.from(union.entries()).map(([key, e]) => ({
      key,
      from: e.from,
      to: e.to,
      label: e.label,
    })),
    { direction, margin: 0, nodesep: 28, ranksep: 60 }
  );

  let back = 0;
  const routes = new Map(
    Array.from(union.entries()).map(([key, e]) => {
      const r = routeEdge(layout, key, e.from, e.to, direction, {
        backLevel: back,
      });
      if (isBack(layout, e, direction)) back++;
      return [key, r];
    })
  );
  const reach = Math.max(0, ...Array.from(routes.values()).map(r => r.extent));
  const innerW =
    direction === 'TB' ? Math.max(layout.width, reach) : layout.width;
  const innerH =
    direction === 'LR' ? Math.max(layout.height, reach) : layout.height;

  // Side by side when both panels fit the width; stacked otherwise, so the
  // text never shrinks below the reference scale.
  const gap = 40;
  const sideBySide = 2 * (innerW + 2 * MARGIN) + gap <= width - 2 * MARGIN;
  const panelW = sideBySide
    ? (width - 2 * MARGIN - gap) / 2
    : Math.max(width - 2 * MARGIN, innerW + 2 * MARGIN);
  const panelH = 22 + MARGIN + innerH + MARGIN;
  const W = Math.ceil(
    sideBySide ? width : Math.max(width, panelW + 2 * MARGIN)
  );
  const H = Math.ceil(
    MARGIN + (sideBySide ? panelH : 2 * panelH + gap / 2) + MARGIN / 2
  );
  const usage = new Usage();

  const panel = (side: 'before' | 'after', x0: number, y0: number) => {
    const spec = side === 'before' ? before : after;
    const ox = x0 + (panelW - innerW) / 2;
    const oy = y0 + 22 + MARGIN;
    return (
      <g key={side}>
        <rect
          x={x0}
          y={y0}
          width={panelW}
          height={panelH}
          rx={6}
          className="dg-ln-mut"
        />
        <SectionLabel x={x0 + 12} y={y0 + 16}>
          {spec.title}
        </SectionLabel>
        <g transform={`translate(${ox} ${oy})`}>
          {spec.edges.map(e => {
            const id = edgeId(e);
            const only =
              side === 'after' ? !beforeIds.has(id) : !afterIds.has(id);
            const tone =
              emphasis?.includes(id) || (side === 'after' && only)
                ? 'accent'
                : only
                  ? 'muted'
                  : (e.tone ?? 'default');
            const dashed = e.dashed || (side === 'before' && only);
            usage.edge(tone, dashed);
            const r = routes.get(id)!;
            return (
              <Arrow
                key={id}
                points={r.points}
                tone={tone}
                dashed={dashed}
                label={e.label}
                labelAt={r.label ? [r.label.x, r.label.y] : undefined}
                labelAnchor={r.label?.anchor}
                labelTone={tone === 'accent' ? 'accent' : 'muted'}
                halo
              />
            );
          })}
          {nodes.map(n => {
            const t = nodeTone(n, emphasis);
            usage.tone(t);
            const r = layout.nodes[n.id];
            return (
              <Box
                key={n.id}
                x={r.x}
                y={r.y}
                w={r.w}
                h={r.h}
                title={n.title}
                sub={n.sub}
                mono={n.mono}
                tone={t}
              />
            );
          })}
        </g>
      </g>
    );
  };

  const body = (
    <>
      {panel('before', MARGIN, MARGIN)}
      {sideBySide
        ? panel('after', MARGIN + panelW + gap, MARGIN)
        : panel('after', MARGIN, MARGIN + panelH + gap / 2)}
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
