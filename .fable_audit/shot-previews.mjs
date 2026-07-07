import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 810, height: 1700 }, deviceScaleFactor: 2 })).newPage();
await page.goto('file://' + process.cwd() + '/.fable_audit/previews.html');
await page.waitForTimeout(500);
await page.screenshot({ path: '.fable_audit/shots/preclick-previews.png', fullPage: true });
console.log('done');
await browser.close();
