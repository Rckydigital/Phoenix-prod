import type { Metadata } from 'next'
import AutomationLab from '@/components/AutomationLab'

export const metadata: Metadata = {
  title: 'Automation Lab: AI lead handling for agencies and consultancies',
  description:
    'RCKY DIGITAL builds Claude-powered automations for marketing agencies and consulting firms: lead qualification, CRM updates, replies, follow-ups and bookings. Free 15-min audit.',
  alternates: { canonical: '/en/automation-lab', languages: { fr: '/automation-lab', en: '/en/automation-lab' } },
  openGraph: { locale: 'en_US' },
}

export default function Page() {
  return <AutomationLab lang="en" />
}
