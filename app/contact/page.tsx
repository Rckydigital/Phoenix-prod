import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact & RDV stratégie gratuit — Phoenix Prod Guadeloupe',
  description:
    'Prenez un rendez-vous stratégie gratuit avec Phoenix Prod. Appelez-nous ou envoyez un message — nous répondons sous 24h.',
}

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-brand/20 text-brand text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Parlons de votre projet
          </span>
          <h1 className="section-title text-5xl">Contactez-nous</h1>
          <p className="section-subtitle mx-auto">
            Un premier échange de 30 minutes pour comprendre vos besoins — gratuit, sans engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Colonne gauche — infos & Calendly */}
          <div className="space-y-8">
            {/* CTA rapides */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Réserver un RDV stratégie</h2>

              {/* ========================================================
                  BLOC CALENDLY — Remplacer l'URL ci-dessous par votre lien
                  Créez un compte sur calendly.com et copiez votre lien ici
                  ======================================================== */}
              <div className="bg-dark-400 rounded-xl p-8 text-center mb-4">
                <p className="text-gray-400 text-sm mb-4">
                  📅 Calendly — Sélectionnez un créneau disponible
                </p>
                <a
                  href={SITE.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                >
                  Voir les disponibilités →
                </a>
                <p className="text-gray-600 text-xs mt-3">
                  Remplacez ce lien dans lib/constants.ts → SITE.calendly
                </p>
              </div>
            </div>

            {/* Contacts directs */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Ou contactez-nous directement</h2>
              <div className="space-y-4">
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 p-4 bg-dark-400 rounded-xl hover:bg-brand/10 hover:border-brand border border-transparent transition-all"
                >
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Téléphone</p>
                    <p className="text-white font-semibold">{SITE.phone}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-4 p-4 bg-dark-400 rounded-xl hover:bg-brand/10 hover:border-brand border border-transparent transition-all"
                >
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">E-mail</p>
                    <p className="text-white font-semibold">{SITE.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 bg-dark-400 rounded-xl">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Localisation</p>
                    <p className="text-white font-semibold">{SITE.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Envoyer un message</h2>
            <form action="/api/contact" method="POST" className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nom complet *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jean Dupont"
                  className="w-full bg-dark-400 border border-dark-300 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jean@entreprise.com"
                  className="w-full bg-dark-400 border border-dark-300 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+590 XXX XXX XXX"
                  className="w-full bg-dark-400 border border-dark-300 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Votre projet *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Décrivez votre projet, vos objectifs, votre budget estimé..."
                  className="w-full bg-dark-400 border border-dark-300 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder-gray-600 resize-none"
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="rgpd"
                  name="rgpd"
                  required
                  className="mt-1 accent-brand"
                />
                <label htmlFor="rgpd" className="text-xs text-gray-500">
                  J'accepte que mes données soient traitées par Rcky Digital dans le cadre de ma demande, conformément à la{' '}
                  <a href="/politique-confidentialite" className="text-brand underline">
                    politique de confidentialité
                  </a>
                  . *
                </label>
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                Envoyer ma demande →
              </button>
              <p className="text-center text-gray-600 text-xs">
                Réponse garantie sous 24h ouvrées
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
