import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    // AI crawlers (GPTBot, Google-Extended, CCBot) are intentionally NOT blocked:
    // warm buyers vet vendors through assistants, so being retrievable/citable is
    // the goal. They fall under the '*' rule below. (F11)
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
          '*.json',
          '/tmp/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
