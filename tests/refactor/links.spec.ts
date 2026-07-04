import { test, expect } from '@playwright/test';

// T4 — every internal link resolves. Crawl from home to depth 2 and assert each
// discovered same-origin URL returns a 2xx/3xx status.
async function internalLinks(page: import('@playwright/test').Page) {
  const hrefs = await page.locator('a[href]').evaluateAll(els =>
    els.map(e => (e as HTMLAnchorElement).getAttribute('href') || '')
  );
  return hrefs
    .filter(h => h.startsWith('/') && !h.startsWith('//'))
    .map(h => h.split('#')[0])
    .filter(Boolean);
}

test('T4 — internal links resolve (crawl from home, depth 2)', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const depth1 = new Set(await internalLinks(page));

  const depth2 = new Set<string>(depth1);
  for (const url of depth1) {
    await page.goto(url);
    for (const l of await internalLinks(page)) depth2.add(l);
  }

  const broken: string[] = [];
  for (const url of depth2) {
    const res = await request.get(url);
    if (res.status() >= 400) broken.push(`${url} → ${res.status()}`);
  }

  expect(depth2.size).toBeGreaterThan(8);
  expect(broken, `broken internal links:\n${broken.join('\n')}`).toEqual([]);
});
