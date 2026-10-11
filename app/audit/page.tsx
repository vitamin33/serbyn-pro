import { createMetadata } from '@/lib/seo';
import { OfferPage } from '@/components/site/offer-page';
import { AUDIT_CONTENT } from '@/lib/offer-content';
import { SampleReportCTA } from '@/components/site/sample-report-cta';
import { MethodDemonstrated } from '@/components/site/method-demonstrated';
import { SAMPLE_REPORT_HREF, sampleAuditReportExists } from '@/lib/assets';

export const metadata = createMetadata({
  title: 'AI Agent Production-Readiness Audit',
  description:
    '$3,500 flat, ~2 weeks: an AI agent production-readiness audit that measures your agents the way production will — trajectory evals, false-green metering, evidence-binding — and hands you a prioritized fix list.',
  canonicalUrl: 'https://serbyn.io/audit',
});

export default function AuditPage() {
  return (
    <>
      <OfferPage
        content={AUDIT_CONTENT}
        after={
          <>
            <MethodDemonstrated />
            {sampleAuditReportExists() && (
              <SampleReportCTA href={SAMPLE_REPORT_HREF} />
            )}
          </>
        }
      />
    </>
  );
}
