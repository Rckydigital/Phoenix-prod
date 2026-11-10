import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { Check, CtaBand, Faq, FlowVisual, IconTile, SectionHead } from '@/components/ui'
import { r, type Lang } from '@/lib/i18n'

// Page « Automation Lab » (pôle automatisation de RCKY DIGITAL), en français et en anglais.
// Règle : aucun témoignage, client ou chiffre inventé.

export const LAB_FAQ = {
  fr: [
    { q: 'Comment fonctionne une automatisation Automation Lab ?', a: 'Nous relions vos outils existants (formulaire du site, boîte e-mail, CRM, agenda) et nous ajoutons l’IA Claude pour lire, trier et préparer les réponses. Vous suivez tout dans votre espace client.' },
    { q: 'Quels outils pouvez-vous connecter ?', a: 'Les plus courants : Gmail ou Outlook, Google Agenda, HubSpot, Airtable, Notion, les formulaires de site (WordPress, Webflow, Wix…). Pour un autre outil, nous vérifions pendant l’audit gratuit.' },
    { q: 'Qui paie l’usage de l’IA ?', a: 'Vous, directement auprès d’Anthropic, avec votre propre clé : en général quelques euros par mois pour une petite entreprise. C’est transparent et le compte reste à votre nom.' },
    { q: 'Mes données sont-elles en sécurité ?', a: 'Les accès restent à votre nom et vous pouvez les couper à tout moment. Nous ne gardons que ce qui est nécessaire, et un contrat de sous-traitance (RGPD) est signé avec chaque client.' },
    { q: 'Quel est le délai de mise en place ?', a: 'En général 1 à 3 semaines selon la formule et le nombre d’outils à connecter. Le délai exact figure sur votre devis.' },
    { q: 'Puis-je arrêter mon abonnement ?', a: 'Oui. L’abonnement mensuel est sans engagement après les 3 premiers mois, résiliable depuis votre espace client avec un préavis d’un mois.' },
    { q: 'Que comprend l’essai gratuit de 14 jours ?', a: 'Votre espace client, la démo LeadFlow, un audit de 15 minutes en visio et une proposition sur mesure. Sans carte bancaire et sans engagement.' },
  ],
  en: [
    { q: 'How does an Automation Lab automation work?', a: 'We connect the tools you already use (website form, inbox, CRM, calendar) and add Claude AI to read, qualify and draft replies. You track everything in your client area.' },
    { q: 'Which tools can you connect?', a: 'The most common ones: Gmail or Outlook, Google Calendar, HubSpot, Airtable, Notion, website forms (WordPress, Webflow, Wix…). For anything else we check during the free audit.' },
    { q: 'Who pays for the AI usage?', a: 'You do, directly to Anthropic with your own key: usually a few euros a month for a small business. It is transparent and the account stays in your name.' },
    { q: 'Is my data safe?', a: 'Access stays in your name and you can revoke it at any time. We keep only what is needed, and a data processing agreement (GDPR) is signed with every client.' },
    { q: 'How long does setup take?', a: 'Usually 1 to 3 weeks depending on the plan and the number of tools. The exact timeline is in your quote.' },
    { q: 'Can I cancel my subscription?', a: 'Yes. The monthly plan has no commitment after the first 3 months and can be cancelled from your client area with one month’s notice.' },
    { q: 'What does the 14-day free trial include?', a: 'Your client area, the LeadFlow demo, a 15-minute video audit and a tailored proposal. No credit card, no commitment.' },
  ],
}

const T = {
  fr: {
    kicker: 'Automation Lab · par RCKY DIGITAL',
    h1a: 'Automatisez vos demandes clients',
    h1b: 'avec l’IA.',
    lead: 'Pour les agences, les cabinets de conseil et les PME : chaque demande est lue, triée, enregistrée et suivie, sans saisie et sans prospect oublié. Construit avec Claude, installé dans vos outils, 100 % à distance.',
    cta1: 'Essai gratuit 14 jours',
    cta2: 'Voir la démo',
    solKicker: 'Nos solutions',
    solTitle: 'Trois systèmes prêts à installer chez vous',
    solSub: 'Chaque solution est adaptée à vos outils et à vos règles. Elles sont incluses dans nos formules.',
    sols: [
      { icon: 'inbox', name: 'LeadFlow', tag: 'Le plus demandé', text: 'Gère vos prospects de la première demande au rendez-vous.', items: ['Collecte des formulaires et e-mails', 'Tri par l’IA : besoin, urgence, budget', 'Fiche créée dans votre CRM', 'Réponse personnalisée préparée', 'Relances et prise de rendez-vous'] },
      { icon: 'doc', name: 'AdminFlow', tag: '', text: 'Allège votre gestion administrative.', items: ['Lecture des documents reçus', 'Extraction des informations utiles', 'Classement automatique', 'Préparation des devis', 'Validation humaine avant envoi'] },
      { icon: 'chat', name: 'SupportFlow', tag: '', text: 'Traite les demandes de vos clients plus vite.', items: ['Analyse des e-mails entrants', 'Catégorisation des demandes', 'Suggestions de réponses', 'Transfert à la bonne personne', 'Suivi des demandes en attente'] },
    ],
    included: 'Inclus dans les formules',
    seePricing: 'Voir les tarifs',
    howKicker: 'Méthode',
    howTitle: 'Simple pour vous, solide en coulisses',
    how: [['link', 'Connectez vos outils', 'Vous nous donnez les accès nécessaires, à votre nom, que vous pouvez couper à tout moment.'], ['bolt', 'Nous construisons', 'Nous configurons l’automatisation, l’IA et vos règles, puis nous testons avec vous.'], ['chart', 'Vous suivez les résultats', 'Demandes traitées, relances, rendez-vous : tout est visible dans votre espace client.']],
    ctrlKicker: 'Vous gardez la main',
    ctrlTitle: 'L’IA prépare, vous décidez',
    ctrl: [['hand', 'Validation humaine', 'Devis, prix, décisions : rien de sensible ne part sans votre accord.'], ['shield', 'Vos comptes, vos accès', 'Les outils et la clé IA restent à votre nom. Accès révocables à tout moment.'], ['user', 'Transparence', 'Vos clients savent quand ils échangent avec un assistant IA.']],
    faqTitle: 'Questions fréquentes',
    ctaTitle: 'Prêt à ne plus perdre une seule demande ?',
    ctaText: 'Créez votre espace : démo, audit gratuit de 15 min et proposition sur mesure.',
    quote: 'Demander un devis',
  },
  en: {
    kicker: 'Automation Lab · by RCKY DIGITAL',
    h1a: 'Automate your client requests',
    h1b: 'with AI.',
    lead: 'For marketing agencies, consulting firms and small businesses: every request is read, qualified, logged and followed up, with no manual entry and no lead left behind. Built with Claude, set up in your tools, 100% remote.',
    cta1: 'Start a 14-day free trial',
    cta2: 'See the demo',
    solKicker: 'Our solutions',
    solTitle: 'Three systems ready to set up for you',
    solSub: 'Each one is adapted to your tools and your rules. They are included in our plans.',
    sols: [
      { icon: 'inbox', name: 'LeadFlow', tag: 'Most requested', text: 'Handles your leads from first request to booked call.', items: ['Collects forms and emails', 'AI qualification: need, urgency, budget', 'Record created in your CRM', 'Tailored reply drafted', 'Follow-ups and booking'] },
      { icon: 'doc', name: 'AdminFlow', tag: '', text: 'Lightens your admin workload.', items: ['Reads incoming documents', 'Extracts the key information', 'Files everything automatically', 'Prepares quotes', 'Human approval before sending'] },
      { icon: 'chat', name: 'SupportFlow', tag: '', text: 'Handles customer requests faster.', items: ['Analyses incoming emails', 'Categorises requests', 'Suggests replies', 'Routes to the right person', 'Tracks pending requests'] },
    ],
    included: 'Included in our plans',
    seePricing: 'See pricing',
    howKicker: 'Method',
    howTitle: 'Simple for you, solid behind the scenes',
    how: [['link', 'Connect your tools', 'You grant the access we need, in your name, revocable at any time.'], ['bolt', 'We build', 'We configure the automation, the AI and your rules, then test it with you.'], ['chart', 'You track results', 'Requests handled, follow-ups, meetings: everything is visible in your client area.']],
    ctrlKicker: 'You stay in control',
    ctrlTitle: 'AI prepares, you decide',
    ctrl: [['hand', 'Human approval', 'Quotes, prices, decisions: nothing sensitive goes out without your sign-off.'], ['shield', 'Your accounts, your access', 'Tools and the AI key stay in your name. Access can be revoked at any time.'], ['user', 'Transparency', 'Your customers know when they are talking to an AI assistant.']],
    faqTitle: 'Frequently asked questions',
    ctaTitle: 'Ready to stop losing requests?',
    ctaText: 'Create your space: demo, free 15-min audit and a tailored proposal.',
    quote: 'Request a quote',
  },
}

export default function AutomationLab({ lang }: { lang: Lang }) {
  const t = T[lang]
  return (
    <div lang={lang}>
      <section className="bg-hero relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="kicker hero-in">{t.kicker}</span>
            <h1 style={{ '--d': '100ms' } as React.CSSProperties} className="hero-in mt-6 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl">
              {t.h1a} <span className="text-brand-deep">{t.h1b}</span>
            </h1>
            <p style={{ '--d': '200ms' } as React.CSSProperties} className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{t.lead}</p>
            <div style={{ '--d': '300ms' } as React.CSSProperties} className="hero-in mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={r('signup', lang)} data-track="Lab : essai" className="btn-primary px-7 py-4 text-base">{t.cta1}</Link>
              <Link href={r('demo', lang)} data-track="Lab : démo" className="btn-ghost px-7 py-4 text-base"><span aria-hidden="true">▶</span> {t.cta2}</Link>
            </div>
          </div>
          <div className="hero-in" style={{ '--d': '250ms' } as React.CSSProperties}>
            <FlowVisual lang={lang} />
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-site">
          <SectionHead kicker={t.solKicker} title={t.solTitle} sub={t.solSub} />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {t.sols.map((s, i) => (
              <Reveal key={s.name} delay={i * 90} className={`card lift flex flex-col ${i === 0 ? 'ring-2 ring-brand/40' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <IconTile name={s.icon} tone={i === 1 ? 'teal' : i === 2 ? 'plum' : 'brand'} />
                  {s.tag && <span className="rounded-full bg-brand-deep px-3 py-1 text-xs font-semibold text-white">{s.tag}</span>}
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink">{s.name}</h3>
                <p className="mt-2 text-ink-soft">{s.text}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm text-ink"><Check />{it}</li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t.included}</span>
                  <Link href={r('pricing', lang)} className="text-sm font-semibold text-brand-deep hover:underline">{t.seePricing} →</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24">
        <div className="container-site">
          <SectionHead kicker={t.howKicker} title={t.howTitle} center />
          <ol className="relative mt-12 grid gap-6 md:grid-cols-3">
            <div aria-hidden="true" className="absolute left-[16%] right-[16%] top-[2.2rem] hidden h-px bg-line md:block" />
            {t.how.map(([icon, title, text], i) => (
              <Reveal as="li" key={title} delay={i * 100} className="relative text-center">
                <span className="relative mx-auto flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-2xl border border-line bg-white text-teal-deep shadow-sm">
                  <IconTile name={icon} tone="teal" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-deep text-xs font-bold text-white">{i + 1}</span>
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs leading-relaxed text-ink-soft">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHead kicker={t.ctrlKicker} title={t.ctrlTitle} />
            <ul className="mt-8 space-y-4">
              {t.ctrl.map(([icon, title, text]) => (
                <li key={title} className="flex gap-4">
                  <IconTile name={icon} tone="teal" />
                  <div>
                    <p className="font-semibold text-ink">{title}</p>
                    <p className="mt-1 text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div id="faq" className="scroll-mt-24">
            <h2 className="mb-6 text-2xl font-bold text-ink">{t.faqTitle}</h2>
            <Faq items={LAB_FAQ[lang]} />
          </div>
        </div>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} primary={{ href: r('signup', lang), label: t.cta1 }} secondary={{ href: r('quote', lang), label: t.quote }} />
    </div>
  )
}
