import { test, expect } from '@playwright/test';

// Canonical numbers that MUST appear on the home page (T2).
const CANON = ['18+', '1,178', '101', '0.94', '$3,500'];

test.describe('T1 — home renders the vendor H1', () => {
  test('home H1', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(
      'I make AI agents reliable enough to run in production'
    );
  });
});

test.describe('T2 — canonical numbers with JavaScript DISABLED, no "0" counter', () => {
  test.use({ javaScriptEnabled: false });

  test('home HTML carries canonical numbers and no bare-0 metric', async ({
    page,
  }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    for (const n of CANON) {
      expect(body, `expected canonical number "${n}" in home HTML`).toContain(n);
    }
    // The killed count-up counter used to render metric values as "0" before
    // animating. Every labeled metric must be plain, final text — never "0".
    const metrics = await page
      .locator('[data-claim] .metric-lg')
      .allInnerTexts();
    expect(metrics.length).toBeGreaterThan(0);
    for (const m of metrics) {
      expect(m.trim(), 'no standalone "0" metric value').not.toBe('0');
    }
  });
});

test.describe('T5 — every quantified claim carries a label element', () => {
  test('each [data-claim] contains exactly one [data-claim-label]', async ({
    page,
  }) => {
    await page.goto('/');
    const claims = page.locator('[data-claim]');
    const count = await claims.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(claims.nth(i).locator('[data-claim-label]')).toHaveCount(1);
    }
  });
});
