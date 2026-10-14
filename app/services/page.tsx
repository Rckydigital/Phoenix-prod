import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES, OPTIONS, AUDIT, LAUNCH_OFFER, SITE, FAQ } from '@/lib/constants'
import ServiceCard from '@/components/ServiceCard'

export const metadata: Metadata = {
  title: 'Services et tarifs',
  description:
    'Vitrine Pro (390 €), Réservation en ligne (790 €), Visibilité Mensuelle (349 €/mois) : les offres de RCKY DIGITAL en Guadeloupe, avec un audit de visibilité offert.',
}


const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="bg-sand pb-16 pt-32 md:pt-40">
        <div className="container-site">
          <span className="eyebrow">Services et tarifs</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            3 offres claires pour être vu, et choisi.
          </h1>
          <p className="section-subtitle">
            Un contenu précis, un délai annoncé et un prix fixe, sans TVA à ajouter. Pas sûr de ce qu’il vous faut ? Commencez par l’audit offert.
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
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <article className="self-start rounded-3xl border-2 border-brand bg-white p-8">
            <span className="eyebrow">Gratuit</span>
            <h2 className="mt-4 text-2xl font-bold text-ink">{AUDIT.title}</h2>
            <p className="mt-3 text-ink-soft">{AUDIT.text}</p>
            <Link href={`/contact?service=${AUDIT.id}`} className="btn-primary mt-8">
              Demander mon audit
            </Link>
          </article>
          <div>
            <h2 className="section-title">Options à la carte</h2>
            <p className="section-subtitle">Pour un besoin précis, ou en complément d’une offre.</p>
            <ul className="mt-8 divide-y divide-line rounded-3xl border border-line bg-white">
              {OPTIONS.map((o) => (
                <li key={o.id} id={o.id} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="font-semibold text-ink">{o.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{o.description}</p>
                  </div>
                  <p className="shrink-0 font-bold text-brand-deep">
                    {o.price}
                    {o.priceNote && <span className="font-medium text-ink-muted"> {o.priceNote}</span>}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-muted">
              Un besoin sur mesure (newsletter, refonte d’un site, événement) ?{' '}
              <Link href="/contact" className="font-semibold text-brand-deep underline">Décrivez-le-moi</Link>.
            </p>
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
