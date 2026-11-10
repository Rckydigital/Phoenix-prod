import type { Metadata } from 'next'
import PricingPage from '@/components/pages/PricingPage'

export const metadata: Metadata = {
  title: 'Tarifs Automation Lab',
  description: 'Formules Starter, Business et Premium : installation unique puis abonnement mensuel. Essai gratuit de 14 jours, sans carte bancaire.',
  alternates: { canonical: '/tarifs', languages: { fr: '/tarifs', en: '/en/pricing' } },
}

export default function Page() {
  return <PricingPage lang="fr" />
}
