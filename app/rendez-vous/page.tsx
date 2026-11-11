import type { Metadata } from 'next'
import BookPage from '@/components/pages/BookPage'

export const metadata: Metadata = {
  title: 'Réserver un appel découverte',
  description: 'Réservez un appel gratuit de 15 minutes avec RCKY DIGITAL, par téléphone ou WhatsApp, pour voir ce qui peut être automatisé dans votre activité.',
  alternates: { canonical: '/rendez-vous', languages: { fr: '/rendez-vous', en: '/en/book' } },
}

export default function Page() {
  return <BookPage lang="fr" />
}
