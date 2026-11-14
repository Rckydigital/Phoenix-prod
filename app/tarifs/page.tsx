import type { Metadata } from 'next'
import PricingPage from '@/components/pages/PricingPage'

export const metadata: Metadata = {
  title: 'Tarifs : création de site internet et automatisation IA',
  description: 'Sites internet sur mesure en Guadeloupe (vitrine, réservation, boutique en ligne, page de vente, refonte), sur devis gratuit sous 48 h. Automatisation IA : pilote de 10 jours puis formules Starter, Business et Premium.',
  alternates: { canonical: '/tarifs', languages: { fr: '/tarifs', en: '/en/pricing' } },
}

export default function Page() {
  return <PricingPage lang="fr" />
}
