import Link from 'next/link'
import { Check, Faq, IconTile } from '@/components/ui'
import { LAB_FAQ } from '@/components/AutomationLab'
import { FOUNDER, PILOT, PLANS, eur, r, type Lang } from '@/lib/i18n'

const T = {
  fr: {
    kicker: 'Tarifs',
    h1: 'Des prix affichés, du pilote à l’abonnement',
    lead: 'On commence par un pilote de 10 jours sur vos vrais cas. S’il atteint les objectifs fixés ensemble, on installe la formule de votre choix. Prix nets : TVA non applicable (art. 293 B du CGI).',
    pilotKicker: 'Étape 1',
    pilotTitle: `Pilote ${PILOT.days} jours`,
    pilotSub: 'Testez l’automatisation sur vos propres demandes avant de vous engager.',
    pilotItems: ['Appel de cadrage de 30 min et objectifs chiffrés écrits', 'Prototype construit sur 30 à 50 de vos vrais cas', 'Score mesuré et rapport clair', 'Restitution en visio et devis d’installation', 'Prix déduit de l’installation si vous continuez'],
    pilotGuarantee: 'Objectifs non atteints ? Le pilote est remboursé.',
    pilotCta: 'Réserver l’appel de cadrage',
    stepPlans: 'Étape 2 : la formule qui vous convient',
    setup: 'Installation',
    month: '/ mois',
    popular: 'Le plus choisi',
    choose: 'Choisir',
    founderTitle: `Offre Client fondateur : −${FOUNDER.discount} % sur l’installation`,
    founderText: `Réservée aux ${FOUNDER.seats} premières agences ou cabinets. En échange : une étude de cas publiée et un témoignage, une fois les résultats mesurés.`,
    founderCta: 'Demander une place',
    notes: ['Abonnement sans engagement après 3 mois, préavis d’un mois.', 'L’usage de l’IA est réglé par vous auprès d’Anthropic (en général quelques euros par mois).', 'Besoin différent ? Nous établissons un devis sur mesure.'],
    quote: 'Demander un devis',
    faq: 'Questions fréquentes',
  },
  en: {
    kicker: 'Pricing',
    h1: 'Published prices, from pilot to subscription',
    lead: 'We start with a 10-day pilot on your real cases. If it meets the goals we set together, we set up the plan of your choice. Prices in euros; VAT not applicable (French micro-business, art. 293 B CGI).',
    pilotKicker: 'Step 1',
    pilotTitle: `${PILOT.days}-day pilot`,
    pilotSub: 'Test the automation on your own requests before committing.',
    pilotItems: ['30-min scoping call and written, measurable goals', 'Prototype built on 30 to 50 of your real cases', 'Measured score and a clear report', 'Video wrap-up and setup quote', 'Price deducted from setup if you continue'],
    pilotGuarantee: 'Goals not met? The pilot is refunded.',
    pilotCta: 'Book the scoping call',
    stepPlans: 'Step 2: the plan that fits you',
    setup: 'Setup',
    month: '/ month',
    popular: 'Most popular',
    choose: 'Choose',
    founderTitle: `Founding client offer: ${FOUNDER.discount}% off setup`,
    founderText: `For the first ${FOUNDER.seats} agencies or consultancies. In return: a published case study and a testimonial, once results are measured.`,
    founderCta: 'Ask for a spot',
    notes: ['No commitment after 3 months, one month’s notice.', 'AI usage is billed to you directly by Anthropic (usually a few euros a month).', 'Different needs? We prepare a custom quote.'],
    quote: 'Request a quote',
    faq: 'Frequently asked questions',
  },
}

export default function PricingPage({ lang }: { lang: Lang }) {
  const t = T[lang]
  const colon = lang === 'fr' ? ' : ' : ': '
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

      {/* ÉTAPE 1 : PILOTE */}
      <section id="pilote" className="scroll-mt-24 pb-12 pt-6">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white md:p-10">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">{t.pilotKicker}</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">{t.pilotTitle}</h2>
                <p className="mt-2 text-white/75">{t.pilotSub}</p>
                <p className="mt-6 text-5xl font-extrabold tracking-tight">{eur(PILOT.price, lang)}</p>
                <p className="mt-2 font-semibold text-[#7fd3e2]">{t.pilotGuarantee}</p>
                <Link href={r('book', lang)} data-track="Tarifs : pilote" className="btn-primary mt-7">{t.pilotCta} →</Link>
              </div>
              <ul className="space-y-3">
                {t.pilotItems.map((it, i) => (
                  <li key={it} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F2A65A] text-xs font-bold text-ink">{i + 1}</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTAPE 2 : FORMULES */}
      <section className="pb-12">
        <div className="container-site">
          <h2 className="mb-8 text-center text-2xl font-bold text-ink md:text-3xl">{t.stepPlans}</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.id} className={`card relative flex flex-col p-7 ${p.popular ? 'border-2 border-brand-deep shadow-[0_30px_60px_-30px_rgba(180,81,26,0.45)] lg:-translate-y-3' : ''}`}>
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-deep px-4 py-1 text-xs font-semibold text-white">{t.popular}</span>
                )}
                <h3 className="text-xl font-bold text-ink">{p.name[lang]}</h3>
                <p className="mt-1 text-sm text-ink-muted">{p.tagline[lang]}</p>
                <p className="mt-6">
                  <span className="text-4xl font-extrabold tracking-tight text-ink">{eur(p.monthly, lang)}</span>
                  <span className="text-ink-muted"> {t.month}</span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {t.setup}{colon}<strong className="text-ink">{eur(p.setup, lang)}</strong>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features[lang].map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-ink"><Check />{f}</li>
                  ))}
                </ul>
                <Link href={`${r('book', lang)}?plan=${p.id}`} data-track={`Tarifs : ${p.id}`} className={`${p.popular ? 'btn-primary' : 'btn-outline'} mt-8 w-full`}>
                  {t.choose} {p.name[lang]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT FONDATEUR */}
      <section className="pb-16">
        <div className="container-site">
          <div className="flex flex-col items-start gap-5 rounded-3xl border border-teal/30 bg-teal-soft p-6 md:flex-row md:items-center md:p-8">
            <IconTile name="hand" tone="teal" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-ink">{t.founderTitle}</h2>
              <p className="mt-1 text-ink-soft">{t.founderText}</p>
            </div>
            <Link href={`${r('quote', lang)}?service=lab-fondateur`} className="btn-primary shrink-0">{t.founderCta} →</Link>
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
