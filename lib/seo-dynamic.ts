import type { Metadata } from 'next';
import type { SitePack, Offer } from './types.leadgen';

export function makeMetadata(
  pack: SitePack,
  offers: Offer[],
  page = 'home'
): Metadata {
  const t =
    pack?.blocks?.hero?.headline ||
    'AI engineer who builds reliable LLM platforms';
  const d =
    pack?.blocks?.hero?.sub ||
    'Reliable LLM systems with MLflow, vLLM, SLO-gated CI';

  return {
    title: `${t} | Serbyn Pro`,
    description: d,
    openGraph: {
      title: t,
      description: d,
      type: 'website',
      locale: 'en_US',
      url: 'https://serbyn.pro/',
      siteName: 'Serbyn Pro',
      images: [
        {
          url: 'https://serbyn.pro/logo.png',
          width: 1200,
          height: 630,
          alt: t,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t,
      description: d,
      images: ['https://serbyn.pro/logo.png'],
      creator: '@VitaliiSerbyn',
      site: '@VitaliiSerbyn',
    },
    alternates: {
      canonical: 'https://serbyn.pro/',
    },
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
      'Production ML',
      'Model Deployment',
      'AI Infrastructure',
    ],
  };
}

export function jsonLd(pack: SitePack, offers: Offer[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vitalii Serbyn',
    jobTitle: 'AI Engineer & MLOps Specialist',
    description:
      pack?.blocks?.hero?.sub ||
      'Reliable LLM systems with MLflow, vLLM, SLO-gated CI',
    url: 'https://serbyn.pro',
    image: 'https://serbyn.pro/logo.png',
    sameAs: [
      'https://www.linkedin.com/in/vitalii-serbyn-b517a083',
      'https://github.com/vitamin33',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Easelect LTD',
      url: 'https://serbyn.pro',
    },
    offers: offers.map(o => ({
      '@type': 'Service',
      name: o.name,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: o.price_cents / 100,
        priceCurrency: o.currency,
      },
    })),
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
