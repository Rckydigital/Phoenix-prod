import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Mentions légales — RCKY DIGITAL',
  description: 'Mentions légales du site RCKY DIGITAL, conformément à la loi LCEN.',
  robots: { index: false },
}

export default function MentionsLegalesPage() {
  return (
    <div className="pt-32 pb-20 px-4 md:pt-40">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-ink mb-2">Mentions légales</h1>
        <p className="text-ink-muted text-sm mb-12">
          Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la Confiance en l'Économie Numérique (LCEN).
        </p>

        <div className="space-y-10 text-ink-soft leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              1. Éditeur du site
            </h2>
            <div className="bg-sand rounded-xl p-6 space-y-2 text-sm">
              <p><strong className="text-ink">Nom commercial :</strong> RCKY DIGITAL</p>
              <p><strong className="text-ink">Forme juridique :</strong> Entreprise individuelle (EI) — Ricky GALIN</p>
              <p><strong className="text-ink">SIRET :</strong> {SITE.siret}</p>
              <p><strong className="text-ink">Siège social :</strong> {SITE.address}</p>
              <p><strong className="text-ink">E-mail :</strong>{' '}
                <a href={`mailto:${SITE.email}`} className="text-brand-deep underline">{SITE.email}</a>
              </p>
              <p><strong className="text-ink">Téléphone :</strong> {SITE.phone}</p>
              <p><strong className="text-ink">Directeur de la publication :</strong> Ricky GALIN</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              2. Hébergeur
            </h2>
            <div className="bg-sand rounded-xl p-6 space-y-2 text-sm">
              <p><strong className="text-ink">Hébergeur :</strong> Vercel Inc.</p>
              <p><strong className="text-ink">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><strong className="text-ink">Site web :</strong>{' '}
                <a href="https://vercel.com" className="text-brand-deep underline" target="_blank" rel="noopener noreferrer">vercel.com</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              3. Propriété intellectuelle
            </h2>
            <p className="text-sm">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est la propriété exclusive de RCKY DIGITAL ou de ses partenaires, et est protégé par les lois françaises et internationales relatives au droit d'auteur et à la propriété intellectuelle.
            </p>
            <p className="text-sm mt-3">
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de RCKY DIGITAL.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              4. Limitation de responsabilité
            </h2>
            <p className="text-sm">
              Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions. Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email à l'adresse{' '}
              <a href={`mailto:${SITE.email}`} className="text-brand-deep underline">{SITE.email}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              5. Cookies
            </h2>
            <p className="text-sm">
              Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience. Il compte simplement, de façon anonyme, les pages vues et les clics sur les boutons de contact (sans cookie, sans adresse IP ni identifiant), pour améliorer ses contenus. Seuls des éléments techniques strictement nécessaires à son fonctionnement peuvent être utilisés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              6. Droit applicable
            </h2>
            <p className="text-sm">
              Tout litige en relation avec l'utilisation du site{' '}
              <span className="text-brand-deep underline">{SITE.url}</span> est soumis au droit français. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents.
            </p>
          </section>

          <p className="text-ink-muted text-xs border-t border-line pt-6">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
