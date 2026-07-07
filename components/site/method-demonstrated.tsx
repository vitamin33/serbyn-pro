import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/blog-posts';

// /audit — "Method, demonstrated" (F18). The offer page describes the method;
// this strip links the field reports that show it running on my own systems,
// plus the methodology, so the buyer deciding on the $3,500 page can reach the
// evidence (and an LLM summarizing /audit can cite it).
const POST_SLUGS = [
  'six-false-greens-in-a-self-auditing-agent-pipeline',
  'the-calibration-ledger-58-runs-93-pass-n-is-small',
];

export function MethodDemonstrated() {
  const posts = POST_SLUGS.map(slug => getBlogPostBySlug(slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-8">
          <p className="label-caps mb-2 text-muted-foreground">
            method, demonstrated
          </p>
          <h2 className="headline-lg">The same method, in the open</h2>
          <p className="mt-3 max-w-2xl body-md text-muted-foreground">
            The audit runs the discipline these field reports describe — applied
            to my own systems first.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}` as never}
              className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <h3 className="headline-sm mb-3 flex-1">{post.title}</h3>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-primary group-hover:underline">
                Read the field report
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}

          <Link
            href="/methodology"
            className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <h3 className="headline-sm mb-3 flex-1">
              How runs &amp; passes are counted
            </h3>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-primary group-hover:underline">
              See the methodology
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
