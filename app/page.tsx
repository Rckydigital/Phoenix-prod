import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, SERVICES, REALISATIONS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Agence vidéo & drone en Guadeloupe | Phoenix Prod',
  description:
    'Phoenix Prod — production vidéo professionnelle, prises de vue drone et stratégie marketing en Guadeloupe. Contactez-nous pour un premier RDV stratégie gratuit.',
}

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark">
        {/* Fond décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-100 to-dark-200" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand/5 rounded-full blur-2xl" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <span className="inline-block bg-brand/20 text-brand text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Agence de production audiovisuelle — Guadeloupe 🇬🇵
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Donnez vie à{' '}
            <span className="text-brand">votre vision</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Production vidéo, prises de vue drone et stratégie digitale. Nous amplifions
            votre message avec des visuels qui marquent les esprits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Prendre un RDV stratégie gratuit →
            </Link>
            <Link href="/realisations" className="btn-outline text-lg px-8 py-4">
              Voir nos réalisations
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '50+', label: 'Projets réalisés' },
              { value: '5★', label: 'Note client' },
              { value: '971', label: 'Guadeloupe' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-brand">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-24 px-4 bg-dark-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Nos services</h2>
            <p className="section-subtitle mx-auto">
              De la prise de vue à la stratégie digitale, tout sous un même toit.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <div key={service.id} className="card group">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
                <ul className="space-y-1">
                  {service.features.map((f) => (
                    <li key={f} className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="btn-outline">
              Découvrir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* ===== RÉALISATIONS ===== */}
      <section className="py-24 px-4 bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Nos réalisations</h2>
            <p className="section-subtitle mx-auto">
              Des projets qui parlent d'eux-mêmes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REALISATIONS.map((r) => (
              <div key={r.id} className="card group hover:scale-105 transition-transform duration-300">
                <div className="h-48 bg-dark-400 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-5xl opacity-30">🎬</span>
                </div>
                <span className="text-xs bg-brand/20 text-brand px-2 py-1 rounded-full">{r.category}</span>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">{r.title}</h3>
                <p className="text-gray-400 text-sm">{r.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/realisations" className="btn-outline">
              Voir toutes nos réalisations
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA PRINCIPAL ===== */}
      <section className="py-24 px-4 bg-brand">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à passer à la vitesse supérieure ?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Un premier échange de 30 minutes pour comprendre vos besoins et vous proposer une stratégie sur mesure. Gratuit et sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Réserver mon RDV stratégie →
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Envoyer un e-mail
            </a>
          </div>
          <p className="mt-6 text-white/60 text-sm">
            Ou appelez-nous directement :{' '}
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="underline">
              {SITE.phone}
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
