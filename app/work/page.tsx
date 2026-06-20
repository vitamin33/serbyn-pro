import { getAllCaseStudies } from '@/lib/case-studies';
import { pageMetadata } from '@/lib/seo';
import { WorkGrid } from '@/components/lab/work-grid';

export const metadata = pageMetadata.work();

export default function WorkPage() {
  // Strip MDX body before handing to the client grid (cards don't need it).
  const caseStudies = getAllCaseStudies().map(s => ({ ...s, content: '' }));

  return (
    <div className="py-16">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="label-caps mb-2 text-muted-foreground">INDEX / WORK</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            High-performance AI systems &amp; infrastructure
          </h1>
          <p className="text-lg text-muted-foreground">
            Real projects with authentic metrics — from autonomous agent
            orchestration to multi-project enterprise delivery.
          </p>
        </div>

        <WorkGrid studies={caseStudies} />
      </div>
    </div>
  );
}
