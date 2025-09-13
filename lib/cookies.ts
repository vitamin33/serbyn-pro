import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export function getVisitorId(): string {
  const jar = cookies();
  const prev = jar.get('vid')?.value;
  if (prev) return prev;

  // Generate ID but let middleware handle cookie setting
  const vid = randomUUID();

  try {
    jar.set('vid', vid, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
  } catch (error) {
    // Middleware will handle this
    console.warn('Visitor ID cookie will be set by middleware');
  }

  return vid;
}

// Read-only version for server components
export function getVisitorIdReadOnly(): string {
  const jar = cookies();
  return jar.get('vid')?.value ?? randomUUID();
}

export function getOrSetIcp(pref?: string): string {
  const jar = cookies();
  const q = pref ?? jar.get('icp')?.value ?? 'default';

  // Only set cookie if we have a preference and it's different from current
  if (pref && pref !== jar.get('icp')?.value) {
    try {
      jar.set('icp', q, {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 90,
      });
    } catch (error) {
      // In Next.js 14, cookies can only be set in Server Actions or Route Handlers
      // This will be handled by middleware for URL params
      console.warn('Cookie setting deferred to middleware:', error);
    }
  }

  return q;
}

// Read-only version for server components
export function getIcp(): string {
  const jar = cookies();
  return jar.get('icp')?.value ?? 'default';
}
