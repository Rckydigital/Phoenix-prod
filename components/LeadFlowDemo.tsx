'use client'

// Démo LeadFlow simulée : tout se passe dans le navigateur, rien n'est envoyé.
// L'« analyse » utilise ici des règles simples pour illustrer le parcours ;
// dans une vraie installation, c'est Claude qui lit et classe la demande.

import { useEffect, useRef, useState } from 'react'
import type { Lang } from '@/lib/i18n'

type Result = {
  name: string
  company: string
  email: string
  need: string
  urgency: 'high' | 'normal'
  budget: string
  score: 'hot' | 'warm' | 'cold'
  reply: string
  followUp: string
  slots: string[]
}

const T = {
  fr: {
    formTitle: 'Le formulaire de votre site',
    formSub: 'Modifiez la demande si vous voulez, puis envoyez-la.',
    name: 'Nom', company: 'Entreprise', email: 'E-mail', message: 'Message', budget: 'Budget',
    budgets: ['Moins de 2 000 €', '2 000 à 5 000 €', '5 000 à 10 000 €', 'Plus de 10 000 €'],
    sample: { name: 'Claire Martin', company: 'Atelier Nova (exemple)', email: 'claire@exemple.fr', message: 'Bonjour, nous voulons refaire notre site et lancer des campagnes LinkedIn avant mars. Pouvez-vous nous faire une proposition rapidement ?' },
    send: 'Envoyer la demande (démo)',
    reset: 'Recommencer',
    flowTitle: 'Ce que LeadFlow fait, automatiquement',
    idle: 'Envoyez la demande pour voir le parcours se dérouler.',
    steps: ['Demande reçue', 'Analyse par l’IA', 'Fiche créée dans le CRM', 'Réponse personnalisée préparée', 'Relance programmée', 'Rendez-vous proposé'],
    needLbl: 'Besoin', urgLbl: 'Urgence', budLbl: 'Budget', scoreLbl: 'Priorité',
    urg: { high: 'Haute', normal: 'Normale' },
    score: { hot: 'Prospect chaud', warm: 'Prospect tiède', cold: 'À qualifier' },
    needs: { site: 'Site internet', seo: 'Référencement', social: 'Réseaux sociaux / LinkedIn', ads: 'Publicité', auto: 'Automatisation', other: 'Autre demande' },
    crmStage: 'Étape : Nouveau prospect · Source : formulaire du site',
    draftLbl: 'Brouillon à valider',
    followLbl: 'Si pas de réponse, relance le',
    slotsLbl: 'Créneaux proposés dans votre agenda',
    reply: (n: string, need: string) => `Bonjour ${n},\n\nMerci pour votre message. Nous avons bien noté votre besoin (${need.toLowerCase()}). Pour vous faire une proposition précise, je vous propose un échange de 20 minutes cette semaine : choisissez le créneau qui vous convient ci-dessous.\n\nBelle journée,\nL’équipe`,
    note: 'Démo simulée : rien n’est envoyé ni enregistré. Ici, l’analyse est faite par des règles simples dans votre navigateur ; dans une vraie installation, c’est Claude qui lit et classe chaque demande.',
    stats: ['Demandes traitées (démo)', 'Étapes automatisées', 'Saisie manuelle'],
    statVals: ['6', 'aucune'],
  },
  en: {
    formTitle: 'Your website form',
    formSub: 'Edit the request if you like, then send it.',
    name: 'Name', company: 'Company', email: 'Email', message: 'Message', budget: 'Budget',
    budgets: ['Under €2,000', '€2,000 to €5,000', '€5,000 to €10,000', 'Over €10,000'],
    sample: { name: 'Claire Martin', company: 'Nova Studio (sample)', email: 'claire@example.com', message: 'Hi, we want to rebuild our website and launch LinkedIn campaigns before March. Could you send us a proposal soon?' },
    send: 'Send the request (demo)',
    reset: 'Start again',
    flowTitle: 'What LeadFlow does, automatically',
    idle: 'Send the request to watch the flow run.',
    steps: ['Request received', 'AI analysis', 'Record created in CRM', 'Tailored reply drafted', 'Follow-up scheduled', 'Meeting slots offered'],
    needLbl: 'Need', urgLbl: 'Urgency', budLbl: 'Budget', scoreLbl: 'Priority',
    urg: { high: 'High', normal: 'Normal' },
    score: { hot: 'Hot lead', warm: 'Warm lead', cold: 'To qualify' },
    needs: { site: 'Website', seo: 'SEO', social: 'Social media / LinkedIn', ads: 'Advertising', auto: 'Automation', other: 'Other request' },
    crmStage: 'Stage: New lead · Source: website form',
    draftLbl: 'Draft awaiting approval',
    followLbl: 'If no reply, follow up on',
    slotsLbl: 'Slots offered from your calendar',
    reply: (n: string, need: string) => `Hi ${n},\n\nThanks for your message. We have noted your need (${need.toLowerCase()}). To send you an accurate proposal, how about a 20-minute call this week? Just pick a slot below.\n\nBest regards,\nThe team`,
    note: 'Simulated demo: nothing is sent or stored. Here the analysis uses simple rules in your browser; in a real setup, Claude reads and qualifies every request.',
    stats: ['Requests handled (demo)', 'Automated steps', 'Manual entry'],
    statVals: ['6', 'none'],
  },
}

function analyse(lang: Lang, f: { name: string; company: string; email: string; message: string; budget: number }): Result {
  const t = T[lang]
  const m = f.message.toLowerCase()
  const has = (...w: string[]) => w.some((x) => m.includes(x))
  const needKey = has('site', 'website', 'web') ? 'site' : has('seo', 'référencement', 'google') ? 'seo' : has('linkedin', 'instagram', 'réseau', 'social') ? 'social' : has('pub', 'ads', 'campagne', 'campaign') ? 'ads' : has('automat') ? 'auto' : 'other'
  const urgency: Result['urgency'] = has('urgent', 'rapidement', 'vite', 'asap', 'soon', 'quickly', 'avant', 'before', 'cette semaine', 'this week') ? 'high' : 'normal'
  const score: Result['score'] = f.budget >= 2 || (f.budget >= 1 && urgency === 'high') ? 'hot' : f.budget >= 1 || urgency === 'high' ? 'warm' : 'cold'
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  const day = (n: number) => {
    const d = new Date()
    d.setDate(d.getDate() + n)
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1)
    return d
  }
  const fmt = (d: Date, h: string) => `${d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })} · ${h}`
  const first = f.name.trim().split(/\s+/)[0] || (lang === 'fr' ? 'Madame, Monsieur' : 'there')
  return {
    name: f.name || '—',
    company: f.company || '—',
    email: f.email || '—',
    need: t.needs[needKey as keyof typeof t.needs],
    urgency,
    budget: t.budgets[f.budget],
    score,
    reply: t.reply(first, t.needs[needKey as keyof typeof t.needs]),
    followUp: day(3).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }),
    slots: [fmt(day(1), '10:00'), fmt(day(2), '14:30'), fmt(day(3), '11:00')],
  }
}

export default function LeadFlowDemo({ lang }: { lang: Lang }) {
  const t = T[lang]
  const [form, setForm] = useState({ ...t.sample, budget: 2 })
  const [res, setRes] = useState<Result | null>(null)
  const [step, setStep] = useState(0)
  const [count, setCount] = useState(0)
  const timers = useRef<number[]>([])
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = (e: React.FormEvent) => {
    e.preventDefault()
    timers.current.forEach(clearTimeout)
    const result = analyse(lang, form)
    setRes(result)
    setStep(0)
    setCount((c) => c + 1)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    for (let i = 1; i <= 6; i++) timers.current.push(window.setTimeout(() => setStep(i), reduce ? 0 : i * 650))
    if (window.innerWidth < 1024) setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }
  const reset = () => {
    timers.current.forEach(clearTimeout)
    setRes(null)
    setStep(0)
    setForm({ ...t.sample, budget: 2 })
  }

  const scoreClass = res?.score === 'hot' ? 'bg-brand-soft text-brand-deep' : res?.score === 'warm' ? 'bg-[#FFF4D2] text-[#8a6100]' : 'bg-sand text-ink-soft'

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={run} className="card h-fit p-6 md:p-8">
        <div className="flex items-center gap-2 border-b border-line pb-4">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-3 truncate text-xs text-ink-muted">{lang === 'fr' ? 'votre-site.fr/contact' : 'your-website.com/contact'}</span>
        </div>
        <h2 className="mt-5 text-xl font-bold text-ink">{t.formTitle}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t.formSub}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="d-name">{t.name}</label>
            <input id="d-name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="d-company">{t.company}</label>
            <input id="d-company" className="field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="d-email">{t.email}</label>
            <input id="d-email" type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="d-budget">{t.budget}</label>
            <select id="d-budget" className="field" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}>
              {t.budgets.map((b, i) => <option key={b} value={i}>{b}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="d-msg">{t.message}</label>
            <textarea id="d-msg" rows={4} className="field resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary flex-1 py-3.5">{t.send}</button>
          {res && <button type="button" onClick={reset} className="btn-ghost">{t.reset}</button>}
        </div>
        <p className="mt-5 rounded-xl bg-sand px-4 py-3 text-xs leading-relaxed text-ink-muted">{t.note}</p>
      </form>

      <div className="scroll-mt-24" aria-live="polite">
        <h2 className="text-xl font-bold text-ink">{t.flowTitle}</h2>
        {!res && <p className="mt-3 rounded-2xl border border-dashed border-line p-6 text-ink-muted">{t.idle}</p>}
        <ol ref={listRef} className="mt-5 space-y-3">
          {t.steps.map((s, i) => {
            const done = res && step > i
            return (
              <li key={s} className={`rounded-2xl border p-4 transition-all duration-500 ${done ? 'border-teal/40 bg-white shadow-sm' : 'border-line bg-white/60 opacity-50'}`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${done ? 'bg-teal text-white' : 'bg-line text-ink-muted'}`}>{done ? '✓' : i + 1}</span>
                  <p className="font-semibold text-ink">{s}</p>
                </div>
                {done && res && (
                  <div className="mt-3 pl-10 text-sm text-ink-soft">
                    {i === 0 && <p><strong className="text-ink">{res.name}</strong> · {res.company} · {res.email}</p>}
                    {i === 1 && (
                      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[[t.needLbl, res.need], [t.urgLbl, t.urg[res.urgency]], [t.budLbl, res.budget]].map(([k, v]) => (
                          <div key={k} className="rounded-xl bg-sand px-3 py-2"><dt className="text-[11px] uppercase tracking-wider text-ink-muted">{k}</dt><dd className="font-medium text-ink">{v}</dd></div>
                        ))}
                        <div className={`rounded-xl px-3 py-2 ${scoreClass}`}><dt className="text-[11px] uppercase tracking-wider opacity-80">{t.scoreLbl}</dt><dd className="font-semibold">{t.score[res.score]}</dd></div>
                      </dl>
                    )}
                    {i === 2 && (
                      <div className="rounded-xl border border-line px-3 py-2.5">
                        <p className="font-semibold text-ink">{res.company} — {res.name}</p>
                        <p className="text-xs text-ink-muted">{t.crmStage}</p>
                      </div>
                    )}
                    {i === 3 && (
                      <div className="rounded-xl border border-line">
                        <p className="border-b border-line px-3 py-1.5 text-xs font-semibold text-brand-deep">{t.draftLbl}</p>
                        <p className="whitespace-pre-line px-3 py-2.5 text-ink">{res.reply}</p>
                      </div>
                    )}
                    {i === 4 && <p>{t.followLbl} <strong className="text-ink">{res.followUp}</strong>.</p>}
                    {i === 5 && (
                      <div>
                        <p className="text-xs text-ink-muted">{t.slotsLbl}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {res.slots.map((sl) => <span key={sl} className="rounded-full border border-teal/40 bg-teal-soft px-3 py-1 text-xs font-semibold text-teal-deep">{sl}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
        {res && step >= 6 && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[[String(count), t.stats[0]], [t.statVals[0], t.stats[1]], [t.statVals[1], t.stats[2]]].map(([v, k]) => (
              <div key={k} className="rounded-2xl bg-ink p-4 text-white">
                <p className="text-xl font-extrabold">{v}</p>
                <p className="mt-1 text-xs text-white/65">{k}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
