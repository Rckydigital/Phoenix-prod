import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, SERVICES, SECTORS, LAUNCH_OFFER } from '@/lib/constants'
import { PhoenixIcon } from '@/components/Logo'
import ServiceCard from '@/components/ServiceCard'

export const metadata: Metadata = {
  title: 'Agence digitale en Guadeloupe : photo, vidéo, réseaux et sites | RCKY DIGITAL',
  description: SITE.description,
}

const STEPS = [
  {
    n: '1',
    title: 'Un échange gratuit',
    text: '30 minutes pour comprendre votre activité, vos clients et ce qui vous freine aujourd’hui.',
  },
  {
    n: '2',
    title: 'On crée',
    text: 'Shooting sur place, montage, visuels ou site : vous validez chaque étape avant la publication.',
  },
  {
    n: '3',
    title: 'Vous êtes visible',
    text: 'Vos contenus sont en ligne et, si vous le souhaitez, on s’occupe de la suite chaque mois.',
  },
]

const sectorColors = ['bg-brand-soft text-brand-deep', 'bg-plum-soft text-plum', 'bg-teal-soft text-teal-deep']

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-sand pb-20 pt-32 md:pb-28 md:pt-40">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/15" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal/10" />
        <div className="container-site relative grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow">Agence digitale en Guadeloupe</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
              Des visuels qui donnent <span className="text-brand-deep">envie de réserver.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Photos, vidéos, réseaux sociaux et sites avec réservation pour les gîtes, les activités, les salons et les
              instituts de Guadeloupe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary px-7 py-4 text-base">
                Réserver un échange gratuit
              </Link>
              <Link href="/services" className="btn-outline px-7 py-4 text-base">
                Voir les services et tarifs
              </Link>
            </div>
          </div>
          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-full bg-white shadow-[0_30px_80px_-30px_rgba(30,42,51,0.35)]">
            <PhoenixIcon className="h-4/5 w-4/5" title="Phénix RCKY DIGITAL" />
          </div>
        </div>
      </section>

      {/* OFFRE DE LANCEMENT */}
      {LAUNCH_OFFER.active && (
        <section className="bg-ink py-5 text-white">
          <div className="container-site flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p>
              <span className="font-bold text-[#F2A65A]">{LAUNCH_OFFER.title}</span>{' '}
              <span className="text-white/80">{LAUNCH_OFFER.text}</span>
            </p>
            <Link href="/contact" className="shrink-0 font-semibold underline underline-offset-4 hover:text-[#F2A65A]">
              J’en profite
            </Link>
          </div>
        </section>
      )}

      {/* POUR QUI */}
      <section className="py-20 md:py-24">
        <div className="container-site">
          <h2 className="section-title">Pour qui ?</h2>
          <p className="section-subtitle">
            Des petites entreprises qui ont un vrai savoir-faire, mais pas le temps de soigner leur image en ligne.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SECTORS.map((s, i) => (
              <div key={s.id} className="card">
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${sectorColors[i % 3]}`}>
                  {s.title}
                </span>
                <p className="mt-4 leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-sand py-20 md:py-24">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="section-title">Services et tarifs</h2>
              <p className="section-subtitle">Des prix clairs, affichés dès le départ. Devis gratuit et sans engagement.</p>
            </div>
            <Link href="/services" className="btn-outline shrink-0">
              Tous les détails
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* MÉTHODE */}
      <section className="py-20 md:py-24">
        <div className="container-site">
          <h2 className="section-title">Comment ça marche</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-xl font-bold text-ink">
                  {step.n}
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="bg-sand py-20 md:py-24">
        <div className="container-site grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="eyebrow">Qui est derrière RCKY DIGITAL ?</span>
            <h2 className="section-title mt-5">Un interlocuteur unique, formé au marketing digital.</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Je suis Ricky GALIN, fondateur de RCKY DIGITAL. Diplômé d’un bachelor en marketing digital et d’un master en
              e-business, je mets ces compétences au service des entreprises guadeloupéennes, avec une approche simple :
              des contenus beaux, utiles, et pensés pour vous apporter des clients.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Le phénix de notre logo, c’est la renaissance : redonner de l’éclat à votre image en ligne.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              ['Local', 'Basé en Guadeloupe, je viens sur place.'],
              ['Transparent', 'Tarifs affichés, devis gratuit.'],
              ['Diplômé', 'Double certification marketing & e-business.'],
              ['Réactif', 'Réponse sous 48 h à toute demande.'],
            ].map(([t, d]) => (
              <li key={t} className="card">
                <p className="font-bold text-ink">{t}</p>
                <p className="mt-1 text-sm text-ink-soft">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-center md:px-16">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15" />
            <h2 className="relative text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              Parlons de votre projet.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-ink">
              Un échange de 30 minutes, gratuit et sans engagement, pour voir ce qu’on peut faire pour vous.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-4 font-semibold text-white hover:bg-black">
                Réserver mon échange
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center rounded-full border-2 border-ink px-7 py-4 font-semibold text-ink hover:bg-ink hover:text-white"
              >
                Appeler le {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
