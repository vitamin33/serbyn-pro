import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

export const alt = 'AI Agent Production-Readiness Audit — $3,500, fixed scope';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: 'AI Agent Production-Readiness Audit',
    title: 'Find out where your agents will fail in production.',
    priceLine: '$3,500 flat · ~2 weeks · fixed scope',
    footerLeft: 'serbyn.io/audit',
  });
}
