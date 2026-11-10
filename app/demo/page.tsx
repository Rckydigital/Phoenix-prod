import type { Metadata } from 'next'
import DemoPage from '@/components/pages/DemoPage'

export const metadata: Metadata = {
  title: 'Démo LeadFlow',
  description: 'Démo interactive de LeadFlow : une demande client analysée, enregistrée dans le CRM, avec réponse préparée, relance et rendez-vous proposés.',
  alternates: { canonical: '/demo', languages: { fr: '/demo', en: '/en/demo' } },
}

export default function Page() {
  return <DemoPage lang="fr" />
}
