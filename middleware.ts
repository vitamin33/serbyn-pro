import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

// Newsletter funnel: 302 (not 301 — target will change) to the beehiiv
// subscribe page with per-lane UTM tagging. Inbound query params are
// deliberately not passed through. Lanes: default = LinkedIn Featured link;
// ?src=comment = links dropped in post comments; ?src=site (or a referrer on
// this site) = the site's own footer link, so on-site signups are not counted
// as LinkedIn.
// Link-preview crawlers are exempt: they fall through to app/newsletter/
// page.tsx (200 + OG metadata) because LinkedIn's Featured-link validator
// rejects a bare off-domain 302.
const NEWSLETTER_TARGET = 'https://falsegreen.beehiiv.com/subscribe';
const NEWSLETTER_UTM = {
  featured: 'utm_source=linkedin&utm_medium=featured&utm_campaign=profile',
  comment: 'utm_source=linkedin&utm_medium=comment&utm_campaign=comments',
  site: 'utm_source=serbyn.io&utm_medium=footer&utm_campaign=site',
} as const;
const PREVIEW_BOT_RE =
  /linkedinbot|facebookexternalhit|twitterbot|slackbot|slack-linkexpanding|whatsapp|telegrambot|discordbot|googlebot|bingbot/i;

// Anything that calls itself a bot. These still get the redirect, they just are
// not counted as a newsletter click.
const ANY_BOT_RE =
  /bot|crawl|spider|headless|preview|monitor|curl|wget|python|http-client/i;

// The redirect happens on the server, so the browser never runs analytics for
// it. This records one PostHog event per human click, in production only. No
// IP is stored: the only location kept is the country code Vercel provides.
function newsletterClick(
  request: NextRequest,
  lane: string
): Promise<unknown> | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const ua = request.headers.get('user-agent') ?? '';
  if (
    !key ||
    process.env.VERCEL_ENV !== 'production' ||
    !ua ||
    ANY_BOT_RE.test(ua)
  )
    return null;
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
  const referrer = request.headers.get('referer') ?? '';
  let referringDomain = '$direct';
  try {
    if (referrer) referringDomain = new URL(referrer).hostname;
  } catch {
    /* malformed referer header */
  }
  return fetch(`${host}/i/v0/e/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: key,
      event: 'newsletter_click',
      distinct_id: crypto.randomUUID(),
      properties: {
        lane,
        $host: request.nextUrl.hostname,
        $pathname: '/newsletter',
        $current_url: request.nextUrl.origin + '/newsletter',
        $referrer: referrer || '$direct',
        $referring_domain: referringDomain,
        $geoip_disable: true,
        country: request.headers.get('x-vercel-ip-country') ?? undefined,
        $process_person_profile: false,
        $lib: 'middleware',
      },
    }),
  }).catch(() => undefined); // analytics must never break the redirect
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  if (
    request.nextUrl.pathname === '/newsletter' &&
    !PREVIEW_BOT_RE.test(request.headers.get('user-agent') ?? '')
  ) {
    const src = request.nextUrl.searchParams.get('src');
    let fromSite = src === 'site';
    try {
      const referer = request.headers.get('referer');
      if (
        !src &&
        referer &&
        new URL(referer).hostname === request.nextUrl.hostname
      )
        fromSite = true;
    } catch {
      /* malformed referer header */
    }
    const lane = fromSite ? 'site' : src === 'comment' ? 'comment' : 'featured';
    const click = newsletterClick(request, lane);
    if (click) event.waitUntil(click);
    return NextResponse.redirect(
      `${NEWSLETTER_TARGET}?${NEWSLETTER_UTM[lane]}`,
      302
    );
  }

  const response = NextResponse.next();

  const { searchParams } = new URL(request.url);
  const utmParams = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ];

  utmParams.forEach(param => {
    const value = searchParams.get(param);
    if (value) {
      response.cookies.set(param, value, {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|ingest|_next/static|_next/image|favicon.ico).*)'],
};
