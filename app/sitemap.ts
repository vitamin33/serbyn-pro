import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';
import { getAllCaseStudies } from '@/lib/case-studies';
import { getAllBlogPosts } from '@/lib/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  // Stable "content last materially updated" date, NOT build time — a fresh
  // timestamp every build is meaningless freshness noise (F24). Bump when static
  // content materially changes (mirrors lib/facts UPDATED). Posts use their own
  // dates below.
  const siteUpdated = '2026-07-07';

  const caseStudies = getAllCaseStudies();
  const caseStudyRoutes = caseStudies.map(study => ({
    url: `${baseUrl}${study.url}`,
    lastModified: siteUpdated,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogPosts = getAllBlogPosts();
  const blogRoutes = blogPosts.map(post => ({
    url: `${baseUrl}${post.url}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const routes = [
    {
      url: baseUrl,
      lastModified: siteUpdated,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/audit`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/llm-cost-teardown`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/fractional`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: siteUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: siteUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // /resume is intentionally omitted (noindex, vendor not candidate — D1).
    ...caseStudyRoutes,
    ...blogRoutes,
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: siteUpdated,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: siteUpdated,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  return routes;
}
