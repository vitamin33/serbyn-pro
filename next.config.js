/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
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
