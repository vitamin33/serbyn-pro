import { Arrow, Box, Diagram } from '../primitives';
import { fitBox } from '../metrics';
import { isBack, layered, routeEdge, type Direction } from './layered';
import {
  edgeId,
  edgeTone,
  MARGIN,
  minW,
  nodeTone,
  Usage,
  type EdgeData,
  type NodeData,
  type PresetBase,
} from './shared';

export type GraphDiagramProps = PresetBase & {
  nodes: NodeData[];
  edges: EdgeData[];
  direction?: Direction;
};

/** Generic nodes and edges, laid out by dagre at build time. */
export function GraphDiagram({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  nodes,
  edges,
  direction = 'LR',
}: GraphDiagramProps) {
  const fits = new Map(
    nodes.map(n => [n.id, fitBox(n.title, n.sub, { mono: n.mono })])
  );
  const layout = layered(
    nodes.map(n => ({ id: n.id, ...fits.get(n.id)! })),
    edges.map(e => ({
      key: edgeId(e),
      from: e.from,
      to: e.to,
      label: e.label,
    })),
    { direction, margin: 0 }
  );
  let back = 0;
  const routes = new Map(
    edges.map(e => {
      const r = routeEdge(layout, edgeId(e), e.from, e.to, direction, {
        backLevel: back,
      });
      if (isBack(layout, e, direction)) back++;
      return [edgeId(e), r];
    })
  );
  const reach = Math.max(0, ...Array.from(routes.values()).map(r => r.extent));
  const contentW =
    direction === 'TB' ? Math.max(layout.width, reach) : layout.width;
  const contentH =
    direction === 'LR' ? Math.max(layout.height, reach) : layout.height;
  const W = Math.ceil(Math.max(width, contentW + 2 * MARGIN));
  const H = Math.ceil(contentH + 2 * MARGIN);
  const ox = (W - contentW) / 2;
  const usage = new Usage();

  const body = (
    <g transform={`translate(${ox} ${MARGIN})`}>
      {edges.map(e => {
        const id = edgeId(e);
        const tone = edgeTone(e, emphasis);
        usage.edge(tone, e.dashed);
        const r = routes.get(id)!;
        return (
          <Arrow
            key={id}
            points={r.points}
            tone={tone}
            dashed={e.dashed}
            label={e.label}
            labelAt={r.label ? [r.label.x, r.label.y] : undefined}
            labelAnchor={r.label?.anchor}
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
