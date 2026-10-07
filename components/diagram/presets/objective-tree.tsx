import { Box, Diagram, type Tier } from '../primitives';
import { fitBox, textWidth } from '../metrics';
import { r1 } from '../geometry';
import {
  MARGIN,
  minW,
  nodeTone,
  Usage,
  type NodeData,
  type PresetBase,
} from './shared';

export type KeyResult = NodeData & {
  /** Status dot: a (on track) … d (off track). Named in the legend if repeated. */
  status?: Tier;
};
export type SubObjective = NodeData & { children?: KeyResult[] };

export type ObjectiveTreeProps = PresetBase & {
  root: NodeData & { children: SubObjective[] };
};

const KR_H = 30;
const KR_H2 = 44;
const KR_GAP = 10;

/** Objective → sub-objectives in columns → key results stacked under each. */
export function ObjectiveTree({
  label,
  caption,
  emphasis,
  legend,
  width = 960,
  root,
}: ObjectiveTreeProps) {
  const subs = root.children;
  const n = subs.length;
  const colGap = 24;
  const needCol = Math.max(
    ...subs.map(s => fitBox(s.title, s.sub, { mono: s.mono }).w),
    ...subs.flatMap(s =>
      (s.children ?? []).map(k => textWidth(k.title, 't-m') + 46)
    )
  );
  const colW = Math.max((width - 2 * MARGIN - colGap * (n - 1)) / n, needCol);
  const W = Math.ceil(
    Math.max(width, 2 * MARGIN + n * colW + (n - 1) * colGap)
  );

  const rootFit = fitBox(root.title, root.sub, { minW: 260 });
  const rootR = {
    x: (W - rootFit.w) / 2,
    y: MARGIN,
    w: rootFit.w,
    h: rootFit.h,
  };
  const busY = rootR.y + rootR.h + 22;
  const subH = Math.max(...subs.map(s => fitBox(s.title, s.sub).h));
  const subY = busY + 22;
  const colX = (i: number) => MARGIN + i * (colW + colGap);

  const krTop = subY + subH + 16;
  const colHeights = subs.map(s =>
    (s.children ?? []).reduce(
      (sum, k) => sum + (k.sub ? KR_H2 : KR_H) + KR_GAP,
      0
    )
  );
  const H = Math.ceil(
    krTop +
      Math.max(0, ...colHeights) +
      MARGIN -
      (colHeights.some(h => h) ? KR_GAP : 16)
  );

  const usage = new Usage();
  const rootTone = nodeTone(root, emphasis);
  usage.tone(rootTone);
  const centers = subs.map((_, i) => colX(i) + colW / 2);

  const body = (
    <>
      <Box {...rootR} title={root.title} sub={root.sub} tone={rootTone} />
      <line
        x1={r1(W / 2)}
        y1={rootR.y + rootR.h}
        x2={r1(W / 2)}
        y2={busY}
        className="dg-ln"
      />
      {n > 1 && (
        <line
          x1={r1(centers[0])}
          y1={busY}
          x2={r1(centers[n - 1])}
          y2={busY}
          className="dg-ln"
        />
      )}
      {subs.map((s, i) => {
        const t = nodeTone(s, emphasis);
        usage.tone(t);
        const x = colX(i);
        let y = krTop;
        const railX = x + 14;
        const krs = s.children ?? [];
        const lastMid = krs.length
          ? krTop +
            krs
              .slice(0, -1)
              .reduce((a, k) => a + (k.sub ? KR_H2 : KR_H) + KR_GAP, 0) +
            (krs[krs.length - 1].sub ? KR_H2 : KR_H) / 2
          : 0;
        return (
          <g key={s.id}>
            <line
              x1={r1(centers[i])}
              y1={busY}
              x2={r1(centers[i])}
              y2={subY}
              className="dg-ln"
            />
            <Box
              x={x}
              y={subY + (subH - fitBox(s.title, s.sub).h) / 2}
              w={colW}
              h={fitBox(s.title, s.sub).h}
              title={s.title}
              sub={s.sub}
              mono={s.mono}
              tone={t}
            />
            {krs.length > 0 && (
              <line
                x1={r1(railX)}
                y1={subY + subH}
                x2={r1(railX)}
                y2={r1(lastMid)}
                className="dg-ln-mfg"
              />
            )}
            {krs.map(k => {
              const h = k.sub ? KR_H2 : KR_H;
              const ky = y;
              y += h + KR_GAP;
              const kt = nodeTone(k, emphasis);
              usage.tone(kt);
              if (k.status) usage.add(`tier-${k.status}`);
              const bx = railX + 14;
              const bw = x + colW - bx;
              return (
                <g key={k.id}>
                  <line
                    x1={r1(railX)}
                    y1={r1(ky + h / 2)}
                    x2={r1(bx)}
                    y2={r1(ky + h / 2)}
                    className="dg-ln-mfg"
                  />
                  <rect
                    x={r1(bx)}
                    y={r1(ky)}
                    width={r1(bw)}
                    height={h}
                    rx={4}
                    className={
                      kt === 'accent'
                        ? 'dg-b-acc'
                        : kt === 'muted'
                          ? 'dg-b-mut'
                          : 'dg-b'
                    }
                  />
                  {k.status && (
                    <circle
                      cx={r1(bx + 12)}
                      cy={r1(ky + (k.sub ? 15 : h / 2))}
                      r={4}
                      className={`dg-f${k.status}`}
                    />
                  )}
                  <text
                    x={r1(bx + (k.status ? 24 : 10))}
                    y={r1(ky + (k.sub ? 19 : h / 2 + 4))}
                    className="dg-t-m"
                  >
                    {k.title}
                  </text>
                  {k.sub && (
                    <text
                      x={r1(bx + (k.status ? 24 : 10))}
                      y={r1(ky + 35)}
                      className="dg-t-s"
                    >
                      {k.sub}
                    </text>
                  )}
                </g>
              );
            })}
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
