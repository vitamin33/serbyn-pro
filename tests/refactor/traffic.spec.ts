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

// Cleanup package (2026-11-19).
test.describe('traffic — cleanup package', () => {
  test('/resume is indexable and in the sitemap', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain('<loc>https://serbyn.io/resume</loc>');
    const html = await (await request.get('/resume')).text();
    expect(html).not.toMatch(/<meta name="robots" content="[^"]*noindex/i);
  });

  test('no sitemap page has a description past 160 characters or lacks a social image', async ({
    request,
  }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const paths = Array.from(
      xml.matchAll(/<loc>https:\/\/serbyn\.io([^<]*)<\/loc>/g)
    ).map(m => m[1] || '/');
    for (const path of paths) {
      const html = await (await request.get(path)).text();
      const description =
        html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
      const length = description
        .replace(/&#x27;|&quot;|&amp;/g, 'x')
        .length;
      expect(length, `${path} description`).toBeGreaterThan(50);
      expect(length, `${path} description`).toBeLessThanOrEqual(160);
      expect(html, `${path} og:image`).toMatch(/<meta property="og:image"/);
    }
  });

  test('the newsletter link from the site is not tagged as LinkedIn', async ({
    request,
  }) => {
    const site = await request.get('/newsletter?src=site', { maxRedirects: 0 });
    expect(site.status()).toBe(302);
    expect(site.headers()['location']).toContain('utm_source=serbyn.io');
    const featured = await request.get('/newsletter', { maxRedirects: 0 });
    expect(featured.headers()['location']).toContain('utm_source=linkedin');
    const comment = await request.get('/newsletter?src=comment', {
      maxRedirects: 0,
    });
    expect(comment.headers()['location']).toContain('utm_medium=comment');
  });

  test('a long post headline gets a shorter title tag and keeps its H1', async ({
    request,
  }) => {
    const html = await (
      await request.get('/blog/proof-of-green-checks-every-done')
    ).text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    expect(title.length).toBeLessThanOrEqual(80);
    expect(html).toMatch(/<h1[^>]*>[^<]*I built a tool/);
  });

  test('posts link to posts from their own cluster and case studies link out', async ({
    request,
  }) => {
    const old = await (
      await request.get(
        '/blog/six-false-greens-in-a-self-auditing-agent-pipeline'
      )
    ).text();
    expect(old).toContain('Related posts');
    const study = await (
      await request.get('/work/ascend-autonomous-agents')
    ).text();
    expect(study).toContain('href="/llm-cost-teardown"');
    expect(study).toContain('"@type":"Article"');
  });

  test('baseline security headers are set', async ({ request }) => {
    const headers = (await request.get('/')).headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });
});
