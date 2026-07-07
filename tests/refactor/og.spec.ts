import { test, expect } from '@playwright/test';

// T10 — every money page must expose a real 1200×630, non-transparent OG card
// (F5). The old og:image was a 1024×1024 transparent logo declared as 1200×630;
// this guards against that regressing. The og:image meta is an absolute
// serbyn.io URL (metadataBase), so we test the locally-built image by swapping
// the origin to the test server.
const MONEY_PAGES = ['/', '/audit', '/llm-cost-teardown', '/fractional'];

test.describe('T10 — money-page OG cards are 1200×630 and opaque', () => {
  for (const path of MONEY_PAGES) {
    test(`${path} has a real social card`, async ({ page }) => {
      await page.goto(path);
      const og = await page.getAttribute(
        'meta[property="og:image"]',
        'content'
      );
      expect(og, `${path} is missing og:image`).toBeTruthy();

      const origin = new URL(page.url()).origin;
      const u = new URL(og!);
      const localSrc = origin + u.pathname + u.search;

      // 200 + image content-type
      const resp = await page.request.get(localSrc);
      expect(resp.status(), `${localSrc} status`).toBe(200);
      expect(
        resp.headers()['content-type'] || '',
        `${path} og:image content-type`
      ).toContain('image');

      // dimensions + opacity via canvas (same-origin, no taint)
      const probe = await page.evaluate(async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const tl = Array.from(ctx.getImageData(3, 3, 1, 1).data);
        return { w: img.naturalWidth, h: img.naturalHeight, tl };
      }, localSrc);

      expect(probe.w, `${path} og width`).toBe(1200);
      expect(probe.h, `${path} og height`).toBe(630);
      // corner pixel must be fully opaque and dark (the card background), not the
      // transparent square-logo of the old asset
      expect(probe.tl[3], `${path} corner alpha (transparent bg?)`).toBe(255);
      expect(
        probe.tl[0] + probe.tl[1] + probe.tl[2],
        `${path} corner should be dark card bg`
      ).toBeLessThan(120);
    });
  }
});
