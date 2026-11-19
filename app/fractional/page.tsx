import { createMetadata } from '@/lib/seo';
import { OfferPage } from '@/components/site/offer-page';
import { AdvisoryNote } from '@/components/site/advisory-note';
import { FRACTIONAL_CONTENT } from '@/lib/offer-content';

export const metadata = createMetadata({
  title: 'Fractional AI Architect',
  description:
    'Ongoing architectural ownership of your agent platform: reliability, LLM cost and gated rollouts, about one day a week. From $4,000/mo.',
  canonicalUrl: 'https://serbyn.io/fractional',
});

export default function FractionalPage() {
  return <OfferPage content={FRACTIONAL_CONTENT} extra={<AdvisoryNote />} />;
}
