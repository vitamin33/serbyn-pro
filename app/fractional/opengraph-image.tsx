import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';
import { OFFERS } from '@/lib/facts';

export const alt = 'Fractional AI Architect — from $4,000/mo';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const offer = OFFERS.find(o => o.id === 'fractional')!;

export default function Image() {
  return ogCard({
    kind: 'offer',
    eyebrow: 'Fractional AI Architect',
    title: 'Keep your agent platform reliable and cheap as it scales.',
    price: offer.price,
    terms: offer.terms,
    strip: ['Read-only by default', 'NDA on request'],
  });
}
