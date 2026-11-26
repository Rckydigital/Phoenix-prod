import type { Metadata } from 'next'
import { OG_IMAGE } from '@/lib/constants'
import AutomationLab from '@/components/AutomationLab'

export const metadata: Metadata = {
  title: 'Automation Lab: AI lead handling for agencies',
  description:
    'Claude-powered automations for agencies and consulting firms: lead qualification, CRM updates, replies, follow-ups and bookings. Free 15-min audit.',
  alternates: { canonical: '/en/automation-lab', languages: { fr: '/automation-lab', en: '/en/automation-lab' } },
  openGraph: { locale: 'en_US', images: [OG_IMAGE] },
}

export default function Page() {
  return <AutomationLab lang="en" />
}
