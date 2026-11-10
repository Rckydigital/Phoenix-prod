import { NextResponse } from 'next/server'
import { stripe, priceFor } from '@/lib/stripe'
import { userFromRequest } from '@/lib/supabaseAdmin'
import { SITE } from '@/lib/constants'
import { r, type Lang, type PlanId } from '@/lib/i18n'

// Crée une session de paiement Stripe (abonnement mensuel) pour le client connecté.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const plan = String(body.plan || '') as PlanId
  const lang: Lang = body.lang === 'en' ? 'en' : 'fr'
  const s = stripe()
  const price = priceFor(plan)
  if (!s || !price) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })

  const { admin, user } = await userFromRequest(req)
  if (!admin || !user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: profile } = await admin.from('profiles').select('stripe_customer_id').eq('id', user.id).maybeSingle()
  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin || SITE.url

  const session = await s.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    ...(profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : { customer_email: user.email ?? undefined }),
    client_reference_id: user.id,
    metadata: { user_id: user.id, plan },
    subscription_data: { metadata: { user_id: user.id, plan } },
    locale: lang,
    allow_promotion_codes: true,
    success_url: `${base}${r('dashboard', lang)}?${lang === 'fr' ? 'paiement' : 'payment'}=ok`,
    cancel_url: `${base}${r('dashboard', lang)}?plan=${plan}`,
  })
  return NextResponse.json({ url: session.url })
}
