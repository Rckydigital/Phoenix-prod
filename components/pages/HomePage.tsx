import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { PhoenixIcon } from '@/components/Logo'
import { Check, CtaBand, FlowVisual, Icon, IconTile, SectionHead } from '@/components/ui'
import { SERVICES, REALISATIONS } from '@/lib/constants'
import { GUIDES } from '@/lib/guides'
import { r, type Lang } from '@/lib/i18n'

const T = {
  fr: {
    kicker: 'Agence digitale · Guadeloupe & à distance',
    h1a: 'Plus de clients,',
    h1b: 'moins de tâches répétitives.',
    lead: 'RCKY DIGITAL aide les entreprises à être trouvées et à mieux traiter leurs demandes : visibilité locale en Guadeloupe, et automatisations IA construites avec Claude, partout à distance.',
    cta1: 'Réserver un appel de 15 min',
    cta2: 'Voir la démo LeadFlow',
    noCard: 'Gratuit · Par téléphone ou WhatsApp · Sans engagement',
    facts: [['globe', 'Basé en Guadeloupe'], ['link', 'Automatisation 100 % à distance'], ['bolt', 'Construit avec Claude (Anthropic)'], ['clock', 'Réponse sous 48 h']],
    twoKicker: 'Deux expertises',
    twoTitle: 'Une agence, deux façons de faire grandir votre activité',
    labTitle: 'Automation Lab',
    labFor: 'Agences, cabinets de conseil, PME · partout',
    labText: 'Vos demandes clients lues, triées, enregistrées et suivies automatiquement. Moins de saisie, aucun prospect oublié.',
    labItems: ['LeadFlow : des demandes au rendez-vous', 'AdminFlow : documents et devis', 'SupportFlow : demandes clients'],
    labCta: 'Découvrir Automation Lab',
    localTitle: 'Visibilité locale',
    localFor: 'Tourisme, beauté, commerces · Guadeloupe',
    localText: 'Photos, vidéos, réseaux sociaux et sites avec réservation, pour donner envie de réserver chez vous.',
    localCta: 'Voir les offres et tarifs',
    benKicker: 'Pourquoi automatiser',
    benTitle: 'Ce que vous gagnez dès le premier mois',
    ben: [['clock', 'Du temps', 'Les tâches répétitives (saisie, copier-coller, relances) tournent seules.'], ['inbox', 'Aucun prospect oublié', 'Chaque demande est enregistrée et relancée au bon moment.'], ['bolt', 'Des réponses rapides', 'Une réponse personnalisée est prête en quelques minutes, pas en quelques jours.'], ['hand', 'Le contrôle', 'Rien de sensible ne part sans votre validation. Vous pouvez tout couper.']],
    proofKicker: 'La preuve par l’exemple',
    proofTitle: 'Nous faisons tourner notre agence avec nos propres agents IA',
    proofText: 'Chaque nuit, une équipe d’agents construits avec Claude prépare le travail du lendemain. Chaque matin, un briefing résume ce qui a été fait et ce qui reste à valider. C’est ce savoir-faire que nous installons chez vous.',
    agents: [['Commercial', 'Recherche et vérifie des prospects, prépare les messages'], ['Veille', 'Étudie un sujet utile chaque nuit, avec sources'], ['Finance', 'Vérifie les comptes, cherche des aides'], ['Marketing', 'Prépare les publications à valider'], ['Dev', 'Construit et teste les outils'], ['Briefing', 'Résume tout à 6 h 45']],
    stepsKicker: 'Comment ça marche',
    stepsTitle: 'De l’audit à l’automatisation, en 3 étapes',
    steps: [['Appel découverte de 15 min', 'Par téléphone ou WhatsApp : on regarde comment vous traitez vos demandes et ce qui vous fait perdre du temps.'], ['Installation dans vos outils', 'Formulaire, e-mail, CRM, agenda : on branche l’automatisation sur ce que vous utilisez déjà.'], ['Suivi dans votre espace client', 'Vous voyez ce qui tourne, les demandes traitées et les relances, et vous ajustez avec nous.']],
    workKicker: 'Réalisations',
    workTitle: 'De vrais projets, pas de faux chiffres',
    workCta: 'Toutes les réalisations',
    guidesTitle: 'Guides gratuits',
    guidesCta: 'Tous les guides',
    read: 'Lire',
    ctaTitle: 'Combien de demandes vous échappent chaque mois ?',
    ctaText: 'Un appel de 15 min pour voir ce qui peut être automatisé, puis un pilote de 10 jours sur vos vrais cas.',
    ctaSecondary: 'Demander un devis',
  },
  en: {
    kicker: 'AI automation · Based in Guadeloupe, working worldwide',
    h1a: 'More clients,',
    h1b: 'fewer repetitive tasks.',
    lead: 'RCKY DIGITAL builds AI automations with Claude for marketing agencies, consulting firms and small businesses: every inbound request is read, sorted, logged and followed up, delivered 100% remotely.',
    cta1: 'Book a 15-min call',
    cta2: 'See the LeadFlow demo',
    noCard: 'Free · By phone or WhatsApp · No commitment',
    facts: [['globe', 'Based in Guadeloupe (French Caribbean)'], ['link', '100% remote delivery'], ['bolt', 'Built with Claude (Anthropic)'], ['clock', 'Reply within 48 h']],
    twoKicker: 'What we do',
    twoTitle: 'Automations that turn requests into meetings',
    labTitle: 'Automation Lab',
    labFor: 'Agencies, consultancies, SMBs · worldwide',
    labText: 'Inbound requests read, qualified, logged and followed up automatically. Less admin, no lead left behind.',
    labItems: ['LeadFlow: from request to booked call', 'AdminFlow: documents and quotes', 'SupportFlow: customer requests'],
    labCta: 'Explore Automation Lab',
    localTitle: 'Local visibility (Guadeloupe)',
    localFor: 'Tourism, beauty, local shops · in French',
    localText: 'Photos, videos, social media and booking websites for businesses in Guadeloupe.',
    localCta: 'See local offers (French)',
    benKicker: 'Why automate',
    benTitle: 'What you gain from month one',
    ben: [['clock', 'Time back', 'Repetitive tasks (data entry, copy-paste, follow-ups) run on their own.'], ['inbox', 'No lead forgotten', 'Every request is logged and followed up at the right time.'], ['bolt', 'Faster replies', 'A tailored reply is ready in minutes, not days.'], ['hand', 'Full control', 'Nothing sensitive goes out without your approval. You can switch it all off.']],
    proofKicker: 'We use it ourselves',
    proofTitle: 'Our own agency runs on AI agents we built',
    proofText: 'Every night a team of agents built with Claude prepares the next day’s work. Every morning a briefing sums up what was done and what needs approval. That is the know-how we bring to your business.',
    agents: [['Sales', 'Finds and checks prospects, drafts outreach'], ['Research', 'Studies one useful topic per night, with sources'], ['Finance', 'Checks the books, looks for grants'], ['Marketing', 'Drafts posts for approval'], ['Dev', 'Builds and tests our tools'], ['Briefing', 'Sums it all up at 6:45 am']],
    stepsKicker: 'How it works',
    stepsTitle: 'From audit to automation in 3 steps',
    steps: [['Free 15-min discovery call', 'By phone or WhatsApp we look at how you handle requests today and where time is lost.'], ['Set up in your tools', 'Form, email, CRM, calendar: we plug the automation into what you already use.'], ['Track it in your client area', 'See what runs, requests handled and follow-ups sent, and fine-tune with us.']],
    workKicker: '',
    workTitle: '',
    workCta: '',
    guidesTitle: '',
    guidesCta: '',
    read: '',
    ctaTitle: 'How many requests slip through each month?',
    ctaText: 'A 15-min call to see what can be automated, then a 10-day pilot on your real cases.',
    ctaSecondary: 'Request a quote',
  },
}

export default function HomePage({ lang }: { lang: Lang }) {
  const t = T[lang]
  return (
    <div lang={lang}>
      {/* HÉROS */}
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
              <Link href={r('book', lang)} data-track="Accueil : rendez-vous" className="btn-primary px-7 py-4 text-base">{t.cta1}</Link>
              <Link href={r('demo', lang)} data-track="Accueil : démo" className="btn-ghost px-7 py-4 text-base">
                <span aria-hidden="true">▶</span> {t.cta2}
              </Link>
            </div>
            <p className="hero-in mt-3 text-sm text-ink-muted" style={{ '--d': '360ms' } as React.CSSProperties}>{t.noCard}</p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {t.facts.map(([icon, label]) => (
                <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <span className="text-teal-deep"><Icon name={icon} /></span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-in" style={{ '--d': '250ms' } as React.CSSProperties}>
            <FlowVisual lang={lang} />
          </div>
        </div>
      </section>

      {/* DEUX EXPERTISES */}
      <section className="py-16 md:py-24">
        <div className="container-site">
          <SectionHead kicker={t.twoKicker} title={t.twoTitle} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal className="card lift relative overflow-hidden p-8">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal/10" />
              <IconTile name="bolt" tone="teal" />
              <h3 className="mt-5 text-2xl font-bold text-ink">{t.labTitle}</h3>
              <p className="mt-1 text-sm font-medium text-teal-deep">{t.labFor}</p>
              <p className="mt-4 leading-relaxed text-ink-soft">{t.labText}</p>
              <ul className="mt-5 space-y-2">
                {t.labItems.map((i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-ink"><Check />{i}</li>
                ))}
              </ul>
              <Link href={r('lab', lang)} className="btn-primary mt-7">{t.labCta}</Link>
            </Reveal>
            <Reveal delay={100} className="card lift relative overflow-hidden p-8">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10" />
              <IconTile name="camera" />
              <h3 className="mt-5 text-2xl font-bold text-ink">{t.localTitle}</h3>
              <p className="mt-1 text-sm font-medium text-brand-deep">{t.localFor}</p>
              <p className="mt-4 leading-relaxed text-ink-soft">{t.localText}</p>
              {lang === 'fr' && (
                <ul className="mt-5 space-y-2">
                  {SERVICES.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3 text-sm text-ink">
                      <span className="flex gap-2.5"><Check className="h-5 w-5 text-brand-deep" />{s.title}</span>
                      <span className="font-semibold">{s.price}{s.priceNote ? ` ${s.priceNote}` : ''}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href={r('services', lang)} className="btn-outline mt-7">{t.localCta}</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BÉNÉFICES */}
      <section className="bg-sand py-16 md:py-24">
        <div className="container-site">
          <SectionHead kicker={t.benKicker} title={t.benTitle} center />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.ben.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 80} className="card lift">
                <IconTile name={icon} tone={i % 2 ? 'teal' : 'brand'} />
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PREUVE */}
      <section className="py-16 md:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead kicker={t.proofKicker} title={t.proofTitle} />
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t.proofText}</p>
            <Link href={r('lab', lang)} className="btn-outline mt-8">{t.labCta}</Link>
          </div>
          <Reveal className="rounded-3xl bg-ink p-6 text-white shadow-[0_40px_80px_-40px_rgba(30,42,51,0.6)] md:p-8">
            <div className="flex items-center gap-3">
              <PhoenixIcon className="h-10 w-10" />
              <div>
                <p className="font-bold">RCKY DIGITAL</p>
                <p className="text-xs text-white/60">{lang === 'fr' ? 'Équipe de nuit' : 'Night shift'}</p>
              </div>
              <span className="ml-auto flex items-center gap-2 text-xs text-[#7fd3e2]"><span className="pulse-dot h-2 w-2 rounded-full bg-[#7fd3e2]" aria-hidden="true" />{lang === 'fr' ? 'Actifs' : 'Running'}</span>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {t.agents.map(([name, text]) => (
                <li key={name} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="flex items-center gap-2 font-semibold"><Icon name="moon" className="h-4 w-4 text-[#F2A65A]" />{name}</p>
                  <p className="mt-1 text-sm text-white/65">{text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="bg-sand py-16 md:py-24">
        <div className="container-site">
          <SectionHead kicker={t.stepsKicker} title={t.stepsTitle} center />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {t.steps.map(([title, text], i) => (
              <Reveal as="li" key={title} delay={i * 100} className="card relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-deep font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* RÉALISATIONS + GUIDES (français) */}
      {lang === 'fr' && (
        <section className="py-16 md:py-24">
          <div className="container-site">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHead kicker={t.workKicker} title={t.workTitle} />
              <Link href={r('work', lang)} className="btn-outline shrink-0">{t.workCta}</Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {REALISATIONS.map((p) => (
                <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="card lift group block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-deep">{p.category}</span>
                  <h3 className="mt-2 text-lg font-bold text-ink group-hover:text-brand-deep">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                </a>
              ))}
            </div>
            <div className="mt-16 flex items-end justify-between gap-6">
              <h2 className="text-2xl font-bold text-ink">{t.guidesTitle}</h2>
              <Link href={r('guides', lang)} className="text-sm font-semibold text-brand-deep hover:underline">{t.guidesCta} →</Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {GUIDES.slice(0, 3).map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="card lift group flex flex-col">
                  <h3 className="font-bold leading-snug text-ink group-hover:text-brand-deep">{g.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">{g.description}</p>
                  <span className="mt-4 text-sm font-semibold text-brand-deep">{t.read} ({g.readingMinutes} min) →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={t.ctaTitle} text={t.ctaText} primary={{ href: r('book', lang), label: t.cta1 }} secondary={{ href: r('quote', lang), label: t.ctaSecondary }} />
    </div>
  )
}
