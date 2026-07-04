import Link from 'next/link';
import { createMetadata, siteConfig } from '@/lib/seo';
import { getAllBlogPosts } from '@/lib/blog-posts';

// /writing — vendor-framed index over the SAME posts as /blog (the blog system
// and its routes/RSS/SEO are untouched, R5). SITE STRUCTURE lists /writing as a
// first-class page.
export const metadata = createMetadata({
  title: 'Writing',
  description:
    'Field notes on agent reliability and LLM cost engineering — false greens, evidence-binding, trajectory evals, and multi-model routing.',
  canonicalUrl: `${siteConfig.url}/writing`,
});

export default function WritingPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <p className="label-caps mb-2 text-muted-foreground">index / writing</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Writing on agent reliability and LLM cost
        </h1>
        <p className="mb-12 text-lg text-muted-foreground">
          How I think about making agents trustworthy and affordable in
          production — the same methods behind the audits and teardowns.
        </p>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">First articles coming soon.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <article key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}` as any}
                  className="block rounded-lg border border-border p-6 transition-colors hover:border-primary/40 hover:bg-card/50"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span>{post.readingTime} min read</span>
                    <span className="rounded bg-secondary px-2 py-0.5">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="mb-2 text-xl font-semibold tracking-tight group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground">{post.description}</p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
