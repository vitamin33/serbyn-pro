import { getAllCaseStudies } from '@/lib/case-studies';
import { pageMetadata } from '@/lib/seo';
import { Eyebrow } from '@/components/ds';
import { WorkGrid } from '@/components/site/work-grid';

export const metadata = pageMetadata.work();

export default function WorkPage() {
  // Strip MDX body before handing to the client grid (cards don't need it).
  const caseStudies = getAllCaseStudies().map(s => ({ ...s, content: '' }));

  return (
    <div style={{ padding: '80px 0 120px' }}>
      <div className="ds-wrap">
        <div className="ds-stack" style={{ gap: 20, maxWidth: 860 }}>
          <Eyebrow>Index / work</Eyebrow>
          <h1 className="ds-h1" data-size="index">
            High-performance AI systems &amp; infrastructure
          </h1>
          <p className="ds-lede" style={{ color: 'var(--muted)' }}>
            Real projects with authentic metrics — from autonomous agent
            orchestration to multi-project enterprise delivery.
          </p>
        </div>
        <div style={{ marginTop: 56 }}>
          <WorkGrid studies={caseStudies} />
        </div>
      </div>
    </div>
  );
}
