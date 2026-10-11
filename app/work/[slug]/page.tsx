import { notFound } from 'next/navigation';
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies';
import { PROJECT_LABEL } from '@/lib/taxonomy';
import { createMetadata } from '@/lib/seo';
import { slugify } from '@/lib/toc';
import {
  Chip,
  DiscussCta,
  Eyebrow,
  SignoffStrip,
  TextLink,
  Toc,
} from '@/components/ds';

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
    image: null, // use the dynamic opengraph-image.tsx card
    canonicalUrl: `https://serbyn.io/work/${study.slug}`,
  });
}

export default function CaseStudyPage({ params }: PageProps) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) notFound();

  return (
    <div className="ds-post">
      <div className="ds-wrap">
        <a className="ds-link ds-mono" data-tone="muted" href="/work">
          <span style={{ fontSize: 13 }}>← Work</span>
        </a>

        <header className="ds-post-header">
          <div className="ds-post-tags" style={{ alignItems: 'center' }}>
            <Eyebrow>Case study</Eyebrow>
            {study.project_type && (
              <Chip variant="claim" size="sm">
                {PROJECT_LABEL[study.project_type]}
              </Chip>
            )}
          </div>
          <h1 className="ds-h1" data-size="post">
            {study.title}
          </h1>
          <p className="ds-lede" style={{ color: 'var(--muted)' }}>
            {study.summary}
          </p>
          <div className="ds-post-tags">
            {study.tech.map(t => (
              <Chip key={t} size="sm">
                {t}
              </Chip>
            ))}
          </div>
        </header>

        {study.highlight_metrics && study.highlight_metrics.length > 0 && (
          <div style={{ marginTop: 40, maxWidth: 1000 }}>
            <SignoffStrip items={study.highlight_metrics} />
          </div>
        )}
      </div>

      <div className="ds-wrap" style={{ paddingTop: 64 }}>
        <div className="ds-read">
          <Toc />
          <article>
            <div
              className="post-flow"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(study.content),
              }}
            />
            {(study.links?.repo || study.links?.demo) && (
              <div className="ds-actions" style={{ marginTop: 32 }}>
                {study.links.repo && (
                  <TextLink href={study.links.repo} strong external>
                    GitHub ↗
                  </TextLink>
                )}
                {study.links.demo && (
                  <TextLink href={study.links.demo} strong external>
                    Demo ↗
                  </TextLink>
                )}
              </div>
            )}
          </article>
          <span aria-hidden="true" />
        </div>
      </div>

      <div className="ds-wrap ds-post-end" style={{ paddingBottom: 96 }}>
        <DiscussCta
          title="Discuss this architecture"
          body="Want to explore how similar patterns could work for your system?"
          location="work_case_study"
          label="Book Architecture Review"
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
      html.push(
        `<h3 id="${slugify(trimmed.slice(4))}">${inlineFormat(trimmed.slice(4))}</h3>`
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeLists();
      const raw = trimmed.slice(3);
      const id = slugify(raw.replace(/\*\*/g, '').replace(/`/g, '').trim());
      html.push(`<h2 id="${id}">${inlineFormat(raw)}</h2>`);
      continue;
    }
    // the page renders the title as its only <h1>; a '# ' line in the body
    // is demoted so the page keeps one H1
    if (trimmed.startsWith('# ')) {
      closeLists();
      html.push(
        `<h2 id="${slugify(trimmed.slice(2))}">${inlineFormat(trimmed.slice(2))}</h2>`
      );
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
