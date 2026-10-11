import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Newsletter funnel: 302 (not 301 — target will change) to the beehiiv
// subscribe page with per-lane UTM tagging. Inbound query params are
// deliberately not passed through. Lanes: default = LinkedIn Featured link;
// ?src=comment = links dropped in post comments.
// Link-preview crawlers are exempt: they fall through to app/newsletter/
// page.tsx (200 + OG metadata) because LinkedIn's Featured-link validator
// rejects a bare off-domain 302.
const NEWSLETTER_TARGET = 'https://falsegreen.beehiiv.com/subscribe'
const PREVIEW_BOT_RE =
  /linkedinbot|facebookexternalhit|twitterbot|slackbot|slack-linkexpanding|whatsapp|telegrambot|discordbot|googlebot|bingbot/i

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/newsletter' &&
    !PREVIEW_BOT_RE.test(request.headers.get('user-agent') ?? '')
  ) {
    const lane =
      request.nextUrl.searchParams.get('src') === 'comment'
        ? 'utm_source=linkedin&utm_medium=comment&utm_campaign=comments'
        : 'utm_source=linkedin&utm_medium=featured&utm_campaign=profile'
    return NextResponse.redirect(`${NEWSLETTER_TARGET}?${lane}`, 302)
  }

  const response = NextResponse.next()

  const { searchParams } = new URL(request.url)
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

  utmParams.forEach(param => {
    const value = searchParams.get(param)
    if (value) {
      response.cookies.set(param, value, {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30
      })
    }
  })

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
