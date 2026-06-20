// Essay-map table-of-contents extraction for long-form content rendered by the
// custom markdownToHtml pipeline. Shared so heading ids match TOC anchors.

export interface TocItem {
  id: string;
  title: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function cleanInline(text: string): string {
  return text.replace(/\*\*/g, '').replace(/`/g, '').trim();
}

// Extract H2 sections (## …) as ordered TOC entries.
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of markdown.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      const title = cleanInline(trimmed.slice(3));
      if (title) items.push({ id: slugify(title), title });
    }
  }
  return items;
}
