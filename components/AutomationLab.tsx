import Link from 'next/link'
import { SITE } from '@/lib/constants'

// Page « Automation Lab » (pôle automatisation de RCKY DIGITAL), en français et en anglais.
// Règles : aucun prix affiché avant le pilote, aucun témoignage ni chiffre inventé.

type Lang = 'fr' | 'en'

const T = {
  fr: {
    badge: 'Automation Lab · par RCKY DIGITAL',
    h1a: 'Vos demandes clients traitées ',
    h1b: 'pendant que vous travaillez.',
    lead: "Nous construisons avec l'IA Claude des automatisations sur mesure pour les agences et les cabinets de conseil : chaque demande est lue, triée, enregistrée et suivie, sans saisie et sans prospect oublié.",
    cta: 'Réserver un audit gratuit de 15 min',
    cta2: 'Voir comment ça marche',
    note: 'En visio · Sans engagement · Réponse sous 48 h',
    flowTitle: 'LeadFlow : de la demande au rendez-vous, sans saisie',
    flowSub: 'Notre premier système, installé dans vos outils actuels.',
    steps: [
      ['Un prospect vous écrit', 'Formulaire du site, e-mail ou demande de devis : tout arrive au même endroit.'],
      ["L'IA lit et trie la demande", 'Besoin, urgence, budget annoncé : la demande est classée en quelques secondes.'],
      ['La fiche se crée dans votre CRM', 'Coordonnées et résumé enregistrés automatiquement (HubSpot, Airtable ou votre outil).'],
      ['Une réponse personnalisée est prête', "Vous la relisez et l'envoyez, ou elle part seule pour les demandes simples, selon vos règles."],
      ['Relance et rendez-vous', "Sans réponse, une relance est programmée ; le prospect choisit un créneau dans votre agenda."],
    ],
    proofTitle: 'Nous l’utilisons nous-mêmes, chaque nuit',
    proof: "RCKY DIGITAL fonctionne déjà avec une équipe d'agents IA qui travaillent pendant la nuit : recherche et vérification de prospects, veille, suivi des comptes, préparation des contenus. Chaque matin, un briefing résume le travail fait et ce qui reste à valider. C'est ce savoir-faire que nous installons chez vous.",
    rulesTitle: 'Vous gardez la main',
    rules: [
      ['Validation humaine', 'Rien de sensible ne part sans votre accord : devis, prix, décisions.'],
      ['Vos comptes, vos accès', "Les outils restent à votre nom ; vous pouvez couper un accès à tout moment."],
      ['Transparence', "Vos clients savent qu'ils échangent avec un assistant IA quand c'est le cas."],
    ],
    offersTitle: 'Deux façons de commencer',
    offers: [
      ['LeadFlow', "L'automatisation complète de vos demandes entrantes : tri, CRM, réponses, relances, rendez-vous."],
      ['Claude installé chez vous', "Votre propre assistant Claude réglé pour votre métier : consignes, connexions à Gmail, Agenda ou Drive, tâches programmées."],
    ],
    endTitle: 'Combien de demandes vous échappent chaque mois ?',
    endText: "En 15 minutes, nous regardons ensemble comment vous traitez vos demandes aujourd'hui et ce qu'on peut automatiser. Vous repartez avec 2 ou 3 idées concrètes, même si vous ne travaillez pas avec nous.",
    mailSubject: 'Audit Automation Lab (15 min)',
    mailBody: "Bonjour Ricky, je souhaite un audit gratuit de 15 min. Mon entreprise : ",
    built: 'Construit avec Claude (Anthropic). Basés en Guadeloupe, nous travaillons 100 % à distance.',
    other: 'English version',
    otherHref: '/en/automation-lab',
  },
  en: {
    badge: 'Automation Lab · by RCKY DIGITAL',
    h1a: 'Every client request handled ',
    h1b: 'while you get on with the work.',
    lead: 'We build custom automations with Claude AI for marketing agencies and consulting firms: every inbound request is read, sorted, logged and followed up, with no manual data entry and no lead left behind.',
    cta: 'Book a free 15-min audit',
    cta2: 'See how it works',
    note: 'Video call · No commitment · Reply within 48 h',
    flowTitle: 'LeadFlow: from first message to booked call, hands-free',
    flowSub: 'Our first system, set up inside the tools you already use.',
    steps: [
      ['A prospect gets in touch', 'Website form, email or quote request: everything lands in one place.'],
      ['AI reads and qualifies it', 'Need, urgency, stated budget: the request is sorted in seconds.'],
      ['The record is created in your CRM', 'Contact details and a summary are saved automatically (HubSpot, Airtable or your own tool).'],
      ['A tailored reply is ready', 'You review and send it, or simple requests go out on their own, following your rules.'],
      ['Follow-up and booking', 'No answer? A follow-up is scheduled; the prospect picks a slot in your calendar.'],
    ],
    proofTitle: 'We run on it ourselves, every night',
    proof: 'RCKY DIGITAL already runs with a team of AI agents working overnight: finding and checking prospects, market research, bookkeeping checks, content drafts. Every morning a briefing sums up what was done and what needs approval. That is the know-how we bring to your business.',
    rulesTitle: 'You stay in control',
    rules: [
      ['Human approval', 'Nothing sensitive goes out without your sign-off: quotes, prices, decisions.'],
      ['Your accounts, your access', 'Tools stay in your name; you can revoke access at any time.'],
      ['Transparency', 'Your customers know when they are talking to an AI assistant.'],
    ],
    offersTitle: 'Two ways to start',
    offers: [
      ['LeadFlow', 'Full automation of your inbound requests: qualification, CRM, replies, follow-ups, bookings.'],
      ['Claude, set up for you', 'Your own Claude assistant configured for your business: instructions, Gmail, Calendar or Drive connections, scheduled tasks.'],
    ],
    endTitle: 'How many requests slip through each month?',
    endText: 'In 15 minutes we look at how you handle requests today and what can be automated. You leave with 2 or 3 concrete ideas, whether or not you work with us.',
    mailSubject: 'Automation Lab audit (15 min)',
    mailBody: "Hi Ricky, I'd like a free 15-min audit. My company: ",
    built: 'Built with Claude (Anthropic). Based in Guadeloupe (French Caribbean), working 100% remotely.',
    other: 'Version française',
    otherHref: '/automation-lab',
  },
} as const

export default function AutomationLab({ lang }: { lang: Lang }) {
  const t = T[lang]
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(t.mailBody)}`
  const book = SITE.calendly || mail

  return (
    <div lang={lang}>
      <section className="bg-sand pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="container-site max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-4 py-1.5 text-sm font-semibold text-teal-deep">
              <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
              {t.badge}
            </span>
            <Link href={t.otherHref} className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline">
              {t.other}
            </Link>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
            {t.h1a}
            <span className="text-brand-deep">{t.h1b}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{t.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={book} data-track="Automation Lab : audit (haut)" className="btn-primary px-7 py-4 text-base">
              {t.cta}
            </a>
            <a href="#leadflow" className="btn-outline px-7 py-4 text-base">
              {t.cta2}
            </a>
          </div>
          <p className="mt-4 text-sm text-ink-muted">{t.note}</p>
        </div>
      </section>

      <section id="leadflow" className="scroll-mt-24 py-14 md:py-20">
        <div className="container-site max-w-4xl">
          <h2 className="section-title">{t.flowTitle}</h2>
          <p className="section-subtitle">{t.flowSub}</p>
          <ol className="mt-10 grid gap-4">
            {t.steps.map(([title, text], i) => (
              <li key={title} className="card flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-soft text-lg font-bold text-teal-deep">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-teal-soft/40 py-14 md:py-20">
        <div className="container-site grid max-w-5xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="section-title">{t.proofTitle}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t.proof}</p>
          </div>
          <div>
            <h2 className="section-title">{t.rulesTitle}</h2>
            <ul className="mt-4 grid gap-3">
              {t.rules.map(([title, text]) => (
                <li key={title} className="rounded-2xl bg-white p-4">
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-ink-soft">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site max-w-4xl">
          <h2 className="section-title">{t.offersTitle}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {t.offers.map(([title, text]) => (
              <div key={title} className="card">
                <h3 className="text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-14 text-white md:py-20">
        <div className="container-site max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.endTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{t.endText}</p>
          <a href={book} data-track="Automation Lab : audit (bas)" className="btn-primary mt-8 px-7 py-4 text-base">
            {t.cta}
          </a>
          <p className="mt-6 text-sm text-white/60">{t.built}</p>
        </div>
      </section>
    </div>
  )
}
