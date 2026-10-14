import type { Metadata } from 'next'
import { SITE, SERVICES, LAUNCH_OFFER, priceNumber } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Offre de lancement -30 %',
  description:
    'Photos, vidéos, réseaux sociaux et site avec réservation en Guadeloupe : -30 % pour les 3 premiers clients de RCKY DIGITAL. Devis gratuit, réponse sous 48 h.',
  alternates: { canonical: '/offre' },
}

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-muted focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30'

const WA_TEXT = encodeURIComponent("Bonjour Ricky, je souhaite profiter de l'offre de lancement -30 % de RCKY DIGITAL. Mon activité : ")
const waLink = `https://wa.me/${SITE.phone.replace(/[^0-9]/g, '')}?text=${WA_TEXT}`
const eur = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €'

const CHOIX = ['shooting', 'reseaux', 'site', 'saison']

export default function OffrePage({ searchParams }: { searchParams: { error?: string; src?: string } }) {
  const services = CHOIX.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean) as typeof SERVICES
  const restantes = LAUNCH_OFFER.placesRestantes
  const complet = !LAUNCH_OFFER.active || restantes <= 0
  const src = (searchParams.src || '').slice(0, 40)

  return (
    <>
      {/* 1. Promesse + action */}
      <section className="bg-sand pb-14 pt-28 md:pb-20 md:pt-36">
        <div className="container-site max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-deep">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            {complet ? 'Offre terminée' : `Offre de lancement · plus que ${restantes} place${restantes > 1 ? 's' : ''}`}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
            Des visuels qui donnent envie de réserver, <span className="text-brand-deep">-30 %</span> pour nos 3 premiers clients.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Photos, vidéos, réseaux sociaux et site avec réservation pour les entreprises de Guadeloupe. Vous profitez de -30 % sur votre projet ; en échange, un avis honnête et l’accord de le montrer dans notre portfolio.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={waLink} target="_blank" rel="noopener noreferrer" data-track="Hero : WhatsApp" className="btn-primary px-7 py-4 text-base">
              Réserver ma place sur WhatsApp
            </a>
            <a href="#reserver" data-track="Hero : formulaire" className="btn-outline px-7 py-4 text-base">
              Je préfère un formulaire
            </a>
          </div>
          <p className="mt-4 text-sm text-ink-muted">Devis gratuit · Réponse sous 48 h · Sans engagement</p>
        </div>
      </section>

      {/* 2. Ce que vous pouvez choisir */}
      <section className="py-14 md:py-20">
        <div className="container-site">
          <h2 className="section-title text-center">Ce que vous pouvez choisir</h2>
          <p className="section-subtitle mx-auto text-center">La remise s’applique à tout votre projet. Prix nets, sans TVA à ajouter.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const base = priceNumber(s.price)
              return (
                <div key={s.id} className="card flex flex-col">
                  <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{s.forWho}</p>
                  {base ? (
                    <p className="mt-4">
                      <span className="text-sm text-ink-muted line-through">dès {eur(base)}</span>{' '}
                      <span className="text-2xl font-extrabold text-brand-deep">dès {eur(Math.round(base * (1 - LAUNCH_OFFER.remise)))}</span>
                      {s.priceNote && <span className="text-sm text-ink-muted"> {s.priceNote}</span>}
                    </p>
                  ) : (
                    <p className="mt-4 font-bold text-ink">{s.price}</p>
                  )}
                  <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                    {s.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2"><span className="text-brand" aria-hidden="true">✓</span>{f}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Comment ça marche */}
      <section className="bg-white py-14 md:py-20">
        <div className="container-site max-w-5xl">
          <h2 className="section-title text-center">Comment ça marche</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['Vous réservez votre place', 'Sur WhatsApp ou via le formulaire. Dites-nous votre activité et votre besoin.'],
              ['On échange 15 minutes', 'On comprend votre projet et vous recevez un devis gratuit, remise de -30 % incluse.'],
              ['On crée, vous validez', 'Shooting, publications ou site : vous validez chaque étape. En échange, un avis honnête une fois le projet livré.'],
            ].map(([t, d], i) => (
              <li key={t} className="card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{t}</h3>
                <p className="mt-2 text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Qui est derrière */}
      <section className="py-14 md:py-20">
        <div className="container-site max-w-3xl text-center">
          <h2 className="section-title">Qui est derrière RCKY DIGITAL ?</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Je suis Ricky GALIN, fondateur de l’agence, diplômé d’un master E-business. J’ai notamment créé et animé les réseaux de Nails to go et l’Instagram du CFA IUTS. Je me déplace partout en Guadeloupe, et je vous réponds personnellement.
          </p>
          <a href="/realisations" data-track="Voir les réalisations" className="mt-6 inline-block font-semibold text-brand-deep hover:underline">Voir nos réalisations →</a>
        </div>
      </section>

      {/* 5. Réserver */}
      <section id="reserver" className="scroll-mt-24 bg-sand py-14 md:py-20">
        <div className="container-site grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="section-title">Réservez votre place</h2>
            <p className="mt-4 text-ink-soft">
              {complet ? 'Les 3 places sont prises, mais vous pouvez toujours demander un devis gratuit.' : `Il reste ${restantes} place${restantes > 1 ? 's' : ''}. Premier arrivé, premier servi.`}
            </p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" data-track="Réserver : WhatsApp" className="btn-primary mt-6 w-full py-4 text-base sm:w-auto">
              Écrire sur WhatsApp
            </a>
            <p className="mt-3 text-sm text-ink-muted">Le plus rapide : réponse personnelle de Ricky.</p>
            <dl className="mt-8 space-y-4 text-sm">
              {[
                ['Combien de temps ça prend ?', 'Démarrage sous 3 à 7 jours après validation du devis. Le délai de livraison est précisé sur le devis.'],
                ['Il y a un engagement ?', 'Non : la demande et le devis sont gratuits. Les forfaits mensuels ont une durée minimale de 3 mois.'],
                ['Comment se passe le paiement ?', 'Acompte de 40 % à la commande, solde à la livraison, par virement ou carte bancaire.'],
              ].map(([q, a]) => (
                <div key={q}>
                  <dt className="font-semibold text-ink">{q}</dt>
                  <dd className="mt-1 text-ink-soft">{a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-6 md:p-8">
            {searchParams.error && (
              <p role="alert" className="mb-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8F1F22]">
                Le message n’a pas pu être envoyé. Vérifiez les champs obligatoires et réessayez.
              </p>
            )}
            <form action="/api/contact" method="POST" className="grid gap-4">
              <input type="hidden" name="page" value="/offre" />
              <input type="hidden" name="src" value={src} />
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">Nom *</label>
                <input id="name" name="name" required autoComplete="name" className={inputClass} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">WhatsApp / téléphone</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0690 00 00 00" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">E-mail *</label>
                  <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-ink">Votre besoin</label>
                <select id="service" name="service" defaultValue="" className={inputClass}>
                  <option value="">Je ne sais pas encore</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">Votre activité en quelques mots *</label>
                <textarea id="message" name="message" required rows={3} placeholder="Ex. : gîte de 3 chambres à Sainte-Anne, je voudrais de nouvelles photos" className={`${inputClass} resize-y`} />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Ne pas remplir</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="flex items-start gap-3">
                <input id="rgpd" type="checkbox" name="rgpd" value="oui" required className="mt-1 h-4 w-4 accent-[#B4511A]" />
                <label htmlFor="rgpd" className="text-sm text-ink-soft">
                  J’accepte que mes données soient utilisées pour répondre à ma demande (<a href="/politique-confidentialite" className="underline">confidentialité</a>). *
                </label>
              </div>
              <button type="submit" className="btn-primary py-4 text-base">Réserver ma place</button>
              <p className="text-center text-xs text-ink-muted">Réponse sous 48 h (jours ouvrés) · Aucun engagement</p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
