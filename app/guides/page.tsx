import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Guides pratiques pour les petites entreprises',
  description:
    'Prix d’un site, visibilité Google et ChatGPT, gîtes, réservation en ligne, Instagram : des réponses claires pour les petites entreprises, ici et ailleurs.',
  alternates: { canonical: `${SITE.url}/guides` },
}

export default function GuidesPage() {
  return (
    <>
      <section className="bg-sand pb-14 pt-32 md:pt-40">
        <div className="container-site">
          <span className="eyebrow">Guides</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Des réponses claires pour les petites entreprises.
          </h1>
          <p className="section-subtitle">Les questions qu’on nous pose le plus, avec nos vrais prix et sans jargon.</p>
        </div>
      </section>
      <section className="py-14 md:py-20">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="press group flex flex-col rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-xl font-bold leading-snug text-ink group-hover:text-brand-deep">{g.title}</h2>
              <p className="mt-3 flex-1 text-ink-soft">{g.description}</p>
              <span className="mt-5 text-sm font-semibold text-brand-deep">Lire ({g.readingMinutes} min) →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
