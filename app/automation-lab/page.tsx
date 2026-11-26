import type { Metadata } from 'next'
import AutomationLab from '@/components/AutomationLab'

export const metadata: Metadata = {
  title: 'Automation Lab : automatisation IA des demandes',
  description:
    'Automatisations IA construites avec Claude : tri des demandes, CRM, réponses, relances et rendez-vous, pour agences, cabinets et TPE. Audit gratuit de 15 min.',
  alternates: { canonical: '/automation-lab', languages: { fr: '/automation-lab', en: '/en/automation-lab' } },
}

export default function Page() {
  return <AutomationLab lang="fr" />
}
