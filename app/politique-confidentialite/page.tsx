import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Phoenix Prod',
  description: 'Politique de confidentialité et protection des données personnelles, conformément au RGPD.',
  robots: { index: false },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Politique de confidentialité</h1>
        <p className="text-gray-500 text-sm mb-12">
          Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés.
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              1. Responsable du traitement
            </h2>
            <div className="bg-dark-200 rounded-xl p-6 text-sm space-y-2">
              <p><strong className="text-white">Entité :</strong> Rcky Digital (Phoenix Prod)</p>
              <p><strong className="text-white">Contact DPO :</strong>{' '}
                <a href={`mailto:${SITE.email}`} className="text-brand">{SITE.email}</a>
              </p>
              <p><strong className="text-white">Adresse :</strong> {SITE.address}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              2. Données collectées
            </h2>
            <p className="text-sm mb-4">Nous collectons les données suivantes dans le cadre de notre activité :</p>
            <div className="bg-dark-200 rounded-xl overflow-hidden text-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-400 text-white">
                    <th className="text-left px-4 py-3 font-semibold">Donnée</th>
                    <th className="text-left px-4 py-3 font-semibold">Finalité</th>
                    <th className="text-left px-4 py-3 font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-400">
                  {[
                    { data: 'Nom, prénom', purpose: 'Traitement des demandes', duration: '3 ans' },
                    { data: 'E-mail', purpose: 'Réponse aux demandes, relation client', duration: '3 ans' },
                    { data: 'Téléphone', purpose: 'Contact commercial', duration: '3 ans' },
                    { data: 'Messages envoyés', purpose: 'Suivi des demandes', duration: '1 an' },
                    { data: 'Données de navigation (cookies)', purpose: 'Statistiques anonymes', duration: '13 mois' },
                  ].map((row) => (
                    <tr key={row.data} className="text-gray-400 hover:bg-dark-300 transition-colors">
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
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              3. Base légale des traitements
            </h2>
            <ul className="text-sm space-y-2">
              <li className="flex gap-2"><span className="text-brand mt-1">•</span> <span><strong className="text-white">Exécution d'un contrat</strong> — traitement de vos commandes et devis</span></li>
              <li className="flex gap-2"><span className="text-brand mt-1">•</span> <span><strong className="text-white">Consentement</strong> — cookies analytiques, newsletters</span></li>
              <li className="flex gap-2"><span className="text-brand mt-1">•</span> <span><strong className="text-white">Intérêt légitime</strong> — réponse aux demandes de contact</span></li>
              <li className="flex gap-2"><span className="text-brand mt-1">•</span> <span><strong className="text-white">Obligation légale</strong> — conservation des données comptables</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
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
                  <span className="text-brand mt-1">•</span>
                  <span>{right}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm mt-4">
              Pour exercer vos droits, contactez-nous à{' '}
              <a href={`mailto:${SITE.email}`} className="text-brand">{SITE.email}</a>.
              Vous pouvez également introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" className="text-brand" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              5. Cookies
            </h2>
            <p className="text-sm">
              Ce site utilise des cookies techniques (indispensables au fonctionnement) et, avec votre consentement, des cookies analytiques pour mesurer l'audience. Vous pouvez retirer votre consentement à tout moment en effaçant les cookies de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-brand pl-4">
              6. Transferts hors UE
            </h2>
            <p className="text-sm">
              Vos données sont hébergées sur les serveurs de Vercel Inc. (États-Unis). Ce transfert est encadré par les garanties appropriées (Clauses Contractuelles Types de la Commission Européenne).
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
