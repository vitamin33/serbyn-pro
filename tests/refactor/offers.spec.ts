import { test, expect } from '@playwright/test';

// T8 — the canonical price appears EXACTLY ONCE per offer page and matches the
// canonical value. The list grows as offer pages land (T07/T08).
const OFFER_PAGES: { path: string; price: string }[] = [
  { path: '/audit', price: '$3,500' },
  { path: '/llm-cost-teardown', price: 'from $2,000' },
  { path: '/fractional', price: 'from $4,000/mo' },
];

test.describe('T8 — pricing appears exactly once per offer page', () => {
  for (const o of OFFER_PAGES) {
    test(`${o.path} shows ${o.price} exactly once`, async ({ page }) => {
      await page.goto(o.path);
      const body = await page.locator('body').innerText();
      const occurrences = body.split(o.price).length - 1;
      expect(occurrences, `${o.price} count on ${o.path}`).toBe(1);
    });
  }
});
