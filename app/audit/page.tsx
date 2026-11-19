import { createMetadata } from '@/lib/seo';
import { OfferPage } from '@/components/site/offer-page';
import { AUDIT_CONTENT } from '@/lib/offer-content';
import { SampleReportCTA } from '@/components/site/sample-report-cta';
import { MethodDemonstrated } from '@/components/site/method-demonstrated';
import { SAMPLE_REPORT_HREF, sampleAuditReportExists } from '@/lib/assets';

export const metadata = createMetadata({
  title: 'AI Agent Production-Readiness Audit',
  description:
    '$3,500 flat, about 2 weeks. An AI agent production-readiness audit: trajectory evals, false-green metering, evidence-binding and a prioritized fix list.',
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
