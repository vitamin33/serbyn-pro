import { test, expect } from '@playwright/test';

// Traffic package (2026-11): the things that decide whether a search engine can
// read the site and whether the analytics numbers can be trusted.

test.describe('traffic — crawlability', () => {
  test('robots.txt lets crawlers fetch the CSS and JS under /_next/', async ({
    request,
  }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).not.toMatch(/Disallow:\s*\/_next/i);
    expect(body).toMatch(/Disallow:\s*\/ingest\//i);
    expect(body).toMatch(/Sitemap:\s*https:\/\/serbyn\.io\/sitemap\.xml/i);
  });

  test('the mis-shared calibration-ledger slug redirects to the real post', async ({
    request,
  }) => {
    const res = await request.get(
      '/blog/the-calibration-ledger-58-runs-93-percent-pass-n-is-small',
      { maxRedirects: 0 }
    );
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe(
      '/blog/the-calibration-ledger-58-runs-93-pass-n-is-small'
    );
  });

  test('every sitemap URL resolves', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const paths = Array.from(xml.matchAll(/<loc>https:\/\/serbyn\.io([^<]*)<\/loc>/g)).map(
      m => m[1] || '/'
    );
    expect(paths.length).toBeGreaterThan(20);
    for (const path of paths) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(200);
    }
  });
});

test.describe('traffic — titles', () => {
  test('a long post title drops the long site-name suffix', async ({ page }) => {
    await page.goto('/blog/does-codex-cli-have-hooks');
    const title = await page.title();
    expect(title).toMatch(/\| Vitalii Serbyn$/);
    expect(title).not.toContain('Agentic Systems Architect');
  });

  test('a short page title keeps the full site name', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(
      'About | Vitalii Serbyn — Agentic Systems Architect'
    );
  });
});

test.describe('traffic — analytics hygiene', () => {
  test('a non-production host sends nothing to PostHog', async ({ page }) => {
    const hits: string[] = [];
    page.on('request', r => {
      const url = r.url();
      if (url.includes('/ingest') || url.includes('posthog.com')) hits.push(url);
    });
    await page.goto('/');
    await page.goto('/blog/does-codex-cli-have-hooks');
    await page.waitForTimeout(1500);
    expect(hits).toEqual([]);
  });
});
