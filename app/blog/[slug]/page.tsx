import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import {
  draftsVisible,
  getAllBlogPosts,
  getBlogPostBySlug,
  getDraftSlugs,
  isoDate,
} from '@/lib/blog-posts';
import { createMetadata, siteConfig } from '@/lib/seo';
import { getAllCaseStudies } from '@/lib/case-studies';
import { ContentEnhancers } from '@/components/blog/content-enhancers';
import { EngagementTracker } from '@/components/blog/engagement-tracker';
import { extractFaqs } from '@/lib/blog-faq';
import { slugify } from '@/lib/toc';
import {
  Chip,
  DiscussCta,
  Eyebrow,
  KeyNumber,
  Masthead,
  RelatedList,
  Toc,
} from '@/components/ds';
import { renderMdx } from '@/lib/mdx';

interface PageProps {
  params: { slug: string };
}

// Only the listed slugs exist. Drafts are added on the dev server alone, so a
// production build has no route for them (404, not just unlisted).
export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getAllBlogPosts().map(post => post.slug);
  if (draftsVisible()) slugs.push(...getDraftSlugs());
  return slugs.map(slug => ({ slug }));
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
    ...(post.draft ? { noIndex: true } : {}),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
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

  const date = isoDate(post.date);
  const kn = post.keyNumber;

  return (
    <div className="ds-post">
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

      <div className="ds-wrap">
        <a className="ds-link ds-mono" data-tone="muted" href="/writing">
          <span style={{ fontSize: 13 }}>← All posts</span>
        </a>

        {post.draft && (
          <p className="a-draft" role="status" style={{ marginTop: 24 }}>
            <strong>Draft preview</strong>
            Not listed and not routable in production. Visible on the dev server
            only.
          </p>
        )}

        <header className="ds-post-header">
          <Eyebrow>
            <time dateTime={date}>{date}</time> · {post.readingTime} min read ·{' '}
            {post.category}
          </Eyebrow>
          <h1 className="ds-h1" data-size="post">
            {post.title}
          </h1>
          <p className="ds-lede" style={{ color: 'var(--muted)' }}>
            {post.description}
          </p>
          {post.keywords && post.keywords.length > 0 && (
            <div className="ds-post-tags">
              {post.keywords.map(kw => (
                <Chip key={kw} size="sm">
                  {kw}
                </Chip>
              ))}
            </div>
          )}
        </header>

        {kn && (
          <KeyNumber
            value={kn.value}
            unit={kn.unit}
            caption={kn.caption}
            direction={kn.direction}
            bars={kn.bars.map(b => ({
              label: b.label,
              k: b.k,
              n: b.n,
              series: b.series,
              display: `${b.k} / ${b.n}`,
              tone: b.series === 'accent' ? 'accent' : undefined,
            }))}
            axis={
              kn.bars.every(b => b.n === 40)
                ? ['0', '10', '20', '30', '40']
                : undefined
            }
            note={kn.note}
          />
        )}
      </div>

      <div className="ds-wrap" style={{ paddingTop: 64 }}>
        <div className="ds-read">
          <Toc jumpTo={kn ? 'key-number' : undefined} />
          <article className="blog-content post-body">
            {post.mdx ? (
              <div className="post-flow">{await renderMdx(post.content)}</div>
            ) : (
              <div
                className="post-flow"
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(post.content),
                }}
              />
            )}
            <ContentEnhancers />
          </article>
          <span aria-hidden="true" />
        </div>
      </div>

      <div className="ds-wrap ds-post-end">
        <div className="ds-cards" style={{ gap: 48 }}>
          {caseStudies.length > 0 && (
            <RelatedList
              title="Related case studies"
              metaAt="end"
              items={caseStudies.map(study => ({
                href: `/work/${study.slug}`,
                title: study.title,
                meta: PROJECT_TYPE[study.project_type ?? ''] ?? '',
              }))}
            />
          )}
          {otherPosts.length > 0 && (
            <RelatedList
              title="More posts"
              items={otherPosts.map(p => ({
                href: `/blog/${p.slug}`,
                title: p.title,
                meta: isoDate(p.date),
              }))}
            />
          )}
        </div>

        <DiscussCta
          body="I help teams build autonomous agent systems and production AI infrastructure."
          location={`blog_${post.slug}`}
          label="Book Architecture Review"
          secondary={{
            href: '/audit',
            label: 'or see the audit this method comes from',
          }}
        />

        <div style={{ margin: '48px 0 0', paddingBottom: 96 }}>
          <Masthead variant="footer" location={`blog_${post.slug}`} />
        </div>
      </div>
    </div>
  );
}

const PROJECT_TYPE: Record<string, string> = {
  primary: 'R&D',
  startup: 'Startup',
  anonymized: 'Enterprise',
};

// A chart rendered by scripts/render-charts.mjs has a "-dark" twin next to it;
// both are emitted and CSS shows the one that matches the active theme.
function themedImage(src: string, alt: string): string {
  const dark = src.replace(/\.png$/, '-dark.png');
  const hasDark =
    src.startsWith('/') &&
    dark !== src &&
    fs.existsSync(path.join(process.cwd(), 'public', dark));
  if (!hasDark) return `<img src="${src}" alt="${alt}" loading="lazy" />`;
  return (
    `<img class="ds-img-light" src="${src}" alt="${alt}" loading="lazy" />` +
    `<img class="ds-img-dark" src="${dark}" alt="${alt}" loading="lazy" />`
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

  // Strip the title H1 — the page already renders the post title as its <h1>,
  // so a title-repeating '# …' near the top of the body would duplicate it
  // (F29). Some posts open with a series note before it, so look at the first
  // few content lines, not only the first.
  const contentIdx = lines
    .map((l, i) => (l.trim() ? i : -1))
    .filter(i => i >= 0)
    .slice(0, 4);
  const h1Idx = contentIdx.find(i => /^#\s+/.test(lines[i].trim()));
  if (h1Idx !== undefined) lines.splice(h1Idx, 1);

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
      const t3 = trimmed.slice(4);
      html.push(
        `<h3 id="${slugify(t3.replace(/[*`]/g, ''))}">${inlineFormat(t3)}</h3>`
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeLists();
      const t2 = trimmed.slice(3);
      html.push(
        `<h2 id="${slugify(t2.replace(/[*`]/g, ''))}">${inlineFormat(t2)}</h2>`
      );
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
        `<figure class="blog-figure">${themedImage(src, escapeHtml(alt))}` +
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
