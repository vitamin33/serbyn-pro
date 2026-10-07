import { test, expect } from '@playwright/test';

// T16 — diagram system gallery (/lab/diagrams, docs/design/diagram-system.md).
// Every preset renders as server-side SVG with an accessible name, the page
// never scrolls sideways on a phone, nothing is fetched from another origin,
// and a dark-mode screenshot is saved for review.
const GALLERY = '/lab/diagrams';

test('T16a — every diagram is an svg[role=img] with a non-empty aria-label', async ({
  page,
}) => {
  await page.goto(GALLERY);
  const presets = await page.locator('section[data-preset]').count();
  expect(presets, 'gallery sections').toBeGreaterThanOrEqual(12);

  const figures = page.locator('figure.dg-figure');
  const n = await figures.count();
  // every section shows its diagram twice: light and dark
  expect(n).toBe(presets * 2);
  for (let i = 0; i < n; i++) {
    const svg = figures.nth(i).locator('svg');
    await expect(svg).toHaveCount(1);
    await expect(svg).toHaveAttribute('role', 'img');
    const label = ((await svg.getAttribute('aria-label')) ?? '').trim();
    expect(label.length, `figure ${i} aria-label`).toBeGreaterThan(20);
    await expect(figures.nth(i).locator('figcaption')).not.toBeEmpty();
  }
});

test('T16b — diagrams are in the server HTML (no client JS needed)', async ({
  browser,
}) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(GALLERY);
  expect(
    await page.locator('figure.dg-figure svg[role="img"]').count()
  ).toBeGreaterThanOrEqual(24);
  await ctx.close();
});

test('T16c — no horizontal page scroll at 390px; diagrams scroll in their frame', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(GALLERY);
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );
  expect(overflow, 'page overflows sideways').toBeLessThanOrEqual(1);
  // the text keeps its scale: frames scroll instead of shrinking the SVG
  const scrolls = await page
    .locator('.dg-frame')
    .evaluateAll(
      els => els.filter(e => e.scrollWidth > e.clientWidth + 1).length
    );
  expect(scrolls, 'frames that scroll inside themselves').toBeGreaterThan(0);
});

test('T16d — the gallery makes no external requests', async ({
  page,
  baseURL,
}) => {
  const origin = new URL(baseURL!).origin;
  const external: string[] = [];
  page.on('request', r => {
    const u = r.url();
    if (/^https?:/.test(u) && new URL(u).origin !== origin) external.push(u);
  });
  await page.goto(GALLERY, { waitUntil: 'networkidle' });
  expect(external, 'requests to other origins').toEqual([]);
});

test('T16e — dark-mode screenshot for review', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(GALLERY, { waitUntil: 'networkidle' });
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor
  );
  expect(bg, 'dark token --bg #111715').toBe('rgb(17, 23, 21)');
  await page.screenshot({
    path: '.playwright-artifacts/diagram-gallery-dark.png',
    fullPage: true,
  });
});
