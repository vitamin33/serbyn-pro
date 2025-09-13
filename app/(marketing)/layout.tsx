import { fetchSitePack, fetchOffers } from '@/lib/leadgen-client';
import { getIcp } from '@/lib/cookies';
import { jsonLd } from '@/lib/seo-dynamic';
import type { SitePack, Offer } from '@/lib/types.leadgen';

// Fallback data
const fallbackPack: SitePack = {
  icp: 'default',
  blocks: {
    hero: {
      headline: 'AI engineer who builds reliable LLM platforms',
      sub: 'Reliable LLM systems with MLflow, vLLM, SLO-gated CI',
    },
  },
};

const fallbackOffers: Offer[] = [
  {
    code: 'CONSULTATION',
    name: 'Initial Consultation',
    price_cents: 0,
    currency: 'USD',
    stripe_url: 'https://calendly.com/vitalii-serbyn/consultation',
  },
];

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: { icp?: string };
}

export default async function MarketingLayout({
  children,
  params,
}: MarketingLayoutProps) {
  const icp = getIcp();

  // Fetch data for JSON-LD
  let pack: SitePack = fallbackPack;
  let offers: Offer[] = fallbackOffers;

  try {
    pack = await fetchSitePack(icp, '/');
    offers = await fetchOffers(icp);
  } catch (error) {
    console.warn('Failed to fetch data for JSON-LD, using fallbacks:', error);
  }

  const structuredData = jsonLd(pack, offers);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />
      {children}
    </>
  );
}
