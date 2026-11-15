import type { Metadata } from 'next'
import AboutPage from '@/components/pages/AboutPage'
import { SITE, LAST_UPDATE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Ricky GALIN, fondateur de RCKY DIGITAL (Guadeloupe, 2023) : création de sites internet sur mesure améliorés grâce à l’IA, visibilité sur Google et dans les IA, et automatisations IA (Automation Lab).',
  alternates: { canonical: '/a-propos', languages: { fr: '/a-propos', en: '/en/about' } },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'À propos de RCKY DIGITAL',
  dateModified: LAST_UPDATE,
  mainEntity: {
    '@type': 'Person',
    name: SITE.owner,
    jobTitle: 'Fondateur de RCKY DIGITAL',
    worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    knowsAbout: ['Création de sites internet', 'Visibilité dans les IA (GEO)', 'Référencement local', 'Marketing digital', 'E-business', 'Automatisation IA'],
    homeLocation: { '@type': 'Place', name: 'Guadeloupe' },
  },
}

export default function AProposPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <AboutPage lang="fr" />
    </>
  )
}
