import { chromium } from '@playwright/test';
import fs from 'fs';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('https://serbyn.io/', { waitUntil: 'networkidle' });
const out = {};

// keyboard-tab through first 8 focusables, record computed outline/ring
out.focusStates = [];
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Tab');
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 40),
      outline: cs.outline, outlineColor: cs.outlineColor,
      boxShadow: cs.boxShadow.slice(0, 80),
    };
  });
  if (info) out.focusStates.push(info);
}
await page.screenshot({ path: new URL('./shots/focus-state-1440.png', import.meta.url).pathname });

// contrast pairs: sample real elements
out.colors = await page.evaluate(() => {
  function lum(rgbStr) {
    const m = rgbStr.match(/\d+(\.\d+)?/g).map(Number);
    const [r, g, b] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(fg, bg) { const a = lum(fg), c = lum(bg); return ((Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05)).toFixed(2); }
  const bg = getComputedStyle(document.body).backgroundColor;
  const samples = [];
  const sel = [
    ['hero subhead', 'section p'],
    ['label mono', '[class*="mono"], .font-mono'],
    ['muted', '[class*="muted"]'],
  ];
  for (const [name, s] of sel) {
    const els = [...document.querySelectorAll(s)].filter(e => e.innerText?.trim()).slice(0, 3);
    for (const e of els) {
      const cs = getComputedStyle(e);
      const ebg = (() => { let n = e; while (n && getComputedStyle(n).backgroundColor === 'rgba(0, 0, 0, 0)') n = n.parentElement; return n ? getComputedStyle(n).backgroundColor : bg; })();
      samples.push({ name, text: e.innerText.slice(0, 30), color: cs.color, bg: ebg, fontSizePx: cs.fontSize, contrast: contrast(cs.color, ebg) });
    }
  }
  return samples;
});

// mobile tap targets on menu
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
const mp = await mctx.newPage();
await mp.goto('https://serbyn.io/', { waitUntil: 'networkidle' });
out.tapTargets = await mp.evaluate(() => {
  return [...document.querySelectorAll('a, button')].slice(0, 30).map(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 ? { text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) } : null;
  }).filter(Boolean).filter(t => t.h < 44 || t.w < 44);
});
fs.writeFileSync(new URL('./a11y.json', import.meta.url).pathname, JSON.stringify(out, null, 2));
console.log('focus:', JSON.stringify(out.focusStates.slice(0, 4)));
console.log('small tap targets:', JSON.stringify(out.tapTargets));
console.log('contrast:', JSON.stringify(out.colors.slice(0, 6)));
await browser.close();
