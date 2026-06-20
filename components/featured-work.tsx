import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedCaseStudies } from '@/lib/case-studies';

const TYPE_LABELS: Record<string, string> = {
  primary: 'Primary R&D',
  startup: 'Startup',
  anonymized: 'Enterprise',
};

export function FeaturedWork() {
  const studies = getFeaturedCaseStudies();
  if (studies.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="mb-12">
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            {'// Selected work'}
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Systems I&apos;ve shipped
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {studies.map(study => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}` as any}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
                {study.project_type
                  ? (TYPE_LABELS[study.project_type] ?? 'Case study')
                  : 'Case study'}
              </span>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                {study.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {study.summary}
              </p>

              {/* Metrics */}
              <ul className="mb-4 space-y-1">
                {(study.highlight_metrics ?? []).slice(0, 3).map(metric => (
                  <li
                    key={metric}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    <span className="mr-2 text-primary">-</span>
                    {metric}
                  </li>
                ))}
              </ul>

              {/* Tech badges */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {study.tech.slice(0, 5).map(t => (
                  <span
                    key={t}
                    className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read case study
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
