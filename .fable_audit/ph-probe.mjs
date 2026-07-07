import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, timezoneId: 'America/New_York' });
const page = await ctx.newPage();
const reqs = [];
page.on('request', r => { const u = r.url(); if (/posthog|i\.posthog|ph_|vercel-insights|vitals/.test(u)) reqs.push(u.slice(0, 90)); });
await page.goto('https://serbyn.io/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const cookies = await ctx.cookies();
console.log('tracking requests:', JSON.stringify([...new Set(reqs)].slice(0, 8), null, 1));
console.log('cookies:', JSON.stringify(cookies.map(c => c.name + ' (' + c.domain + ')')));
console.log('consent UI present:', await page.evaluate(() => /cookie|consent/i.test(document.body.innerText) ));
// Calendly slots in ET
await page.goto('https://calendly.com/serbyn-vitalii/consulting', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const day = page.locator('button[aria-label*="Times available"]').first();
if (await day.count()) { await day.click(); await page.waitForTimeout(2500); }
const slots = await page.evaluate(() => [...document.querySelectorAll('button[data-container="time-button"], [data-component="spot-list"] button')].map(b => b.textContent.trim()).slice(0, 20));
const tz = await page.evaluate(() => { const el = [...document.querySelectorAll('button,div')].find(e => /time zone/i.test(e.getAttribute?.('aria-label') || '')); return el ? el.textContent.trim().slice(0, 60) : (document.body.innerText.match(/Time zone\n([^\n]*)/) || [])[1]; });
console.log('detected tz label:', tz);
console.log('slots shown (viewer tz America/New_York):', JSON.stringify(slots));
await browser.close();
