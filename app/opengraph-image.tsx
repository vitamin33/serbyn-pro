import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

// Site-wide default OG card (about, methodology, writing, work, legal). Route
// segments with their own opengraph-image.tsx (home, offers, blog, work detail)
// override this.
export const alt = 'Vitalii Serbyn — Agentic Systems Architect';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: 'Agentic Systems Architect',
    title: 'AI agents, reliable enough to run in production.',
    priceLine: 'Agent reliability · LLM cost engineering',
  });
}
