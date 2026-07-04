import { test, expect } from '@playwright/test';

// T6 — the existing blog system stays fully working (R5): the /blog index
// renders with posts, and an individual post route renders its H1. The post is
// discovered by crawling from the index so no slug is hard-coded.
test.describe('T6 — blog index + a post still render', () => {
  test('/blog index renders with at least one post link', async ({ page }) => {
    const res = await page.goto('/blog');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    const postLinks = page.locator('a[href^="/blog/"]');
    expect(await postLinks.count()).toBeGreaterThan(0);
  });

  test('a blog post renders its H1', async ({ page }) => {
    await page.goto('/blog');
    const href = await page
      .locator('a[href^="/blog/"]')
      .first()
      .getAttribute('href');
    expect(href).toBeTruthy();
    const res = await page.goto(href!);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
