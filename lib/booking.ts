// Client-only helper (F8): append any stored utm_* cookies — set by middleware.ts
// on the first visit — to the Calendly booking URL, so campaign attribution
// survives the site→Calendly handoff instead of being dropped at the last click.
const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export function appendUtmParams(baseUrl: string): string {
  if (typeof document === 'undefined') return baseUrl;
  try {
    const url = new URL(baseUrl);
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
      const idx = cookie.indexOf('=');
      if (idx === -1) continue;
      const key = cookie.slice(0, idx);
      const val = cookie.slice(idx + 1);
      if (
        (UTM_PARAMS as readonly string[]).includes(key) &&
        val &&
        !url.searchParams.has(key)
      ) {
        url.searchParams.set(key, decodeURIComponent(val));
      }
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}
