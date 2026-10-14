import type { Metadata } from 'next'
import { SITE, SERVICES, OPTIONS, AUDIT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact et échange gratuit',
  description:
    'Contactez RCKY DIGITAL pour un échange gratuit de 30 minutes ou un devis : photo, vidéo, réseaux sociaux et sites en Guadeloupe.',
}

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-muted focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30'

export default function ContactPage({
  searchParams,
}: {
  searchParams: { service?: string; error?: string }
}) {
  const options = [AUDIT, ...SERVICES, ...OPTIONS].map((s) => ({ id: s.id, title: s.title }))
  const preselected = options.some((o) => o.id === searchParams.service) ? searchParams.service : ''
  const error = searchParams.error

  return (
    <>
      <section className="bg-sand pb-12 pt-32 md:pt-40">
        <div className="container-site">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Parlons de votre projet.
          </h1>
          <p className="section-subtitle">
            Un échange de 30 minutes, gratuit et sans engagement. Réponse sous 48 h.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {SITE.calendly && (
              <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="card block hover:border-brand">
                <p className="text-sm text-ink-muted">Prise de rendez-vous</p>
                <p className="mt-1 text-lg font-bold text-ink">Choisir un créneau →</p>
              </a>
            )}
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="card block hover:border-brand">
              <p className="text-sm text-ink-muted">Téléphone</p>
              <p className="mt-1 text-lg font-bold text-ink">{SITE.phone}</p>
            </a>
            <a href={`mailto:${SITE.email}`} className="card block hover:border-brand">
              <p className="text-sm text-ink-muted">E-mail</p>
              <p className="mt-1 text-lg font-bold text-ink break-all">{SITE.email}</p>
            </a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="card block hover:border-brand">
              <p className="text-sm text-ink-muted">Instagram</p>
              <p className="mt-1 text-lg font-bold text-ink">@_rcky_digital</p>
            </a>
            <div className="card">
              <p className="text-sm text-ink-muted">Zone d’intervention</p>
              <p className="mt-1 text-lg font-bold text-ink">Toute la Guadeloupe, et à distance</p>
            </div>
          </div>

          <div className="card p-6 md:p-10">
            <h2 className="text-2xl font-bold text-ink">Envoyer un message</h2>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8F1F22]">
                {error === 'config'
                  ? 'Le formulaire est momentanément indisponible. Écrivez-nous directement à ' + SITE.email + '.'
                  : 'Le message n’a pas pu être envoyé. Vérifiez les champs obligatoires et réessayez.'}
              </p>
            )}

            <form action="/api/contact" method="POST" className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">Nom *</label>
                <input id="name" type="text" name="name" required autoComplete="name" className={inputClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="business" className="mb-2 block text-sm font-medium text-ink">Entreprise</label>
                <input id="business" type="text" name="business" autoComplete="organization" className={inputClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">E-mail *</label>
                <input id="email" type="email" name="email" required autoComplete="email" className={inputClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">Téléphone</label>
                <input id="phone" type="tel" name="phone" autoComplete="tel" placeholder="0690 00 00 00" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="service" className="mb-2 block text-sm font-medium text-ink">Service souhaité</label>
                <select id="service" name="service" defaultValue={preselected} className={inputClass}>
                  <option value="">Je ne sais pas encore</option>
                  {options.map((o) => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">Votre projet *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Votre activité, ce que vous aimeriez améliorer, vos délais…"
                  className={`${inputClass} resize-y`}
                />
              </div>
              <input type="hidden" name="page" value="/contact" />
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Ne pas remplir</label>
                <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <input id="rgpd" type="checkbox" name="rgpd" value="oui" required className="mt-1 h-4 w-4 accent-[#B4511A]" />
                <label htmlFor="rgpd" className="text-sm text-ink-soft">
                  J’accepte que mes données soient utilisées pour répondre à ma demande, conformément à la{' '}
                  <a href="/politique-confidentialite" className="font-medium text-brand-deep underline">
                    politique de confidentialité
                  </a>
                  . *
                </label>
              </div>
              <button type="submit" className="btn-primary py-4 text-base sm:col-span-2">
                Envoyer ma demande
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
