import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog-posts';
import { createMetadata, siteConfig } from '@/lib/seo';
import { getAllCaseStudies } from '@/lib/case-studies';
import { ContentEnhancers } from '@/components/blog/content-enhancers';
import { EngagementTracker } from '@/components/blog/engagement-tracker';
import { BookingButton } from '@/components/site/cta';
import { TerminalSignup } from '@/components/lab/terminal-signup';
import { extractFaqs } from '@/lib/blog-faq';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};

  return createMetadata({
    title: post.title,
    description: post.description,
    image: null, // use the dynamic opengraph-image.tsx card
    canonicalUrl: `${siteConfig.url}/blog/${post.slug}`,
    article: { publishedTime: post.date, tags: post.keywords },
  });
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const caseStudies = getAllCaseStudies()
    .filter(s => s.portfolio_ready)
    .slice(0, 3);

  const otherPosts = getAllBlogPosts()
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@id': 'https://serbyn.io/#person' },
    publisher: { '@id': 'https://serbyn.io/#organization' },
    url: `${siteConfig.url}/blog/${post.slug}`,
    keywords: post.keywords?.join(', '),
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readingTime}M`,
  };

  // FAQPage structured data from the post's `## FAQ` section (rich results + AEO)
  const faqs = extractFaqs(post.content);
  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  return (
    <div className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <EngagementTracker slug={post.slug} />
      <div className="post container max-w-wide">
        <Link
          href={'/blog' as any}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All posts
        </Link>

        <header className="post-header">
          <div className="a-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
            <span aria-hidden="true">·</span>
            <span>{post.category}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="a-lede">{post.description}</p>
          {post.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.keywords.map(kw => (
                <span key={kw} className="a-tag">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="blog-content post-body">
          <div
            className="post-flow"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />
          <ContentEnhancers />
        </article>

        {/* Related case studies */}
        {caseStudies.length > 0 && (
          <section className="post-aside">
            <p className="a-eyebrow">Related case studies</p>
            <div className="a-cards">
              {caseStudies.map(study => (
                <Link
                  key={study.slug}
                  href={`/work/${study.slug}` as any}
                  className="a-card transition-colors hover:border-primary"
                >
                  <h3>{study.title}</h3>
                  <p className="text-muted-foreground">
                    {study.summary.slice(0, 80)}...
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other posts */}
        {otherPosts.length > 0 && (
          <section className="post-aside">
            <p className="a-eyebrow">More posts</p>
            <ul className="grid border-t border-border">
              {otherPosts.map(p => (
                <li key={p.slug} className="border-b border-border">
                  <Link
                    href={`/blog/${p.slug}` as any}
                    className="group grid gap-1 py-4"
                  >
                    <span className="font-display text-[1.1rem] font-semibold group-hover:text-primary">
                      {p.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {p.description.slice(0, 100)}...
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="a-callout max-w-measure">
          <h2 className="text-[1.25rem]">Want to discuss this further?</h2>
          <p className="text-[0.95rem]">
            I help teams build autonomous agent systems and production AI
            infrastructure.
          </p>
          <div className="pt-2">
            <BookingButton
              location={`blog_${post.slug}`}
              label="Book Architecture Review"
            />
          </div>
        </section>

        <TerminalSignup
          blurb="Field notes on agent reliability and LLM cost — new posts, no fluff."
          className="max-w-measure"
        />
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineFormat(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(
      // absolute (http/https) OR site-relative (/...) links. Internal links
      // navigate within the site; external links open in a new tab.
      /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)/g,
      (_m, label: string, href: string) =>
        href.startsWith('/')
          ? `<a href="${href}">${label}</a>`
          : `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
}

function renderCodeFence(lang: string, code: string): string {
  // ```mermaid -> a diagram block the client enhancer renders to SVG (the source
  // is HTML-escaped, which textContent decodes back to raw mermaid syntax).
  if (lang === 'mermaid') {
    return `<pre class="mermaid">${code}</pre>`;
  }
  // a language-* class lets the client highlighter (highlight.js) colorize it.
  const cls = /^[a-z0-9+#-]+$/.test(lang) ? ` class="language-${lang}"` : '';
  return `<pre><code${cls}>${code}</code></pre>`;
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');

  // Strip a leading H1 — the page already renders the post title as its <h1>,
  // so a title-repeating '# …' at the top of the body would duplicate it (F29).
  const firstContentIdx = lines.findIndex(l => l.trim() !== '');
  if (firstContentIdx !== -1 && /^#\s+/.test(lines[firstContentIdx].trim())) {
    lines.splice(firstContentIdx, 1);
  }

  const html: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let inUnorderedList = false;
  let inOrderedList = false;

  function closeLists() {
    if (inUnorderedList) {
      html.push('</ul>');
      inUnorderedList = false;
    }
    if (inOrderedList) {
      html.push('</ol>');
      inOrderedList = false;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        closeLists();
        inCodeBlock = true;
        codeBuffer = [];
        codeLang = trimmed.slice(3).trim().toLowerCase();
      } else {
        html.push(renderCodeFence(codeLang, codeBuffer.join('\n')));
        inCodeBlock = false;
        codeLang = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(escapeHtml(line));
      continue;
    }

    if (!trimmed) {
      closeLists();
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      closeLists();
      html.push('<hr>');
      continue;
    }

    if (trimmed.startsWith('> ')) {
      closeLists();
      html.push(
        `<blockquote><p>${inlineFormat(trimmed.slice(2))}</p></blockquote>`
      );
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      closeLists();
      html.push(`<h4>${inlineFormat(trimmed.slice(5))}</h4>`);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      closeLists();
      html.push(`<h3>${inlineFormat(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeLists();
      html.push(`<h2>${inlineFormat(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      closeLists();
      html.push(`<h1>${inlineFormat(trimmed.slice(2))}</h1>`);
      continue;
    }

    // standalone image: ![alt](src "optional caption") -> figure (relative or http)
    const imageMatch = trimmed.match(
      /^!\[([^\]]*)\]\((\/[^)\s]+|https?:\/\/[^)\s]+)(?:\s+"([^"]*)")?\)$/
    );
    if (imageMatch) {
      closeLists();
      const [, alt, src, caption] = imageMatch;
      const cap = caption || alt;
      html.push(
        `<figure class="blog-figure"><img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />` +
          (cap ? `<figcaption>${inlineFormat(cap)}</figcaption>` : '') +
          `</figure>`
      );
      continue;
    }

    if (trimmed.startsWith('- ')) {
      if (inOrderedList) {
        html.push('</ol>');
        inOrderedList = false;
      }
      if (!inUnorderedList) {
        html.push('<ul>');
        inUnorderedList = true;
      }
      html.push(`<li>${inlineFormat(trimmed.slice(2))}</li>`);
      continue;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (inUnorderedList) {
        html.push('</ul>');
        inUnorderedList = false;
      }
      if (!inOrderedList) {
        html.push('<ol>');
        inOrderedList = true;
      }
      html.push(`<li>${inlineFormat(olMatch[2])}</li>`);
      continue;
    }

    closeLists();
    html.push(`<p>${inlineFormat(trimmed)}</p>`);
  }

  closeLists();
  if (inCodeBlock) {
    html.push(renderCodeFence(codeLang, codeBuffer.join('\n')));
  }

  return html.join('\n');
}
