import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';
import { TRUST_CHIPS } from '@/lib/facts';

// Home OG card.
export const alt =
  'Vitalii Serbyn — I make AI agents reliable enough to run in production';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kind: 'home',
    eyebrow: 'Agentic systems architect',
    title: 'I make AI agents reliable enough to run in production.',
    strip: [...TRUST_CHIPS],
  });
}
