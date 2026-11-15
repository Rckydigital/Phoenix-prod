import Link from 'next/link'
import { PhoenixIcon } from '@/components/Logo'
import { Check } from '@/components/ui'

type Lang = 'fr' | 'en'

// Texte validé par Ricky le 15/11 (cerveau : 70 - Fichiers/Site/Page À propos - nouvelle version (2026-11-15).md)
const T = {
  fr: {
    kicker: 'À propos',
    h1: 'Là où la créativité renaît.',
    lead: 'RCKY DIGITAL crée des sites internet, rend les entreprises visibles là où leurs clients les cherchent, et leur fait gagner du temps grâce à l’IA.',
    phoenixTitle: 'Pourquoi un phénix',
    phoenix: [
      'Le phénix renaît de ses cendres. Pour moi, c’est un symbole personnel : celui d’une renaissance, et de l’énergie qu’elle donne pour créer.',
      'C’est aussi ce que je veux pour vous : donner une seconde vie à une fiche Google oubliée, à un Instagram qui ne bouge plus ou à un site qui ne ramène personne.',
    ],
    whoTitle: 'Qui est derrière RCKY DIGITAL',
    who: [
      'Je m’appelle <strong>Ricky GALIN</strong>, fondateur de RCKY DIGITAL, créée en 2023 en Guadeloupe. Je suis diplômé d’un bachelor en marketing digital et d’un master en e-business, obtenu en alternance.',
      'Pendant mon alternance, j’ai créé et animé le compte Instagram d’un centre de formation. À côté, j’ai monté des vidéos pour des événements et des marques, et lancé les réseaux d’un salon de beauté.',
      'Je ne viens pas d’une grande agence. Je viens du terrain : je sais ce qui donne envie d’acheter ou de réserver, et ce qui fait fuir.',
    ],
    doTitle: 'Ce que je fais pour vous',
    services: [
      {
        name: 'Création de sites internet',
        forWho: 'Pour les entreprises qui veulent un site qui travaille pour elles.',
        items: [
          'Un site sur mesure, amélioré grâce à l’IA, rapide et pensé pour le téléphone',
          'La réservation ou la prise de rendez-vous en ligne, si vous en avez besoin',
          'Un site lisible par Google et par les IA (ChatGPT, Gemini…), pour qu’on vous trouve quand on vous cherche',
        ],
        href: '/tarifs#sites',
        cta: 'Voir les types de sites',
      },
      {
        name: 'Visibilité',
        forWho: 'Pour les commerces, gîtes, activités touristiques, instituts et entreprises de services.',
        items: [
          'Des photos et des vidéos de votre activité, tournées sur place en Guadeloupe',
          'Une fiche Google qui ressort dans les recherches et sur Maps, avec vos avis mis en valeur',
          'Vos réseaux sociaux tenus chaque mois, sans que vous y passiez vos soirées',
        ],
        href: '/services',
        cta: 'Voir les offres',
      },
      {
        name: 'Automation Lab',
        forWho: 'Pour les agences, cabinets et entreprises de toutes tailles, où qu’elles soient.',
        items: [
          'Des automatisations construites avec l’IA (Claude) : réponses aux demandes, relances, tri des messages, préparation des devis',
          'Installées dans vos outils, à distance, et testées d’abord sur ma propre agence, où une équipe d’agents IA travaille chaque nuit',
        ],
        href: '/automation-lab',
        cta: 'Découvrir l’Automation Lab',
      },
    ],
    howTitle: 'Ma façon de travailler',
    how: [
      ['Des prix clairs.', 'Devis gratuit, tarifs affichés pour les offres à prix fixe, et le prix annoncé est le prix payé : pas de TVA à ajouter.'],
      ['Rien sans votre accord.', 'Aucune publication, aucun message envoyé à vos clients sans votre validation.'],
      ['De l’honnêteté.', 'Je ne montre que de vrais projets, avec l’accord des clients.'],
      ['Sans jargon.', 'Je vous explique ce que je fais avec des mots simples.'],
    ],
    ctaTitle: 'Un projet, une question, ou juste envie de savoir où vous en êtes ?',
    ctaText: 'Commencez par l’audit gratuit de votre visibilité, ou réservez un appel de 15 minutes.',
    cta1: ['Faire mon audit gratuit', '/audit-ia'],
    cta2: ['Réserver un appel', '/rendez-vous'],
    logoAlt: 'Logo phénix de RCKY DIGITAL',
  },
  en: {
    kicker: 'About',
    h1: 'Where creativity is reborn.',
    lead: 'RCKY DIGITAL builds websites, makes businesses visible where their customers are looking, and saves them time with AI.',
    phoenixTitle: 'Why a phoenix',
    phoenix: [
      'The phoenix rises from its ashes. To me, it is a personal symbol: one of rebirth, and of the energy it gives to create.',
      'It is also what I want for you: a second life for a forgotten Google listing, an Instagram account that has gone quiet, or a website that brings in no one.',
    ],
    whoTitle: 'Who is behind RCKY DIGITAL',
    who: [
      'I am <strong>Ricky GALIN</strong>, founder of RCKY DIGITAL, created in 2023 in Guadeloupe (French Caribbean). I hold a bachelor’s degree in digital marketing and a master’s degree in e-business, earned through a work-study program.',
      'During my work-study years, I created and ran the Instagram account of a training center. Alongside that, I edited videos for events and brands, and launched the social media of a beauty salon.',
      'I don’t come from a big agency. I come from the field: I know what makes people want to buy or book, and what drives them away.',
    ],
    doTitle: 'What I do for you',
    services: [
      {
        name: 'Website creation',
        forWho: 'For businesses that want a website that works for them.',
        items: [
          'A custom website, enhanced with AI, fast and designed for mobile',
          'Online booking or appointment scheduling, if you need it',
          'A website that Google and AI assistants (ChatGPT, Gemini…) can read, so people find you when they look for you',
        ],
        href: '/en/contact',
        cta: 'Ask for a quote',
      },
      {
        name: 'Visibility',
        forWho: 'For shops, holiday rentals, tourist activities, beauty salons and service businesses.',
        items: [
          'Photos and videos of your business, shot on location in Guadeloupe',
          'A Google Business Profile that shows up in searches and on Maps, with your reviews front and center',
          'Your social media handled every month, so you don’t spend your evenings on it',
        ],
        href: '/en/contact',
        cta: 'Get in touch',
      },
      {
        name: 'Automation Lab',
        forWho: 'For agencies, firms and businesses of every size, wherever they are.',
        items: [
          'Automations built with AI (Claude): replies to inquiries, follow-ups, message sorting, quote preparation',
          'Set up in your own tools, remotely, and tested first on my own agency, where a team of AI agents works every night',
        ],
        href: '/en/automation-lab',
        cta: 'Discover Automation Lab',
      },
    ],
    howTitle: 'How I work',
    how: [
      ['Clear prices.', 'Free quotes, published prices for fixed-price offers, and the price quoted is the price you pay: no VAT to add.'],
      ['Nothing without your approval.', 'No post published and no message sent to your customers without your sign-off.'],
      ['Honesty.', 'I only show real projects, with my clients’ permission.'],
      ['No jargon.', 'I explain what I do in plain words.'],
    ],
    ctaTitle: 'A project, a question, or just curious where you stand?',
    ctaText: 'Book a free 15-minute call, or send me a message.',
    cta1: ['Book a call', '/en/book'],
    cta2: ['Send a message', '/en/contact'],
    logoAlt: 'RCKY DIGITAL phoenix logo',
  },
}

export default function AboutPage({ lang }: { lang: Lang }) {
  const t = T[lang]
  return (
    <div lang={lang}>
      <section className="bg-hero pb-14 pt-28 md:pt-36">
        <div className="container-site grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="kicker">{t.kicker}</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{t.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{t.lead}</p>
          </div>
          <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center rounded-full bg-white shadow-[0_30px_80px_-30px_rgba(30,42,51,0.35)]">
            <PhoenixIcon className="h-4/5 w-4/5" title={t.logoAlt} large />
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
            <h2 className="section-title">{t.whoTitle}</h2>
            {t.who.map((p) => (
              <p key={p} dangerouslySetInnerHTML={{ __html: p.replace('<strong>', '<strong class="text-ink">') }} />
            ))}
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
            <h2 className="section-title">{t.phoenixTitle}</h2>
            {t.phoenix.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-14 md:py-20">
        <div className="container-site">
          <h2 className="section-title">{t.doTitle}</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {t.services.map((s) => (
              <div key={s.name} className="card flex flex-col p-7">
                <h3 className="text-xl font-bold text-ink">{s.name}</h3>
                <p className="mt-2 text-sm font-medium text-brand-deep">{s.forWho}</p>
                <ul className="mt-5 flex-1 space-y-3">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-ink-soft">
                      <Check />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="btn-outline mt-6 w-full">
                  {s.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="section-title">{t.howTitle}</h2>
            <ul className="mt-6 space-y-4 text-lg text-ink-soft">
              {t.how.map(([b, txt]) => (
                <li key={b}>
                  <strong className="text-ink">{b}</strong> {txt}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-ink p-8 text-white md:p-10">
            <h2 className="text-2xl font-bold md:text-3xl">{t.ctaTitle}</h2>
            <p className="mt-4 text-white/75">{t.ctaText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={t.cta1[1]} className="btn-primary">{t.cta1[0]}</Link>
              <Link href={t.cta2[1]} className="btn-outline border-white/30 bg-transparent text-white hover:bg-white/10">{t.cta2[0]}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
