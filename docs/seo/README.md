# SEO and indexing notes

Status as of 2026-10-25: Google knows 1 page of the 26 in the sitemap, and Bing knows 0. No sitemap had been submitted to either. Fixing that is a manual step in the two consoles below.

## Submit the sitemap

Google Search Console

1. Open the property for https://serbyn.io (verified by `public/google79e0ddd11f99193e.html`).
2. Sitemaps, enter `sitemap.xml`, Submit.
3. Use URL Inspection on the home page, /audit and a few posts, then Request Indexing.

Bing Webmaster Tools

1. Sign in at bing.com/webmasters.
2. Choose "Import from GSC" so the site and its sitemap come across with the Google verification.
3. Check that https://serbyn.io/sitemap.xml is listed under Sitemaps. If not, submit it.
4. Under IndexNow, confirm the key is found at https://serbyn.io/9b2cc94f75734fdbad0f12e7cd94d7bd.txt.

## IndexNow

IndexNow tells Bing, Yandex, Naver and Seznam that URLs changed. Bing's index feeds ChatGPT search and Copilot. Google does not use it.

- Key file: `public/9b2cc94f75734fdbad0f12e7cd94d7bd.txt`. The key is public by design.
- Script: `scripts/indexnow.mjs`. No dependencies. It reads the sitemap and POSTs `{host, key, keyLocation, urlList}` to https://api.indexnow.org/indexnow.
- `npm run indexnow` submits the live sitemap URLs by hand.
- `node scripts/indexnow.mjs --dry-run` prints the payload and sends nothing.
- `postbuild` in package.json runs the script with `--if-production`. It submits only when `VERCEL_ENV === 'production'`, using the sitemap this build produced. Any other environment prints why it skipped. A failed ping never fails the build.

## Other files

- `app/llms.txt` lists every published post and case study. `/llms-full.txt` holds the full text of every published post.
- Sitemap `lastModified` for posts uses the `updated` frontmatter field, then `date`. Drafts are excluded.
