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

// T12 — the /audit page links the evidence corpus (F18): at least two links to
// /blog/ field reports, so the buyer (and an LLM summarizing /audit) can reach
// the proof behind the method.
test('T12 — /audit links ≥2 blog posts', async ({ page }) => {
  await page.goto('/audit');
  const postLinks = page.locator('a[href^="/blog/"]');
  expect(await postLinks.count()).toBeGreaterThanOrEqual(2);
});
