import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createMetadata, siteConfig } from '@/lib/seo';
import { Stat } from '@/components/site/stat';

// Methodology note backing the DW "101 logged runs · 0.94 pass rate" figure
// (linked from the home DW card). Defines what a run and a pass are so the
// number is legible and honestly labeled. Numbers per APPROVED FACTS; run/pass
// definitions written from the pipeline's own behavior.
export const metadata = createMetadata({
  title: 'DW methodology — how runs and passes are counted',
  description:
    'What counts as a run and a pass for DW, the autonomous spec-driven development pipeline: 101 logged runs at a 0.94 pass rate, measured on my own system.',
  canonicalUrl: `${siteConfig.url}/methodology`,
});

export default function MethodologyPage() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <p className="label-caps mb-2 text-muted-foreground">
          methodology note
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          How DW runs and passes are counted
        </h1>
        <p className="mb-10 text-lg text-muted-foreground">
          DW is an autonomous, spec-driven development pipeline I designed and
          built. A short definition of the numbers so they mean something.
        </p>

        <div className="mb-10 rounded-lg border border-border bg-card p-6">
          <Stat
            claim={{
              value: '101 · 0.94',
              caption: 'logged runs · pass rate',
              label: 'on DW, a system I designed and built',
            }}
          />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="headline-md mb-2">What counts as a run</h2>
            <p className="body-md leading-relaxed text-muted-foreground">
              A <strong className="text-foreground">run</strong> is one
              specification submitted to the pipeline and executed end to end to
              a terminal state — planning, change, and verification — without a
              human taking over mid-way. Each run is logged, which is why the
              count is exact rather than estimated. Aborted or half-completed
              attempts are logged too; they simply don’t count as passes.
            </p>
          </section>

          <section>
            <h2 className="headline-md mb-2">What counts as a pass</h2>
            <p className="body-md leading-relaxed text-muted-foreground">
              A <strong className="text-foreground">pass</strong> is a run whose
              output satisfies the spec’s acceptance checks — it builds, the
              tests and evals it was asked to meet are green, and the result
              matches what the spec described — with{' '}
              <strong className="text-foreground">no human edits</strong> to the
              produced change. A run that needs a person to finish or fix it is
              recorded as a non-pass, even if the final code eventually shipped.
            </p>
          </section>

          <section>
            <h2 className="headline-md mb-2">Why the honesty matters</h2>
            <p className="body-md leading-relaxed text-muted-foreground">
              A pass rate is only worth quoting if a “pass” can’t quietly
              include work a human rescued. Counting human-touched runs as
              non-passes is the same discipline I bring to client agents: a
              green has to be earned and has to point at its evidence, or it
              isn’t a green. This figure is measured on my own system, not a
              client’s.
            </p>
          </section>
        </div>

        <Link
          href={'/writing' as any}
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          More on false greens and evidence-binding
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
