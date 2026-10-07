import Link from 'next/link';
import { createMetadata, siteConfig } from '@/lib/seo';
import { getAllBlogPosts } from '@/lib/blog-posts';
import { TerminalSignup } from '@/components/lab/terminal-signup';

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
    <div className="py-12 sm:py-16">
      <div className="container grid max-w-wide gap-12">
        <header className="grid max-w-measure gap-4">
          <p className="a-eyebrow">index / writing</p>
          <h1>Writing on agent reliability and LLM cost</h1>
          <p className="a-lede text-muted-foreground">
            How I think about making agents trustworthy and affordable in
            production — the same methods behind the audits and teardowns.
          </p>
        </header>

        <TerminalSignup
          blurb="Field notes on agent reliability and LLM cost — new posts, no fluff."
          className="max-w-measure"
        />

        {posts.length === 0 ? (
          <p className="text-muted-foreground">First articles coming soon.</p>
        ) : (
          <ol className="grid border-t border-border">
            {posts.map(post => (
              <li key={post.slug} className="border-b border-border">
                <article className="group">
                  <Link
                    href={`/blog/${post.slug}` as any}
                    className="grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground sm:flex-col sm:items-start">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span>{post.readingTime} min read</span>
                      <span className="a-tag">{post.category}</span>
                    </div>
                    <div className="grid max-w-measure gap-2">
                      <h2 className="text-[1.4rem] transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>
                      <p className="text-[0.95rem] text-muted-foreground">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
