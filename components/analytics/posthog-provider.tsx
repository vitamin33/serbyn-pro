'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { POSTHOG_HOST, POSTHOG_KEY, _registerCapture } from '@/lib/analytics';

let loading = false;
let ready = false;

// Lazily import posthog-js ONLY when a key is set, so it never weighs down the
// First Load bundle. Registers the capture fn so track() can route events.
async function ensureInit(): Promise<void> {
  if (ready || loading || !POSTHOG_KEY || typeof window === 'undefined') return;
  loading = true;
  const { default: posthog } = await import('posthog-js');
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // captured manually below for SPA route changes
    capture_pageleave: true,
    autocapture: true,
    person_profiles: 'identified_only',
  });
  _registerCapture((event, props) => posthog.capture(event, props));
  ready = true;
}

function PageviewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    void ensureInit().then(() => {
      void import('posthog-js').then(({ default: posthog }) =>
        posthog.capture('$pageview', { $current_url: window.location.href })
      );
    });
  }, [pathname, search]);
  return null;
}

/**
 * Initializes PostHog (only if NEXT_PUBLIC_POSTHOG_KEY is set) and tracks SPA
 * pageviews. Renders nothing; without a key it's an inert no-op and posthog-js is
 * never even downloaded, so the site is identical before PostHog is configured.
 */
export function PostHogProvider() {
  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
