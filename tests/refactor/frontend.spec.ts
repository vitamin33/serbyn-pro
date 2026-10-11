import { test, expect } from '@playwright/test';

// T15 — frontend polish guards (F14 404, F15 focus ring, F16 no external fonts).

test('T15a — 404 page is branded, themed, and routes back to /audit', async ({
  page,
}) => {
  // The site used to be dark-only (an html.dark class). It now follows the OS
  // scheme through the design tokens, so the 404 must paint the token
  // background in both schemes: dark under a dark preference, light otherwise.
  const bodyBg = () =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.emulateMedia({ colorScheme: 'dark' });
  const resp = await page.goto('/this-page-does-not-exist-xyz');
  expect(resp?.status(), '404 status').toBe(404);
  expect(await bodyBg(), 'dark token --bg #151513').toBe('rgb(21, 21, 19)');
  await expect(page.locator('a[href="/audit"]').first()).toBeVisible();

  await page.emulateMedia({ colorScheme: 'light' });
  expect(await bodyBg(), 'light token --bg #f5f3ee').toBe('rgb(245, 243, 238)');
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
