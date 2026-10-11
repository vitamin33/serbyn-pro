import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';
import { OFFERS } from '@/lib/facts';

export const alt = 'AI Agent Production-Readiness Audit — $3,500, fixed scope';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const offer = OFFERS.find(o => o.id === 'audit')!;

export default function Image() {
  return ogCard({
    kind: 'offer',
    eyebrow: 'AI agent production-readiness audit',
    title:
      'Find out where your agents will fail in production — before your users do.',
    price: offer.price,
    terms: offer.terms,
    strip: ['Read-only by default', 'NDA on request'],
  });
}
