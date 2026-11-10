import type { Metadata } from 'next'
import AutomationLab from '@/components/AutomationLab'

export const metadata: Metadata = {
  title: 'Automation Lab : automatisation des demandes clients avec l’IA',
  description:
    'RCKY DIGITAL construit avec Claude des automatisations pour les agences et cabinets de conseil : tri des demandes, CRM, réponses, relances et prise de rendez-vous. Audit gratuit de 15 min.',
  alternates: { canonical: '/automation-lab', languages: { fr: '/automation-lab', en: '/en/automation-lab' } },
}

export default function Page() {
  return <AutomationLab lang="fr" />
}
