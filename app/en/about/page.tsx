import type { Metadata } from 'next'
import AboutPage from '@/components/pages/AboutPage'
import { SITE, LAST_UPDATE, OG_IMAGE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About: web & AI agency in Guadeloupe',
  description:
    'Ricky GALIN, founder of RCKY DIGITAL (Guadeloupe, 2023): custom websites enhanced with AI, Google and AI visibility, and AI automations with Claude.',
  alternates: { canonical: '/en/about', languages: { fr: '/a-propos', en: '/en/about' } },
  openGraph: { locale: 'en_US', images: [OG_IMAGE] },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About RCKY DIGITAL',
  inLanguage: 'en',
  dateModified: LAST_UPDATE,
  mainEntity: {
    '@type': 'Person',
    name: SITE.owner,
    jobTitle: 'Founder of RCKY DIGITAL',
    worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    knowsAbout: ['Website creation', 'Generative engine optimization (GEO)', 'Local SEO', 'Digital marketing', 'E-business', 'AI automation'],
    homeLocation: { '@type': 'Place', name: 'Guadeloupe' },
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <AboutPage lang="en" />
    </>
  )
}
