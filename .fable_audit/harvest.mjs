import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE = 'https://serbyn.io';
const SHOTS = new URL('./shots/', import.meta.url).pathname;
const PAGES = [
  ['home', '/'],
  ['audit', '/audit'],
  ['cost-teardown', '/llm-cost-teardown'],
  ['fractional', '/fractional'],
  ['writing', '/writing'],
  ['about', '/about'],
  ['methodology', '/methodology'],
  ['work', '/work'],
  ['blog-arc', '/blog/the-arc-since-the-six-were-caught'],
  ['blog-ledger', '/blog/the-calibration-ledger-58-runs-93-pass-n-is-small'],
  ['blog-parsing', '/blog/permissive-parsing-is-a-false-green-factory'],
  ['404page', '/nonexistent-page-xyz'],
];

const results = {};

async function harvestPage(browser, name, path, viewport, tag) {
  const ctx = await browser.newContext({
    viewport,
    userAgent: viewport.width < 500
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
      : undefined,
    deviceScaleFactor: viewport.width < 500 ? 3 : 1,
    isMobile: viewport.width < 500,
    hasTouch: viewport.width < 500,
  });
  const page = await ctx.newPage();
  const consoleMsgs = [];
  const pageErrors = [];
  page.on('console', m => {
    if (['error', 'warning'].includes(m.type())) consoleMsgs.push(`[${m.type()}] ${m.text().slice(0, 300)}`);
  });
  page.on('pageerror', e => pageErrors.push(String(e).slice(0, 300)));

  const resp = await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => null);
  await page.waitForTimeout(2500);

  // metrics
  const metrics = await page.evaluate(() => new Promise(resolve => {
    const nav = performance.getEntriesByType('navigation')[0];
    let lcp = 0, cls = 0;
    try {
      new PerformanceObserver(l => { const e = l.getEntries(); if (e.length) lcp = e[e.length - 1].startTime; })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
    setTimeout(() => {
      const res = performance.getEntriesByType('resource');
      const js = res.filter(r => r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name));
      const fonts = res.filter(r => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name));
      const imgs = res.filter(r => r.initiatorType === 'img' || /\.(png|jpe?g|webp|avif|svg|gif)(\?|$)/.test(r.name));
      resolve({
        ttfb: nav ? +(nav.responseStart - nav.requestStart).toFixed(0) : null,
        domContentLoaded: nav ? +nav.domContentLoadedEventEnd.toFixed(0) : null,
        lcp: +lcp.toFixed(0),
        cls: +cls.toFixed(4),
        jsCount: js.length,
        jsTransferKB: +(js.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024).toFixed(1),
        fontCount: fonts.length,
        fontKB: +(fonts.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024).toFixed(1),
        imgKB: +(imgs.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024).toFixed(1),
        htmlKB: nav ? +((nav.transferSize || 0) / 1024).toFixed(1) : null,
        totalKB: +(res.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024 + (nav?.transferSize || 0) / 1024).toFixed(1),
        docHeight: document.documentElement.scrollHeight,
        fontsUsed: [...new Set(res.filter(r => /\.(woff2?|ttf)(\?|$)/.test(r.name)).map(r => r.name.split('/').pop().slice(0, 40)))],
      });
    }, 1200);
  }));

  await page.screenshot({ path: `${SHOTS}${name}-${tag}-fold.png` });
  await page.screenshot({ path: `${SHOTS}${name}-${tag}-full.png`, fullPage: true });

  // homepage mobile: scroll-depth captures
  if (name === 'home' && tag === '390') {
    const steps = Math.min(Math.ceil(metrics.docHeight / viewport.height), 12);
    for (let i = 1; i < steps; i++) {
      await page.evaluate(({ i, h }) => window.scrollTo(0, i * h), { i, h: viewport.height });
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${SHOTS}home-390-scroll-${String(i).padStart(2, '0')}.png` });
    }
  }

  results[`${name}@${tag}`] = {
    path, status: resp ? resp.status() : 'NAV-FAIL',
    ...metrics,
    consoleErrors: consoleMsgs, pageErrors,
  };
  await ctx.close();
}

const browser = await chromium.launch();
for (const [name, path] of PAGES) {
  await harvestPage(browser, name, path, { width: 390, height: 844 }, '390');
  await harvestPage(browser, name, path, { width: 1440, height: 900 }, '1440');
  console.log(`done: ${name}`);
}
await browser.close();
fs.writeFileSync(new URL('./metrics.json', import.meta.url).pathname, JSON.stringify(results, null, 2));
console.log('WROTE metrics.json');
