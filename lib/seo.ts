import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Vitalii Serbyn — AI Systems Architect',
  description:
    'I design autonomous agent systems, trust-layered orchestration, and production AI infrastructure.',
  url: 'https://serbyn.pro',
  ogImage: 'https://serbyn.pro/logo.png',
  creator: 'Vitalii Serbyn',
  keywords: [
    'Agent Orchestration',
    'Autonomous Agents',
    'Trust Layers',
    'AI Infrastructure',
    'AI Systems Architect',
    'LLM Systems',
    'MLOps',
    'Multi-Agent Systems',
    'Production AI',
    'Cost Optimization',
    'AI Platform Engineering',
    'Remote Consultant',
  ],
};

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export function createMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonicalUrl,
}: SEOProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description;
  const imageUrl = image;

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
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl || siteConfig.url,
      siteName: siteConfig.name,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: '@VitaliiSerbyn',
      site: '@VitaliiSerbyn',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl || siteConfig.url,
    },
  };
}

export const pageMetadata = {
  home: () =>
    createMetadata({
      canonicalUrl: siteConfig.url,
    }),

  about: () =>
    createMetadata({
      title: 'About',
      description:
        '12+ years shipping production systems. From mobile apps at EPAM/GlobalLogic to autonomous AI agent orchestration. Kyiv-based, UK LTD.',
      canonicalUrl: `${siteConfig.url}/about`,
    }),

  work: () =>
    createMetadata({
      title: 'Work',
      description:
        'Real projects: 15-agent autonomous system, signal-driven AI platform, multi-project enterprise delivery. Architecture case studies with authentic metrics.',
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
        'AI Systems Architect resume. 12+ years production systems, autonomous agent orchestration, MLOps. Download PDF or view online.',
      canonicalUrl: `${siteConfig.url}/resume`,
    }),
};

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vitalii Serbyn',
    jobTitle: 'AI Systems Architect',
    description: siteConfig.description,
    url: siteConfig.url,
    image: 'https://serbyn.pro/logo.png',
    sameAs: [
      'https://www.linkedin.com/in/vitalii-serbyn-b517a083',
      'https://github.com/vitamin33',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Easelect LTD',
      url: siteConfig.url,
    },
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
    name: 'Easelect LTD',
    url: siteConfig.url,
    logo: 'https://serbyn.pro/logo.png',
    description:
      'AI systems architecture consulting. Autonomous agent orchestration, trust layers, and production AI infrastructure.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office 12, Initial Business Centre, Wilson Business Park',
      addressLocality: 'Manchester',
      postalCode: 'M40 8WN',
      addressCountry: 'GB',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '',
      email: 'serbyn.vitalii@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Ukrainian', 'Russian'],
    },
    founder: {
      '@type': 'Person',
      name: 'Vitalii Serbyn',
    },
    sameAs: ['https://linkedin.com/company/serbyn-solutions'],
  };
}
