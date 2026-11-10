import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { userFromRequest } from '@/lib/supabaseAdmin'
import { r } from '@/lib/i18n'

// Ouvre le portail client Stripe (changer de carte, voir les factures, résilier).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const lang = body.lang === 'en' ? 'en' : 'fr'
  const s = stripe()
  if (!s) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
  const { admin, user } = await userFromRequest(req)
  if (!admin || !user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data: profile } = await admin.from('profiles').select('stripe_customer_id').eq('id', user.id).maybeSingle()
  if (!profile?.stripe_customer_id) return NextResponse.json({ error: 'no_customer' }, { status: 400 })
  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  const portal = await s.billingPortal.sessions.create({ customer: profile.stripe_customer_id, return_url: `${base}${r('dashboard', lang)}` })
  return NextResponse.json({ url: portal.url })
}
