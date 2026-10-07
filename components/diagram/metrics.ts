// Text metrics for server-side layout. There is no DOM on the server, so box
// sizes come from IBM Plex advance widths. Mono is exact (every glyph is
// 0.6 em); Plex Sans uses a small per-class table that errs a little wide.

export type TextStyle =
  | 't'
  | 't-s'
  | 't-m'
  | 't-mm'
  | 't-acc'
  | 't-h'
  | 'badge';

const STYLE: Record<
  TextStyle,
  {
    size: number;
    mono: boolean;
    track?: number;
    caps?: boolean;
    weight?: number;
  }
> = {
  t: { size: 13, mono: false, weight: 500 },
  't-s': { size: 11.5, mono: false },
  't-m': { size: 11, mono: true },
  't-mm': { size: 11, mono: true },
  't-acc': { size: 12, mono: true },
  't-h': { size: 10.5, mono: true, track: 0.06, caps: true },
  badge: { size: 14, mono: false, weight: 600 },
};

function sansEm(ch: string): number {
  if (ch === ' ') return 0.25;
  if ('iIl|!.,:;\'"`'.includes(ch)) return 0.27;
  if ('fjtr()[]{}/\\-'.includes(ch)) return 0.36;
  if ('mwMW@%'.includes(ch)) return 0.86;
  if (/[0-9]/.test(ch)) return 0.57;
  if (/[A-Z]/.test(ch)) return 0.66;
  if (/[a-z]/.test(ch)) return 0.54;
  return 0.6;
}

/** Estimated rendered width in SVG user units. */
export function textWidth(text: string, style: TextStyle = 't'): number {
  const s = STYLE[style];
  const str = s.caps ? text.toUpperCase() : text;
  const chars = Array.from(str);
  const em = s.mono
    ? chars.length * 0.6
    : chars.reduce((sum, ch) => sum + sansEm(ch), 0) *
      (s.weight && s.weight >= 500 ? 1.03 : 1);
  return em * s.size + (s.track ?? 0) * s.size * chars.length;
}

export const asLines = (v?: string | string[]): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

/** Box size that fits a title and up to N sub lines, reference proportions. */
export function fitBox(
  title: string | undefined,
  sub: string | string[] | undefined,
  opts: { minW?: number; padX?: number; mono?: boolean } = {}
): { w: number; h: number } {
  const padX = opts.padX ?? 18;
  const subs = asLines(sub);
  const widths = [
    title ? textWidth(title, opts.mono ? 't-m' : 't') : 0,
    ...subs.map(s => textWidth(s, 't-s')),
  ];
  const w = Math.ceil(
    Math.max(opts.minW ?? 0, ...widths.map(x => x + padX * 2))
  );
  const h = title ? 40 + 16 * subs.length : 24 + 16 * subs.length;
  return { w, h };
}
