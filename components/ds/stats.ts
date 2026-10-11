// Numbers for exhibits. Intervals are computed from the counts, never typed in,
// so a chart can only show what n supports.

/** Wilson score interval for k successes out of n, as fractions 0..1. */
export function wilson(k: number, n: number, z = 1.96): [number, number] {
  if (n <= 0) return [0, 1];
  const p = k / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return [Math.max(0, center - half), Math.min(1, center + half)];
}

/** 0.553 -> "55.3%" for inline CSS. */
export const pct = (fraction: number) => `${Math.round(fraction * 1000) / 10}%`;

/** A leading hyphen becomes a true minus sign for display ("-58%" -> "−58%"). */
export const minus = (value: string) => value.replace(/^-/, '−');
