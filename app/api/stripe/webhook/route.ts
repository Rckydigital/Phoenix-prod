import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, planForPrice } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Reçoit les événements Stripe et met à jour l'abonnement du client dans Supabase.
// À déclarer dans Stripe > Développeurs > Webhooks : https://www.rckydigital.fr/api/stripe/webhook
// Événements : checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
export async function POST(req: Request) {
  const s = stripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const admin = supabaseAdmin()
  if (!s || !secret || !admin) return NextResponse.json({ error: 'not_configured' }, { status: 503 })

  let event: Stripe.Event
  try {
    event = s.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') || '', secret)
  } catch {
    return NextResponse.json({ error: 'bad_signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id || session.metadata?.user_id
    if (userId) {
      await admin.from('profiles').update({
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
        plan: session.metadata?.plan || null,
        subscription_status: 'active',
      }).eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
    const plan = planForPrice(sub.items.data[0]?.price?.id) || sub.metadata?.plan || null
    const status = event.type === 'customer.subscription.deleted' ? 'canceled' : sub.status
    await admin.from('profiles').update({ subscription_status: status, ...(plan ? { plan } : {}) }).eq('stripe_customer_id', customer)
  }

  return NextResponse.json({ received: true })
}
