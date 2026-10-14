import { NextRequest, NextResponse } from 'next/server'
import { EVENTS, track, type TrackEvent } from '@/lib/track'

// Reçoit les signaux anonymes du site (pages vues, clics de contact). Aucun cookie, aucune IP stockée.
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse|vercel/i

export async function POST(req: NextRequest) {
  if (BOT.test(req.headers.get('user-agent') || '')) return new NextResponse(null, { status: 204 })
  let body: Record<string, unknown> = {}
  try {
    body = JSON.parse(await req.text())
  } catch {
    return new NextResponse(null, { status: 204 })
  }
  const event = String(body.e || '') as TrackEvent
  const page = String(body.p || '/').split('?')[0]
  if (!EVENTS.includes(event) || page.startsWith('/qg') || page.startsWith('/api')) return new NextResponse(null, { status: 204 })
  await track(event, page, String(body.l || ''), String(body.s || ''))
  return new NextResponse(null, { status: 204 })
}
