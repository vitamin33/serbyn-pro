import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'node:crypto';

// F8b — booking-completion tracking. Booking is an external Calendly link (no
// embed), so completion is invisible to client analytics. This receiver turns
// Calendly's `invitee.created` webhook into a server-side PostHog
// `booking_completed` event, closing the funnel past cta_click.
//
// [VS-TODO:calendly-webhook] To activate: in Calendly (Pro+), create a webhook
// subscription for `invitee.created` pointing at https://serbyn.io/api/calendly-webhook,
// then set CALENDLY_WEBHOOK_SIGNING_KEY (from Calendly) and NEXT_PUBLIC_POSTHOG_KEY
// in Vercel. Until configured this route is inert (no key → no capture).

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

// Calendly signs with header "t=<timestamp>,v1=<hex-hmac-sha256>" over
// `<timestamp>.<rawBody>`. If no signing key is configured we cannot verify, so
// we fail closed (reject) rather than trust an unauthenticated caller.
function verifySignature(rawBody: string, header: string | null): boolean {
  if (!SIGNING_KEY || !header) return false;
  const parts: Record<string, string> = {};
  for (const kv of header.split(',')) {
    const eq = kv.indexOf('=');
    if (eq > -1) parts[kv.slice(0, eq).trim()] = kv.slice(eq + 1).trim();
  }
  const { t, v1 } = parts;
  if (!t || !v1) return false;
  const expected = crypto
    .createHmac('sha256', SIGNING_KEY)
    .update(`${t}.${rawBody}`)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

async function captureBookingCompleted(payload: {
  payload?: {
    email?: string;
    scheduled_event?: { name?: string; start_time?: string };
  };
}): Promise<void> {
  if (!POSTHOG_KEY) return;
  const email = payload?.payload?.email;
  await fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: 'booking_completed',
      distinct_id: email || 'calendly-invitee',
      properties: {
        source: 'calendly_webhook',
        event_name: payload?.payload?.scheduled_event?.name,
        start_time: payload?.payload?.scheduled_event?.start_time,
      },
    }),
  }).catch(() => {
    /* analytics must never break the webhook ack */
  });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifySignature(rawBody, request.headers.get('calendly-webhook-signature'))) {
    return NextResponse.json(
      { ok: false, error: 'invalid or unconfigured signature' },
      { status: 401 }
    );
  }

  let payload: { event?: string } & Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  if (payload?.event === 'invitee.created') {
    await captureBookingCompleted(payload as never);
  }

  return NextResponse.json({ ok: true });
}
