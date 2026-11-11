import type { Metadata } from 'next'
import PricingPage from '@/components/pages/PricingPage'

export const metadata: Metadata = {
  title: 'Tarifs Automation Lab',
  description: 'Formules Starter, Business et Premium : installation unique puis abonnement mensuel. Pilote de 10 jours à prix fixe, déduit de l’installation.',
  alternates: { canonical: '/tarifs', languages: { fr: '/tarifs', en: '/en/pricing' } },
}

export default function Page() {
  return <PricingPage lang="fr" />
}
