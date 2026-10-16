import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { GUIDES, getGuide, type GuideBlock } from '@/lib/guides'

export const dynamicParams = false

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug)
  if (!g) return {}
  const url = `${SITE.url}/guides/${g.slug}`
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: url },
    openGraph: { title: g.metaTitle, description: g.description, url, type: 'article' },
  }
}

const dateFr = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function Block({ b }: { b: GuideBlock }) {
  switch (b.type) {
    case 'h2':
      return <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink md:text-3xl">{b.text}</h2>
    case 'p':
      return <p className="mt-4 text-lg leading-relaxed text-ink-soft">{b.text}</p>
    case 'list':
      return (
        <ul className="mt-5 space-y-3">
          {b.items.map((it) => (
            <li key={it} className="flex gap-3 text-lg leading-relaxed text-ink-soft">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <aside className="mt-12 rounded-3xl border border-brand/20 bg-brand-soft p-6 md:p-8">
          <p className="text-xl font-bold text-ink">{b.title}</p>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{b.text}</p>
          {b.href && (
            <Link href={b.href} className="btn-primary mt-6 inline-flex">
              {b.cta ?? 'En savoir plus'}
            </Link>
          )}
        </aside>
      )
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug)
  if (!g) notFound()
  const url = `${SITE.url}/guides/${g.slug}`

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.title,
      description: g.description,
      datePublished: g.published,
      dateModified: g.updated,
      inLanguage: 'fr-FR',
      mainEntityOfPage: url,
      author: { '@type': 'Person', name: SITE.owner, url: `${SITE.url}/a-propos` },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      about: { '@type': 'Place', name: 'Guadeloupe' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ q: g.title, a: g.answer }, ...g.faq].map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE.url}/guides` },
        { '@type': 'ListItem', position: 3, name: g.title, item: url },
      ],
    },
  ]

  const others = GUIDES.filter((o) => o.slug !== g.slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article>
        <header className="bg-sand pb-12 pt-32 md:pt-40">
          <div className="container-site max-w-3xl">
            <nav aria-label="Fil d’Ariane" className="text-sm text-ink-soft">
              <Link href="/guides" className="hover:text-brand-deep">Guides</Link>
              <span aria-hidden="true"> › </span>
              <span>Guadeloupe</span>
            </nav>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{g.title}</h1>
            <p className="mt-5 text-sm text-ink-soft">
              Par {SITE.owner}, {SITE.name} · Mis à jour le {dateFr(g.updated)} · {g.readingMinutes} min de lecture
            </p>
          </div>
        </header>

        <div className="container-site max-w-3xl py-12 md:py-16">
          <section aria-label="Réponse courte" className="rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-deep">La réponse courte</p>
            <p className="mt-3 text-lg font-medium leading-relaxed text-ink">{g.answer}</p>
          </section>

          {g.body.map((b, i) => (
            <Block key={i} b={b} />
          ))}

          <section className="mt-16" aria-labelledby="faq">
            <h2 id="faq" className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Questions fréquentes</h2>
            <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
              {g.faq.map((f) => (
                <details key={f.q} className="group p-6">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-ink marker:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {f.q}
                      <span className="text-brand transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-lg leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-16" aria-labelledby="autres">
            <h2 id="autres" className="text-xl font-bold text-ink">À lire aussi</h2>
            <ul className="mt-4 space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/guides/${o.slug}`} className="text-lg font-medium text-brand-deep hover:underline">
                    {o.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </>
  )
}
