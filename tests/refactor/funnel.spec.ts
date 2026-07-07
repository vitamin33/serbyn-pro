import { test, expect } from '@playwright/test';

// T11 — /blog (duplicate listing) permanently redirects to canonical /writing,
// but individual posts /blog/:slug stay 200 (they are the canonical article URLs).
// Next.js `permanent: true` emits 308.
test.describe('T11 — blog index redirects, posts preserved', () => {
  test('/blog → 308 → /writing', async ({ page }) => {
    const resp = await page.request.get('/blog', { maxRedirects: 0 });
    expect([301, 308], 'permanent redirect status').toContain(resp.status());
    const loc = resp.headers()['location'] || '';
    expect(loc, 'redirect target').toMatch(/\/writing$/);
  });

  test('/blog/:slug still 200', async ({ page }) => {
    const resp = await page.request.get(
      '/blog/the-arc-since-the-six-were-caught'
    );
    expect(resp.status()).toBe(200);
  });
});
