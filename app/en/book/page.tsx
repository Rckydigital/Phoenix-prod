import type { Metadata } from 'next'
import BookPage from '@/components/pages/BookPage'

export const metadata: Metadata = {
  title: 'Book a discovery call',
  description: 'Book a free 15-minute call with RCKY DIGITAL, by phone or WhatsApp, to see what could be automated in your business.',
  alternates: { canonical: '/en/book', languages: { fr: '/rendez-vous', en: '/en/book' } },
  openGraph: { locale: 'en_US' },
}

export default function Page() {
  return <BookPage lang="en" />
}
