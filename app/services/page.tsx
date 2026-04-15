import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES, SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Nos services — Vidéo, Drone & Marketing en Guadeloupe',
  description:
    'Production vidéo, prises de vue drone certifiées, stratégie marketing et création de contenu. Phoenix Prod intervient partout en Guadeloupe et aux Antilles.',
}

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block bg-brand/20 text-brand text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Ce que nous faisons
          </span>
          <h1 className="section-title text-5xl">Nos services</h1>
          <p className="section-subtitle mx-auto">
            De la prise de vue à la stratégie digitale, nous couvrons tous vos besoins en communication visuelle.
          </p>
        </div>

        {/* Services détaillés */}
        <div className="space-y-16">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="text-5xl mb-4">{service.icon}</div>
                <h2 className="text-3xl font-bold text-white mb-4">{service.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-primary mt-8">
                  Demander un devis
                </Link>
              </div>
              <div className={`h-80 bg-dark-200 border border-dark-400 rounded-2xl flex items-center justify-center ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <span className="text-8xl opacity-20">{service.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bas de page */}
        <div className="mt-24 bg-dark-200 border border-dark-400 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Vous ne savez pas par où commencer ?</h2>
          <p className="text-gray-400 mb-8">
            Prenez un RDV stratégie gratuit. En 30 minutes, nous identifions ensemble les priorités pour votre projet.
          </p>
          <Link href="/contact" className="btn-primary text-lg px-10 py-4">
            Réserver mon RDV gratuit →
          </Link>
          <p className="mt-4 text-gray-600 text-sm">
            Ou par téléphone :{' '}
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="text-gray-400 hover:text-brand underline">
              {SITE.phone}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
