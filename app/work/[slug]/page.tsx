import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies';
import { createMetadata } from '@/lib/seo';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map(study => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) return {};

  return createMetadata({
    title: study.title,
    description: study.summary,
    canonicalUrl: `https://serbyn.pro/work/${study.slug}`,
  });
}

export default function CaseStudyPage({ params }: PageProps) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) notFound();

  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        {/* Back link */}
        <Link
          href={'/work' as any}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All work
        </Link>

        {/* Header */}
        <header className="mb-12">
          {study.project_type && (
            <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
              {study.project_type === 'primary'
                ? 'Primary R&D'
                : study.project_type === 'startup'
                  ? 'Startup'
                  : 'Enterprise'}
            </span>
          )}
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {study.title}
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">{study.summary}</p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5">
            {study.tech.map(t => (
              <span
                key={t}
                className="rounded bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Highlight metrics */}
          {study.highlight_metrics && study.highlight_metrics.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {study.highlight_metrics.map(metric => (
                <div
                  key={metric}
                  className="rounded-lg border border-border border-t-2 border-t-primary/60 bg-card p-3"
                >
                  <p className="font-mono text-sm text-foreground">{metric}</p>
                </div>
              ))}
            </div>
          )}
        </header>

        <hr className="my-12 border-border" />

        {/* MDX content */}
        <article className="case-study-content">
          <div
            dangerouslySetInnerHTML={{ __html: markdownToHtml(study.content) }}
          />
        </article>

        {/* Links */}
        {study.links && Object.values(study.links).some(Boolean) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {study.links.repo && (
              <a
                href={study.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
              >
                GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {study.links.demo && (
              <a
                href={study.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
              >
                Demo
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 rounded-lg border border-primary/20 bg-card/50 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Discuss This Architecture
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Want to explore how similar patterns could work for your system?
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
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const html: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
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

    // Fenced code blocks
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        closeLists();
        inCodeBlock = true;
        codeBuffer = [];
      } else {
        html.push(`<pre><code>${codeBuffer.join('\n')}</code></pre>`);
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(escapeHtml(line));
      continue;
    }

    // Empty line
    if (!trimmed) {
      closeLists();
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      closeLists();
      html.push('<hr>');
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      closeLists();
      html.push(
        `<blockquote><p>${inlineFormat(trimmed.slice(2))}</p></blockquote>`
      );
      continue;
    }

    // Headings
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

    // Unordered list
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

    // Ordered list
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

    // Paragraph
    closeLists();
    html.push(`<p>${inlineFormat(trimmed)}</p>`);
  }

  closeLists();
  if (inCodeBlock) {
    html.push(`<pre><code>${codeBuffer.join('\n')}</code></pre>`);
  }

  return html.join('\n');
}
