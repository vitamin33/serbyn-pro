import { CONTACT, OFFERS } from '@/lib/facts';

// Navigation model shared by the header, the mobile menu, the footer and the
// command palette. Labels and routes are the site's current ones; "Work" is in
// the header and footer per the 2026-10-10 decision.

const DURATION: Record<string, string> = {
  audit: '2 wks',
  'llm-cost-teardown': '1 wk',
  fractional: 'retainer',
};

const SHORT_NAME: Record<string, string> = {
  audit: 'Production-Readiness Audit',
};

export const NAV_OFFERS = OFFERS.map(o => ({
  href: o.href,
  label: SHORT_NAME[o.id] ?? o.name,
  hint: DURATION[o.id] ?? '',
}));

export const NAV_SITE = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
] as const;

export interface PaletteItem {
  kind: 'Offer' | 'Page' | 'Post' | 'Action';
  label: string;
  hint: string;
  href?: string;
  action?: 'copy-email' | 'toggle-theme';
}

/** Static part of the palette; posts are appended by the caller. */
export const PALETTE_BASE: PaletteItem[] = [
  ...OFFERS.map(o => ({
    kind: 'Offer' as const,
    label: o.name,
    hint: o.href,
    href: o.href,
  })),
  { kind: 'Page', label: 'Work — case studies', hint: '/work', href: '/work' },
  { kind: 'Page', label: 'Writing', hint: '/writing', href: '/writing' },
  { kind: 'Page', label: 'About', hint: '/about', href: '/about' },
  {
    kind: 'Page',
    label: 'How DW runs and passes are counted',
    hint: '/methodology',
    href: '/methodology',
  },
  { kind: 'Page', label: 'Résumé', hint: '/resume', href: '/resume' },
  {
    kind: 'Action',
    label: 'Book a 30-min systems call',
    hint: 'calendly ↗',
    href: CONTACT.booking,
  },
  {
    kind: 'Action',
    label: 'Copy email',
    hint: CONTACT.email,
    action: 'copy-email',
  },
  {
    kind: 'Action',
    label: 'Toggle theme',
    hint: 'light / dark',
    action: 'toggle-theme',
  },
];
