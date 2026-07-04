import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/blog-posts';

// Home §10 — WRITING. Latest posts pulled programmatically from the existing
// blog system (unchanged, R5). Links to individual posts (/blog/[slug]) and the
// /writing index.
export function WritingTeaser() {
  const posts = getAllBlogPosts().slice(0, 4);
  if (posts.length === 0) return null;

  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="label-caps mb-2 text-muted-foreground">07_writing</p>
            <h2 className="headline-lg">Notes on agent reliability</h2>
          </div>
          <Link
            href={'/writing' as any}
            className="group label-caps flex shrink-0 items-center gap-1.5 pb-1 text-muted-foreground transition-colors hover:text-primary"
          >
            all_writing
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}` as any}
              className="group flex flex-col bg-card p-6 transition-colors hover:bg-secondary/40"
            >
              <div className="mb-2 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
                <span>{post.readingTime} min</span>
              </div>
              <h3 className="headline-sm mb-2 transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="body-md line-clamp-2 text-muted-foreground">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
