import dagre from '@dagrejs/dagre';
import type { Pt, Rect } from '../geometry';
import { asLines, textWidth } from '../metrics';

// dagre wrapper used by GraphDiagram, StateMachine and ComparisonDiagram. Runs
// on the server at build; nothing here ships to the browser.

export type LayoutNode = { id: string; w: number; h: number };
export type LayoutEdge = {
  key: string;
  from: string;
  to: string;
  label?: string | string[];
};
export type Direction = 'LR' | 'TB';

export type Layout = {
  width: number;
  height: number;
  nodes: Record<string, Rect & { rank: number }>;
  edges: Record<string, { points: Pt[]; label?: Pt; labelW: number }>;
};

export function layered(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  opts: {
    direction?: Direction;
    nodesep?: number;
    ranksep?: number;
    margin?: number;
  } = {}
): Layout {
  const g = new dagre.graphlib.Graph({ multigraph: true });
  const margin = opts.margin ?? 16;
  g.setGraph({
    rankdir: opts.direction ?? 'LR',
    nodesep: opts.nodesep ?? 36,
    ranksep: opts.ranksep ?? 56,
    edgesep: 16,
    marginx: margin,
    marginy: margin,
  });
  g.setDefaultEdgeLabel(() => ({}));
  for (const n of nodes) g.setNode(n.id, { width: n.w, height: n.h });
  for (const e of edges) {
    if (e.from === e.to) continue; // self-loops are drawn by the preset
    const lines = asLines(e.label);
    g.setEdge(
      e.from,
      e.to,
      lines.length
        ? {
            width: Math.max(...lines.map(l => textWidth(l, 't-mm'))) + 8,
            height: 14 * lines.length + 4,
            labelpos: 'c',
          }
        : {},
      e.key
    );
  }
  dagre.layout(g);

  const out: Layout = {
    width: g.graph().width ?? 0,
    height: g.graph().height ?? 0,
    nodes: {},
    edges: {},
  };
  for (const n of nodes) {
    const d = g.node(n.id) as {
      x: number;
      y: number;
      width: number;
      height: number;
      rank?: number;
    };
    out.nodes[n.id] = {
      x: d.x - d.width / 2,
      y: d.y - d.height / 2,
      w: d.width,
      h: d.height,
      rank: d.rank ?? 0,
    };
  }
  for (const e of edges) {
    if (e.from === e.to) continue;
    const d = g.edge({ v: e.from, w: e.to, name: e.key }) as {
      points: { x: number; y: number }[];
      x?: number;
      y?: number;
    };
    out.edges[e.key] = {
      points: d.points.map(p => [p.x, p.y] as Pt),
      label: d.x !== undefined && d.y !== undefined ? [d.x, d.y] : undefined,
      labelW: Math.max(0, ...asLines(e.label).map(l => textWidth(l, 't-mm'))),
    };
  }
  return out;
}

function segHitsRect(p: Pt, q: Pt, r: Rect): boolean {
  // axis-aligned segments only (elbows)
  const x1 = Math.min(p[0], q[0]),
    x2 = Math.max(p[0], q[0]);
  const y1 = Math.min(p[1], q[1]),
    y2 = Math.max(p[1], q[1]);
  return (
    x1 < r.x + r.w + 4 && x2 > r.x - 4 && y1 < r.y + r.h + 4 && y2 > r.y - 4
  );
}

type Routed = {
  points: Pt[];
  label: { x: number; y: number; anchor: 'start' | 'middle' } | null;
  /** Furthest coordinate used across the flow (y for LR, x for TB), for canvas size. */
  extent: number;
};

/**
 * Route an edge in the reference style.
 * - Forward edge: one orthogonal elbow through the gap before the target, if
 *   that path crosses no other node.
 * - Back edge (given a `backLevel`): a U under the nodes (LR) or to their right
 *   (TB), like a retry loop. Several back edges stack on separate levels.
 * - Anything else follows dagre's points, which already avoid other nodes.
 */
export function routeEdge(
  layout: Layout,
  key: string,
  from: string,
  to: string,
  direction: Direction,
  opts: { backLevel?: number } = {}
): Routed {
  const a = layout.nodes[from];
  const b = layout.nodes[to];
  const e = layout.edges[key];
  const lab = e?.label;
  const gap = 2;
  const others = Object.entries(layout.nodes)
    .filter(([id]) => id !== from && id !== to)
    .map(([, r]) => r);
  const clear = (pts: Pt[]) =>
    others.every(r => pts.slice(1).every((q, i) => !segHitsRect(pts[i], q, r)));

  if (direction === 'LR' && b.x > a.x + a.w + 4) {
    const sy = a.y + a.h / 2;
    const ty = b.y + b.h / 2;
    // elbow late, so the first horizontal run is long enough for a label
    const mx = b.x - Math.min(24, (b.x - a.x - a.w) / 3);
    const straight = Math.abs(sy - ty) < 4;
    const points: Pt[] = straight
      ? [
          [a.x + a.w, sy],
          [b.x - gap, sy],
        ]
      : [
          [a.x + a.w, sy],
          [mx, sy],
          [mx, ty],
          [b.x - gap, ty],
        ];
    if (clear(points))
      return {
        points,
        label: !lab
          ? null
          : straight
            ? { x: (a.x + a.w + b.x) / 2, y: sy - 7, anchor: 'middle' }
            : // above the longer horizontal run, as the reference labels arrows
              mx - (a.x + a.w) >= b.x - mx
              ? { x: (a.x + a.w + mx) / 2, y: sy - 7, anchor: 'middle' }
              : { x: (mx + b.x) / 2, y: ty - 7, anchor: 'middle' },
        extent: Math.max(sy, ty),
      };
  } else if (direction === 'TB' && b.y > a.y + a.h + 4) {
    const sx = a.x + a.w / 2;
    const tx = b.x + b.w / 2;
    const my =
      lab && lab[1] > a.y + a.h && lab[1] < b.y
        ? lab[1]
        : b.y - Math.min(24, (b.y - a.y - a.h) / 2);
    const straight = Math.abs(sx - tx) < 4;
    const points: Pt[] = straight
      ? [
          [sx, a.y + a.h],
          [sx, b.y - gap],
        ]
      : [
          [sx, a.y + a.h],
          [sx, my],
          [tx, my],
          [tx, b.y - gap],
        ];
    if (clear(points))
      return {
        points,
        label: !lab
          ? null
          : straight
            ? { x: sx + 7, y: (a.y + a.h + b.y) / 2 + 4, anchor: 'start' }
            : { x: (sx + tx) / 2, y: my - 6, anchor: 'middle' },
        extent: Math.max(sx, tx),
      };
  }

  const backward =
    direction === 'LR' ? b.x + b.w <= a.x + 4 : b.y + b.h <= a.y + 4;
  if (backward && opts.backLevel !== undefined) {
    const k = opts.backLevel;
    if (direction === 'LR') {
      const x1 = Math.min(a.x, b.x);
      const x2 = Math.max(a.x + a.w, b.x + b.w);
      const base = Math.max(
        a.y + a.h,
        b.y + b.h,
        ...others.filter(r => r.x < x2 && r.x + r.w > x1).map(r => r.y + r.h)
      );
      const y = base + 22 + 26 * k;
      const sx = a.x + a.w / 2 - 10;
      const tx = b.x + b.w / 2 + 10;
      return {
        points: [
          [sx, a.y + a.h],
          [sx, y],
          [tx, y],
          [tx, b.y + b.h + gap],
        ],
        label: lab ? { x: (sx + tx) / 2, y: y + 14, anchor: 'middle' } : null,
        extent: y + (lab ? 18 : 4),
      };
    }
    const y1 = Math.min(a.y, b.y);
    const y2 = Math.max(a.y + a.h, b.y + b.h);
    const base = Math.max(
      a.x + a.w,
      b.x + b.w,
      ...others.filter(r => r.y < y2 && r.y + r.h > y1).map(r => r.x + r.w)
    );
    const x = base + 22 + 26 * k;
    const sy = a.y + a.h / 2;
    const ty = b.y + b.h / 2;
    return {
      points: [
        [a.x + a.w, sy],
        [x, sy],
        [x, ty],
        [b.x + b.w + gap, ty],
      ],
      label: lab ? { x: x + 7, y: (sy + ty) / 2 + 4, anchor: 'start' } : null,
      extent: x + (lab ? 90 : 4),
    };
  }

  // dagre's own route; the label goes beside its nearest segment, not on it
  const pts = e.points;
  let label: Routed['label'] = null;
  if (lab) {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      const my = (pts[i][1] + pts[i + 1][1]) / 2;
      const d = Math.hypot(mx - lab[0], my - lab[1]);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const [p, q] = [pts[best], pts[best + 1]];
    label =
      Math.abs(q[1] - p[1]) <= Math.abs(q[0] - p[0])
        ? { x: lab[0], y: lab[1] - 7, anchor: 'middle' }
        : { x: lab[0] + 7, y: lab[1] + 4, anchor: 'start' };
  }
  return {
    points: pts,
    label,
    extent: Math.max(...pts.map(p => (direction === 'LR' ? p[1] : p[0]))),
  };
}

/** True when the target sits before the source along the flow direction. */
export function isBack(
  layout: Layout,
  e: { from: string; to: string },
  direction: Direction
): boolean {
  const a = layout.nodes[e.from];
  const b = layout.nodes[e.to];
  if (!a || !b || e.from === e.to) return false;
  return direction === 'LR' ? b.x + b.w <= a.x + 4 : b.y + b.h <= a.y + 4;
}
