import type { ReactNode } from 'react';
import { BookingCta } from './cta';
import { MiniExhibit, type MiniExhibitData } from './exhibit';
import { Reveal } from './motion';
import { Eyebrow, TextLink, Tick } from './primitives';

// Writing index and post furniture. Server components; the post list reveals
// its mini exhibits once through the client <Reveal>.

/* ── Index ──────────────────────────────────────────────────────────────── */

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  category: string;
  exhibit?: MiniExhibitData;
  exhibitLabel?: string;
}

/** One row of the writing wall: date and category, title, the post's number. */
export function PostRow({ post, size }: { post: PostSummary; size?: 'sm' }) {
  return (
    <a className="ds-postrow" data-size={size} href={`/blog/${post.slug}`}>
      <span className="ds-postrow-meta">
        <time dateTime={post.date}>{post.date}</time>
        <span>{post.category}</span>
      </span>
      <span className="ds-postrow-title">{post.title}</span>
      {post.exhibit ? (
        <MiniExhibit data={post.exhibit} ariaLabel={post.exhibitLabel} />
      ) : (
        <span />
      )}
    </a>
  );
}

/** "September 2026 · 5 posts" */
export function MonthHeader({
  month,
  count,
}: {
  month: string;
  count: number;
}) {
  return (
    <div className="ds-monthhead">
      <h2>{month}</h2>
      <Eyebrow>
        {count} {count === 1 ? 'post' : 'posts'}
      </Eyebrow>
    </div>
  );
}

/** Posts grouped by month; mini bars draw once on view. */
export function PostWall({
  groups,
  size,
}: {
  groups: { month?: string; posts: PostSummary[] }[];
  size?: 'sm';
}) {
  return (
    <Reveal threshold={0.15}>
      {groups.map((g, i) => (
        <section key={g.month ?? i} aria-label={g.month}>
          {g.month && <MonthHeader month={g.month} count={g.posts.length} />}
          {g.posts.map(p => (
            <PostRow key={p.slug} post={p} size={size} />
          ))}
        </section>
      ))}
    </Reveal>
  );
}

/* ── Post furniture ─────────────────────────────────────────────────────── */

/**
 * Margin note: in the margin column at >= 1200px (Tufte), an inline note with
 * a left rule below that. Place it right before the paragraph it qualifies.
 */
export function MarginNote({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: 'claim';
}) {
  return (
    <aside className="ds-margin" data-tone={tone}>
      <span className="ds-margin-label">note · </span>
      {children}
    </aside>
  );
}

export function ShortVersion({
  children,
  title = 'The short version',
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <details className="ds-short" open>
      <summary className="ds-eyebrow" data-tone="fg">
        {title}
      </summary>
      <div>{children}</div>
    </details>
  );
}

export function Callout({
  children,
  label = 'Callout',
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="ds-callout">
      <Tick />
      <div>
        <Eyebrow size="sm" tone="accent">
          {label}
        </Eyebrow>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="ds-pullquote">
      <p>{children}</p>
    </blockquote>
  );
}

/** "In this series · False Greens · 6 of 12", a segment per post, prev/next. */
export function SeriesNav({
  name,
  index,
  total,
  prev,
  next,
}: {
  name: string;
  /** 1-based position of this post */
  index: number;
  total: number;
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  return (
    <nav className="ds-series" aria-label="In this series">
      <div className="ds-series-head">
        <Eyebrow>In this series · {name}</Eyebrow>
        <span
          className="ds-mono"
          style={{ fontSize: 12, color: 'var(--muted)' }}
        >
          {index} of {total}
        </span>
      </div>
      <div className="ds-series-bar" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} data-current={i + 1 === index ? '' : undefined} />
        ))}
      </div>
      <div className="ds-series-links">
        {prev ? (
          <TextLink href={prev.href} strong>
            ← {prev.title}
          </TextLink>
        ) : (
          <span />
        )}
        {next && (
          <TextLink href={next.href} strong>
            {next.title} →
          </TextLink>
        )}
      </div>
    </nav>
  );
}

/** Related case studies (meta at the end) or more posts (date first). */
export function RelatedList({
  title,
  items,
  metaAt = 'start',
}: {
  title: string;
  items: { href: string; title: string; meta: string }[];
  metaAt?: 'start' | 'end';
}) {
  return (
    <div>
      <Eyebrow>{title}</Eyebrow>
      <div
        className="ds-related"
        data-meta={metaAt === 'end' ? 'end' : undefined}
      >
        {items.map(it => (
          <a key={it.href} href={it.href}>
            <span>{it.meta}</span>
            <b>{it.title}</b>
          </a>
        ))}
      </div>
    </div>
  );
}

/** End-of-post call to action. */
export function DiscussCta({
  title = 'Want to discuss this further?',
  body,
  location,
  label,
  secondary,
}: {
  title?: string;
  body: ReactNode;
  location: string;
  label?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="ds-card ds-discuss">
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <div>
        <BookingCta location={location} label={label} />
        {secondary && (
          <TextLink href={secondary.href} className="ds-mono">
            <span style={{ fontSize: 12.5 }}>{secondary.label} →</span>
          </TextLink>
        )}
      </div>
    </div>
  );
}
