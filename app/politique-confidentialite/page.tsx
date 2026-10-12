import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — RCKY DIGITAL',
  description: 'Politique de confidentialité et protection des données personnelles, conformément au RGPD.',
  robots: { index: false },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-32 pb-20 px-4 md:pt-40">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-ink mb-2">Politique de confidentialité</h1>
        <p className="text-ink-muted text-sm mb-12">
          Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés.
        </p>

        <div className="space-y-10 text-ink-soft leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              1. Responsable du traitement
            </h2>
            <div className="bg-sand rounded-xl p-6 text-sm space-y-2">
              <p><strong className="text-ink">Entité :</strong> RCKY DIGITAL (Ricky GALIN, entrepreneur individuel)</p>
              <p><strong className="text-ink">Contact :</strong>{' '}
                <a href={`mailto:${SITE.email}`} className="text-brand-deep underline">{SITE.email}</a>
              </p>
              <p><strong className="text-ink">Adresse :</strong> {SITE.address}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              2. Données collectées
            </h2>
            <p className="text-sm mb-4">Nous collectons les données suivantes dans le cadre de notre activité :</p>
            <div className="bg-sand rounded-xl overflow-hidden text-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-sand text-ink">
                    <th className="text-left px-4 py-3 font-semibold">Donnée</th>
                    <th className="text-left px-4 py-3 font-semibold">Finalité</th>
                    <th className="text-left px-4 py-3 font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {[
                    { data: 'Nom, prénom', purpose: 'Traitement des demandes', duration: '3 ans après le dernier contact' },
                    { data: 'E-mail', purpose: 'Réponse aux demandes, relation client', duration: '3 ans après le dernier contact' },
                    { data: 'Téléphone', purpose: 'Contact commercial', duration: '3 ans après le dernier contact' },
                    { data: 'Messages envoyés', purpose: 'Suivi des demandes', duration: '1 an' },
                  ].map((row) => (
                    <tr key={row.data} className="text-ink-soft hover:bg-sand transition-colors">
                      <td className="px-4 py-3">{row.data}</td>
                      <td className="px-4 py-3">{row.purpose}</td>
                      <td className="px-4 py-3">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              3. Base légale des traitements
            </h2>
            <ul className="text-sm space-y-2">
              <li className="flex gap-2"><span className="text-brand-deep mt-1">•</span> <span><strong className="text-ink">Exécution d'un contrat</strong> — traitement de vos commandes et devis</span></li>
              <li className="flex gap-2"><span className="text-brand-deep mt-1">•</span> <span><strong className="text-ink">Consentement</strong> — newsletters (si vous vous y inscrivez)</span></li>
              <li className="flex gap-2"><span className="text-brand-deep mt-1">•</span> <span><strong className="text-ink">Intérêt légitime</strong> — réponse aux demandes de contact</span></li>
              <li className="flex gap-2"><span className="text-brand-deep mt-1">•</span> <span><strong className="text-ink">Obligation légale</strong> — conservation des données comptables</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              4. Vos droits
            </h2>
            <p className="text-sm mb-4">
              Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
            </p>
            <ul className="text-sm space-y-2">
              {[
                'Droit d\'accès (article 15 RGPD)',
                'Droit de rectification (article 16 RGPD)',
                'Droit à l\'effacement (article 17 RGPD)',
                'Droit à la limitation du traitement (article 18 RGPD)',
                'Droit à la portabilité des données (article 20 RGPD)',
                'Droit d\'opposition (article 21 RGPD)',
              ].map((right) => (
                <li key={right} className="flex gap-2">
                  <span className="text-brand-deep mt-1">•</span>
                  <span>{right}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm mt-4">
              Pour exercer vos droits, contactez-nous à{' '}
              <a href={`mailto:${SITE.email}`} className="text-brand-deep underline">{SITE.email}</a>.
              Vous pouvez également introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" className="text-brand-deep underline" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              5. Cookies
            </h2>
            <p className="text-sm">
              Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience, c'est pourquoi aucun bandeau de consentement n'est affiché. Les vidéos YouTube et Instagram ne sont chargées que si vous cliquez dessus : ces plateformes peuvent alors déposer leurs propres cookies, selon leurs politiques. Un cookie technique, strictement nécessaire, est utilisé uniquement pour l'espace privé de gestion réservé à l'éditeur. Si un outil de statistiques est ajouté plus tard, votre consentement sera demandé au préalable lorsque la loi l'exige.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4 border-l-4 border-brand pl-4">
              6. Destinataires et transferts hors UE
            </h2>
            <p className="text-sm">
              Vos données ne sont ni vendues ni cédées. Elles sont uniquement accessibles à Ricky GALIN et aux prestataires techniques nécessaires au fonctionnement du site : Vercel Inc. (hébergement du site), Resend (envoi de l'e-mail de notification lors d'une demande de contact) et GitHub Inc. (stockage privé du fichier de suivi des demandes). Ces prestataires sont situés aux États-Unis ; ces transferts sont encadrés par des garanties appropriées (Clauses Contractuelles Types de la Commission européenne et/ou Data Privacy Framework UE-États-Unis).
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
