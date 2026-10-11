// serbyn.io design system v1, "Claim vs. proof".
// Spec and catalogue: docs/design/design-system.md. Gallery: /lab/design-system.

export * from './primitives';
export * from './exhibit';
export * from './offer';
export * from './writing';
export { BarChart, type BarDatum } from './bars';
export { BookingCta, EmailCta, OutboundCta } from './cta';
export { Masthead, NEWSLETTER } from './newsletter';
export { Reveal, useReveal, useReplay } from './motion';
export { ReadingProgress, Toc } from './reading';
export { SiteHeader, ThemeSwitch, CommandPalette } from './shell';
export { SiteFooter } from './footer';
export {
  ClaimCheck,
  CostExhibit,
  HeadToHead,
  KeyNumber,
  ReplayButton,
  ResultTiles,
  type ResultItem,
  type H2HMetric,
  type LedgerRow,
} from './signature';
export { ThemeScript } from './theme-script';
export { NAV_OFFERS, NAV_SITE, PALETTE_BASE, type PaletteItem } from './nav';
export { wilson, pct, minus } from './stats';
