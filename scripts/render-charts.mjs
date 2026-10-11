// Re-renders the blog chart PNGs in the design-system palette, light and dark.
//
//   node scripts/render-charts.mjs
//
// Writes public/blog/<name>.png (light) and public/blog/<name>-dark.png. The
// post renderer shows the one that matches the active theme. Every number
// below is one the post states (or the count behind a rate it states);
// intervals are Wilson 95%, computed here from the counts, as in the posts.
// Fonts are the site's own (app/fonts), rasterized by Playwright at 2x.

import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const font = f =>
  `data:font/woff2;base64,${readFileSync(join(root, 'app/fonts', f)).toString('base64')}`;

const THEMES = {
  light: {
    bg: '#fdfbf6',
    fg: '#1c1b19',
    muted: '#6b665d',
    line: '#e5e0d7',
    lineStrong: '#d3ccbf',
    claim: '#cc7c5e',
    claimText: '#9e5136',
    baseline: '#4f5b77',
    accent: '#496a62',
  },
  dark: {
    bg: '#1d1c1a',
    fg: '#ece8df',
    muted: '#a39d92',
    line: '#2e2c28',
    lineStrong: '#403c36',
    claim: '#e0906f',
    claimText: '#e0906f',
    baseline: '#8f9fc6',
    accent: '#7fb3a4',
  },
};

function wilson(k, n, z = 1.96) {
  if (!n) return null;
  const p = k / n,
    z2 = z * z,
    d = 1 + z2 / n;
  const c = (p + z2 / (2 * n)) / d;
  const h = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/**
 * One panel of vertical bars. Values are fractions of yMax.
 * bar: { label, value, series, top?, count?, ci?: [lo, hi], empty?: string }
 */
function panel({ x, y, w, h, title, yMax, ticks, tickFmt, bars, ref, t }) {
  const out = [];
  const plotTop = y + 44,
    plotH = h - 44 - 64,
    plotBottom = plotTop + plotH;
  const plotLeft = x + 44,
    plotW = w - 44;
  const Y = v => plotBottom - (v / yMax) * plotH;
  if (title)
    out.push(
      `<text x="${plotLeft}" y="${y + 18}" class="pt">${esc(title)}</text>`
    );
  for (const tk of ticks) {
    out.push(
      `<line x1="${plotLeft}" x2="${plotLeft + plotW}" y1="${Y(tk)}" y2="${Y(tk)}" stroke="${t.line}" />`
    );
    out.push(
      `<text x="${plotLeft - 8}" y="${Y(tk) + 4}" class="tick" text-anchor="end">${tickFmt(tk)}</text>`
    );
  }
  out.push(
    `<line x1="${plotLeft}" x2="${plotLeft + plotW}" y1="${plotBottom}" y2="${plotBottom}" stroke="${t.lineStrong}" />`
  );
  if (ref) {
    out.push(
      `<line x1="${plotLeft}" x2="${plotLeft + plotW}" y1="${Y(ref.v)}" y2="${Y(ref.v)}" stroke="${t.muted}" stroke-dasharray="4 4" />`
    );
    if (ref.label)
      out.push(
        `<text x="${plotLeft + plotW}" y="${Y(ref.v) - 6}" class="tick" text-anchor="end">${esc(ref.label)}</text>`
      );
  }
  const slot = plotW / bars.length,
    bw = Math.min(112, slot * 0.56);
  bars.forEach((b, i) => {
    const cx = plotLeft + slot * (i + 0.5);
    if (b.empty) {
      out.push(
        `<text x="${cx}" y="${plotBottom - 24}" class="note" text-anchor="middle" fill="${t.claimText}">${esc(b.empty)}</text>`
      );
    } else {
      const top = Y(b.value);
      out.push(
        `<rect x="${cx - bw / 2}" y="${top}" width="${bw}" height="${Math.max(plotBottom - top, b.value === 0 ? 0 : 1)}" rx="2" fill="${t[b.series]}" />`
      );
      if (b.value === 0)
        out.push(
          `<rect x="${cx - bw / 2}" y="${plotBottom - 2}" width="${bw}" height="2" fill="${t[b.series]}" />`
        );
      let labelY = top - 10;
      if (b.ci) {
        const [lo, hi] = b.ci.map(f => Y(f * yMax));
        out.push(
          `<line x1="${cx}" x2="${cx}" y1="${lo}" y2="${hi}" stroke="${t.fg}" stroke-width="1.5" />`
        );
        out.push(
          `<line x1="${cx - 6}" x2="${cx + 6}" y1="${lo}" y2="${lo}" stroke="${t.fg}" stroke-width="1.5" />`
        );
        out.push(
          `<line x1="${cx - 6}" x2="${cx + 6}" y1="${hi}" y2="${hi}" stroke="${t.fg}" stroke-width="1.5" />`
        );
        labelY = Math.min(labelY, hi - 10);
      }
      out.push(
        `<text x="${cx}" y="${labelY}" class="val" text-anchor="middle">${esc(b.top)}</text>`
      );
    }
    if (b.count)
      out.push(
        `<text x="${cx}" y="${plotBottom + 20}" class="tick" text-anchor="middle">${esc(b.count)}</text>`
      );
    b.label
      .split('\n')
      .forEach((line, j) =>
        out.push(
          `<text x="${cx}" y="${plotBottom + 42 + j * 17}" class="lab" text-anchor="middle">${esc(line)}</text>`
        )
      );
  });
  return out.join('\n');
}

const pct = (k, n) => `${Math.round((k / n) * 100)}%`;
const rate = (label, k, n, series) => ({
  label,
  series,
  value: (k / n) * 100,
  top: pct(k, n),
  count: `${k} / ${n}`,
  ci: wilson(k, n),
});

/* ── the charts ─────────────────────────────────────────────────────────── */

const CHARTS = {
  // content/blog/enforced-checkpoint-0-of-40-silent-failures-vs-22-of-40.mdx
  'checkpoint-silent-failures': {
    w: 920,
    h: 430,
    title: 'Finished wrong and said done, and what it cost',
    sub: 'deepseek-flash · ckpt-stage2-20260929T145911Z.jsonl · n = 40 fired injections per arm · error bars: Wilson 95%',
    panels: t => [
      panel({
        x: 0,
        y: 70,
        w: 440,
        h: 340,
        t,
        title: 'silent failures per fired injection, %',
        yMax: 100,
        ticks: [0, 25, 50, 75, 100],
        tickFmt: v => v,
        bars: [
          rate('no checkpoint', 22, 40, 'claim'),
          rate('reconcile tool,\nvoluntary', 6, 40, 'baseline'),
          rate('checkpoint,\nenforced', 0, 40, 'accent'),
        ],
      }),
      panel({
        x: 480,
        y: 70,
        w: 440,
        h: 340,
        t,
        title: 'cost per trajectory, relative to no checkpoint',
        yMax: 2.5,
        ticks: [0, 0.5, 1, 1.5, 2, 2.5],
        tickFmt: v => v.toFixed(1),
        ref: { v: 1 },
        bars: [
          { label: 'no checkpoint', series: 'claim', value: 1, top: '1.00x' },
          {
            label: 'reconcile tool,\nvoluntary',
            series: 'baseline',
            value: 1.94,
            top: '1.94x',
          },
          {
            label: 'checkpoint,\nenforced',
            series: 'accent',
            value: 1,
            top: '1.00x',
          },
        ],
      }),
    ],
  },
  // content/blog/nine-times-the-eval-tried-to-lie-to-me.mdx
  'detection-two-definitions': {
    w: 720,
    h: 470,
    title: 'Same 70 trajectories, two definitions of detection',
    sub: 'the first counts ordinary progress through a customer list as suspicion · error bars: Wilson 95%',
    panels: t => [
      panel({
        x: 0,
        y: 70,
        w: 720,
        h: 380,
        t,
        title: 'detection rate, %',
        yMax: 100,
        ticks: [0, 25, 50, 75, 100],
        tickFmt: v => v,
        ref: { v: 50, label: 'H2 threshold: < 50%' },
        bars: [
          rate('"called the tool again"', 39, 70, 'claim'),
          rate('"re-examined the same subject"', 8, 70, 'baseline'),
        ],
      }),
    ],
  },
  // content/blog/nine-times-the-eval-tried-to-lie-to-me.mdx
  'position-trap': {
    w: 920,
    h: 450,
    title: 'The −26pp that was not a position effect',
    sub: 'detection rate by injection position · error bars: Wilson 95%',
    panels: t => [
      panel({
        x: 0,
        y: 70,
        w: 440,
        h: 360,
        t,
        title: 'pooled across all tasks',
        yMax: 60,
        ticks: [0, 20, 40, 60],
        tickFmt: v => v,
        bars: [rate('early', 2, 50, 'baseline'), rate('late', 6, 20, 'claim')],
      }),
      panel({
        x: 480,
        y: 70,
        w: 440,
        h: 360,
        t,
        title: 'only tasks where late ≠ early (T3, T4, T7, T8)',
        yMax: 60,
        ticks: [0, 20, 40, 60],
        tickFmt: v => v,
        bars: [
          rate('early', 0, 30, 'baseline'),
          {
            label: 'late',
            series: 'claim',
            empty: 'n = 0 · never fired',
            count: '0 / 0',
          },
        ],
      }),
    ],
  },
  // content/blog/same-model-0-and-100-where-the-verifier-gap-actually-lives.mdx
  'verifier-gap-contrast': {
    w: 820,
    h: 500,
    title: 'deepseek-v4-flash, same week',
    sub: 'single answer n = 50 wrong shown · trajectory n = 70 injected · error bars: Wilson 95%',
    legend: [
      ['single answer', 'baseline'],
      ['trajectory', 'claim'],
    ],
    panels: t => [
      panel({
        x: 0,
        y: 70,
        w: 400,
        h: 390,
        t,
        title: 'false-green rate, %',
        yMax: 100,
        ticks: [0, 25, 50, 75, 100],
        tickFmt: v => v,
        bars: [
          rate('single answer', 0, 50, 'baseline'),
          rate('trajectory', 45, 45, 'claim'),
        ],
      }),
      panel({
        x: 420,
        y: 70,
        w: 400,
        h: 390,
        t,
        title: 'caught the planted fault, %',
        yMax: 100,
        ticks: [0, 25, 50, 75, 100],
        tickFmt: v => v,
        bars: [
          rate('single answer', 50, 50, 'baseline'),
          rate('trajectory', 8, 70, 'claim'),
        ],
      }),
    ],
  },
};

function page(name, spec, themeName) {
  const t = THEMES[themeName];
  const legendH = spec.legend ? 28 : 0;
  const H = spec.h + legendH + 30;
  const legend = spec.legend
    ? spec.legend
        .map(
          ([l, s], i) =>
            `<rect x="${i * 170}" y="${spec.h + 6}" width="12" height="12" rx="2" fill="${t[s]}" /><text x="${i * 170 + 20}" y="${spec.h + 17}" class="lab" text-anchor="start">${esc(l)}</text>`
        )
        .join('')
    : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Manrope;src:url(${font('manrope.woff2')});font-weight:200 800}
@font-face{font-family:'Plex Sans';src:url(${font('plex-sans.woff2')});font-weight:100 700}
@font-face{font-family:'Plex Mono';src:url(${font('plex-mono-400.woff2')});font-weight:400}
html,body{margin:0;background:${t.bg}}
#c{padding:28px 32px 20px;display:inline-block;background:${t.bg}}
text{fill:${t.fg}}
.h{font:800 22px Manrope;letter-spacing:-.02em}
.s{font:400 12px 'Plex Mono';fill:${t.muted}}
.pt{font:500 12px 'Plex Mono';fill:${t.muted};letter-spacing:.04em}
.tick{font:400 12px 'Plex Mono';fill:${t.muted}}
.val{font:500 15px 'Plex Mono'}
.lab{font:500 14px 'Plex Sans'}
.note{font:italic 400 13px 'Plex Mono'}
.src{font:400 11px 'Plex Mono';fill:${t.muted}}
</style></head><body><div id="c"><svg width="${spec.w}" height="${H}" viewBox="0 0 ${spec.w} ${H}" xmlns="http://www.w3.org/2000/svg">
<text x="0" y="22" class="h">${esc(spec.title)}</text>
<text x="0" y="44" class="s">${esc(spec.sub)}</text>
${spec.panels(t).join('\n')}
${legend}
<text x="${spec.w}" y="${H - 4}" class="src" text-anchor="end">serbyn.io</text>
</svg></div></body></html>`;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 2 });
const p = await ctx.newPage();
for (const [name, spec] of Object.entries(CHARTS)) {
  for (const theme of ['light', 'dark']) {
    await p.setContent(page(name, spec, theme));
    await p.evaluate(() => document.fonts.ready);
    const file = join(
      root,
      'public/blog',
      `${name}${theme === 'dark' ? '-dark' : ''}.png`
    );
    await p.locator('#c').screenshot({ path: file });
    console.log('wrote', file.replace(root + '/', ''));
  }
}
await browser.close();
