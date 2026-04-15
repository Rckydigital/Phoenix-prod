import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Agence vidéo & drone en Guadeloupe`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'agence vidéo Guadeloupe',
    'drone Guadeloupe',
    'production audiovisuelle Antilles',
    'stratégie marketing Guadeloupe',
    'tournage drone 971',
    'film institutionnel Guadeloupe',
    'agence marketing digital PME',
    'Rcky Digital',
    'Phoenix Prod',
  ],
  authors: [{ name: SITE.agency }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Production vidéo & drone en Guadeloupe`,
    description: SITE.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Phoenix Prod — Agence vidéo & drone en Guadeloupe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | Production vidéo & drone en Guadeloupe`,
    description: SITE.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Phoenix Prod',
  alternateName: 'Rcky Digital',
  description:
    'Agence de production vidéo, drone et stratégie marketing basée en Guadeloupe. Nous accompagnons les PMEs françaises dans leur développement digital.',
  url: 'https://phoenixprod.fr',
  telephone: '+590690573870',
  email: 'rckydigital@outlook.fr',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Guadeloupe',
    addressCountry: 'FR',
    addressRegion: 'Guadeloupe',
  },
  sameAs: [
    'https://instagram.com/rckydigital',
    'https://linkedin.com/company/rckydigital',
    'https://youtube.com/@rckydigital',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '12',
    bestRating: '5',
  },
  priceRange: '€€',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
