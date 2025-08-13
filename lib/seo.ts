import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Vitalii Serbyn — AI Engineer & MLOps Specialist',
  description:
    'Reliable LLM systems with MLflow, vLLM, SLO-gated CI. Remote US/EU consultant.',
  url: 'https://serbyn.pro',
  ogImage: 'https://serbyn.pro/og.png',
  creator: 'Vitalii Serbyn',
  keywords: [
    'AI Engineer',
    'MLOps Specialist',
    'LLM Systems',
    'Machine Learning',
    'vLLM',
    'MLflow',
    'RAG',
    'SLO',
    'Cost Optimization',
    'Remote Consultant',
    'US/EU Clients',
    'Production ML',
    'Model Deployment',
    'AI Infrastructure',
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
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl || siteConfig.url,
    },
  };
}

// Page-specific metadata generators
export const pageMetadata = {
  home: () =>
    createMetadata({
      canonicalUrl: siteConfig.url,
    }),

  about: () =>
    createMetadata({
      title: 'About',
      description:
        'Senior AI/ML Engineer with 8+ years building production-scale LLM systems. Specialized in cost optimization and enterprise MLOps.',
      canonicalUrl: `${siteConfig.url}/about`,
    }),

  howToPay: () =>
    createMetadata({
      title: 'How to Pay',
      description:
        'Payment methods and invoicing for AI/ML engineering services. ACH, SEPA, Stripe, and Wise transfers accepted.',
      canonicalUrl: `${siteConfig.url}/how-to-pay`,
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
        'Terms of service for AI/ML engineering consulting. Clear service delivery and liability terms.',
      canonicalUrl: `${siteConfig.url}/legal/terms`,
    }),

  resume: () =>
    createMetadata({
      title: 'Resume',
      description:
        'Detailed technical resume and work history. Download PDF or view online with ATS-optimized format.',
      canonicalUrl: `${siteConfig.url}/resume`,
    }),

  caseStudies: () =>
    createMetadata({
      title: 'Case Studies',
      description:
        'Real-world AI/ML implementations with measurable outcomes. Production systems serving 10M+ requests.',
      canonicalUrl: `${siteConfig.url}/case-studies`,
    }),
};

// JSON-LD structured data generators
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vitalii Serbyn',
    jobTitle: 'AI Engineer & MLOps Specialist',
    description: siteConfig.description,
    url: siteConfig.url,
    image: siteConfig.ogImage,
    sameAs: [
      'https://linkedin.com/in/vitalii-serbyn',
      'https://github.com/vitamin33',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Serbyn Solutions Ltd',
      url: siteConfig.url,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UA',
      addressLocality: 'Kyiv',
      addressRegion: 'Kyiv',
    },
    knowsAbout: [
      'Machine Learning',
      'Large Language Models',
      'MLOps',
      'AI Infrastructure',
      'Model Deployment',
      'Cost Optimization',
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Serbyn Solutions Ltd',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description:
      'AI/ML engineering consulting specializing in LLM systems and MLOps.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '71-75 Shelton Street',
      addressLocality: 'London',
      postalCode: 'WC2H 9JQ',
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
