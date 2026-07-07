import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

// Home OG card.
export const alt =
  'Vitalii Serbyn — I make AI agents reliable enough to run in production';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: 'Agentic Systems Architect',
    title: 'I make AI agents reliable enough to run in production.',
    priceLine: 'Fixed-scope audits from $3,500',
  });
}
