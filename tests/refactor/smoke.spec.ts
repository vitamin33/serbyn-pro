import { test, expect } from '@playwright/test';

// T1 (partial, grows as pages land): each SITE STRUCTURE page returns 200 and
// renders its H1. Home always exists; offer/writing pages are added as they are
// implemented in later tasks.
test.describe('T1 — pages return 200 + render an H1', () => {
  test('home renders an H1', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
