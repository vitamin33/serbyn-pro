'use server';
import { getVisitorId } from '@/lib/cookies';
import { createShortlink, trackEvent, captureLead } from '@/lib/leadgen-client';
import type { ShortlinkRequest, CaptureLeadBody } from '@/lib/types.leadgen';

export async function makeShortlink(req: ShortlinkRequest) {
  return createShortlink(req);
}

export async function trackClientEvent(
  payload: Omit<Parameters<typeof trackEvent>[0], 'visitor_id' | 'ts'>
) {
  return trackEvent({
    ...payload,
    visitor_id: getVisitorId(),
    ts: new Date().toISOString(),
  });
}

export async function submitLead(body: CaptureLeadBody) {
  return captureLead(body);
}
