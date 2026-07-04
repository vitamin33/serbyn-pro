import { test, expect } from '@playwright/test';

// T1 — every SITE STRUCTURE page returns 200 and renders an H1. The list grows
// as pages land (offer pages, /writing, /methodology added in their tasks).
const PAGES: { path: string; h1?: RegExp }[] = [
  { path: '/', h1: /reliable enough to run in production/i },
  { path: '/audit', h1: /where your agents will fail/i },
];

test.describe('T1 — pages return 200 + render an H1', () => {
  for (const p of PAGES) {
    test(`${p.path} returns 200 + H1`, async ({ page }) => {
      const res = await page.goto(p.path);
      expect(res?.status()).toBe(200);
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      if (p.h1) await expect(h1).toHaveText(p.h1);
    });
  }
});
