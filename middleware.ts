import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Persist UTM parameters and ICP to cookies if present
  const { searchParams } = new URL(request.url)
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  
  utmParams.forEach(param => {
    const value = searchParams.get(param)
    if (value) {
      response.cookies.set(param, value, {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }
  })

  // Handle ICP parameter
  const icp = searchParams.get('icp')
  if (icp) {
    response.cookies.set('icp', icp, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90 // 90 days
    })
  }

  // Ensure visitor ID exists
  if (!request.cookies.get('vid')) {
    response.cookies.set('vid', crypto.randomUUID(), {
      httpOnly: false,
      sameSite: 'lax', 
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}