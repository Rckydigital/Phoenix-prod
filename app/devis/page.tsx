import type { Metadata } from 'next'
import QuotePage from '@/components/pages/QuotePage'

export const metadata: Metadata = {
  title: 'Demander un devis',
  description: 'Demandez un devis gratuit à RCKY DIGITAL : automatisation IA (Automation Lab) ou visibilité locale en Guadeloupe. Réponse sous 48 h.',
  alternates: { canonical: '/devis', languages: { fr: '/devis', en: '/en/quote' } },
}

export default function Page({ searchParams }: { searchParams: { error?: string; service?: string } }) {
  return <QuotePage lang="fr" error={searchParams.error} preset={searchParams.service} />
}
