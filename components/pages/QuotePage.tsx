import Link from 'next/link'
import { SITE, SERVICES, LAB_SERVICES } from '@/lib/constants'
import { Check, IconTile } from '@/components/ui'
import { r, type Lang } from '@/lib/i18n'

const T = {
  fr: {
    kicker: 'Devis gratuit',
    h1: 'Demandez votre devis',
    lead: 'Décrivez votre besoin en 2 minutes. Vous recevez une réponse sous 48 h, avec une proposition claire ou une question précise.',
    side: [['clock', 'Réponse sous 48 h', 'Par e-mail, avec un premier avis sur votre besoin.'], ['user', 'Un seul interlocuteur', 'Ricky GALIN, fondateur de RCKY DIGITAL.'], ['shield', 'Sans engagement', 'Le devis est gratuit, vous décidez ensuite.']],
    name: 'Nom *', business: 'Entreprise', email: 'E-mail professionnel *', phone: 'Téléphone', site: 'Site web', need: 'Votre besoin', needEmpty: 'Je ne sais pas encore',
    groupLab: 'Automation Lab (automatisation IA)', groupLocal: 'Visibilité locale (Guadeloupe)',
    tools: 'Outils que vous utilisez', toolsPh: 'Ex. Gmail, HubSpot, Notion, formulaire WordPress…',
    volume: 'Demandes reçues par mois', volumes: ['Moins de 20', '20 à 100', '100 à 500', 'Plus de 500', 'Je ne sais pas'],
    budget: 'Budget envisagé', budgets: ['Moins de 1 000 €', '1 000 à 3 000 €', '3 000 à 6 000 €', 'Plus de 6 000 €', 'À définir'],
    message: 'Votre projet *', messagePh: 'Ce qui vous prend du temps aujourd’hui, ce que vous aimeriez automatiser, vos délais…',
    rgpd1: 'J’accepte que mes données soient utilisées pour répondre à ma demande, conformément à la', rgpd2: 'politique de confidentialité',
    send: 'Envoyer ma demande de devis',
    err: 'La demande n’a pas pu être envoyée. Vérifiez les champs obligatoires et réessayez.',
    errConfig: 'Le formulaire est momentanément indisponible. Écrivez-nous à ',
    alt: 'Vous préférez en parler ?', altCta: 'Réserver un appel de 15 min',
  },
  en: {
    kicker: 'Free quote',
    h1: 'Request your quote',
    lead: 'Describe what you need in 2 minutes. You get a reply within 48 hours, with a clear proposal or a precise question.',
    side: [['clock', 'Reply within 48 h', 'By email, with a first opinion on your needs.'], ['user', 'One point of contact', 'Ricky GALIN, founder of RCKY DIGITAL.'], ['shield', 'No commitment', 'The quote is free, you decide afterwards.']],
    name: 'Name *', business: 'Company', email: 'Work email *', phone: 'Phone', site: 'Website', need: 'What you need', needEmpty: 'Not sure yet',
    groupLab: 'Automation Lab (AI automation)', groupLocal: 'Local visibility (Guadeloupe)',
    tools: 'Tools you use', toolsPh: 'E.g. Gmail, HubSpot, Notion, WordPress form…',
    volume: 'Requests per month', volumes: ['Under 20', '20 to 100', '100 to 500', 'Over 500', 'Not sure'],
    budget: 'Budget', budgets: ['Under €1,000', '€1,000 to €3,000', '€3,000 to €6,000', 'Over €6,000', 'To be defined'],
    message: 'Your project *', messagePh: 'What takes your time today, what you would like to automate, your timeline…',
    rgpd1: 'I agree that my data will be used to answer my request, as described in the', rgpd2: 'privacy policy (French)',
    send: 'Send my quote request',
    err: 'Your request could not be sent. Please check the required fields and try again.',
    errConfig: 'The form is temporarily unavailable. Email us at ',
    alt: 'Prefer to talk first?', altCta: 'Book a 15-min call',
  },
}

export default function QuotePage({ lang, error, preset }: { lang: Lang; error?: string; preset?: string }) {
  const t = T[lang]
  const all = [...LAB_SERVICES, ...SERVICES]
  const selected = all.some((s) => s.id === preset) ? preset : ''
  return (
    <div lang={lang}>
      <section className="bg-hero relative overflow-hidden pb-10 pt-28 md:pt-36">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="container-site relative max-w-3xl">
          <span className="kicker">{t.kicker}</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{t.h1}</h1>
          <p className="mt-5 text-lg text-ink-soft">{t.lead}</p>
        </div>
      </section>

      <section className="pb-16 pt-6 md:pb-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div id={lang === 'fr' ? 'formulaire' : 'form'} className="card scroll-mt-28 p-6 md:p-10">
            {error && (
              <p role="alert" className="mb-6 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8F1F22]">
                {error === 'config' ? t.errConfig + SITE.email + '.' : t.err}
              </p>
            )}
            <form action="/api/contact" method="POST" className="grid gap-5 sm:grid-cols-2">
              <div><label className="label" htmlFor="q-name">{t.name}</label><input id="q-name" name="name" required autoComplete="name" className="field" /></div>
              <div><label className="label" htmlFor="q-business">{t.business}</label><input id="q-business" name="business" autoComplete="organization" className="field" /></div>
              <div><label className="label" htmlFor="q-email">{t.email}</label><input id="q-email" type="email" name="email" required autoComplete="email" className="field" /></div>
              <div><label className="label" htmlFor="q-phone">{t.phone}</label><input id="q-phone" type="tel" name="phone" autoComplete="tel" className="field" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="q-site">{t.site}</label><input id="q-site" name="site" type="url" placeholder="https://" className="field" /></div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="q-service">{t.need}</label>
                <select id="q-service" name="service" defaultValue={selected} className="field">
                  <option value="">{t.needEmpty}</option>
                  <optgroup label={t.groupLab}>{LAB_SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title.replace('Automation Lab · ', '')}</option>)}</optgroup>
                  {lang === 'fr' && <optgroup label={t.groupLocal}>{SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</optgroup>}
                </select>
              </div>
              <div className="sm:col-span-2"><label className="label" htmlFor="q-tools">{t.tools}</label><input id="q-tools" name="tools" placeholder={t.toolsPh} className="field" /></div>
              <div>
                <label className="label" htmlFor="q-volume">{t.volume}</label>
                <select id="q-volume" name="volume" defaultValue="" className="field"><option value="">—</option>{t.volumes.map((v) => <option key={v}>{v}</option>)}</select>
              </div>
              <div>
                <label className="label" htmlFor="q-budget">{t.budget}</label>
                <select id="q-budget" name="budget" defaultValue="" className="field"><option value="">—</option>{t.budgets.map((v) => <option key={v}>{v}</option>)}</select>
              </div>
              <div className="sm:col-span-2"><label className="label" htmlFor="q-message">{t.message}</label><textarea id="q-message" name="message" required rows={5} placeholder={t.messagePh} className="field resize-y" /></div>
              <input type="hidden" name="page" value={r('quote', lang)} />
              <input type="hidden" name="lang" value={lang} />
              <div className="hidden" aria-hidden="true"><label htmlFor="q-website">Ne pas remplir</label><input id="q-website" type="text" name="website" tabIndex={-1} autoComplete="off" /></div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <input id="q-rgpd" type="checkbox" name="rgpd" value="oui" required className="mt-1 h-4 w-4 accent-[#B4511A]" />
                <label htmlFor="q-rgpd" className="text-sm text-ink-soft">{t.rgpd1} <a href="/politique-confidentialite" className="font-medium text-brand-deep underline">{t.rgpd2}</a>. *</label>
              </div>
              <button type="submit" className="btn-primary py-4 text-base sm:col-span-2">{t.send}</button>
            </form>
          </div>

          <aside className="space-y-4">
            {t.side.map(([icon, title, text]) => (
              <div key={title} className="card flex gap-4">
                <IconTile name={icon} tone="teal" />
                <div><p className="font-semibold text-ink">{title}</p><p className="mt-1 text-sm text-ink-soft">{text}</p></div>
              </div>
            ))}
            <div className="rounded-2xl bg-ink p-6 text-white">
              <p className="font-semibold">{t.alt}</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li className="flex gap-2"><Check className="h-5 w-5 text-[#7fd3e2]" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
                <li className="flex gap-2"><Check className="h-5 w-5 text-[#7fd3e2]" /><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-white">{SITE.phone}</a></li>
              </ul>
              <Link href={r('book', lang)} className="btn-primary mt-5 w-full">{t.altCta}</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
