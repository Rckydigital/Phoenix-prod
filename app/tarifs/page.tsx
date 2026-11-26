import type { Metadata } from 'next'
import PricingPage from '@/components/pages/PricingPage'

export const metadata: Metadata = {
  title: 'Tarifs : création de site internet sur mesure',
  description: 'Sites internet sur mesure (vitrine, réservation, boutique, refonte) sur devis gratuit sous 48 h, partout à distance, et tarifs publics de l’automatisation IA.',
  alternates: { canonical: '/tarifs', languages: { fr: '/tarifs', en: '/en/pricing' } },
}

export default function Page() {
  return <PricingPage lang="fr" />
}
