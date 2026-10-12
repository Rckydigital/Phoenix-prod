import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, LAST_UPDATE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'RCKY DIGITAL est l’agence digitale de Ricky GALIN, en Guadeloupe : photo, vidéo, réseaux sociaux et sites avec réservation pour les petites entreprises locales.',
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
    knowsAbout: ['Marketing digital', 'E-business', 'Réseaux sociaux', 'Photo et vidéo', 'Sites internet'],
    homeLocation: { '@type': 'Place', name: 'Guadeloupe' },
  },
}

export default function AProposPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <section className="bg-sand pb-16 pt-32 md:pt-40">
        <div className="container-site">
          <span className="eyebrow">À propos</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Une agence guadeloupéenne, pour les entreprises d’ici.
          </h1>
          <p className="section-subtitle">
            RCKY DIGITAL est une agence de communication digitale créée en 2023 en Guadeloupe par Ricky GALIN. Elle aide les petites
            entreprises locales à avoir une image à la hauteur de leur savoir-faire.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <h2 className="section-title">Qui est derrière RCKY DIGITAL ?</h2>
            <p>
              Je m’appelle Ricky GALIN. J’ai suivi un bachelor en marketing digital, puis un master en e-business, en alternance : j’ai
              appris le métier en formation et sur le terrain, notamment en créant et en animant le compte Instagram d’un centre de
              formation en Guadeloupe.
            </p>
            <p>
              Aujourd’hui, je mets ces compétences au service des gîtes, des activités touristiques, des salons, des instituts et des
              commerces de Guadeloupe. Mon objectif : des contenus beaux et utiles, qui vous apportent des réservations et des clients.
            </p>
          </div>
          <div className="space-y-5">
            <h2 className="section-title">Notre façon de travailler</h2>
            <ul className="space-y-4 text-lg text-ink-soft">
              <li><strong className="text-ink">Des prix clairs.</strong> Les tarifs sont affichés et le devis est gratuit. Nos prix sont finaux, sans TVA à ajouter.</li>
              <li><strong className="text-ink">De la proximité.</strong> Nous nous déplaçons partout en Guadeloupe pour les shootings.</li>
              <li><strong className="text-ink">Vous validez tout.</strong> Aucune publication ne part sans votre accord.</li>
              <li><strong className="text-ink">De l’honnêteté.</strong> Nous montrons uniquement de vrais projets, avec l’accord des clients.</li>
            </ul>
            <Link href="/contact" className="btn-primary inline-flex">Parlons de votre projet</Link>
          </div>
        </div>
      </section>
    </>
  )
}
