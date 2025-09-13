// Site pack returned by your lead-gen /dashboard/site/pack
export interface SitePack {
  icp: string;
  blocks: {
    hero?: {
      headline: string;
      sub?: string;
      cta_primary?: string;
      cta_secondary?: string;
    };
    offer_tiles?: Array<{
      offer_code: string;
      headline?: string;
      bullets?: string[];
    }>;
    social_proof?: Array<{ logo?: string; label?: string }>;
    case_studies?: Array<{ slug: string; title: string; kpi?: string }>;
    faq?: Array<{ q: string; a: string }>;
  };
  experiment?: { [surface: string]: { variant: string; arms?: string[] } };
}

export interface Offer {
  code: string; // "AUDIT_LITE"
  name: string; // "Audit Lite (48h)"
  price_cents: number; // 15000
  currency: string; // "USD"
  stripe_url: string; // public checkout URL
  icp_tag?: string;
}

export interface ShortlinkRequest {
  target_url: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    icp?: string;
  };
  slug?: string;
}

export interface ShortlinkResponse {
  slug: string;
  url: string;
}

export type EventType =
  | 'pageview'
  | 'video_25'
  | 'video_50'
  | 'video_95'
  | 'cta_click'
  | 'checkout_started'
  | 'form_submit'
  | 'purchase';

export interface TrackEventBody {
  visitor_id: string;
  icp: string;
  variant?: string; // e.g., hero_v2
  event: EventType;
  context?: {
    route?: string;
    utm?: Record<string, string | undefined>;
    slug?: string; // shortlink or CTA id
    offer_code?: string;
    ref?: string;
    user_agent?: string;
  };
  ts: string; // ISO timestamp
}

export interface CaptureLeadBody {
  icp: string;
  variant?: string;
  source: 'site';
  contact: { name?: string; email: string; company?: string; note?: string };
  context?: { route?: string; utm?: Record<string, string | undefined> };
}
