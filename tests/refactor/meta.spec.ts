import { test, expect } from '@playwright/test';

// Measurement (T10): every SITE STRUCTURE page must carry correct meta/OG tags.
const PAGES = [
  '/',
  '/audit',
  '/llm-cost-teardown',
  '/fractional',
  '/writing',
  '/methodology',
];

test.describe('meta/OG — every page has title, description, OG, canonical', () => {
  for (const path of PAGES) {
    test(`${path} has complete head metadata`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(/serbyn|vitalii|architect/i);

      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(desc, `${path} meta description`).toBeTruthy();
      expect((desc ?? '').length).toBeGreaterThan(30);

      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content');
      expect(ogTitle, `${path} og:title`).toBeTruthy();

      const ogDesc = await page
        .locator('meta[property="og:description"]')
        .getAttribute('content');
      expect(ogDesc, `${path} og:description`).toBeTruthy();

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical, `${path} canonical`).toContain('serbyn.io');
    });
  }
});
