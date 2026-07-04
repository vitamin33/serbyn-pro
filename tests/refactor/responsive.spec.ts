import { test, expect } from '@playwright/test';

// T7 — home and /audit render without horizontal overflow at 390px (mobile) and
// 1440px (desktop). Screenshots saved to .playwright-artifacts/ for review.
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/audit', name: 'audit' },
];
const VIEWPORTS = [
  { w: 390, h: 844, tag: '390' },
  { w: 1440, h: 900, tag: '1440' },
];

test.describe('T7 — no horizontal overflow, capture screenshots', () => {
  for (const p of PAGES) {
    for (const v of VIEWPORTS) {
      test(`${p.name} @ ${v.tag}px`, async ({ page }) => {
        await page.setViewportSize({ width: v.w, height: v.h });
        await page.goto(p.path);
        await page.waitForLoadState('networkidle');

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth
        );
        // allow 1px for sub-pixel rounding
        expect(
          overflow,
          `${p.name} overflows by ${overflow}px at ${v.tag}`
        ).toBeLessThanOrEqual(1);

        await page.screenshot({
          path: `.playwright-artifacts/${p.name}-${v.tag}.png`,
          fullPage: true,
        });
      });
    }
  }
});
