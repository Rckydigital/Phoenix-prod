import type { Metadata } from 'next'
import { OG_IMAGE } from '@/lib/constants'
import HomePage from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: 'AI automation for agencies and consultancies',
  description:
    'Claude-powered automations for agencies and consulting firms: lead qualification, CRM updates, replies, follow-ups and bookings. Start with a 10-day pilot.',
  alternates: { canonical: '/en', languages: { fr: '/', en: '/en' } },
  openGraph: { locale: 'en_US', images: [OG_IMAGE] },
}

export default function Page() {
  return <HomePage lang="en" />
}
