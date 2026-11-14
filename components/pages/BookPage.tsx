import CalendlyEmbed from '@/components/CalendlyEmbed'
import { Check, IconTile } from '@/components/ui'
import type { Lang } from '@/lib/i18n'

const T = {
  site: {
    kicker: 'Appel découverte gratuit',
    h1: 'Réservez votre appel de 15 minutes',
    lead: 'Par téléphone ou WhatsApp, au créneau qui vous arrange. On parle de votre activité, de vos clients et du site qu’il vous faut pour être trouvé sur Google et recommandé par les IA comme ChatGPT. Sans engagement.',
    steps: [['chat', 'Appel de 15 min', 'Vous présentez votre activité, vos clients et ce que vous attendez de votre site.'], ['bolt', 'Audit offert', 'Je regarde gratuitement si Google et les IA vous trouvent aujourd’hui, et qui ils citent à votre place.'], ['doc', 'Proposition sous 48 h', 'Un devis clair pour un site sur mesure, amélioré grâce à l’IA : livré plus vite, à moindre coût.']],
    tz: 'Les créneaux s’affichent dans votre fuseau horaire. Je suis basé en Guadeloupe (UTC−4).',
    prep: 'Pour gagner du temps',
    prepItems: ['Votre site actuel, votre fiche Google ou votre Instagram', '2 ou 3 sites que vous aimez', 'Ce que le site doit faire : présenter, prendre des rendez-vous, vendre…'],
  },
  fr: {
    kicker: 'Appel découverte gratuit',
    h1: 'Réservez votre appel de 15 minutes',
    lead: 'Par téléphone ou WhatsApp, au créneau qui vous arrange. On regarde comment vous traitez vos demandes aujourd’hui et ce qui pourrait être automatisé. Sans engagement.',
    steps: [['chat', 'Appel de 15 min', 'Vous expliquez votre activité et ce qui vous prend du temps.'], ['bolt', 'Démo en visio si utile', 'Si c’est pertinent, je vous montre LeadFlow appliqué à votre cas (30 min).'], ['doc', 'Proposition sous 48 h', 'Un devis clair, ou un conseil honnête si l’automatisation n’est pas utile pour vous.']],
    tz: 'Les créneaux s’affichent dans votre fuseau horaire. Je suis basé en Guadeloupe (UTC−4).',
    prep: 'Pour gagner du temps',
    prepItems: ['Les outils que vous utilisez (e-mail, CRM, agenda…)', 'Le nombre de demandes reçues par mois', 'La tâche que vous aimeriez ne plus faire'],
  },
  en: {
    kicker: 'Free discovery call',
    h1: 'Book your 15-minute call',
    lead: 'By phone or WhatsApp, at a time that suits you. We look at how you handle requests today and what could be automated. No commitment.',
    steps: [['chat', '15-min call', 'You tell me about your business and what takes your time.'], ['bolt', 'Video demo if useful', 'If relevant, I show you LeadFlow applied to your case (30 min).'], ['doc', 'Proposal within 48 h', 'A clear quote, or honest advice if automation is not worth it for you.']],
    tz: 'Slots are shown in your own time zone. I am based in Guadeloupe (UTC−4).',
    prep: 'To make the most of it',
    prepItems: ['The tools you use (email, CRM, calendar…)', 'How many requests you get per month', 'The task you would love to stop doing'],
  },
}

export type BookTopic = 'site' | 'automatisation'

const TABS: [BookTopic, string][] = [['site', 'Création de site internet'], ['automatisation', 'Automatisation IA']]

export default function BookPage({ lang, topic = 'site' }: { lang: Lang; topic?: BookTopic }) {
  const t = lang === 'fr' && topic === 'site' ? T.site : T[lang]
  return (
    <div lang={lang}>
      <section className="bg-hero relative overflow-hidden pb-10 pt-28 md:pt-36">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="container-site relative max-w-3xl">
          {lang === 'fr' && (
            <div role="tablist" aria-label="Sujet de l’appel" className="mb-6 flex w-fit rounded-full border border-line bg-white p-1 text-sm font-semibold">
              {TABS.map(([id, label]) => (
                <a
                  key={id}
                  role="tab"
                  aria-selected={topic === id}
                  href={`/rendez-vous?sujet=${id}`}
                  className={`rounded-full px-4 py-2 transition ${topic === id ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'}`}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
          <span className="kicker">{t.kicker}</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{t.h1}</h1>
          <p className="mt-5 text-lg text-ink-soft">{t.lead}</p>
        </div>
      </section>
      <section className="pb-16 pt-6 md:pb-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <aside className="space-y-4">
            {t.steps.map(([icon, title, text], i) => (
              <div key={title} className="card flex gap-4">
                <IconTile name={icon} tone={i === 1 ? 'teal' : 'brand'} />
                <div><p className="font-semibold text-ink">{i + 1}. {title}</p><p className="mt-1 text-sm text-ink-soft">{text}</p></div>
              </div>
            ))}
            <div className="rounded-2xl bg-sand p-5">
              <p className="font-semibold text-ink">{t.prep}</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">{t.prepItems.map((x) => <li key={x} className="flex gap-2"><Check />{x}</li>)}</ul>
            </div>
            <p className="text-sm text-ink-muted">{t.tz}</p>
          </aside>
          <CalendlyEmbed lang={lang} />
        </div>
      </section>
    </div>
  )
}
