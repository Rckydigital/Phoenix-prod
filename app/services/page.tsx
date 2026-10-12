import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES, PACKS, LAUNCH_OFFER, SITE } from '@/lib/constants'
import ServiceCard from '@/components/ServiceCard'

export const metadata: Metadata = {
  title: 'Services et tarifs',
  description:
    'Shooting photo et vidéo, gestion des réseaux sociaux, site avec réservation, montage vidéo : les services et tarifs de RCKY DIGITAL en Guadeloupe.',
}

const FAQ = [
  {
    q: 'Pourquoi des prix « à partir de » ?',
    a: 'Chaque projet est différent (taille du lieu, nombre de vidéos, pages du site…). Le prix affiché est le point de départ ; vous recevez un devis précis et gratuit avant tout engagement. Nos prix sont finaux : TVA non applicable (art. 293 B du CGI), rien ne s’ajoute.',
  },
  {
    q: 'Est-ce que vous vous déplacez ?',
    a: 'Oui, partout en Guadeloupe pour les shootings. Le reste (montage, réseaux, site) se fait à distance, avec des points réguliers.',
  },
  {
    q: 'Qui possède les photos et vidéos ?',
    a: 'Vous. Une fois le projet réglé, vous pouvez utiliser les contenus librement sur votre site, vos réseaux et vos annonces.',
  },
  {
    q: 'Comment se passe le paiement ?',
    a: 'Un acompte à la commande, le solde à la livraison. Pour les forfaits mensuels, un paiement par mois, sans engagement de durée.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="bg-sand pb-16 pt-32 md:pt-40">
        <div className="container-site">
          <span className="eyebrow">Services et tarifs</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Tout ce qu’il faut pour être vu, et choisi.
          </h1>
          <p className="section-subtitle">
            Des prix de départ clairs et finaux : pas de TVA à ajouter. Un devis précis et gratuit pour chaque projet.
          </p>
          {LAUNCH_OFFER.active && (
            <p className="mt-8 inline-block rounded-2xl bg-ink px-5 py-3 text-white">
              <span className="font-bold text-[#F2A65A]">{LAUNCH_OFFER.title}</span>{' '}
              <span className="text-white/80">{LAUNCH_OFFER.text}</span>
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-site grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} detailed />
          ))}
        </div>
      </section>

      <section className="bg-sand py-16 md:py-20">
        <div className="container-site">
          <h2 className="section-title">Les packs</h2>
          <p className="section-subtitle">Plusieurs services réunis, à un prix plus doux.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PACKS.map((pack) => (
              <article key={pack.id} className="rounded-3xl border-2 border-brand bg-white p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-ink">{pack.title}</h3>
                  <p className="shrink-0 rounded-full bg-brand px-4 py-1.5 font-bold text-ink">{pack.price}</p>
                </div>
                <p className="mt-3 text-ink-soft">{pack.description}</p>
                <ul className="mt-5 space-y-2">
                  {pack.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-ink">
                      <svg className="mt-1 shrink-0 text-teal" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/contact?service=${pack.id}`} className="btn-primary mt-8">
                  Demander ce pack
                </Link>
              </article>
            ))}
            <article className="rounded-3xl border border-dashed border-ink/30 bg-white p-8">
              <h3 className="text-2xl font-bold text-ink">Un besoin sur mesure ?</h3>
              <p className="mt-3 text-ink-soft">
                Newsletter, e-mailing, refonte d’un site existant, contenus pour un événement… Décrivez votre projet, je
                vous propose une solution adaptée.
              </p>
              <Link href="/contact" className="btn-outline mt-8">
                Me contacter
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-site max-w-3xl">
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-ink">
                  {item.q}
                  <span className="text-brand-deep transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-ink-soft">
            Une autre question ? Appelez le{' '}
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="font-semibold text-brand-deep underline">
              {SITE.phone}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
