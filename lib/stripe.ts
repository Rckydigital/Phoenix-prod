// Stripe (abonnements Automation Lab). Variables serveur à définir dans Vercel :
//   STRIPE_SECRET_KEY            clé secrète (sk_test_… pour les essais, sk_live_… en réel)
//   STRIPE_WEBHOOK_SECRET        secret du webhook (whsec_…)
//   STRIPE_PRICE_STARTER / _BUSINESS / _PREMIUM   identifiants des prix mensuels (price_…)
import Stripe from 'stripe'
import type { PlanId } from '@/lib/i18n'

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY
  return key ? new Stripe(key) : null
}

export function priceFor(plan: PlanId) {
  const map: Record<PlanId, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    business: process.env.STRIPE_PRICE_BUSINESS,
    premium: process.env.STRIPE_PRICE_PREMIUM,
  }
  return map[plan]
}

export function planForPrice(priceId: string | undefined | null): PlanId | null {
  if (!priceId) return null
  if (priceId === process.env.STRIPE_PRICE_STARTER) return 'starter'
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return 'business'
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return 'premium'
  return null
}
