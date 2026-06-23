import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog-posts';
import { createMetadata, siteConfig } from '@/lib/seo';
import { getAllCaseStudies } from '@/lib/case-studies';
import { ContentEnhancers } from '@/components/blog/content-enhancers';
import { EngagementTracker } from '@/components/blog/engagement-tracker';
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
    author: {
      '@type': 'Person',
      name: 'Vitalii Serbyn',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easelect LTD',
      url: siteConfig.url,
    },
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
    <div className="py-16">
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
      <div className="container max-w-3xl">
        <Link
          href={'/blog' as any}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>

        <header className="mb-12">
          <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
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
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">{post.description}</p>
          {post.keywords && post.keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.keywords.map(kw => (
                <span
                  key={kw}
                  className="rounded bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="my-12 border-border" />

        <article className="blog-content case-study-content">
          <div
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />
          <ContentEnhancers />
        </article>

        {/* Related case studies */}
        {caseStudies.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-4 text-xl font-semibold">Related case studies</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {caseStudies.map(study => (
                <Link
                  key={study.slug}
                  href={`/work/${study.slug}` as any}
                  className="rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
                >
                  <p className="mb-1 text-sm font-medium">{study.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {study.summary.slice(0, 80)}...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other posts */}
        {otherPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">More posts</h2>
            <div className="space-y-3">
              {otherPosts.map(p => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}` as any}
                  className="block rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
                >
                  <p className="mb-1 text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.description.slice(0, 100)}...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-lg border border-primary/20 bg-card/50 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Want to discuss this further?
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            I help teams build autonomous agent systems and production AI
            infrastructure.
          </p>
          <a
            href="https://calendly.com/serbyn-vitalii/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book Architecture Review
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
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
