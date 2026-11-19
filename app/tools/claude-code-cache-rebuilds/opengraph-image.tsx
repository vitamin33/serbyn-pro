import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

export const alt = 'Claude Code cache rebuild cost: check your own logs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kind: 'home',
    eyebrow: 'Tool',
    title: 'How much of your Claude Code spend is cache rebuilds?',
    strip: ['Runs in your browser', 'Nothing uploaded', 'Free'],
  });
}
