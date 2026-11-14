import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, AUDIT_IA, LAST_UPDATE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Audit gratuit : votre entreprise est-elle visible par l’IA ?',
  description:
    'On demande à ChatGPT, Gemini, Perplexity et Google de recommander une entreprise comme la vôtre en Guadeloupe. Résultat sous 48 h et 3 actions concrètes. Gratuit, sans engagement.',
  alternates: { canonical: '/audit-ia' },
}

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-muted focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30'

const STEPS = [
  {
    title: 'On pose les questions de vos clients',
    text: '5 questions qu’un client poserait sur votre activité et votre commune, posées à ChatGPT, Gemini, Perplexity et Google.',
  },
  {
    title: 'On regarde qui est cité',
    text: 'Êtes-vous recommandé ? Qui l’est à votre place ? D’où l’IA tire-t-elle ses informations ?',
  },
  {
    title: 'On vérifie vos bases',
    text: 'Fiche Google, site, réseaux et annuaires : vos informations sont-elles complètes et identiques partout ?',
  },
  {
    title: 'Vous recevez 3 actions',
    text: 'Sous 48 h, par e-mail ou WhatsApp : le résultat question par question et 3 actions concrètes, que vous pouvez faire seul.',
  },
]

const FAQ_AUDIT = [
  {
    q: 'L’audit est-il vraiment gratuit ?',
    a: 'Oui, gratuit et sans engagement. Vous gardez le résultat et les 3 actions, que vous travailliez avec nous ensuite ou non.',
  },
  {
    q: 'C’est quoi le GEO ?',
    a: 'Le GEO (Generative Engine Optimization) regroupe ce qui aide une entreprise à être citée dans les réponses des IA comme ChatGPT, Gemini ou Perplexity. Il prolonge le référencement Google classique.',
  },
  {
    q: 'Faut-il déjà avoir un site internet ?',
    a: 'Non. L’audit regarde aussi votre fiche Google, vos réseaux et les annuaires. Si vous n’avez pas de site, on vous dit si c’est ce qui vous manque le plus.',
  },
  {
    q: 'Pouvez-vous garantir que je serai cité par ChatGPT ?',
    a: 'Non, personne ne peut le garantir : les réponses des IA varient d’une fois à l’autre et changent avec le temps. L’audit est une photographie à un instant donné, avec ce qui augmente vos chances.',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: AUDIT_IA.title,
      description: AUDIT_IA.text,
      provider: { '@id': `${SITE.url}/#business` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Guadeloupe' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    },
    {
      '@type': 'FAQPage',
      dateModified: LAST_UPDATE,
      mainEntity: FAQ_AUDIT.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

export default function AuditIaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-hero pb-14 pt-32 md:pt-40">
        <div className="container-site">
          <span className="eyebrow">Audit gratuit</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Votre entreprise est-elle visible par l’IA ?
          </h1>
          <p className="section-subtitle">
            De plus en plus de clients ne cherchent plus, ils demandent : « Quel garage sérieux à Baie-Mahault ? »,
            « Un institut ouvert le samedi au Gosier ? ». ChatGPT ou Google répondent avec deux ou trois noms. On vérifie
            gratuitement si le vôtre en fait partie.
          </p>
          <a href="#demande" className="btn-primary mt-8 inline-flex py-4 text-base">
            Demander mon audit gratuit
          </a>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">Ce qu’on vérifie</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card">
                <span className="text-sm font-semibold text-brand-deep">Étape {i + 1}</span>
                <h3 className="mt-2 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-ink-muted">
            Pour comprendre la démarche, lisez notre guide :{' '}
            <Link href="/guides/etre-recommande-par-chatgpt-guadeloupe" className="font-medium text-brand-deep underline">
              comment être recommandé par ChatGPT en Guadeloupe
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="demande" className="bg-sand py-14 md:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-2xl font-bold text-ink md:text-3xl">Demander l’audit</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Indiquez votre activité et votre commune : c’est ce qu’on demandera aux IA. Réponse sous 48 h.
            </p>
            <p className="mt-4 text-sm text-ink-muted">
              Vous préférez WhatsApp ?{' '}
              <a href={`https://wa.me/${SITE.phone.replace(/[^\d]/g, '')}`} className="font-medium text-brand-deep underline">
                {SITE.phone}
              </a>
            </p>
          </div>

          <div className="card p-6 md:p-10">
            <form action="/api/contact" method="POST" className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">Nom *</label>
                <input id="name" type="text" name="name" required autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="business" className="mb-2 block text-sm font-medium text-ink">Entreprise *</label>
                <input id="business" type="text" name="business" required autoComplete="organization" className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">E-mail *</label>
                <input id="email" type="email" name="email" required autoComplete="email" className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">Téléphone (WhatsApp)</label>
                <input id="phone" type="tel" name="phone" autoComplete="tel" placeholder="0690 00 00 00" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="site" className="mb-2 block text-sm font-medium text-ink">Site, fiche Google ou Instagram</label>
                <input id="site" type="text" name="site" placeholder="Lien ou nom de la page" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">Votre activité et votre commune *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  placeholder="Ex. : garage automobile à Baie-Mahault, vidange et pneus"
                  className={`${inputClass} resize-y`}
                />
              </div>
              <input type="hidden" name="service" value={AUDIT_IA.id} />
              <input type="hidden" name="page" value="/audit-ia" />
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Ne pas remplir</label>
                <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <input id="rgpd" type="checkbox" name="rgpd" value="oui" required className="mt-1 h-4 w-4 accent-[#B4511A]" />
                <label htmlFor="rgpd" className="text-sm text-ink-soft">
                  J’accepte que mes données soient utilisées pour réaliser l’audit et y répondre, conformément à la{' '}
                  <a href="/politique-confidentialite" className="font-medium text-brand-deep underline">
                    politique de confidentialité
                  </a>
                  . *
                </label>
              </div>
              <button type="submit" className="btn-primary py-4 text-base sm:col-span-2">
                Recevoir mon audit gratuit
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">Questions fréquentes</h2>
          <div className="mt-8 space-y-4">
            {FAQ_AUDIT.map((f) => (
              <details key={f.q} className="card">
                <summary className="cursor-pointer font-semibold text-ink">{f.q}</summary>
                <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
