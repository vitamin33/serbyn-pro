import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

export const alt = 'LLM Cost Teardown — from $2,000';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: 'LLM Cost Teardown',
    title: 'Cut your LLM bill without lowering output quality.',
    priceLine: 'from $2,000 · ~1 week',
    footerLeft: 'serbyn.io/llm-cost-teardown',
  });
}
