import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Mentions légales — Phoenix Prod',
  description: 'Mentions légales du site Phoenix Prod / Rcky Digital, conformément à la loi LCEN.',
  robots: { index: false },
}

export default function MentionsLegalesPage() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Mentions légales</h1>
        <p className="text-gray-500 text-sm mb-12">
          Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la Confiance en l'Économie Numérique (LCEN).
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              1. Éditeur du site
            </h2>
            <div className="bg-dark-200 rounded-xl p-6 space-y-2 text-sm">
              <p><strong className="text-white">Raison sociale :</strong> Rcky Digital</p>
              <p><strong className="text-white">Forme juridique :</strong> [FORME JURIDIQUE — ex: SASU, Auto-entrepreneur]</p>
              <p><strong className="text-white">SIRET :</strong> {SITE.siret}</p>
              <p><strong className="text-white">Siège social :</strong> {SITE.address}</p>
              <p><strong className="text-white">E-mail :</strong>{' '}
                <a href={`mailto:${SITE.email}`} className="text-brand">{SITE.email}</a>
              </p>
              <p><strong className="text-white">Téléphone :</strong> {SITE.phone}</p>
              <p><strong className="text-white">Directeur de la publication :</strong> [NOM DU DIRIGEANT]</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              2. Hébergeur
            </h2>
            <div className="bg-dark-200 rounded-xl p-6 space-y-2 text-sm">
              <p><strong className="text-white">Hébergeur :</strong> Vercel Inc.</p>
              <p><strong className="text-white">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><strong className="text-white">Site web :</strong>{' '}
                <a href="https://vercel.com" className="text-brand" target="_blank" rel="noopener noreferrer">vercel.com</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              3. Propriété intellectuelle
            </h2>
            <p className="text-sm">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est la propriété exclusive de Rcky Digital / Phoenix Prod ou de ses partenaires, et est protégé par les lois françaises et internationales relatives au droit d'auteur et à la propriété intellectuelle.
            </p>
            <p className="text-sm mt-3">
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Rcky Digital.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              4. Limitation de responsabilité
            </h2>
            <p className="text-sm">
              Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions. Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email à l'adresse{' '}
              <a href={`mailto:${SITE.email}`} className="text-brand">{SITE.email}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              5. Cookies
            </h2>
            <p className="text-sm">
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Des cookies analytiques peuvent être déposés avec votre consentement, conformément à votre choix lors de l'affichage de la bannière cookies. Vous pouvez modifier vos préférences à tout moment en effaçant les données de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              6. Droit applicable
            </h2>
            <p className="text-sm">
              Tout litige en relation avec l'utilisation du site{' '}
              <span className="text-brand">{SITE.url}</span> est soumis au droit français. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents.
            </p>
          </section>

          <p className="text-gray-600 text-xs border-t border-dark-300 pt-6">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
