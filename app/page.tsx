import type { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Agence digitale en Guadeloupe et automatisation IA | RCKY DIGITAL',
  description: SITE.description,
  alternates: { canonical: '/', languages: { fr: '/', en: '/en' } },
}

export default function Page() {
  return <HomePage lang="fr" />
}
