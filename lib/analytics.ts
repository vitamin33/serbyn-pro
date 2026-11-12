export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// The browser never calls PostHog directly: it calls this path on our own
// origin and next.config.js rewrites it to POSTHOG_HOST.
export const POSTHOG_PROXY_PATH = '/ingest';

// Events are recorded on the production host only, so local runs, the
// Playwright build and *.vercel.app previews stay out of the data. Set
// NEXT_PUBLIC_POSTHOG_ANY_HOST=1 to test analytics locally.
const PRODUCTION_HOST = 'serbyn.io';
const OPT_OUT_KEY = 'analytics-optout';

/**
 * Should this browser send analytics at all? No on any host but production, no
 * for automated browsers, and no for a browser that opted out. Opening any page
 * with ?analytics=off opts this browser out (the owner's own visits), and
 * ?analytics=on brings it back.
 */
export function analyticsAllowed(): boolean {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return false;
  if (
    window.location.hostname !== PRODUCTION_HOST &&
    process.env.NEXT_PUBLIC_POSTHOG_ANY_HOST !== '1'
  )
    return false;
  if (navigator.webdriver) return false;
  try {
    const flag = new URLSearchParams(window.location.search).get('analytics');
    if (flag === 'off') localStorage.setItem(OPT_OUT_KEY, '1');
    if (flag === 'on') localStorage.removeItem(OPT_OUT_KEY);
    if (localStorage.getItem(OPT_OUT_KEY) === '1') return false;
  } catch {
    /* storage blocked: treat as not opted out */
  }
  return true;
}

type Capture = (event: string, props?: Record<string, unknown>) => void;

// Registered by the PostHogProvider once posthog-js has lazily loaded. Keeping the
// posthog import OUT of this module means it never lands in the First Load bundle.
let _capture: Capture | null = null;

export function _registerCapture(fn: Capture): void {
  _capture = fn;
}

/**
 * Fire a custom analytics event. No-ops cleanly when PostHog isn't configured
 * (no NEXT_PUBLIC_POSTHOG_KEY) or hasn't loaded yet, so callers never need to guard.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  try {
    _capture?.(event, props);
  } catch {
    /* analytics must never break the page */
  }
}
