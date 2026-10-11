// Renders the site icons from the mark (the proven tick on a ledger rule):
//
//   node scripts/render-icons.mjs
//
// public/favicon.svg     scalable mark, follows the OS color scheme
// public/favicon-32x32.png, public/apple-touch-icon.png (180), public/logo.png (512)
// public/favicon.ico     16 + 32 PNGs in an ICO container
// Shapes and colors as on the design-system board "01 · Mark".

import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = f => join(root, 'public', f);

const ACCENT = '#496a62';
const PAPER = '#f5f3ee';
const INK = '#1c1b19';
const DARK = '#151513';
const DARK_INK = '#ece8df';
const DARK_ACCENT = '#7fb3a4';

// 16 and 32: evergreen tile, white tick (the rule only from 32 up)
const tile = (size, radius, rule) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${ACCENT}"/>
  <svg x="${size * 0.125}" y="${size * 0.125}" width="${size * 0.75}" height="${size * 0.75}" viewBox="0 0 28 28">
    ${rule ? '<path d="M3 23h22" stroke="#fff" stroke-width="1.8" fill="none" opacity=".6"/>' : ''}
    <path d="M6.5 14.5 11 23 23 5" stroke="#fff" stroke-width="${rule ? 3.4 : 4.2}" fill="none"/>
  </svg>
</svg>`;

// 180 and 512: paper (or darkroom) tile, ink rule, accent tick
const plate = (size, bg, ink, accent) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${bg}"/>
  <svg x="${size * 0.17}" y="${size * 0.17}" width="${size * 0.66}" height="${size * 0.66}" viewBox="0 0 28 28">
    <path d="M2 23h24" stroke="${ink}" stroke-width="1.5" fill="none"/>
    <path d="M6.5 14.5 11 23 23 5" stroke="${accent}" stroke-width="2.8" fill="none"/>
  </svg>
</svg>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
  <style>
    .r { stroke: ${INK} } .t { stroke: ${ACCENT} }
    @media (prefers-color-scheme: dark) { .r { stroke: ${DARK_INK} } .t { stroke: ${DARK_ACCENT} } }
  </style>
  <path class="r" d="M2 23h24" stroke-width="1.5" fill="none"/>
  <path class="t" d="M6.5 14.5 11 23 23 5" stroke-width="2.8" fill="none"/>
</svg>
`;
writeFileSync(out('favicon.svg'), faviconSvg);

const browser = await chromium.launch();
const page = await browser.newPage();
async function png(svg, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg}</body></html>`
  );
  return page.locator('svg').first().screenshot({ omitBackground: true });
}

const p16 = await png(tile(16, 3, false), 16);
const p32 = await png(tile(32, 6, true), 32);
writeFileSync(out('favicon-32x32.png'), p32);
writeFileSync(
  out('apple-touch-icon.png'),
  await png(plate(180, PAPER, INK, ACCENT), 180)
);
writeFileSync(
  out('logo.png'),
  await png(plate(512, DARK, DARK_INK, DARK_ACCENT), 512)
);
await browser.close();

// ICO container holding PNG images (valid since Windows Vista, read by all
// current browsers)
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...images.map(i => i.data)]);
}
writeFileSync(
  out('favicon.ico'),
  ico([
    { size: 16, data: p16 },
    { size: 32, data: p32 },
  ])
);
console.log('icons written');
