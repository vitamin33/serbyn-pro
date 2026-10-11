import { FieldReportCard, SectionHeader } from '@/components/ds';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import type { MiniExhibitData } from '@/components/ds/exhibit';

// /audit — "Method, demonstrated" (F18). The offer page describes the method;
// these cards link the field reports that show it running on my own systems,
// plus the methodology, so the buyer deciding on the audit page can reach the
// evidence (T12 needs at least two /blog/ links here). Each card's number is
// the post's own exhibit from frontmatter.
const POST_SLUGS = [
  'six-false-greens-in-a-self-auditing-agent-pipeline',
  'the-calibration-ledger-58-runs-93-pass-n-is-small',
];

function figureOf(ex?: MiniExhibitData): string {
  if (!ex) return '';
  if (ex.kind === 'num') return ex.value;
  if (ex.kind === 'ledger') return `${ex.sub} · ${ex.value}`;
  if (ex.kind === 'cost') return ex.value;
  return '';
}

export function MethodDemonstrated() {
  const posts = POST_SLUGS.map(slug => getBlogPostBySlug(slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section className="ds-sec" data-tone="surface" aria-labelledby="h-demo">
      <div className="ds-wrap">
        <SectionHeader
          id="h-demo"
          eyebrow="Method, demonstrated"
          title="The same method, in the open"
          intro="The audit runs the discipline these field reports describe — applied to my own systems first."
        />
        <div
          className="ds-cards ds-mt-40"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {posts.map(post => (
            <FieldReportCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              kind="Field report"
              title={post.title}
              figure={figureOf(post.exhibit)}
              figureTone="claim"
              cta="Read the field report"
            />
          ))}
          <FieldReportCard
            href="/methodology"
            kind="Methodology"
            title="How runs & passes are counted"
            figure="101 · 0.94"
            cta="See the methodology"
          />
        </div>
      </div>
    </section>
  );
}
