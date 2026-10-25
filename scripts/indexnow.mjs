#!/usr/bin/env node
/**
 * IndexNow submission for serbyn.io.
 *
 * IndexNow is an open protocol: one POST tells every participating search
 * engine that URLs changed. Bing, Yandex, Naver and Seznam consume it, and
 * they share submissions with each other. Bing's index also feeds ChatGPT
 * search and Microsoft Copilot, so this is the fastest route to those answers.
 * Google does not use IndexNow; it needs the sitemap in Search Console.
 *
 * The key below is public by design. It is served at
 * https://serbyn.io/<key>.txt so engines can verify we own the host.
 *
 * Usage:
 *   node scripts/indexnow.mjs --dry-run   print the payload, send nothing
 *   node scripts/indexnow.mjs             submit (npm run indexnow)
 *
 * Vercel: run as a post-build step only when VERCEL_ENV === 'production'
 * (see "vercel-build" in package.json). Any other environment skips.
 * Note the post-build runs before the new deployment is live, so the first
 * production deploy can race the key file; a failed submit never fails the build.
 */

import fs from 'node:fs';
import path from 'node:path';

const HOST = 'serbyn.io';
const KEY = '3d40b1ad44886b9950c3fb0356cf6ebc';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const fromBuild = args.has('--if-production');

if (fromBuild && process.env.VERCEL_ENV !== 'production') {
  console.log(
    `[indexnow] skipped: VERCEL_ENV is "${process.env.VERCEL_ENV ?? 'unset'}", only "production" submits.`
  );
  process.exit(0);
}

async function main() {
  // In the build step the new deployment is not live yet, so read the sitemap
  // that this build just produced; otherwise use the production sitemap.
  const local = path.join('.next', 'server', 'app', 'sitemap.xml.body');
  let xml;
  if (fromBuild && fs.existsSync(local)) {
    xml = fs.readFileSync(local, 'utf8');
  } else {
    const res = await fetch(SITEMAP_URL);
    if (!res.ok) throw new Error(`sitemap fetch failed: HTTP ${res.status}`);
    xml = await res.text();
  }
  const urlList = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m =>
    m[1].replace(/&amp;/g, '&')
  );
  if (urlList.length === 0) throw new Error('no URLs found in sitemap');

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  };

  if (dryRun) {
    console.log('[indexnow] dry run, nothing sent. Payload:');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const post = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  console.log(
    `[indexnow] submitted ${urlList.length} URLs: HTTP ${post.status}`
  );
  if (post.status >= 400 && !fromBuild) process.exitCode = 1;
}

main().catch(err => {
  console.error(`[indexnow] ${err.message}`);
  // Never fail a deploy because of a ping.
  process.exit(fromBuild ? 0 : 1);
});
