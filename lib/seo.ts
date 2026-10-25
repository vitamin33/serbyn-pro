import type { Metadata } from 'next';
import { OFFERS } from '@/lib/facts';

// Canonical @id for the site's Person entity — referenced by Organization,
// Service.provider, and BlogPosting.author so assistants resolve one entity
// instead of disconnected copies.
export const PERSON_ID = 'https://serbyn.io/#person';

export const siteConfig = {
  name: 'Vitalii Serbyn — Agentic Systems Architect',
  description:
    'I make AI agents reliable enough to run in production. Agent reliability engineering and LLM cost engineering for US, UK, and EU teams — fixed-scope audits, teardowns, and fractional architecture.',
  url: 'https://serbyn.io',
  ogImage: 'https://serbyn.io/logo.png',
  creator: 'Vitalii Serbyn',
  keywords: [
    'Agent Reliability',
    'AI Agent Audit',
    'Agentic Systems Architect',
    'LLM Cost Engineering',
    'Trajectory Evals',
    'Multi-Agent Systems',
    'Production AI',
    'LLM Cost Optimization',
    'Fractional AI Architect',
    'AI Consulting',
    'Trust-Tiered Execution',
    'Remote AI Consultant',
  ],
};

interface SEOProps {
  title?: string;
  description?: string;
  // `null` => omit the static image so a route-level opengraph-image.tsx
  // (dynamic next/og card) supplies it instead.
  image?: string | null;
  noIndex?: boolean;
  canonicalUrl?: string;
  // when set, the page is an Open Graph `article` (blog posts) with publish/author/tags
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
  };
}

export function createMetadata({
  title,
  description = siteConfig.description,
  // Default to null: every route now carries a file-based opengraph-image.tsx
  // (1200×630 dark card). Pass an explicit URL only to override that.
  image = null,
  noIndex = false,
  canonicalUrl,
  article,
}: SEOProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description;
  const includeImage = image !== null;
  const imageUrl = image ?? siteConfig.ogImage;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: article ? 'article' : 'website',
      locale: 'en_US',
      url: canonicalUrl || siteConfig.url,
      siteName: siteConfig.name,
      title: metaTitle,
      description: metaDescription,
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime || article.publishedTime,
            authors: [siteConfig.creator],
            tags: article.tags,
          }
        : {}),
      ...(includeImage
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: metaTitle,
                type: 'image/png',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      ...(includeImage ? { images: [imageUrl] } : {}),
      // twitter:creator/site omitted — no verified handle is linked from the
      // site. [VS-TODO:twitter-handle] add back once a real handle is confirmed.
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: '16x16 32x32' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    metadataBase: new URL(siteConfig.url),
    // Bing Webmaster Tools site verification (public token, must stay after verification).
    verification: {
      other: { 'msvalidate.01': '0B709168E1F6A0F22BF2F7D54FC0933F' },
    },
    alternates: {
      canonical: canonicalUrl || siteConfig.url,
      types: { 'application/rss+xml': `${siteConfig.url}/feed.xml` },
    },
  };
}

export const pageMetadata = {
  home: () =>
    createMetadata({
      description:
        'Fixed-scope AI agent audits from $3,500. I make AI agents reliable enough to run in production — agent reliability engineering (trajectory evals, false-green metering, evidence-binding) and LLM cost engineering, for US/UK/EU teams.',
      canonicalUrl: siteConfig.url,
    }),

  about: () =>
    createMetadata({
      title: 'About',
      description:
        '13+ years shipping production systems. From mobile apps at EPAM/GlobalLogic to autonomous AI agent orchestration. Kyiv-based, UK LTD.',
      canonicalUrl: `${siteConfig.url}/about`,
    }),

  work: () =>
    createMetadata({
      title: 'Work',
      description:
        'Real projects: 27-agent (18 mature) autonomous system, signal-driven AI platform, multi-project enterprise delivery. Architecture case studies with authentic metrics.',
      canonicalUrl: `${siteConfig.url}/work`,
    }),

  blog: () =>
    createMetadata({
      title: 'Blog',
      description:
        'Technical writing on agent orchestration, trust layers, cost engineering, and production AI systems.',
      canonicalUrl: `${siteConfig.url}/blog`,
    }),

  privacy: () =>
    createMetadata({
      title: 'Privacy Policy',
      description:
        'Privacy policy and data protection information. UK GDPR compliant with clear data rights.',
      canonicalUrl: `${siteConfig.url}/legal/privacy`,
    }),

  terms: () =>
    createMetadata({
      title: 'Terms of Service',
      description:
        'Terms of service for AI systems architecture consulting. Clear service delivery and liability terms.',
      canonicalUrl: `${siteConfig.url}/legal/terms`,
    }),

  resume: () =>
    createMetadata({
      title: 'Resume',
      description:
        'Agentic Systems Architect resume. 13+ years production systems, autonomous agent orchestration, MLOps.',
      canonicalUrl: `${siteConfig.url}/resume`,
      // Vendor site, not a job hunt: keep the route reachable but out of the
      // index so it doesn't read as "hireable candidate" in search (D1).
      noIndex: true,
    }),
};

const SERVICE_TYPE: Record<string, string> = {
  audit: 'AI agent reliability audit',
  'llm-cost-teardown': 'LLM cost engineering',
  fractional: 'Fractional AI architecture',
};

// Service schema for an offer page (F12). Price is pulled from the canonical
// OFFERS so structured data can never drift from the rendered price.
export function generateServiceSchema(offerId: string) {
  const offer = OFFERS.find(o => o.id === offerId);
  if (!offer) return null;
  const priceValue = offer.price.replace(/[^0-9]/g, '');
  const isMonthly = /\/mo/.test(offer.price);
  const url = `${siteConfig.url}${offer.href}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: offer.name,
    serviceType: SERVICE_TYPE[offerId] ?? 'AI consulting',
    description: offer.summary,
    provider: { '@id': PERSON_ID },
    areaServed: ['US', 'GB', 'EU'],
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: priceValue,
      ...(isMonthly
        ? {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: priceValue,
              priceCurrency: 'USD',
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: 1,
                unitCode: 'MON',
              },
            },
          }
        : {}),
    },
  };
}

// FAQPage schema from an offer page's structured Q&A (F12).
export function generateFaqSchema(faqs: { q: string; a: string }[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

const ORG_ID = 'https://serbyn.io/#organization';

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Vitalii Serbyn',
    jobTitle: 'Agentic Systems Architect',
    description: siteConfig.description,
    url: siteConfig.url,
    image: 'https://serbyn.io/logo.png',
    sameAs: [
      'https://www.linkedin.com/in/vitalii-serbyn-b517a083',
      'https://github.com/vitamin33',
    ],
    worksFor: { '@id': ORG_ID },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UA',
      addressLocality: 'Kyiv',
      addressRegion: 'Kyiv',
    },
    knowsAbout: [
      'Agent Orchestration',
      'Autonomous Agent Systems',
      'Trust-Layered AI',
      'Multi-Agent Systems',
      'MLOps',
      'AI Infrastructure',
      'Cost Engineering',
      'Production AI Systems',
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Easelect LTD',
    url: siteConfig.url,
    logo: 'https://serbyn.io/logo.png',
    description:
      'AI systems architecture consulting. Autonomous agent orchestration, trust layers, and production AI infrastructure.',
    // The one machine-verifiable trust fact the site has.
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'UK Companies House',
      value: '15983917',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office 12, Initial Business Centre, Wilson Business Park',
      addressLocality: 'Manchester',
      postalCode: 'M40 8WN',
      addressCountry: 'GB',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'serbyn.vitalii@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Ukrainian', 'Russian'],
    },
    founder: { '@id': PERSON_ID },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://serbyn.io/#website',
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { '@id': PERSON_ID },
  };
}
