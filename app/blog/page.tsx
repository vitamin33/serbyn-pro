import Link from 'next/link';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { getAllBlogPosts } from '@/lib/blog-posts';
import { TerminalSignup } from '@/components/lab/terminal-signup';

export const metadata = pageMetadata.blog();

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Vitalii Serbyn — Technical Blog',
    description:
      'Writing about agent orchestration, trust layers, cost engineering, and lessons from building production AI systems.',
    url: `${siteConfig.url}/blog`,
    author: {
      '@type': 'Person',
      name: 'Vitalii Serbyn',
      url: siteConfig.url,
    },
  };

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container max-w-2xl">
        <p className="label-caps mb-2 text-muted-foreground">INDEX / BLOG</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Technical perspectives on AI systems
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Writing about agent orchestration, trust layers, cost engineering, and
          lessons from building production AI systems.
        </p>

        <TerminalSignup className="mb-12" />

        {posts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="mb-2 font-mono text-sm text-muted-foreground">
              {'// Coming soon'}
            </p>
            <p className="text-muted-foreground">
              First article:{' '}
              <em>
                &quot;Trust Levels in Agent Orchestration: Why L0-L4
                Matters&quot;
              </em>
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}` as any}>
                  <div className="rounded-lg border border-border p-6 transition-colors hover:border-primary/40 hover:bg-card/50">
                    <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="font-mono text-xs">
                        {post.readingTime} min read
                      </span>
                      <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold tracking-tight group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground">{post.description}</p>
                    {post.keywords && post.keywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.keywords.slice(0, 4).map(kw => (
                          <span
                            key={kw}
                            className="rounded bg-secondary/50 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
