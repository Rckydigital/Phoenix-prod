import type { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: 'AI automation for agencies and consultancies | RCKY DIGITAL',
  description:
    'RCKY DIGITAL builds Claude-powered automations for marketing agencies and consulting firms: lead qualification, CRM updates, replies, follow-ups and bookings. Start with a 10-day pilot.',
  alternates: { canonical: '/en', languages: { fr: '/', en: '/en' } },
  openGraph: { locale: 'en_US' },
}

export default function Page() {
  return <HomePage lang="en" />
}
