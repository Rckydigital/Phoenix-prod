import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, SERVICES, SECTORS, LAUNCH_OFFER } from '@/lib/constants'
import { PhoenixIcon } from '@/components/Logo'
import ServiceCard from '@/components/ServiceCard'
import Reveal from '@/components/Reveal'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Agence digitale en Guadeloupe : photo, vidéo, réseaux et sites | RCKY DIGITAL',
  description: SITE.description,
}

const STEPS = [
  {
    n: '1',
    title: 'Un audit offert',
    text: 'Je regarde votre fiche Google, votre Instagram et vos photos, puis on en parle 15 minutes : vous savez ce qui vous freine.',
  },
  {
    n: '2',
    title: 'On crée',
    text: 'Vitrine Pro, Réservation en ligne ou Visibilité Mensuelle : un contenu et un délai annoncés, vous validez chaque étape.',
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
        <div aria-hidden="true" className="drift absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/15" />
        <div aria-hidden="true" className="drift-slow absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal/10" />
        <div className="container-site relative grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow hero-in" style={{ '--d': '0ms' } as React.CSSProperties}>Agence digitale en Guadeloupe</span>
            <h1 style={{ '--d': '120ms' } as React.CSSProperties} className="hero-in mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
              Des visuels qui donnent <span className="text-brand-deep">envie de réserver.</span>
            </h1>
            <p style={{ '--d': '240ms' } as React.CSSProperties} className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Photos, vidéos, réseaux sociaux et sites avec réservation pour les gîtes, les activités, les salons et les
              instituts de Guadeloupe.
            </p>
            <div style={{ '--d': '360ms' } as React.CSSProperties} className="hero-in mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary px-7 py-4 text-base">
                Réserver un échange gratuit
              </Link>
              <Link href="/services" className="btn-outline px-7 py-4 text-base">
                Voir les services et tarifs
              </Link>
            </div>
          </div>
          <div style={{ '--d': '300ms' } as React.CSSProperties} className="hero-in relative mx-auto w-full max-w-sm">
            <div className="float flex aspect-square w-full items-center justify-center rounded-full bg-white shadow-[0_30px_80px_-30px_rgba(30,42,51,0.35)]">
              <PhoenixIcon className="h-4/5 w-4/5" title="Phénix RCKY DIGITAL tenant un objectif photo" large />
            </div>
          </div>
        </div>
      </section>


      {/* BANDEAU DÉFILANT */}
      <div className="overflow-hidden border-y border-line bg-white py-4" aria-hidden="true">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 pr-10 text-lg font-semibold text-ink-soft">
              {['Gîtes & villas', 'Excursions', 'Salons de coiffure', 'Instituts de beauté', 'Barbiers', 'Restaurants', 'Commerces', 'Artisans'].map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t}
                  <span className="text-brand">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

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
          <Reveal>
            <h2 className="section-title">Pour qui ?</h2>
            <p className="section-subtitle">
              Des petites entreprises qui ont un vrai savoir-faire, mais pas le temps de soigner leur image en ligne.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SECTORS.map((s, i) => (
              <Reveal key={s.id} delay={i * 90} className="card lift">
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${sectorColors[i % 3]}`}>
                  {s.title}
                </span>
                <p className="mt-4 leading-relaxed text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-sand py-20 md:py-24">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="section-title">3 offres, des prix fixes</h2>
              <p className="section-subtitle">Un contenu précis, un délai annoncé, un prix final. Et un audit de votre visibilité offert pour commencer.</p>
            </div>
            <Link href="/services" className="btn-outline shrink-0">
              Tous les détails
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.id} delay={i * 110} className="lift rounded-3xl">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTHODE */}
      <section className="py-20 md:py-24">
        <div className="container-site">
          <Reveal>
            <h2 className="section-title">Comment ça marche</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 140}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-xl font-bold text-ink">
                  {step.n}
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
              </Reveal>
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
            ].map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 90} className="card lift">
                <p className="font-bold text-ink">{t}</p>
                <p className="mt-1 text-sm text-ink-soft">{d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* GUIDES */}
      <section className="py-20 md:py-24">
        <div className="container-site">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Guides gratuits</span>
              <h2 className="section-title mt-5">Les réponses à vos questions</h2>
              <p className="section-subtitle">Prix d’un site, visibilité sur Google, photos pour Instagram : l’essentiel, sans jargon.</p>
            </div>
            <Link href="/guides" className="btn-outline shrink-0">
              Tous les guides
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {GUIDES.map((g, i) => (
              <Reveal key={g.slug} delay={i * 110} className="h-full">
                <Link href={`/guides/${g.slug}`} className="card lift group flex h-full flex-col">
                  <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-brand-deep">{g.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{g.description}</p>
                  <span className="mt-5 text-sm font-semibold text-brand-deep">Lire ({g.readingMinutes} min) →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="container-site">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-center md:px-16">
            <div aria-hidden="true" className="drift absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15" />
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
          </Reveal>
        </div>
      </section>
    </>
  )
}
