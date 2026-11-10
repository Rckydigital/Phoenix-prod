import Link from 'next/link'
import LeadFlowDemo from '@/components/LeadFlowDemo'
import { r, type Lang } from '@/lib/i18n'

const T = {
  fr: { kicker: 'Démo interactive', h1: 'Voyez LeadFlow traiter une demande, étape par étape', lead: 'Un prospect remplit le formulaire de votre site : en quelques secondes, la demande est analysée, enregistrée, une réponse est prête et un rendez-vous est proposé.', after: 'Envie de la même chose dans vos outils ?', cta: 'Essai gratuit 14 jours', quote: 'Demander un devis' },
  en: { kicker: 'Interactive demo', h1: 'Watch LeadFlow handle a request, step by step', lead: 'A prospect fills in your website form: within seconds the request is analysed, logged, a reply is ready and a meeting is offered.', after: 'Want the same inside your tools?', cta: 'Start a 14-day free trial', quote: 'Request a quote' },
}

export default function DemoPage({ lang }: { lang: Lang }) {
  const t = T[lang]
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
        <div className="container-site">
          <LeadFlowDemo lang={lang} />
          <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-sand p-8 text-center">
            <p className="text-xl font-bold text-ink">{t.after}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={r('signup', lang)} className="btn-primary">{t.cta}</Link>
              <Link href={r('quote', lang)} className="btn-outline">{t.quote}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
