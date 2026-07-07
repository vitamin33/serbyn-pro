import { test, expect } from '@playwright/test';

// T15 — frontend polish guards (F14 404, F15 focus ring, F16 no external fonts).

test('T15a — 404 page is dark and routes back to /audit', async ({ page }) => {
  const resp = await page.goto('/this-page-does-not-exist-xyz');
  expect(resp?.status(), '404 status').toBe(404);
  const isDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark')
  );
  expect(isDark, 'html has dark theme class').toBe(true);
  await expect(page.locator('a[href="/audit"]').first()).toBeVisible();
});

test('T15b — keyboard-focused nav link shows a visible outline', async ({
  page,
}) => {
  await page.goto('/');
  let checked = false;
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el.tagName !== 'A') return null;
      const cs = getComputedStyle(el);
      return {
        href: el.getAttribute('href') || '',
        outlineStyle: cs.outlineStyle,
      };
    });
    if (
      info &&
      /\/(audit|llm-cost-teardown|fractional|writing|about)$/.test(info.href)
    ) {
      // F15: the global :focus-visible outline must actually render (it was an
      // invalid raw HSL triplet before).
      expect(info.outlineStyle, `focus outline on ${info.href}`).not.toBe(
        'none'
      );
      checked = true;
      break;
    }
  }
  expect(checked, 'reached a nav link via keyboard').toBe(true);
});

test('T15c — no external Google Fonts requests', async ({ page }) => {
  const googleFonts: string[] = [];
  page.on('request', r => {
    const u = r.url();
    if (u.includes('fonts.googleapis.com') || u.includes('fonts.gstatic.com')) {
      googleFonts.push(u);
    }
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(googleFonts, 'external font requests').toEqual([]);
});
