export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Extract Q&A pairs from a post's `## FAQ` section. Each item is a single
 * paragraph of the form `**Question?** Answer.` (the shape the pipeline emits).
 * Returns [] when there's no FAQ section. Used to emit FAQPage structured data
 * (rich results + answer-engine optimization).
 */
export function extractFaqs(content: string): FaqItem[] {
  // Accept FAQ heading variants (kept in sync with ascend scripts/blog_seo.py).
  const m = content.match(
    /(?:^|\n)##\s+(?:FAQ|Frequently Asked Questions|Common Questions)\s*\n([\s\S]*?)(?:\n##\s|\s*$)/i
  );
  if (!m) return [];
  const items: FaqItem[] = [];
  for (const para of m[1].split(/\n\s*\n/)) {
    const qa = para.trim().match(/^\*\*(.+?)\*\*\s*([\s\S]+)$/);
    if (!qa) continue;
    const question = qa[1].trim().replace(/\s+/g, ' ');
    const answer = qa[2].trim().replace(/\s+/g, ' ');
    if (question && answer) items.push({ question, answer });
  }
  return items;
}
