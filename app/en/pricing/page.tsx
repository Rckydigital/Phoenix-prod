import type { Metadata } from 'next'
import PricingPage from '@/components/pages/PricingPage'

export const metadata: Metadata = {
  title: 'Automation Lab pricing',
  description: 'Starter, Business and Premium plans: one-off setup, then a monthly plan. 14-day free trial, no credit card.',
  alternates: { canonical: '/en/pricing', languages: { fr: '/tarifs', en: '/en/pricing' } },
  openGraph: { locale: 'en_US' },
}

export default function Page() {
  return <PricingPage lang="en" />
}
