import type { Metadata } from 'next'
import PricingPage from '@/components/pages/PricingPage'

export const metadata: Metadata = {
  title: 'Tarifs création de site internet en Guadeloupe',
  description: 'Sites internet sur mesure en Guadeloupe (vitrine, réservation, boutique, refonte) sur devis gratuit sous 48 h, et tarifs publics de l’automatisation IA.',
  alternates: { canonical: '/tarifs', languages: { fr: '/tarifs', en: '/en/pricing' } },
}

export default function Page() {
  return <PricingPage lang="fr" />
}
