import { fetchSitePack, fetchOffers, trackEvent } from '@/lib/leadgen-client';
import { getVisitorIdReadOnly, getIcp } from '@/lib/cookies';
import { readUTM } from '@/lib/icp';
import { makeMetadata } from '@/lib/seo-dynamic';
import type { SitePack, Offer } from '@/lib/types.leadgen';

import HeroDynamic from './components/HeroDynamic';
import OfferTiles from './components/OfferTiles';
import CaseStudyList from './components/CaseStudyList';
import FAQ from './components/FAQ';
import StickyCTA from './components/StickyCTA';

// Fallback data for when API is unavailable
const fallbackPack: SitePack = {
  icp: 'default',
  blocks: {
    hero: {
      headline: 'AI engineer who builds reliable LLM platforms',
      sub: 'I design and run production-ready LLM services with clear SLOs, MLflow registries, and cost controls. 12+ years of production discipline applied to AI platforms.',
      cta_primary: 'Book Consultation',
      cta_secondary: 'See Proof Pack',
    },
    case_studies: [
      {
        slug: 'threads-agent-platform',
        title: 'Threads-Agent Platform',
        kpi: '88/100 impact score',
      },
      {
        slug: 'rag-system-optimization',
        title: 'RAG System Optimization',
        kpi: '45% cost reduction',
      },
      {
        slug: 'vllm-cost-optimization',
        title: 'vLLM Cost Optimization',
        kpi: '3x throughput increase',
      },
    ],
    faq: [
      {
        q: "What's your typical project timeline?",
        a: 'Most projects range from 2-8 weeks depending on complexity. I provide detailed estimates after understanding your specific requirements.',
      },
      {
        q: 'Do you work with enterprise clients?',
        a: 'Yes, I work with companies of all sizes. I have UK LTD setup for contracting and experience with enterprise compliance requirements.',
      },
      {
        q: 'What technologies do you specialize in?',
        a: 'My core focus is LLM systems: vLLM, MLflow, RAG, vector databases, and production MLOps. I also handle the full stack from infrastructure to monitoring.',
      },
    ],
  },
};

const fallbackOffers: Offer[] = [
  {
    code: 'CONSULTATION',
    name: 'Initial Consultation (60min)',
    price_cents: 0,
    currency: 'USD',
    stripe_url: 'https://calendly.com/vitalii-serbyn/consultation',
    icp_tag: 'all',
  },
];

interface PageProps {
  searchParams: { icp?: string };
}

export async function generateMetadata({ searchParams }: PageProps) {
  const icp = searchParams.icp || 'default';

  try {
    const pack = await fetchSitePack(icp, '/');
    const offers = await fetchOffers(icp);
    return makeMetadata(pack, offers);
  } catch (error) {
    console.warn('Failed to fetch pack for metadata:', error);
    return makeMetadata(fallbackPack, fallbackOffers);
  }
}

export default async function MarketingHome({ searchParams }: PageProps) {
  // Use URL params directly, cookies handled by middleware
  const icp = searchParams.icp || getIcp();
  const visitor_id = getVisitorIdReadOnly();

  // Fetch site pack and offers with fallbacks
  let pack: SitePack = fallbackPack;
  let offers: Offer[] = fallbackOffers;

  try {
    pack = await fetchSitePack(icp, '/');
  } catch (error) {
    console.warn('Failed to fetch site pack, using fallback:', error);
    pack = { ...fallbackPack, icp };
  }

  try {
    offers = await fetchOffers(icp);
  } catch (error) {
    console.warn('Failed to fetch offers, using fallback:', error);
    offers = fallbackOffers;
  }

  // Server-side pageview tracking
  try {
    await trackEvent({
      visitor_id,
      icp,
      variant: pack.experiment?.hero?.variant ?? 'default',
      event: 'pageview',
      context: { route: '/', utm: readUTM() },
      ts: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Failed to track pageview:', error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroDynamic pack={pack} icp={icp} offers={offers} />

      <OfferTiles pack={pack} icp={icp} offers={offers} />

      <CaseStudyList pack={pack} icp={icp} />

      <FAQ pack={pack} icp={icp} />

      <StickyCTA icp={icp} offers={offers} />
    </div>
  );
}
