import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

export const alt = 'Fractional AI Architect — from $4,000/mo';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: 'Fractional AI Architect',
    title: 'Keep your agent platform reliable and cheap as it scales.',
    priceLine: 'from $4,000/mo · ~1 day/week',
    footerLeft: 'serbyn.io/fractional',
  });
}
