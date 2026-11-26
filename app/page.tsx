import type { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: { absolute: 'Création de site internet en Guadeloupe | RCKY DIGITAL' },
  description: SITE.metaDescription,
  alternates: { canonical: '/', languages: { fr: '/', en: '/en' } },
}

export default function Page() {
  return <HomePage lang="fr" />
}
