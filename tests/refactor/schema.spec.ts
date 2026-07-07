import { test, expect } from '@playwright/test';

// T13 — each offer page carries exactly one Service and one FAQPage JSON-LD
// block, parseable, with the Service price matching the canonical OFFERS price
// (F12). Person + Organization blocks from the root layout are present too and
// are ignored by the @type filter.
const OFFER_PRICES: Record<string, string> = {
  '/audit': '3500',
  '/llm-cost-teardown': '2000',
  '/fractional': '4000',
};

function extractJsonLd(html: string): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      /* ignore non-JSON */
    }
  }
  return blocks;
}

test.describe('T13 — offer pages carry Service + FAQPage JSON-LD', () => {
  for (const [path, price] of Object.entries(OFFER_PRICES)) {
    test(`${path}: one Service (price ${price}) + one FAQPage`, async ({
      page,
    }) => {
      const resp = await page.request.get(path);
      const html = await resp.text();
      const blocks = extractJsonLd(html);

      const services = blocks.filter(b => b['@type'] === 'Service');
      const faqs = blocks.filter(b => b['@type'] === 'FAQPage');

      expect(services.length, `${path} Service count`).toBe(1);
      expect(faqs.length, `${path} FAQPage count`).toBe(1);

      const offers = services[0].offers as { price?: unknown };
      expect(String(offers.price), `${path} Service price`).toBe(price);

      const mainEntity = faqs[0].mainEntity as unknown[];
      expect(mainEntity.length, `${path} FAQ items`).toBeGreaterThan(0);
    });
  }
});

// T14 — /llms.txt is served as markdown with the canonical identity + pricing.
test('T14 — /llms.txt is 200 text/markdown', async ({ page }) => {
  const resp = await page.request.get('/llms.txt');
  expect(resp.status()).toBe(200);
  expect(resp.headers()['content-type'] || '').toContain('markdown');
  const body = await resp.text();
  expect(body).toContain('serbyn.io');
  expect(body).toContain('$3,500');
});
