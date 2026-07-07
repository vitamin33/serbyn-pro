/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
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
