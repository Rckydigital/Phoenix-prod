import type { Metadata } from 'next'
import Link from 'next/link'
import { REALISATIONS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Nos réalisations — Portfolio Phoenix Prod',
  description:
    'Découvrez nos projets : films institutionnels, prises de vue drone, stratégie marketing pour des clients en Guadeloupe et aux Antilles.',
}

const categories = ['Tous', 'Vidéo', 'Drone', 'Marketing']

export default function RealisationsPage() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-brand/20 text-brand text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Notre travail
          </span>
          <h1 className="section-title text-5xl">Nos réalisations</h1>
          <p className="section-subtitle mx-auto">
            Des projets concrets, des résultats mesurables, des clients satisfaits.
          </p>
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                cat === 'Tous'
                  ? 'bg-brand text-white'
                  : 'bg-dark-200 text-gray-400 hover:text-white border border-dark-400'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Grille projets */}
        <div className="grid md:grid-cols-3 gap-6">
          {REALISATIONS.map((r) => (
            <div key={r.id} className="card group hover:scale-[1.02] transition-transform duration-300">
              <div className="h-52 bg-dark-400 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
                <span className="text-6xl opacity-20">🎬</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-brand/20 text-brand px-3 py-1 rounded-full font-medium">
                  {r.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">{r.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{r.description}</p>
            </div>
          ))}

          {/* Carte "Votre projet ici" */}
          <div className="card border-dashed border-dark-400 flex flex-col items-center justify-center text-center py-10 group hover:border-brand transition-colors">
            <div className="text-4xl mb-4 opacity-40">✨</div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">Votre projet ici</h3>
            <p className="text-gray-600 text-sm mb-6">Prochaine réalisation disponible</p>
            <Link href="/contact" className="btn-primary text-sm py-2">
              Démarrer mon projet
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
