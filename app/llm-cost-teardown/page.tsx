import { createMetadata } from '@/lib/seo';
import { OfferPage } from '@/components/site/offer-page';
import { CostCase } from '@/components/site/cost-case';
import { TEARDOWN_CONTENT } from '@/lib/offer-content';

export const metadata = createMetadata({
  title: 'LLM Cost Teardown',
  description:
    'A one-week teardown of where your LLM spend goes and the six levers that bring it down — model routing, semantic caching, prompt compression, batch pricing, provider arbitrage, and fallback chains — without lowering output quality. From $2,000.',
  canonicalUrl: 'https://serbyn.io/llm-cost-teardown',
});

export default function LlmCostTeardownPage() {
  return <OfferPage content={TEARDOWN_CONTENT} extra={<CostCase />} />;
}
