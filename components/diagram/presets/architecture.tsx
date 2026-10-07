import {
  Arrow,
  Boundary,
  Box,
  Diagram,
  Divider,
  SectionLabel,
} from '../primitives';
import { fitBox } from '../metrics';
import { bbox, labelSpot, orthoRoute, type Rect } from '../geometry';
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

export type ArchNode = NodeData & {
  /** 0-based column on a 12-column grid. */
  col: number;
  /** 0-based row. */
  row: number;
  /** Columns wide (default 3). */
  span?: number;
};

export type ArchBoundary = {
  id: string;
  label?: string;
  /** Node ids or other boundary ids (nesting). */
  contains: string[];
  tone?: 'default' | 'accent' | 'muted';
};

export type ArchitectureDiagramProps = PresetBase & {
  nodes: ArchNode[];
  boundaries?: ArchBoundary[];
  /** Endpoints may be node or boundary ids. `route` picks the elbow order. */
  edges?: (EdgeData & { route?: 'hv' | 'vh' })[];
  /** Uppercase band label above a row ("guardrail · online"). */
  sections?: { label: string; row: number }[];
  /** Dashed rules above these rows. */
  dividers?: number[];
  cols?: number;
};

const PAD_X = 14;
const PAD_TOP = 30;
const PAD_BOTTOM = 14;
const GUTTER = 24;

/** Architecture: nodes on a grid, nested dashed boundaries, orthogonal edges. */
export function ArchitectureDiagram({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  nodes,
  boundaries = [],
  edges = [],
  sections = [],
  dividers = [],
  cols = 12,
}: ArchitectureDiagramProps) {
  const W = width;
  const colW = (W - 2 * MARGIN + GUTTER) / cols;
  const fits = nodes.map(n => fitBox(n.title, n.sub, { mono: n.mono }));
  const maxH = Math.max(...fits.map(f => f.h));

  const byId = new Map(boundaries.map(b => [b.id, b]));
  const depthOf = (id: string, seen = new Set<string>()): number => {
    const b = byId.get(id);
    if (!b || seen.has(id)) return 0;
    seen.add(id);
    return 1 + Math.max(0, ...b.contains.map(c => depthOf(c, seen)));
  };
  const maxDepth = Math.max(0, ...boundaries.map(b => depthOf(b.id)));
  const band = sections.length || dividers.length ? 26 : 0;
  const pitch = maxH + 36 + (PAD_TOP + PAD_BOTTOM) * maxDepth + band;
  const top = MARGIN + PAD_TOP * maxDepth + band;
  const rowY = (row: number) => top + row * pitch;

  const rects = new Map<string, Rect>();
  nodes.forEach((n, i) => {
    const span = n.span ?? 3;
    rects.set(n.id, {
      x: MARGIN + n.col * colW,
      y: rowY(n.row) + (maxH - fits[i].h) / 2,
      w: span * colW - GUTTER,
      h: fits[i].h,
    });
  });
  const boundaryRect = (id: string): Rect => {
    if (rects.has(id)) return rects.get(id)!;
    const b = byId.get(id)!;
    const inner = bbox(b.contains.map(boundaryRect));
    const r = {
      x: inner.x - PAD_X,
      y: inner.y - PAD_TOP,
      w: inner.w + 2 * PAD_X,
      h: inner.h + PAD_TOP + PAD_BOTTOM,
    };
    rects.set(id, r);
    return r;
  };
  boundaries.forEach(b => boundaryRect(b.id));

  const H = Math.ceil(
    Math.max(...Array.from(rects.values()).map(r => r.y + r.h)) + MARGIN
  );

  const usage = new Usage();
  const bandY = (row: number) => rowY(row) - PAD_TOP * maxDepth - 8;

  const body = (
    <>
      {dividers.map(row => (
        <Divider
          key={`d${row}`}
          x1={MARGIN}
          x2={W - MARGIN}
          y={bandY(row) - 20}
        />
      ))}
      {sections.map(s => (
        <SectionLabel key={s.label} x={MARGIN} y={bandY(s.row)}>
          {s.label}
        </SectionLabel>
      ))}
      {boundaries.map(b => {
        const r = rects.get(b.id)!;
        const t = isEmphasized(emphasis, b.id)
          ? 'accent'
          : (b.tone ?? 'default');
        usage.add('dashed');
        return <Boundary key={b.id} {...r} label={b.label} tone={t} />;
      })}
      {nodes.map(n => {
        const t = nodeTone(n, emphasis);
        usage.tone(t);
        return (
          <Box
            key={n.id}
            {...rects.get(n.id)!}
            title={n.title}
            sub={n.sub}
            mono={n.mono}
            tone={t}
          />
        );
      })}
      {edges.map(e => {
        const pts = orthoRoute(
          rects.get(e.from)!,
          rects.get(e.to)!,
          e.route ?? 'hv'
        );
        const tone = edgeTone(e, emphasis);
        usage.edge(tone, e.dashed);
        const spot = labelSpot(pts);
        return (
          <Arrow
            key={edgeId(e)}
            points={pts}
            tone={tone}
            dashed={e.dashed}
            label={e.label}
            labelAt={[spot.x, spot.y]}
            labelAnchor={spot.anchor}
          />
        );
      })}
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

function isEmphasized(emphasis: string[] | undefined, id: string) {
  return !!emphasis?.includes(id);
}
