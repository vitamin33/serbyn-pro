import { headers } from 'next/headers';

export function readUTM(h = headers()) {
  const referer = h.get('referer') || '';
  if (!referer) return {};

  try {
    const url = new URL(referer);
    const entries = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ]
      .map(k => [k, url.searchParams.get(k) || undefined])
      .filter(([_, v]) => v !== undefined);
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}
