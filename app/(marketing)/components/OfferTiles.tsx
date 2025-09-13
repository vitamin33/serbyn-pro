import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { makeShortlink, trackClientEvent } from '../actions';
import type { SitePack, Offer } from '@/lib/types.leadgen';

interface OfferTilesProps {
  pack: SitePack;
  icp: string;
  offers: Offer[];
}

interface OfferWithShortlink extends Offer {
  shortlink_url?: string;
}

export default async function OfferTiles({
  pack,
  icp,
  offers,
}: OfferTilesProps) {
  const offerTiles = pack.blocks.offer_tiles || [];
  const experiment = pack.experiment?.offers;
  const variant = experiment?.variant || 'default';

  // Pre-mint shortlinks for all offers server-side
  const offersWithShortlinks: OfferWithShortlink[] = await Promise.all(
    offers.map(async offer => {
      try {
        const shortlinkResponse = await makeShortlink({
          target_url: offer.stripe_url,
          utm: {
            source: 'website',
            medium: 'offer_tile',
            campaign: icp,
            content: variant,
            icp: icp,
          },
          slug: `${offer.code.toLowerCase()}-${icp}-${variant}`,
        });

        return {
          ...offer,
          shortlink_url: shortlinkResponse.url,
        };
      } catch (error) {
        console.error(
          `Failed to create shortlink for offer ${offer.code}:`,
          error
        );
        return offer;
      }
    })
  );

  // Filter offers based on pack configuration
  const filteredOffers = offersWithShortlinks.filter(offer =>
    offerTiles.some(tile => tile.offer_code === offer.code)
  );

  if (filteredOffers.length === 0) {
    return null;
  }

  // Helper function to format price
  const formatPrice = (priceCents: number, currency: string) => {
    const price = priceCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Client component for tracking clicks
  const OfferButton = ({
    offer,
    tileConfig,
  }: {
    offer: OfferWithShortlink;
    tileConfig: { offer_code: string; headline?: string; bullets?: string[] };
  }) => {
    const handleClick = async () => {
      try {
        await trackClientEvent({
          event: 'checkout_started',
          icp,
          variant,
          context: {
            route: window.location.pathname,
            offer_code: offer.code,
            slug: `offer_${offer.code.toLowerCase()}_${variant}`,
            user_agent: navigator.userAgent,
          },
        });
      } catch (error) {
        console.error('Failed to track checkout started:', error);
      }

      // Navigate to checkout
      window.open(offer.shortlink_url || offer.stripe_url, '_blank');
    };

    return (
      <Button
        onClick={handleClick}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        size="lg"
      >
        Get Started - {formatPrice(offer.price_cents, offer.currency)}
      </Button>
    );
  };

  return (
    <section id="offers" className="py-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Choose Your Service
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Professional MLOps consulting tailored to your needs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {filteredOffers.map(offer => {
            const tileConfig = offerTiles.find(
              tile => tile.offer_code === offer.code
            );
            if (!tileConfig) return null;

            return (
              <Card
                key={offer.code}
                className="relative hover:shadow-lg transition-shadow"
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {tileConfig.headline || offer.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(offer.price_cents, offer.currency)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {tileConfig.bullets && (
                    <ul className="space-y-3">
                      {tileConfig.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-slate-600 dark:text-slate-400">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <OfferButton offer={offer} tileConfig={tileConfig} />
                </CardContent>

                {/* Popular badge for first offer */}
                {filteredOffers.indexOf(offer) === 0 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Experiment indicator (only in development) */}
        {process.env.NODE_ENV === 'development' && experiment && (
          <div className="mt-8 text-center">
            <div className="inline-block rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Experiment: {variant}{' '}
              {experiment.arms && `(${experiment.arms.join(', ')})`}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
