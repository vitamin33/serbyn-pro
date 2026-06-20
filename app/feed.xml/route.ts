import { getAllBlogPosts } from '@/lib/blog-posts';
import { siteConfig } from '@/lib/seo';

export const dynamic = 'force-static';

const ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
};

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, c => ESCAPES[c] ?? c);
}

export async function GET() {
  const posts = getAllBlogPosts();
  const items = posts
    .map(
      p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteConfig.url}${p.url}</link>
      <guid>${siteConfig.url}${p.url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
