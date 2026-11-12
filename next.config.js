/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // PostHog sends requests with and without a trailing slash; without this
  // Next would 308 them and the proxy below would drop events.
  skipTrailingSlashRedirect: true,
  // First-party analytics proxy. The browser talks to /ingest on our own
  // origin and Next forwards to PostHog, so ad blockers that block
  // *.posthog.com do not silently drop a share of the readers. The static
  // rule has to come first.
  async rewrites() {
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
    const assets = host.replace('.i.posthog.com', '-assets.i.posthog.com');
    return [
      { source: '/ingest/static/:path*', destination: `${assets}/static/:path*` },
      { source: '/ingest/:path*', destination: `${host}/:path*` },
    ];
  },
  async redirects() {
    return [
      {
        // A link shared with "93-percent-pass" in the slug was landing on the
        // 404 page (seen in PostHog, 2026-11). The real slug says "93-pass".
        source: '/blog/the-calibration-ledger-58-runs-93-percent-pass-n-is-small',
        destination: '/blog/the-calibration-ledger-58-runs-93-pass-n-is-small',
        permanent: true,
      },
      {
        // F10 — /blog and /writing were duplicate listings of the same posts.
        // /writing is canonical; the blog index 301s to it. Individual posts
        // (/blog/:slug) are the canonical article URLs and are NOT redirected.
        source: '/blog',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/case-studies',
        destination: '/work',
        permanent: true,
      },
      {
        source: '/case-studies/:slug',
        destination: '/work/:slug',
        permanent: true,
      },
      {
        source: '/payments',
        destination: '/',
        permanent: true,
      },
      {
        source: '/how-to-pay',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
