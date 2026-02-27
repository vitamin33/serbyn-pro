import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllCaseStudies } from '@/lib/case-studies';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata.work();

export default function WorkPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="py-16">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            {'// Work'}
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Systems I&apos;ve built
          </h1>
          <p className="text-lg text-muted-foreground">
            Real projects with authentic metrics. From autonomous agent
            orchestration to multi-project enterprise delivery.
          </p>
        </div>

        <div className="space-y-6">
          {caseStudies.map(study => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}` as any}
              className="group block rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  {study.project_type && (
                    <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
                      {study.project_type === 'primary'
                        ? 'Primary R&D'
                        : study.project_type === 'startup'
                          ? 'Startup'
                          : 'Enterprise'}
                    </span>
                  )}
                  <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
                    {study.title}
                  </h2>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {study.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {study.tech.slice(0, 6).map(t => (
                      <span
                        key={t}
                        className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                  Read case study
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {caseStudies.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              Case studies are being prepared. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
