import type { Metadata } from 'next'
import QuotePage from '@/components/pages/QuotePage'

export const metadata: Metadata = {
  title: 'Request a quote',
  description: 'Request a free quote from RCKY DIGITAL for AI automation (Automation Lab). Reply within 48 hours.',
  alternates: { canonical: '/en/quote', languages: { fr: '/devis', en: '/en/quote' } },
  openGraph: { locale: 'en_US' },
}

export default function Page({ searchParams }: { searchParams: { error?: string; service?: string } }) {
  return <QuotePage lang="en" error={searchParams.error} preset={searchParams.service} />
}
