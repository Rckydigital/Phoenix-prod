import Link from 'next/link'
import type { Lang } from '@/lib/i18n'

export function Check({ className = 'h-5 w-5 text-teal-deep' }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
    </svg>
  )
}

// Icônes simples (trait), même famille partout
const PATHS: Record<string, string> = {
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  inbox: 'M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6l2-8Z',
  bolt: 'M13 3 4 14h7l-1 7 9-11h-7l1-7Z',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z',
  chart: 'M4 19h16M7 16V9M12 16V5M17 16v-4',
  doc: 'M7 3h7l5 5v13H7V3Zm7 0v5h5',
  chat: 'M4 5h16v11H8l-4 4V5Z',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  calendar: 'M4 6h16v14H4V6Zm4-3v6m8-6v6M4 11h16',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4V8Zm8 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z',
  hand: 'M8 11V5a1.5 1.5 0 0 1 3 0v5m0-1V4a1.5 1.5 0 0 1 3 0v6m0-2a1.5 1.5 0 0 1 3 0v5c0 4-2.5 7-6.5 7S5 18 5 15v-3a1.5 1.5 0 0 1 3 0',
}

export function Icon({ name, className = 'h-5 w-5' }: { name: keyof typeof PATHS | string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] || PATHS.bolt} />
    </svg>
  )
}

export function IconTile({ name, tone = 'brand' }: { name: string; tone?: 'brand' | 'teal' | 'plum' }) {
  const c = tone === 'teal' ? 'bg-teal-soft text-teal-deep' : tone === 'plum' ? 'bg-plum-soft text-plum' : 'bg-brand-soft text-brand-deep'
  return (
    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c}`}>
      <Icon name={name} className="h-5 w-5" />
    </span>
  )
}

export function SectionHead({ kicker, title, sub, center = false }: { kicker?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {kicker && <span className="kicker">{kicker}</span>}
      <h2 className={`section-title ${kicker ? 'mt-4' : ''}`}>{title}</h2>
      {sub && <p className={`section-subtitle ${center ? 'mx-auto' : ''}`}>{sub}</p>}
    </div>
  )
}

export function CtaBand({ title, text, primary, secondary }: { title: string; text: string; primary: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center text-white md:px-16 md:py-16">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal/30 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/75">{text}</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={primary.href} className="btn-primary px-7 py-4 text-base">{primary.label}</Link>
            {secondary && (
              <Link href={secondary.href} className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white hover:bg-white hover:text-ink">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Visuel produit du héros : le parcours LeadFlow, avec des données d'exemple (affichées comme telles)
export function FlowVisual({ lang }: { lang: Lang }) {
  const t = lang === 'fr'
    ? { ex: 'Exemple · données fictives', title: 'Nouvelle demande', from: 'Formulaire du site', msg: '« Nous cherchons une agence pour refaire notre site avant mars, budget 5 à 8 k€. »', tag: 'Prospect chaud', need: 'Refonte de site', steps: ['Fiche créée dans le CRM', 'Réponse préparée', 'Relance prévue à J+3', 'Créneau proposé'], live: 'LeadFlow actif' }
    : { ex: 'Example · sample data', title: 'New request', from: 'Website form', msg: '“We need an agency to rebuild our website before March, budget £5–8k.”', tag: 'Hot lead', need: 'Website rebuild', steps: ['Record created in CRM', 'Reply drafted', 'Follow-up set for day 3', 'Meeting slot offered'], live: 'LeadFlow running' }
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-transparent to-teal/20 blur-2xl" />
      <div className="relative rounded-3xl border border-line bg-white p-5 shadow-[0_40px_80px_-40px_rgba(30,42,51,0.45)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold text-teal-deep">
            <span className="pulse-dot h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
            {t.live}
          </span>
          <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-ink-muted">{t.ex}</span>
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-sand/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-ink">{t.title}</p>
            <span className="text-[11px] text-ink-muted">{t.from}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.msg}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-deep">{t.tag}</span>
            <span className="rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-semibold text-teal-deep">{t.need}</span>
          </div>
        </div>
        <ol className="mt-4 space-y-2.5">
          {t.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">{i + 1}</span>
              <span className="flex-1 text-sm font-medium text-ink">{s}</span>
              <Check className="h-4 w-4 text-teal-deep" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-4 md:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
            {f.q}
            <span aria-hidden="true" className="text-xl text-ink-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
