import { Arrow, Box, Diagram, SectionLabel } from '../primitives';
import { fitBox } from '../metrics';
import { clipToRect, center, type Pt, type Rect } from '../geometry';
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

export type LoopDiagramProps = PresetBase & {
  /** Clockwise from the top. */
  nodes: NodeData[];
  /** Default: each node to the next, last back to first. */
  edges?: EdgeData[];
  /** Uppercase label in the middle of the loop ("until green"). */
  center?: string;
  /** A way out of the loop, drawn to the right. */
  exit?: {
    from: string;
    title: string;
    sub?: string | string[];
    label?: string | string[];
    id?: string;
  };
};

/** Feedback loop or retry cycle: nodes on an ellipse, curved arrows, one exit. */
export function LoopDiagram({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  nodes,
  edges,
  center: mid,
  exit,
}: LoopDiagramProps) {
  const n = nodes.length;
  const es: EdgeData[] =
    edges ?? nodes.map((s, i) => ({ from: s.id, to: nodes[(i + 1) % n].id }));
  const fits = nodes.map(s =>
    fitBox(s.title, s.sub, { mono: s.mono, minW: 150 })
  );
  const bw = Math.max(...fits.map(f => f.w));
  const bh = Math.max(...fits.map(f => f.h));
  const exitFit = exit ? fitBox(exit.title, exit.sub, { minW: 150 }) : null;

  const ry = n <= 3 ? 92 : 104;
  const rx = Math.max(200, bw * 1.15);
  const loopW = 2 * rx + bw;
  const exitArea = exitFit ? exitFit.w + 110 : 0;
  const W = Math.max(width, Math.ceil(loopW + exitArea + 2 * MARGIN));
  const cx = exitFit
    ? MARGIN + loopW / 2 + (W - 2 * MARGIN - loopW - exitArea) / 2
    : W / 2;
  const cy = MARGIN + bh / 2 + ry;

  const rects = new Map<string, Rect>();
  nodes.forEach((s, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    rects.set(s.id, { x: x - bw / 2, y: y - bh / 2, w: bw, h: bh });
  });

  const lowest = Math.max(...Array.from(rects.values()).map(r => r.y + r.h));
  // a curved edge between the two lowest nodes bows below them
  const H = Math.ceil(lowest + (n === 3 ? 44 : 22) + MARGIN);

  const usage = new Usage();
  const boxes = nodes.map(s => {
    const t = nodeTone(s, emphasis);
    usage.tone(t);
    return (
      <Box
        key={s.id}
        {...rects.get(s.id)!}
        title={s.title}
        sub={s.sub}
        mono={s.mono}
        tone={t}
      />
    );
  });

  const arrows = es.map(e => {
    const a = rects.get(e.from)!;
    const b = rects.get(e.to)!;
    const [ax, ay] = center(a);
    const [bx, by] = center(b);
    // bow the chord outward from the loop center
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    const ox = mx - cx;
    const oy = my - cy;
    const ol = Math.hypot(ox, oy) || 1;
    const bow = n === 2 ? 70 : 34;
    const ctrl: Pt = [mx + (ox / ol) * bow, my + (oy / ol) * bow];
    const p0 = clipToRect(a, ctrl, 3);
    const p1 = clipToRect(b, ctrl, 3);
    const tone = edgeTone(e, emphasis);
    usage.edge(tone, e.dashed);
    const lx = 0.25 * p0[0] + 0.5 * ctrl[0] + 0.25 * p1[0] + (ox / ol) * 12;
    const ly = 0.25 * p0[1] + 0.5 * ctrl[1] + 0.25 * p1[1] + (oy / ol) * 12 + 4;
    const anchor =
      Math.abs(lx - cx) < 30 ? 'middle' : lx > cx ? 'start' : 'end';
    return (
      <Arrow
        key={edgeId(e)}
        points={[p0, p1]}
        curve={ctrl}
        tone={tone}
        dashed={e.dashed}
        label={e.label}
        labelAt={[lx, ly]}
        labelAnchor={anchor}
        halo
      />
    );
  });

  let exitEls = null;
  if (exit && exitFit) {
    const src = rects.get(exit.from)!;
    const ex: Rect = {
      x: W - MARGIN - exitFit.w,
      y: center(src)[1] - exitFit.h / 2,
      w: exitFit.w,
      h: exitFit.h,
    };
    const id = exit.id ?? `${exit.from}->exit`;
    const emph = !!emphasis?.includes(id) || !!emphasis?.includes('exit');
    usage.tone(emph ? 'accent' : 'default');
    exitEls = (
      <>
        <Box
          {...ex}
          title={exit.title}
          sub={exit.sub}
          tone={emph ? 'accent' : 'default'}
        />
        <Arrow
          points={[
            [src.x + src.w, center(src)[1]],
            [ex.x - 2, center(src)[1]],
          ]}
          tone={emph ? 'accent' : 'default'}
          label={exit.label}
        />
      </>
    );
  }

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
      {mid && (
        <SectionLabel x={cx} y={cy + 4} anchor="middle">
          {mid}
        </SectionLabel>
      )}
      {arrows}
      {boxes}
      {exitEls}
    </Diagram>
  );
}
