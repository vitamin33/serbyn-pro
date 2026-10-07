import { Diagram, Text, type Tier } from '../primitives';
import { textWidth } from '../metrics';
import { r1 } from '../geometry';
import { MARGIN, minW, Usage, type PresetBase } from './shared';

export type Region = {
  id: string;
  label: string;
  /** Grid units (default grid 12 × 6). */
  x: number;
  y: number;
  w: number;
  h: number;
  shape?: 'rect' | 'ellipse';
  tone?: 'default' | 'accent' | 'muted' | `tier-${Tier}`;
  dashed?: boolean;
  /** Where the label sits. Default: top-left for rects, top-center for ellipses. */
  labelAt?: 'top-left' | 'top' | 'bottom-left' | 'center';
};

export type RegionItem = { id: string; label: string; x: number; y: number };

export type RegionsDiagramProps = PresetBase & {
  regions: Region[];
  /** Chips placed inside or across regions, in grid units (their center). */
  items?: RegionItem[];
  grid?: [cols: number, rows: number];
  height?: number;
};

const CLS: Record<string, string> = {
  default: 'dg-rg',
  accent: 'dg-rg-acc',
  muted: 'dg-rg-mut',
  'tier-a': 'dg-rg-a',
  'tier-b': 'dg-rg-b',
  'tier-c': 'dg-rg-c',
  'tier-d': 'dg-rg-d',
};

/** Zones, overlaps and scope maps. Fills are translucent, so overlaps read darker. */
export function RegionsDiagram({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  height = 360,
  regions,
  items = [],
  grid = [12, 6],
}: RegionsDiagramProps) {
  const W = width;
  const H = height;
  const ux = (W - 2 * MARGIN) / grid[0];
  const uy = (H - 2 * MARGIN) / grid[1];
  const px = (gx: number) => MARGIN + gx * ux;
  const py = (gy: number) => MARGIN + gy * uy;
  const usage = new Usage();

  const body = (
    <>
      {regions.map(r => {
        const tone = emphasis?.includes(r.id)
          ? 'accent'
          : (r.tone ?? 'default');
        usage.add(tone === 'default' ? undefined : tone);
        if (r.dashed) usage.add('dashed');
        const x = px(r.x);
        const y = py(r.y);
        const w = r.w * ux;
        const h = r.h * uy;
        const cls = `${CLS[tone]}${r.dashed || tone === 'muted' ? ' dg-dash' : ''}`;
        const at = r.labelAt ?? (r.shape === 'ellipse' ? 'top' : 'top-left');
        const lp =
          at === 'top-left'
            ? { x: x + 12, y: y + 20, anchor: 'start' as const }
            : at === 'bottom-left'
              ? { x: x + 12, y: y + h - 12, anchor: 'start' as const }
              : at === 'center'
                ? { x: x + w / 2, y: y + h / 2 + 4, anchor: 'middle' as const }
                : {
                    x: x + w / 2,
                    y:
                      y +
                      (r.shape === 'ellipse' ? Math.min(30, h * 0.18) : 0) +
                      20,
                    anchor: 'middle' as const,
                  };
        return (
          <g key={r.id}>
            {r.shape === 'ellipse' ? (
              <ellipse
                cx={r1(x + w / 2)}
                cy={r1(y + h / 2)}
                rx={r1(w / 2)}
                ry={r1(h / 2)}
                className={cls}
              />
            ) : (
              <rect
                x={r1(x)}
                y={r1(y)}
                width={r1(w)}
                height={r1(h)}
                rx={8}
                className={cls}
              />
            )}
            <Text x={lp.x} y={lp.y} cls="t-h" anchor={lp.anchor}>
              {r.label}
            </Text>
          </g>
        );
      })}
      {items.map(it => {
        const acc = !!emphasis?.includes(it.id);
        usage.tone(acc ? 'accent' : 'default');
        const w = textWidth(it.label, 't-m') + 18;
        const cx = px(it.x);
        const cy = py(it.y);
        return (
          <g key={it.id}>
            <rect
              x={r1(cx - w / 2)}
              y={r1(cy - 11)}
              width={r1(w)}
              height={22}
              rx={3}
              className={acc ? 'dg-b-acc' : 'dg-b'}
            />
            <Text x={cx} y={cy + 4} cls="t-m" anchor="middle">
              {it.label}
            </Text>
          </g>
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
