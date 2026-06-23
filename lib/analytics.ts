export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

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
