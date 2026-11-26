import type { Metadata } from 'next'
import { OG_IMAGE } from '@/lib/constants'
import DemoPage from '@/components/pages/DemoPage'

export const metadata: Metadata = {
  title: 'LeadFlow demo: an AI agent sorts your leads',
  description: 'Interactive LeadFlow demo: a client request analysed, logged in the CRM, with a drafted reply, follow-up and meeting slots.',
  alternates: { canonical: '/en/demo', languages: { fr: '/demo', en: '/en/demo' } },
  openGraph: { locale: 'en_US', images: [OG_IMAGE] },
}

export default function Page() {
  return <DemoPage lang="en" />
}
