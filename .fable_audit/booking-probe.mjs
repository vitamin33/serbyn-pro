import { chromium } from '@playwright/test';
import fs from 'fs';

const SHOTS = new URL('./shots/', import.meta.url).pathname;
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  deviceScaleFactor: 3, isMobile: true, hasTouch: true,
});
const page = await ctx.newPage();
const out = { steps: [] };

// Step 1: landing on Calendly event page
await page.goto('https://calendly.com/serbyn-vitalii/consulting', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: SHOTS + 'booking-1-landing-390.png' });
out.steps.push({ step: 1, name: 'event landing', title: await page.title(), url: page.url() });
out.landingText = (await page.evaluate(() => document.body.innerText)).slice(0, 1500);

// Step 2: pick first available day
const day = page.locator('button[aria-label*="Times available"], td button:not([disabled])').first();
if (await day.count()) {
  await day.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: SHOTS + 'booking-2-times-390.png' });
  out.steps.push({ step: 2, name: 'day picked' });
  // Step 3: pick first time slot
  const slot = page.locator('button[data-container="time-button"], [data-component="spot-list"] button').first();
  if (await slot.count()) {
    await slot.click();
    await page.waitForTimeout(1500);
    // Calendly shows a "Next" confirm button after picking time
    const next = page.locator('button[aria-label*="Next"], button:has-text("Next")').first();
    if (await next.count()) { await next.click(); await page.waitForTimeout(2500); }
    await page.screenshot({ path: SHOTS + 'booking-3-form-390.png' });
    out.steps.push({ step: 3, name: 'details form' });
    // harvest form fields
    out.formFields = await page.evaluate(() => {
      const fields = [...document.querySelectorAll('input, textarea, select')].map(el => ({
        tag: el.tagName.toLowerCase(), type: el.type || null, required: el.required,
        label: (el.labels && el.labels[0] ? el.labels[0].innerText : el.getAttribute('aria-label') || el.name || el.id || '').slice(0, 120),
      })).filter(f => f.type !== 'hidden');
      return fields;
    });
    out.formText = (await page.evaluate(() => document.body.innerText)).slice(0, 2500);
    // full form screenshot
    await page.screenshot({ path: SHOTS + 'booking-3-form-390-full.png', fullPage: true });
  }
}
fs.writeFileSync(new URL('./booking-flow.json', import.meta.url).pathname, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out.steps));
await browser.close();
