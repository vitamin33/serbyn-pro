// Pull the first fenced code block out of markdown for the article code panel.

export interface CodeBlock {
  lang: string;
  code: string;
}

export function firstCodeBlock(markdown: string): CodeBlock | null {
  const lines = markdown.split('\n');
  let inBlock = false;
  let lang = '';
  const buf: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      if (!inBlock) {
        inBlock = true;
        lang = trimmed.slice(3).trim() || 'text';
        buf.length = 0;
      } else {
        return { lang, code: buf.join('\n') };
      }
      continue;
    }
    if (inBlock) buf.push(line);
  }
  return null;
}
