// Geometry helpers shared by primitives and presets. Pure functions, no React.

export type Pt = [number, number];
export type Rect = { x: number; y: number; w: number; h: number };
export type Side = 'top' | 'right' | 'bottom' | 'left';

export const center = (r: Rect): Pt => [r.x + r.w / 2, r.y + r.h / 2];

export function anchor(r: Rect, side: Side, offset = 0): Pt {
  switch (side) {
    case 'top':
      return [r.x + r.w / 2 + offset, r.y];
    case 'bottom':
      return [r.x + r.w / 2 + offset, r.y + r.h];
    case 'left':
      return [r.x, r.y + r.h / 2 + offset];
    case 'right':
      return [r.x + r.w, r.y + r.h / 2 + offset];
  }
}

/**
 * Arrowhead as a triangle, matching the reference marker (viewBox 10, path
 * M0 0 L10 5 L0 10, markerWidth 7, refX 9, scaled by stroke width).
 */
export function arrowHead(tail: Pt, end: Pt, strokeWidth: number): string {
  const dx = end[0] - tail[0];
  const dy = end[1] - tail[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const unit = 0.7 * strokeWidth;
  const tip: Pt = [end[0] + ux * unit, end[1] + uy * unit];
  const base: Pt = [end[0] - ux * 9 * unit, end[1] - uy * 9 * unit];
  const half = 5 * unit;
  const a: Pt = [base[0] - uy * half, base[1] + ux * half];
  const b: Pt = [base[0] + uy * half, base[1] - ux * half];
  return [tip, a, b].map(p => `${r1(p[0])},${r1(p[1])}`).join(' ');
}

export const r1 = (n: number) => Math.round(n * 10) / 10;

export const pointsAttr = (pts: Pt[]) =>
  pts.map(p => `${r1(p[0])},${r1(p[1])}`).join(' ');

/** Clip a ray from the rect center toward `toward` at the rect border, minus a gap. */
export function clipToRect(r: Rect, toward: Pt, gap = 2): Pt {
  const [cx, cy] = center(r);
  const dx = toward[0] - cx;
  const dy = toward[1] - cy;
  if (dx === 0 && dy === 0) return [cx, cy];
  const sx = dx === 0 ? Infinity : r.w / 2 / Math.abs(dx);
  const sy = dy === 0 ? Infinity : r.h / 2 / Math.abs(dy);
  const s = Math.min(sx, sy);
  const len = Math.hypot(dx, dy);
  const k = s + gap / len;
  return [cx + dx * k, cy + dy * k];
}

/**
 * Orthogonal route between two boxes. Straight when they overlap on one axis,
 * otherwise one elbow: horizontal first (`hv`) or vertical first (`vh`).
 */
export function orthoRoute(
  a: Rect,
  b: Rect,
  prefer: 'hv' | 'vh' = 'hv',
  gap = 2
): Pt[] {
  const yOverlap = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  const xOverlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  if (yOverlap > 8 && (b.x >= a.x + a.w || a.x >= b.x + b.w)) {
    const y = Math.max(a.y, b.y) + yOverlap / 2;
    return b.x >= a.x + a.w
      ? [
          [a.x + a.w, y],
          [b.x - gap, y],
        ]
      : [
          [a.x, y],
          [b.x + b.w + gap, y],
        ];
  }
  if (xOverlap > 8 && (b.y >= a.y + a.h || a.y >= b.y + b.h)) {
    const x = Math.max(a.x, b.x) + xOverlap / 2;
    return b.y >= a.y + a.h
      ? [
          [x, a.y + a.h],
          [x, b.y - gap],
        ]
      : [
          [x, a.y],
          [x, b.y + b.h + gap],
        ];
  }
  const [acx, acy] = center(a);
  const [bcx, bcy] = center(b);
  if (prefer === 'hv') {
    const start: Pt = bcx > acx ? [a.x + a.w, acy] : [a.x, acy];
    const end: Pt = bcy > acy ? [bcx, b.y - gap] : [bcx, b.y + b.h + gap];
    return [start, [bcx, acy], end];
  }
  const start: Pt = bcy > acy ? [acx, a.y + a.h] : [acx, a.y];
  const end: Pt = bcx > acx ? [b.x - gap, bcy] : [b.x + b.w + gap, bcy];
  return [start, [acx, bcy], end];
}

/**
 * Where an edge label goes, reference style: above a horizontal segment
 * (centered), to the right of a vertical one (start-anchored). Uses the
 * longest segment.
 */
export function labelSpot(pts: Pt[]): {
  x: number;
  y: number;
  anchor: 'start' | 'middle';
} {
  let best = 0;
  let bestLen = -1;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    if (l > bestLen) {
      bestLen = l;
      best = i;
    }
  }
  const [p, q] = [pts[best], pts[best + 1]];
  const mx = (p[0] + q[0]) / 2;
  const my = (p[1] + q[1]) / 2;
  if (Math.abs(q[1] - p[1]) <= Math.abs(q[0] - p[0]))
    return { x: mx, y: my - 7, anchor: 'middle' };
  return { x: mx + 7, y: my + 4, anchor: 'start' };
}

export function bbox(rects: Rect[]): Rect {
  const x = Math.min(...rects.map(r => r.x));
  const y = Math.min(...rects.map(r => r.y));
  const x2 = Math.max(...rects.map(r => r.x + r.w));
  const y2 = Math.max(...rects.map(r => r.y + r.h));
  return { x, y, w: x2 - x, h: y2 - y };
}
