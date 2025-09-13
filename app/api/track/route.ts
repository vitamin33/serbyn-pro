import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const API = process.env.LEADGEN_API_BASE!;
  const AUTH = process.env.LEADGEN_METRICS_TOKEN!;
  const body = await req.json();

  const r = await fetch(`${API}/revenue/attribution/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: AUTH },
    body: JSON.stringify(body),
  });

  return new NextResponse(await r.text(), {
    status: r.status,
    headers: { 'Content-Type': r.headers.get('Content-Type') || 'text/plain' },
  });
}
