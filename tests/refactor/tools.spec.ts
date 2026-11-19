import { test, expect, type Page, type Request } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { analyzeLines, sampleLines } from '../../lib/tools/cache-rebuilds';

// /tools/claude-code-cache-rebuilds: reads Claude Code session logs in the
// browser and prices the prompt-cache rebuilds. The fixture is invented data.
//
// Expected numbers for the fixture, by hand (USD per MTok: Opus 5.5 input 4,
// Fable 5.2 input 8; 1h write 2x, 5m write 1.25x, output 5x):
//   req_fx_1  60k written (1h), Opus      write 0.48  total 0.494   rebuild
//   req_fx_2  two rows, last wins          write 0.01  total 0.043
//   req_fx_3  100k written after 2h29m     write 0.80  total 0.8404  rebuild
//   req_fx_4  80k written, no TTL split    write 1.28  total 1.288   rebuild
//   req_fx_5  70k written (5m), new model  write 0.35  total 0.3524  rebuild
//   req_fx_6  unknown model                unpriced
//   total 3.0178, rebuilds 2.91 -> 96%

const PATH = '/tools/claude-code-cache-rebuilds';
const FIXTURE = join(__dirname, '..', 'fixtures', 'claude-code-session.jsonl');

test.describe('tools — cache rebuild logic', () => {
  test('the fixture gives the hand-computed numbers', () => {
    const r = analyzeLines(readFileSync(FIXTURE, 'utf8').split('\n'));
    expect(r.requests).toBe(6);
    expect(r.sessions).toBe(2);
    expect(r.rebuilds).toBe(4);
    expect(r.cost).toBeCloseTo(3.0178, 6);
    expect(r.rebuildCost).toBeCloseTo(2.91, 6);
    expect(r.unpricedRequests).toBe(1);
    expect(r.unpricedModels).toEqual(['acme-model-1']);
    expect(r.causes.map(c => [c.cause, c.rebuilds])).toEqual([
      ['start', 2],
      ['idle1h', 1],
      ['model', 1],
    ]);
    expect(r.worstSessions.map(s => s.id)).toEqual(['bbbb2222', 'aaaa1111']);
  });

  test('the sample data is deterministic and has rebuilds', () => {
    const a = analyzeLines(sampleLines());
    const b = analyzeLines(sampleLines());
    expect(a).toEqual(b);
    expect(a.rebuilds).toBeGreaterThan(0);
    expect(a.rebuildShare).toBeGreaterThan(0);
    expect(a.rebuildShare).toBeLessThan(1);
    expect(a.unpricedRequests).toBe(0);
  });
});

/**
 * Requests that could carry log content: anything cross-origin, anything that
 * is not a GET, anything with a body. Same-origin GETs (static files, link
 * prefetches) cannot.
 */
function watch(page: Page): Request[] {
  const bad: Request[] = [];
  page.on('request', req => {
    const url = new URL(req.url());
    const sameOrigin = url.origin === new URL(page.url()).origin;
    if (!sameOrigin || req.method() !== 'GET' || req.postData()) bad.push(req);
  });
  return bad;
}

test.describe('tools — cache rebuild page', () => {
  test('the page loads and says where the logs live', async ({ page }) => {
    const res = await page.goto(PATH);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('body')).toContainText('~/.claude/projects');
    await expect(page.locator('body')).toContainText('Nothing from them is');
    await expect(
      page.locator(`main a[href="/llm-cost-teardown"], .ds-tool a[href="/llm-cost-teardown"]`).first()
    ).toBeVisible();
    await expect(
      page.locator(
        'a[href="https://github.com/vitamin33/claude-code-statusline"]'
      )
    ).toBeVisible();
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);
  });

  test('sample data produces a headline share, with no network', async ({
    page,
  }) => {
    await page.goto(PATH);
    await page.waitForLoadState('networkidle');
    const bad = watch(page);
    await expect(async () => {
      await page.getByTestId('tool-sample').click();
      await expect(page.getByTestId('tool-share')).toBeVisible({
        timeout: 1000,
      });
    }).toPass();
    await expect(page.getByTestId('tool-share')).toHaveText(/^\d+(\.\d)?%$/);
    await expect(page.getByTestId('tool-share')).not.toHaveText('0%');
    await page.waitForTimeout(500);
    expect(bad.map(r => `${r.method()} ${r.url()}`)).toEqual([]);
  });

  test('an uploaded log gives the exact numbers, with no network', async ({
    page,
  }) => {
    await page.goto(PATH);
    await page.waitForLoadState('networkidle');
    const bad = watch(page);
    await expect(async () => {
      await page.getByTestId('tool-files-input').setInputFiles(FIXTURE);
      await expect(page.getByTestId('tool-share')).toBeVisible({
        timeout: 1000,
      });
    }).toPass();
    await expect(page.getByTestId('tool-share')).toHaveText('96%');
    await expect(page.getByTestId('tool-requests')).toHaveText('6');
    await expect(page.getByTestId('tool-rebuilds')).toHaveText('4');
    await expect(page.getByTestId('tool-rebuild-cost')).toHaveText('$2.91');
    await expect(page.getByTestId('tool-total-cost')).toHaveText('$3.02');
    await expect(page.getByTestId('tool-unpriced')).toContainText(
      'acme-model-1'
    );
    // the synthetic prompt line in the fixture is never rendered
    await expect(page.locator('body')).not.toContainText(
      'synthetic fixture line'
    );
    await page.waitForTimeout(500);
    expect(bad.map(r => `${r.method()} ${r.url()}`)).toEqual([]);
  });

  test('no horizontal scroll at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(PATH);
    await page.waitForLoadState('networkidle');
    await expect(async () => {
      await page.getByTestId('tool-sample').click();
      await expect(page.getByTestId('tool-share')).toBeVisible({
        timeout: 1000,
      });
    }).toPass();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
