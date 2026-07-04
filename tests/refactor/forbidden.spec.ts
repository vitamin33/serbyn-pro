import { test, expect } from '@playwright/test';

// T3 — no page may contain forbidden strings: the deleted "59x" ROI claim,
// lorem-ipsum placeholder, unresolved template tokens, or leaked VS-TODO ids.
const PAGES = [
  '/',
  '/audit',
  '/llm-cost-teardown',
  '/fractional',
  '/writing',
  '/methodology',
  '/blog',
];

// Matched case-insensitively against the RENDERED page text.
const FORBIDDEN: { needle: string; why: string }[] = [
  { needle: '59x', why: 'banned ROI claim' },
  { needle: 'lorem', why: 'placeholder copy' },
  { needle: 'ipsum', why: 'placeholder copy' },
  { needle: '{{', why: 'unresolved template token' },
  { needle: '}}', why: 'unresolved template token' },
  { needle: '${', why: 'unresolved template literal' },
  { needle: 'vs-todo', why: 'leaked VS-TODO id' },
  { needle: '[object object]', why: 'stringified object' },
  { needle: 'undefined', why: 'leaked undefined value' },
  { needle: 'nan/month', why: 'broken numeric render' },
];

test.describe('T3 — no forbidden strings on any page', () => {
  for (const path of PAGES) {
    test(`${path} is clean`, async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator('body').innerText()).toLowerCase();
      for (const f of FORBIDDEN) {
        expect(text, `${path} contains "${f.needle}" (${f.why})`).not.toContain(
          f.needle.toLowerCase()
        );
      }
    });
  }
});
