import { createMetadata } from '@/lib/seo';
import { OfferPage } from '@/components/site/offer-page';
import { AUDIT_CONTENT } from '@/lib/offer-content';

export const metadata = createMetadata({
  title: 'AI Agent Production-Readiness Audit',
  description:
    'A flat-fee, two-week audit that measures your AI agents the way production will — trajectory evals, false-green metering, evidence-binding — and hands you a prioritized fix list. $3,500, fixed scope.',
  canonicalUrl: 'https://serbyn.io/audit',
});

export default function AuditPage() {
  return <OfferPage content={AUDIT_CONTENT} />;
}
