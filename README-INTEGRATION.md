# ICP Dynamic Lead-Gen Testing Integration

## Overview
This integration enables ICP-based dynamic content rendering, offer checkout, and full-funnel tracking for the portfolio site.

## Architecture
- **Framework**: Next.js 14 App Router + Server Actions
- **ICP Resolution**: URL params + cookie persistence  
- **Content**: Dynamic from lead-gen service API
- **Tracking**: Full attribution chain (pageview → click → checkout)
- **Checkout**: Stripe via shortlinks (no client-side secrets)

## Environment Variables
```bash
NEXT_PUBLIC_SITE_NAME="CERBEN Pro"
LEADGEN_API_BASE="https://api.serbyn.pro"
LEADGEN_METRICS_TOKEN="Bearer <redacted>"
LEADGEN_PUBLIC_ORIGIN="https://serbyn.pro"
```

## Key Files
- `lib/types.leadgen.ts` - TypeScript contracts
- `lib/leadgen-client.ts` - API client functions
- `lib/icp.ts` - ICP resolution logic
- `lib/cookies.ts` - Cookie management helpers
- `app/(marketing)/` - Dynamic marketing pages
- `middleware.ts` - UTM persistence

## Usage
1. Visit `/?icp=startup` to see startup-focused content
2. Hero, offers, and case studies adapt to ICP
3. All interactions tracked for attribution
4. Checkout uses shortlinks with UTM preservation

## Testing
- ICP switching changes content ✅
- Events flow to `/api/track` ✅  
- Shortlinks resolve correctly ✅
- Graceful fallbacks on API failure ✅