'use client'

// Espace client Automation Lab : abonnement, automatisations, activité, paramètres.
// Les données viennent de Supabase ; chaque client ne voit que les siennes (règles RLS).

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabase, type Automation, type AutomationEvent, type Profile } from '@/lib/supabase'
import { Icon } from '@/components/ui'
import { PLANS, eur, r, type Lang, type PlanId } from '@/lib/i18n'
import { SITE } from '@/lib/constants'

type Tab = 'overview' | 'automations' | 'billing' | 'settings'

const T = {
  fr: {
    tabs: { overview: 'Tableau de bord', automations: 'Automatisations', billing: 'Abonnement', settings: 'Paramètres' },
    hello: 'Bonjour', logout: 'Déconnexion', loading: 'Chargement de votre espace…',
    unavailable: 'L’espace client ouvre très bientôt. En attendant, écrivez-nous ou demandez un devis.', quote: 'Demander un devis',
    plan: 'Formule', trial: 'Découverte', next: 'Prochaine étape : votre appel ou votre pilote', daysLeft: (n: number) => (n > 0 ? `${n} jour${n > 1 ? 's' : ''} restant${n > 1 ? 's' : ''}` : 'Essai terminé'),
    active: 'Automatisations actives', events30: 'Actions sur 30 jours', meetings: 'Rendez-vous pris',
    chart: 'Activité des 30 derniers jours', recent: 'Dernières actions',
    emptyTitle: 'Votre première automatisation se prépare',
    emptyText: 'Dès qu’elle sera en service, vous verrez ici les demandes traitées, les réponses, les relances et les rendez-vous. En attendant, essayez la démo ou réservez votre appel découverte de 15 min.',
    demo: 'Voir la démo LeadFlow', audit: 'Réserver mon appel découverte',
    status: { en_preparation: 'En préparation', active: 'Active', en_pause: 'En pause' },
    types: { demande: 'Demande traitée', reponse: 'Réponse envoyée', relance: 'Relance', rdv: 'Rendez-vous', autre: 'Action' },
    noAuto: 'Aucune automatisation pour l’instant.', askAuto: 'Demander une automatisation',
    subStatus: { trialing: 'Essai en cours', active: 'Abonnement actif', past_due: 'Paiement en attente', canceled: 'Abonnement arrêté' } as Record<string, string>,
    billingIntro: 'L’abonnement mensuel couvre l’hébergement, le suivi et les ajustements de vos automatisations. L’installation est facturée à part, sur devis.',
    month: '/ mois', choose: 'Activer', current: 'Formule actuelle', manage: 'Gérer mon abonnement et mes factures',
    stripeOff: 'Le paiement en ligne s’ouvre bientôt. Pour activer une formule, demandez un devis.',
    paid: 'Merci ! Votre abonnement est en cours d’activation.',
    testMode: 'Paiement en mode test : aucune somme réelle n’est débitée.',
    save: 'Enregistrer', saved: 'Enregistré.', name: 'Nom complet', company: 'Entreprise', lang: 'Langue',
    newPw: 'Nouveau mot de passe', setPw: 'Définir le mot de passe', pwDone: 'Mot de passe mis à jour.',
    err: 'Une erreur est survenue. Réessayez.',
  },
  en: {
    tabs: { overview: 'Dashboard', automations: 'Automations', billing: 'Subscription', settings: 'Settings' },
    hello: 'Hello', logout: 'Log out', loading: 'Loading your space…',
    unavailable: 'The client area opens very soon. Meanwhile, email us or request a quote.', quote: 'Request a quote',
    plan: 'Plan', trial: 'Discovery', next: 'Next step: your call or your pilot', daysLeft: (n: number) => (n > 0 ? `${n} day${n > 1 ? 's' : ''} left` : 'Trial ended'),
    active: 'Active automations', events30: 'Actions in 30 days', meetings: 'Meetings booked',
    chart: 'Activity over the last 30 days', recent: 'Latest actions',
    emptyTitle: 'Your first automation is being prepared',
    emptyText: 'Once it is live you will see requests handled, replies, follow-ups and meetings here. Meanwhile, try the demo or book your 15-min discovery call.',
    demo: 'See the LeadFlow demo', audit: 'Book my discovery call',
    status: { en_preparation: 'In preparation', active: 'Active', en_pause: 'Paused' },
    types: { demande: 'Request handled', reponse: 'Reply sent', relance: 'Follow-up', rdv: 'Meeting', autre: 'Action' },
    noAuto: 'No automation yet.', askAuto: 'Request an automation',
    subStatus: { trialing: 'Trial running', active: 'Subscription active', past_due: 'Payment pending', canceled: 'Subscription stopped' } as Record<string, string>,
    billingIntro: 'The monthly plan covers hosting, monitoring and adjustments of your automations. Setup is billed separately, on quote.',
    month: '/ month', choose: 'Activate', current: 'Current plan', manage: 'Manage my subscription and invoices',
    stripeOff: 'Online payment opens soon. To activate a plan, request a quote.',
    paid: 'Thank you! Your subscription is being activated.',
    testMode: 'Test mode payment: no real money is charged.',
    save: 'Save', saved: 'Saved.', name: 'Full name', company: 'Company', lang: 'Language',
    newPw: 'New password', setPw: 'Set password', pwDone: 'Password updated.',
    err: 'Something went wrong. Please try again.',
  },
}

export default function Dashboard({ lang, paid, reset, plan: planHint, stripeTest }: { lang: Lang; paid?: boolean; reset?: boolean; plan?: string; stripeTest?: boolean }) {
  const t = T[lang]
  const router = useRouter()
  const supabase = getSupabase()
  const [tab, setTab] = useState<Tab>(planHint ? 'billing' : 'overview')
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [autos, setAutos] = useState<Automation[]>([])
  const [events, setEvents] = useState<AutomationEvent[]>([])
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(paid ? { ok: true, text: t.paid } : null)
  const [recovery, setRecovery] = useState(!!reset)
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return setLoading(false)
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (!session) {
      if (!reset) router.replace(r('login', lang))
      return
    }
    setToken(session.access_token)
    const since = new Date(Date.now() - 30 * 864e5).toISOString()
    const [p, a, e] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
      supabase.from('automations').select('*').order('created_at', { ascending: false }),
      supabase.from('automation_events').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(500),
    ])
    setProfile((p.data as Profile) || { id: session.user.id, email: session.user.email ?? null, full_name: null, company: null, lang, plan: 'essai', trial_ends_at: null, subscription_status: 'trialing', stripe_customer_id: null })
    setAutos((a.data as Automation[]) || [])
    setEvents((e.data as AutomationEvent[]) || [])
    setLoading(false)
  }, [supabase, router, lang, reset])

  useEffect(() => {
    load()
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') load()
    })
    return () => data.subscription.unsubscribe()
  }, [load, supabase])

  const daysLeft = useMemo(() => {
    if (!profile?.trial_ends_at) return 14
    return Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 864e5))
  }, [profile])

  const perDay = useMemo(() => {
    const days: { key: string; n: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5)
      days.push({ key: d.toISOString().slice(0, 10), n: 0 })
    }
    const idx = Object.fromEntries(days.map((d, i) => [d.key, i]))
    events.forEach((ev) => {
      const k = ev.created_at.slice(0, 10)
      if (idx[k] !== undefined) days[idx[k]].n++
    })
    return days
  }, [events])

  if (!supabase) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="text-ink-soft">{t.unavailable}</p>
        <p className="mt-3"><a href={`mailto:${SITE.email}`} className="font-semibold text-brand-deep underline">{SITE.email}</a></p>
        <Link href={r('quote', lang)} className="btn-primary mt-6">{t.quote}</Link>
      </div>
    )
  }
  if (loading) return <p className="py-20 text-center text-ink-muted" role="status">{t.loading}</p>

  const planName = profile?.plan && profile.plan !== 'essai' ? PLANS.find((p) => p.id === profile.plan)?.name[lang] || profile.plan : t.trial
  const isTrial = !profile?.plan || profile.plan === 'essai'
  const activeCount = autos.filter((a) => a.status === 'active').length
  const rdv = events.filter((e) => e.type === 'rdv').length
  const max = Math.max(1, ...perDay.map((d) => d.n))

  async function api(path: string, body: object) {
    setBusy(path)
    setNote(null)
    try {
      const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.url) return (window.location.href = json.url)
      setNote({ ok: false, text: json.error === 'stripe_not_configured' ? t.stripeOff : t.err })
    } catch {
      setNote({ ok: false, text: t.err })
    } finally {
      setBusy('')
    }
  }

  async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase || !profile) return
    const f = new FormData(e.currentTarget)
    const patch = { full_name: String(f.get('full_name') || ''), company: String(f.get('company') || ''), lang: String(f.get('lang') || lang) }
    const { error } = await supabase.from('profiles').update(patch).eq('id', profile.id)
    setNote(error ? { ok: false, text: t.err } : { ok: true, text: t.saved })
    if (!error) setProfile({ ...profile, ...patch })
  }

  async function setPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return
    const pw = String(new FormData(e.currentTarget).get('pw') || '')
    const { error } = await supabase.auth.updateUser({ password: pw })
    setNote(error ? { ok: false, text: t.err } : { ok: true, text: t.pwDone })
    if (!error) setRecovery(false)
  }

  async function logout() {
    await supabase?.auth.signOut()
    router.push(r('home', lang))
  }

  const tabs: [Tab, string][] = [['overview', 'chart'], ['automations', 'bolt'], ['billing', 'doc'], ['settings', 'user']]

  return (
    <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
      <aside className="h-fit rounded-2xl bg-ink p-4 text-white lg:sticky lg:top-24">
        <p className="px-2 text-xs uppercase tracking-[0.14em] text-white/50">Automation Lab</p>
        <p className="mt-1 truncate px-2 font-semibold">{profile?.company || profile?.full_name || profile?.email}</p>
        <nav className="mt-4 flex gap-1 overflow-x-auto lg:flex-col" aria-label={t.tabs.overview}>
          {tabs.map(([k, icon]) => (
            <button key={k} type="button" onClick={() => setTab(k)} aria-current={tab === k ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium ${tab === k ? 'bg-white text-ink' : 'text-white/75 hover:bg-white/10'}`}>
              <Icon name={icon} className="h-4 w-4" />{t.tabs[k]}
            </button>
          ))}
          <button type="button" onClick={logout} className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-white/60 hover:bg-white/10 lg:mt-6">
            {t.logout}
          </button>
        </nav>
      </aside>

      <section className="min-w-0">
        <h1 className="text-2xl font-bold text-ink md:text-3xl">{t.hello}{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}</h1>
        {note && <p role={note.ok ? 'status' : 'alert'} className={`mt-4 rounded-xl px-4 py-3 text-sm ${note.ok ? 'bg-teal-soft text-teal-deep' : 'bg-[#FDECEC] text-[#8F1F22]'}`}>{note.text}</p>}

        {recovery && (
          <form onSubmit={setPassword} className="card mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1"><label className="label" htmlFor="pw">{t.newPw}</label><input id="pw" name="pw" type="password" minLength={8} required autoComplete="new-password" className="field" /></div>
            <button type="submit" className="btn-primary">{t.setPw}</button>
          </form>
        )}

        {tab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [t.plan, planName, isTrial ? t.next : t.subStatus[profile?.subscription_status || 'active'] || ''],
                [t.active, String(activeCount), `${autos.length} ${lang === 'fr' ? 'au total' : 'in total'}`],
                [t.events30, String(events.length), ''],
                [t.meetings, String(rdv), lang === 'fr' ? '30 derniers jours' : 'last 30 days'],
              ].map(([k, v, s]) => (
                <div key={k} className="card">
                  <p className="text-sm text-ink-muted">{k}</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink">{v}</p>
                  {s && <p className="mt-1 text-xs text-ink-muted">{s}</p>}
                </div>
              ))}
            </div>

            {events.length === 0 ? (
              <div className="card p-8">
                <h2 className="text-xl font-bold text-ink">{t.emptyTitle}</h2>
                <p className="mt-2 max-w-2xl text-ink-soft">{t.emptyText}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={r('demo', lang)} className="btn-primary">{t.demo}</Link>
                  <Link href={r('book', lang)} className="btn-outline">{t.audit}</Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <div className="card">
                  <h2 className="font-bold text-ink">{t.chart}</h2>
                  <svg viewBox="0 0 300 110" className="mt-4 w-full" role="img" aria-label={t.chart}>
                    {perDay.map((d, i) => {
                      const h = (d.n / max) * 90
                      return <rect key={d.key} x={i * 10 + 1} y={100 - h} width="8" height={Math.max(h, 1)} rx="2" fill={d.n ? '#2A93A8' : '#ECE6DF'}><title>{`${d.key} : ${d.n}`}</title></rect>
                    })}
                  </svg>
                  <div className="mt-1 flex justify-between text-[11px] text-ink-muted"><span>{lang === 'fr' ? 'il y a 30 jours' : '30 days ago'}</span><span>{lang === 'fr' ? 'aujourd’hui' : 'today'}</span></div>
                  <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(['demande', 'reponse', 'relance', 'rdv'] as const).map((k) => (
                      <div key={k} className="rounded-xl bg-sand px-3 py-3">
                        <dt className="text-xs text-ink-muted">{t.types[k]}</dt>
                        <dd className="mt-1 text-xl font-extrabold text-ink">{events.filter((e) => e.type === k).length}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="card">
                  <h2 className="font-bold text-ink">{t.recent}</h2>
                  <ul className="mt-3 divide-y divide-line">
                    {events.slice(0, 8).map((ev) => (
                      <li key={ev.id} className="py-2.5">
                        <p className="text-sm font-medium text-ink">{t.types[ev.type] || t.types.autre}</p>
                        <p className="text-xs text-ink-muted">{ev.label ? `${ev.label} · ` : ''}{new Date(ev.created_at).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' })}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'automations' && (
          <div className="mt-6 space-y-4">
            {autos.length === 0 && <div className="card text-ink-soft">{t.noAuto}</div>}
            {autos.map((a) => (
              <div key={a.id} className="card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-ink">{a.name}</p>
                  {a.description && <p className="mt-1 text-sm text-ink-soft">{a.description}</p>}
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${a.status === 'active' ? 'bg-teal-soft text-teal-deep' : a.status === 'en_pause' ? 'bg-sand text-ink-soft' : 'bg-brand-soft text-brand-deep'}`}>{t.status[a.status]}</span>
              </div>
            ))}
            <Link href={r('quote', lang) + '?service=lab-autre'} className="btn-outline">{t.askAuto}</Link>
          </div>
        )}

        {tab === 'billing' && (
          <div className="mt-6 space-y-6">
            <p className="max-w-2xl text-ink-soft">{t.billingIntro}</p>
            {stripeTest && <p className="rounded-xl bg-[#FFF4D2] px-4 py-3 text-sm text-[#7a5600]">{t.testMode}</p>}
            {profile?.stripe_customer_id && (
              <button type="button" disabled={!!busy} onClick={() => api('/api/stripe/portal', { lang })} className="btn-outline">{t.manage}</button>
            )}
            <div className="grid gap-4 xl:grid-cols-3">
              {PLANS.map((p) => {
                const current = profile?.plan === p.id && profile?.subscription_status === 'active'
                const hinted = planHint === p.id
                return (
                  <div key={p.id} className={`card flex flex-col ${hinted || p.popular ? 'border-2 border-brand-deep' : ''}`}>
                    <p className="font-bold text-ink">{p.name[lang]}</p>
                    <p className="mt-2"><span className="text-3xl font-extrabold text-ink">{eur(p.monthly, lang)}</span> <span className="text-ink-muted">{t.month}</span></p>
                    <ul className="mt-4 flex-1 space-y-1.5 text-sm text-ink-soft">{p.features[lang].slice(0, 3).map((f) => <li key={f}>· {f}</li>)}</ul>
                    {current ? (
                      <span className="mt-5 rounded-full bg-teal-soft py-2.5 text-center text-sm font-semibold text-teal-deep">{t.current}</span>
                    ) : (
                      <button type="button" disabled={!!busy} onClick={() => api('/api/stripe/checkout', { plan: p.id as PlanId, lang })} className="btn-primary mt-5">
                        {busy === '/api/stripe/checkout' ? '…' : `${t.choose} ${p.name[lang]}`}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'settings' && profile && (
          <form onSubmit={saveSettings} className="card mt-6 grid max-w-xl gap-4">
            <div><label className="label" htmlFor="s-name">{t.name}</label><input id="s-name" name="full_name" defaultValue={profile.full_name || ''} className="field" /></div>
            <div><label className="label" htmlFor="s-company">{t.company}</label><input id="s-company" name="company" defaultValue={profile.company || ''} className="field" /></div>
            <div>
              <label className="label" htmlFor="s-lang">{t.lang}</label>
              <select id="s-lang" name="lang" defaultValue={profile.lang || lang} className="field"><option value="fr">Français</option><option value="en">English</option></select>
            </div>
            <p className="text-sm text-ink-muted">{profile.email}</p>
            <button type="submit" className="btn-primary w-fit">{t.save}</button>
          </form>
        )}
      </section>
    </div>
  )
}
