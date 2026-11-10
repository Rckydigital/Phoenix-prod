import Link from 'next/link'
import { Check, Faq, IconTile } from '@/components/ui'
import { LAB_FAQ } from '@/components/AutomationLab'
import { PLANS, eur, r, type Lang } from '@/lib/i18n'

const T = {
  fr: {
    kicker: 'Tarifs',
    h1: 'Une tarification claire, pour une croissance sereine',
    lead: 'Une installation unique, puis un abonnement mensuel pour l’hébergement, le suivi et les ajustements. Prix de lancement, nets : TVA non applicable (art. 293 B du CGI).',
    setup: 'Installation',
    month: '/ mois',
    then: 'puis',
    popular: 'Le plus choisi',
    choose: 'Choisir',
    trialTitle: 'Essai gratuit de 14 jours',
    trialText: 'Votre espace client, la démo LeadFlow, un audit de 15 min en visio et une proposition sur mesure. Sans carte bancaire.',
    trialCta: 'Commencer l’essai',
    notes: ['Abonnement sans engagement après 3 mois, préavis d’un mois.', 'L’usage de l’IA est réglé par vous auprès d’Anthropic (en général quelques euros par mois).', 'Besoin différent ? Nous établissons un devis sur mesure.'],
    quote: 'Demander un devis',
    faq: 'Questions fréquentes',
  },
  en: {
    kicker: 'Pricing',
    h1: 'Clear pricing for steady growth',
    lead: 'A one-off setup fee, then a monthly plan for hosting, monitoring and adjustments. Launch prices in euros; VAT not applicable (French micro-business, art. 293 B CGI).',
    setup: 'Setup',
    month: '/ month',
    then: 'then',
    popular: 'Most popular',
    choose: 'Choose',
    trialTitle: '14-day free trial',
    trialText: 'Your client area, the LeadFlow demo, a 15-min video audit and a tailored proposal. No credit card needed.',
    trialCta: 'Start the trial',
    notes: ['No commitment after 3 months, one month’s notice.', 'AI usage is billed to you directly by Anthropic (usually a few euros a month).', 'Different needs? We prepare a custom quote.'],
    quote: 'Request a quote',
    faq: 'Frequently asked questions',
  },
}

export default function PricingPage({ lang }: { lang: Lang }) {
  const t = T[lang]
  return (
    <div lang={lang}>
      <section className="bg-hero relative overflow-hidden pb-10 pt-28 md:pt-36">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="container-site relative max-w-3xl text-center">
          <span className="kicker">{t.kicker}</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{t.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">{t.lead}</p>
        </div>
      </section>

      <section className="pb-12 pt-6">
        <div className="container-site grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.id} className={`card relative flex flex-col p-7 ${p.popular ? 'border-2 border-brand-deep shadow-[0_30px_60px_-30px_rgba(180,81,26,0.45)] lg:-translate-y-3' : ''}`}>
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-deep px-4 py-1 text-xs font-semibold text-white">{t.popular}</span>
              )}
              <h2 className="text-xl font-bold text-ink">{p.name[lang]}</h2>
              <p className="mt-1 text-sm text-ink-muted">{p.tagline[lang]}</p>
              <p className="mt-6">
                <span className="text-4xl font-extrabold tracking-tight text-ink">{eur(p.monthly, lang)}</span>
                <span className="text-ink-muted"> {t.month}</span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {t.setup}{lang === 'fr' ? ' : ' : ': '}<strong className="text-ink">{eur(p.setup, lang)}</strong>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features[lang].map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-ink"><Check />{f}</li>
                ))}
              </ul>
              <Link
                href={`${r('signup', lang)}?plan=${p.id}`}
                data-track={`Tarifs : ${p.id}`}
                className={`${p.popular ? 'btn-primary' : 'btn-outline'} mt-8 w-full`}
              >
                {t.choose} {p.name[lang]}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site">
          <div className="flex flex-col items-start gap-5 rounded-3xl border border-teal/30 bg-teal-soft p-6 md:flex-row md:items-center md:p-8">
            <IconTile name="bolt" tone="teal" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-ink">{t.trialTitle}</h2>
              <p className="mt-1 text-ink-soft">{t.trialText}</p>
            </div>
            <Link href={r('signup', lang)} className="btn-primary shrink-0">{t.trialCta} →</Link>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-ink-soft md:grid-cols-3">
            {t.notes.map((n) => (
              <li key={n} className="flex gap-2"><Check className="h-5 w-5 text-ink-muted" />{n}</li>
            ))}
          </ul>
          <p className="mt-6 text-center">
            <Link href={r('quote', lang)} className="font-semibold text-brand-deep hover:underline">{t.quote} →</Link>
          </p>
        </div>
      </section>

      <section className="bg-sand py-16 md:py-20">
        <div className="container-site max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold text-ink">{t.faq}</h2>
          <Faq items={LAB_FAQ[lang]} />
        </div>
      </section>
    </div>
  )
}
