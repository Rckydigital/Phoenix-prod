import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SITE, SERVICES, LAST_UPDATE, priceNumber } from '@/lib/constants'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Agence digitale en Guadeloupe`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'agence digitale Guadeloupe',
    'photographe gîte Guadeloupe',
    'vidéo réseaux sociaux Guadeloupe',
    'community manager Guadeloupe',
    'site internet réservation Guadeloupe',
    'marketing digital 971',
    'RCKY DIGITAL',
  ],
  authors: [{ name: SITE.owner }],
  icons: { icon: '/icon.svg' },
  other: { 'article:modified_time': LAST_UPDATE },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Agence digitale en Guadeloupe`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: './' },
  // Validation Google Search Console (code public, non secret)
  verification: { google: 'PK-xn4-K9kic7yoxOSGH46YbhyYD56xfKr_oEFeiWpI' },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: 'fr-FR',
      publisher: { '@id': `${SITE.url}/#business` },
      dateModified: LAST_UPDATE,
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE.url}/#business`,
      name: SITE.name,
      alternateName: 'RCKY DIGITAL, agence digitale en Guadeloupe',
      founder: { '@type': 'Person', name: SITE.owner, jobTitle: 'Fondateur, marketing digital' },
      description: SITE.description,
      url: SITE.url,
      logo: `${SITE.url}/icon.svg`,
      image: `${SITE.url}/icon.svg`,
      telephone: SITE.phone.replace(/\s/g, ''),
      email: SITE.email,
      priceRange: '60 € - 800 €',
      currenciesAccepted: 'EUR',
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Guadeloupe' }],
      address: { '@type': 'PostalAddress', addressRegion: 'Guadeloupe', addressCountry: 'FR' },
      knowsAbout: ['Marketing digital', 'Gestion des réseaux sociaux', 'Photographie', 'Vidéo', 'Création de sites internet', 'Référencement local'],
      sameAs: [SITE.social.instagram, SITE.social.google],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services RCKY DIGITAL',
        itemListElement: SERVICES.filter((sv) => priceNumber(sv.price)).map((sv) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: sv.title, description: sv.description, areaServed: 'Guadeloupe' },
          priceSpecification: { '@type': 'PriceSpecification', minPrice: priceNumber(sv.price), priceCurrency: 'EUR' },
        })),
      },
    },
  ],
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Aller au contenu
        </a>
        <Navbar />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
