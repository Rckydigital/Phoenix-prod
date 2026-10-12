import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SITE } from '@/lib/constants'

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
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE.name,
  founder: SITE.owner,
  description: SITE.description,
  url: SITE.url,
  telephone: SITE.phone.replace(/\s/g, ''),
  email: SITE.email,
  areaServed: 'Guadeloupe',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Guadeloupe',
    addressCountry: 'FR',
  },
  sameAs: [SITE.social.instagram],
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
