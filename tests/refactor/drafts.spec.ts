import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

// T17 — a post with `draft: true` is invisible in a production build: no route,
// and absent from every listing, feed and index. Drafts are found from their
// frontmatter, so this keeps guarding whatever is in draft at the time.
const BLOG = join(__dirname, '..', '..', 'content', 'blog');
const drafts = readdirSync(BLOG)
  .filter(f => f.endsWith('.mdx'))
  .map(f => matter(readFileSync(join(BLOG, f), 'utf8')).data)
  .filter(d => d.draft === true)
  .map(d => String(d.slug));

test.describe('T17 — drafts are not published', () => {
  test.skip(drafts.length === 0, 'no draft posts in content/blog');

  for (const slug of drafts) {
    test(`${slug}: no route in production`, async ({ request }) => {
      const res = await request.get(`/blog/${slug}`);
      expect(res.status(), `/blog/${slug}`).toBe(404);
    });

    test(`${slug}: not in sitemap, RSS, llms.txt or listings`, async ({
      request,
    }) => {
      for (const path of [
        '/sitemap.xml',
        '/feed.xml',
        '/llms.txt',
        '/writing',
        '/',
      ]) {
        const res = await request.get(path);
        expect(res.status(), path).toBe(200);
        expect(await res.text(), `${path} mentions the draft`).not.toContain(
          slug
        );
      }
    });

    test(`${slug}: not among a published post's related links`, async ({
      page,
    }) => {
      await page.goto('/writing');
      const first = await page
        .locator('a[href^="/blog/"]')
        .first()
        .getAttribute('href');
      await page.goto(first!);
      expect(
        await page.locator(`a[href="/blog/${slug}"]`).count(),
        'link to draft'
      ).toBe(0);
    });
  }
});
