import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';
import { OFFERS } from '@/lib/facts';

export const alt = 'LLM Cost Teardown — from $2,000';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const offer = OFFERS.find(o => o.id === 'llm-cost-teardown')!;

export default function Image() {
  return ogCard({
    kind: 'offer',
    eyebrow: 'LLM Cost Teardown',
    title: 'Cut your LLM bill without lowering output quality.',
    price: offer.price,
    terms: offer.terms,
    strip: ['Read-only by default', 'NDA on request'],
  });
}
