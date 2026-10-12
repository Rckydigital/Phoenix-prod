import type { Metadata } from 'next'
import Link from 'next/link'
import { REALISATIONS, VIDEOS } from '@/lib/constants'
import VideoEmbed from '@/components/VideoEmbed'

export const metadata: Metadata = {
  title: 'Réalisations',
  description: 'Les projets réalisés par RCKY DIGITAL pour des entreprises de Guadeloupe.',
}

export default function RealisationsPage() {
  return (
    <>
      <section className="bg-sand pb-16 pt-32 md:pt-40">
        <div className="container-site">
          <span className="eyebrow">Réalisations</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Nos projets, en toute transparence.
          </h1>
          <p className="section-subtitle">
            RCKY DIGITAL est une jeune agence : chaque projet ajouté ici est un vrai client, avec son accord.
          </p>
        </div>
      </section>

      {VIDEOS.length > 0 && (
        <section className="pt-16 md:pt-20">
          <div className="container-site">
            <h2 className="section-title">En vidéo</h2>
            <p className="section-subtitle">Quelques contenus réalisés, à regarder directement ici.</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VIDEOS.map((v) => (
                <VideoEmbed key={v.url} video={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="container-site grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REALISATIONS.map((r) => (
            <article key={r.id} className="card">
              <span className="inline-block rounded-full bg-plum-soft px-3 py-1 text-sm font-semibold text-plum">
                {r.category}
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink">{r.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{r.description}</p>
              {r.link && (
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block text-sm font-semibold text-brand-deep hover:underline"
                >
                  {r.link.includes('instagram.com') ? 'Voir le compte →' : 'Voir le site →'}
                </a>
              )}
            </article>
          ))}

          <article className="flex flex-col items-start justify-center rounded-3xl border-2 border-dashed border-brand bg-brand-soft p-8">
            <h2 className="text-xl font-bold text-ink">Votre projet ici ?</h2>
            <p className="mt-2 text-ink-soft">
              Profitez de l’offre de lancement : -30 % pour nos 3 premiers clients.
            </p>
            <Link href="/contact" className="btn-primary mt-6">
              Démarrer mon projet
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
