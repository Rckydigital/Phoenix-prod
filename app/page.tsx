import type { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: { absolute: 'Création de sites internet en Guadeloupe, visibles sur Google et l’IA | RCKY DIGITAL' },
  description: SITE.description,
  alternates: { canonical: '/', languages: { fr: '/', en: '/en' } },
}

export default function Page() {
  return <HomePage lang="fr" />
}
