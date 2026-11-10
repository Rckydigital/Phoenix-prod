import type { Metadata } from 'next'
import DemoPage from '@/components/pages/DemoPage'

export const metadata: Metadata = {
  title: 'LeadFlow demo',
  description: 'Interactive LeadFlow demo: a client request analysed, logged in the CRM, with a drafted reply, follow-up and meeting slots.',
  alternates: { canonical: '/en/demo', languages: { fr: '/demo', en: '/en/demo' } },
  openGraph: { locale: 'en_US' },
}

export default function Page() {
  return <DemoPage lang="en" />
}
