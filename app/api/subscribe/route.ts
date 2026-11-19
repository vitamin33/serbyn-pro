import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Newsletter signup. The newsletter itself is sent from beehiiv, so when
// BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID are set the address goes straight
// there (one list, with beehiiv's own welcome email). Without them it falls
// back to Resend Audiences, and without those either it runs in stub mode. Stub mode FAILS CLOSED
// (ok:false) and logs — a silent ok:true would drop every real signup on a
// misconfigured production deploy. [VS-TODO:resend-keys] verify in Vercel env.
// See docs/redesign/03_PUBLISHING_PIPELINE.md §5.
export async function POST(req: Request) {
  let email = '';
  try {
    const body = (await req.json()) as { email?: string };
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'bad request' },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'invalid email' },
      { status: 422 }
    );
  }

  const beehiivKey = process.env.BEEHIIV_API_KEY;
  const publication = process.env.BEEHIIV_PUBLICATION_ID;
  if (beehiivKey && publication) {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publication}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${beehiivKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'serbyn.io',
          utm_medium: 'form',
          utm_campaign: 'site',
          referring_site: 'https://serbyn.io',
        }),
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: 'provider error' },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) {
    // Fail closed: the caller must not believe the address was captured.
    console.warn(
      '[subscribe] RESEND_API_KEY / RESEND_AUDIENCE_ID not set — dropping signup (stub mode).'
    );
    return NextResponse.json({ ok: false, stub: true }, { status: 503 });
  }

  const res = await fetch(
    `https://api.resend.com/audiences/${audience}/contacts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: 'provider error' },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
