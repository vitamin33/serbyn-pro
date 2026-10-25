import { siteConfig } from '@/lib/seo';
import { getAllBlogPosts, isoDate } from '@/lib/blog-posts';

// /llms-full.txt: the full text of every published post as plain text, for
// answer engines that prefer one fetch over crawling. Drafts are excluded by
// getAllBlogPosts().
export const dynamic = 'force-static';

/** MDX source to readable plain text: keep headings and paragraphs. */
function toPlainText(mdx: string): string {
  return (
    mdx
      // fenced code: keep the code, drop the fence lines
      .replace(/^```.*$/gm, '')
      // multi-line JSX blocks (<Short>...</Short>, <Pog... caption={...} />)
      .replace(/<[A-Z][A-Za-z0-9]*\s+caption=\{<>([\s\S]*?)<\/>\}\s*\/>/g, '$1')
      .replace(/<[A-Z][A-Za-z0-9]*\b[^>]*?\/>/g, '')
      .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, '$2')
      .replace(/<\/?[A-Z][A-Za-z0-9]*[^>]*>/g, '')
      // JSX fragments and left-over HTML tags
      .replace(/<\/?>/g, '')
      .replace(/^\s*(caption=\{|\}|\/>)\s*$/gm, '')
      .replace(/<\/?[a-z][^>]*>/g, '')
      // images, then links -> label (url)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, `$1 (${siteConfig.url}$2)`)
      .replace(/\[([^\]]+)\]\((https?:[^)]*)\)/g, '$1 ($2)')
      // emphasis markers
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

export function GET() {
  const parts = getAllBlogPosts().map(p => {
    const body = toPlainText(p.content.replace(/^\s*#\s+.*\n/, ''));
    return [
      `# ${p.title}`,
      `URL: ${siteConfig.url}${p.url}`,
      `Published: ${isoDate(p.date)}${p.updated ? ` · Updated: ${isoDate(p.updated)}` : ''}`,
      '',
      body,
    ].join('\n');
  });

  const body = `# Vitalii Serbyn — serbyn.io, full text of all posts

Summary and offers: ${siteConfig.url}/llms.txt

${parts.join('\n\n---\n\n')}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
