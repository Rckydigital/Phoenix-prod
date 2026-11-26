import type { Metadata } from 'next'
import BookPage from '@/components/pages/BookPage'

export const metadata: Metadata = {
  title: 'Réserver un appel découverte',
  description: 'Appel gratuit de 15 minutes par téléphone ou WhatsApp : création de site internet sur mesure ou automatisation IA de vos demandes.',
  alternates: { canonical: '/rendez-vous', languages: { fr: '/rendez-vous', en: '/en/book' } },
}

export default function Page({ searchParams }: { searchParams: { sujet?: string } }) {
  return <BookPage lang="fr" topic={searchParams.sujet === 'automatisation' ? 'automatisation' : 'site'} />
}
