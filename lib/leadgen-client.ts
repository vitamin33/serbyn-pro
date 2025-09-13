import { cookies, headers } from 'next/headers';
import type {
  SitePack,
  Offer,
  ShortlinkRequest,
  ShortlinkResponse,
  TrackEventBody,
  CaptureLeadBody,
} from './types.leadgen';

const API = process.env.LEADGEN_API_BASE!;
const AUTH = process.env.LEADGEN_METRICS_TOKEN!;

export async function fetchSitePack(
  icp: string,
  route: string
): Promise<SitePack> {
  const res = await fetch(
    `${API}/dashboard/site/pack?icp=${encodeURIComponent(icp)}&route=${encodeURIComponent(route)}`,
    {
      headers: { Authorization: AUTH },
      cache: 'no-store',
    }
  );
  if (!res.ok) throw new Error(`pack ${res.status}`);
  return res.json();
}

export async function fetchOffers(icp: string): Promise<Offer[]> {
  const res = await fetch(`${API}/offers?icp=${encodeURIComponent(icp)}`, {
    headers: { Authorization: AUTH },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`offers ${res.status}`);
  return res.json();
}

export async function createShortlink(
  req: ShortlinkRequest
): Promise<ShortlinkResponse> {
  const res = await fetch(`${API}/shortlinks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: AUTH },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`shortlink ${res.status}`);
  return res.json();
}

// Portfolio → Lead-gen tracking proxy (call our /api/track)
export async function trackEvent(body: TrackEventBody) {
  const res = await fetch(`${process.env.LEADGEN_PUBLIC_ORIGIN}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.warn('trackEvent non-200', await res.text());
}

export async function captureLead(body: CaptureLeadBody) {
  const res = await fetch(`${API}/revenue/capture-lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: AUTH },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`capture-lead ${res.status}`);
  return res.json();
}
