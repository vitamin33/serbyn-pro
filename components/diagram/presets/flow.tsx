import { Arrow, Box, Diagram, SectionLabel } from '../primitives';
import { fitBox, textWidth, asLines } from '../metrics';
import type { Pt } from '../geometry';
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

export type FlowDiagramProps = PresetBase & {
  /** Left to right. */
  steps: NodeData[];
  /** Default: each step to the next. Backward or skipping edges loop underneath. */
  edges?: EdgeData[];
  /** Uppercase section label above the row. */
  title?: string;
};

/** Pipeline: steps left to right, labeled arrows, retries looping underneath. */
export function FlowDiagram({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  steps,
  edges,
  title,
}: FlowDiagramProps) {
  const es: EdgeData[] =
    edges ?? steps.slice(1).map((s, i) => ({ from: steps[i].id, to: s.id }));
  const index = new Map(steps.map((s, i) => [s.id, i]));
  const adjacent = (e: EdgeData) => index.get(e.to)! === index.get(e.from)! + 1;

  const fits = steps.map(s => fitBox(s.title, s.sub, { mono: s.mono }));
  const h = Math.max(...fits.map(f => f.h));
  const labelW = Math.max(
    0,
    ...es
      .filter(adjacent)
      .map(e => Math.max(0, ...asLines(e.label).map(l => textWidth(l, 't-mm'))))
  );
  const gap = Math.max(48, Math.ceil(labelW + 20));
  const n = steps.length;
  const boxW = Math.max(
    (width - 2 * MARGIN - gap * (n - 1)) / n,
    ...fits.map(f => f.w)
  );
  const W = Math.max(width, Math.ceil(2 * MARGIN + n * boxW + (n - 1) * gap));
  const y0 = title ? 28 : MARGIN;
  const rect = (i: number) => ({
    x: MARGIN + i * (boxW + gap),
    y: y0,
    w: boxW,
    h,
  });

  const loops = es.filter(e => !adjacent(e));
  const H = y0 + h + (loops.length ? 28 * loops.length + 10 : 0) + MARGIN;
  const usage = new Usage();

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
      {title && (
        <SectionLabel x={MARGIN} y={12}>
          {title}
        </SectionLabel>
      )}
      {steps.map((s, i) => {
        const t = nodeTone(s, emphasis);
        usage.tone(t);
        const r = rect(i);
        return (
          <Box
            key={s.id}
            {...r}
            title={s.title}
            sub={s.sub}
            mono={s.mono}
            tone={t}
          />
        );
      })}
      {es.map(e => {
        const a = rect(index.get(e.from)!);
        const b = rect(index.get(e.to)!);
        const tone = edgeTone(e, emphasis);
        usage.edge(tone, e.dashed);
        if (adjacent(e)) {
          const y = y0 + h / 2;
          return (
            <Arrow
              key={edgeId(e)}
              points={[
                [a.x + a.w, y],
                [b.x - 2, y],
              ]}
              tone={tone}
              dashed={e.dashed}
              label={e.label}
            />
          );
        }
        const k = loops.indexOf(e);
        const yb = y0 + h + 28 * (k + 1);
        const back = b.x < a.x;
        const sx = a.x + a.w / 2 + (back ? -12 : 12);
        const tx = b.x + b.w / 2 + (back ? 12 : -12);
        const pts: Pt[] = [
          [sx, y0 + h],
          [sx, yb],
          [tx, yb],
          [tx, y0 + h + 2],
        ];
        return (
          <Arrow
            key={edgeId(e)}
            points={pts}
            tone={tone}
            dashed={e.dashed}
            label={e.label}
          />
        );
      })}
    </Diagram>
  );
}
