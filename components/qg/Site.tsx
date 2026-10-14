'use client'

import { useMemo, useState } from 'react'
import type { StatRow } from '@/lib/track'

const CONV = ['formulaire', 'whatsapp', 'telephone', 'email'] as const
const LABEL: Record<string, string> = { formulaire: 'Formulaires', whatsapp: 'WhatsApp', telephone: 'Appels', email: 'E-mails' }
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %` : '—')

export default function Site({ site, today }: { site: { configured: boolean; rows: StatRow[] }; today: string }) {
  const [period, setPeriod] = useState<7 | 30>(7)
  const from = useMemo(() => new Date(Date.parse(today) - (period - 1) * 86400000).toISOString().slice(0, 10), [today, period])
  const rows = site.rows.filter((r) => r.date >= from)
  const sum = (f: (r: StatRow) => boolean) => rows.filter(f).reduce((t, r) => t + r.n, 0)
  const vues = sum((r) => r.event === 'vue')
  const conv = sum((r) => (CONV as readonly string[]).includes(r.event))

  const pages = Array.from(new Set(rows.map((r) => r.page)))
    .map((p) => ({ p, v: sum((r) => r.page === p && r.event === 'vue'), c: sum((r) => r.page === p && (CONV as readonly string[]).includes(r.event)) }))
    .filter((x) => x.v || x.c)
    .sort((a, b) => b.v - a.v)
    .slice(0, 8)
  const sources = Array.from(new Set(rows.filter((r) => r.event === 'vue' && r.source).map((r) => r.source)))
    .map((src) => ({ src, v: sum((r) => r.event === 'vue' && r.source === src) }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 6)
  const days = Array.from({ length: period }, (_, i) => new Date(Date.parse(from) + i * 86400000).toISOString().slice(0, 10))
  const perDay = days.map((d) => ({ d, v: sum((r) => r.date === d && r.event === 'vue'), c: sum((r) => r.date === d && (CONV as readonly string[]).includes(r.event)) }))
  const max = Math.max(1, ...perDay.map((x) => x.v))

  return (
    <div>
      <p className="text-sm font-semibold text-ink-muted">Bureau Marketing</p>
      <h2 className="mt-1 text-2xl font-extrabold text-ink">Site & conversion</h2>

      {!site.configured ? (
        <p className="mt-4 rounded-xl bg-brand-soft px-3 py-3 text-sm text-ink">
          La mesure n’est pas encore activée. Dans Vercel › Storage, ajoute une base <strong>Upstash Redis</strong> (gratuite) au projet phoenix-prod, puis redéploie.
        </p>
      ) : (
        <>
          <div className="mt-4 flex rounded-full bg-sand p-1 text-sm font-semibold">
            {([7, 30] as const).map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)} aria-pressed={period === p}
                className={`flex-1 rounded-full px-3 py-1.5 ${period === p ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'}`}>
                {p} derniers jours
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-sand px-3 py-3"><p className="text-xs text-ink-muted">Pages vues</p><p className="mt-1 text-xl font-extrabold text-ink">{vues}</p></div>
            <div className="rounded-2xl bg-[#E8F3EC] px-3 py-3"><p className="text-xs text-[#2F6B45]">Contacts</p><p className="mt-1 text-xl font-extrabold text-[#2F6B45]">{conv}</p></div>
            <div className="rounded-2xl bg-brand-soft px-3 py-3"><p className="text-xs text-brand-deep">Conversion</p><p className="mt-1 text-xl font-extrabold text-brand-deep">{pct(conv, vues)}</p></div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {CONV.map((k) => (
              <span key={k} className="rounded-full border border-line px-2.5 py-1 text-ink-soft">{LABEL[k]} : <strong className="text-ink">{sum((r) => r.event === k)}</strong></span>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold text-ink-muted">Par jour (barre = vues, point vert = contact)</p>
          <div className="mt-2 flex h-20 items-end gap-[2px]">
            {perDay.map((x) => (
              <div key={x.d} className="relative flex h-full flex-1 items-end" title={`${x.d} : ${x.v} vues, ${x.c} contacts`}>
                <span className="w-full rounded-t-sm bg-[#2A93A8]/70" style={{ height: `${(x.v / max) * 100}%`, minHeight: x.v ? 2 : 0 }} />
                {x.c > 0 && <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#3F9A62]" />}
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-bold text-ink">Par page</h3>
          {pages.length ? (
            <table className="mt-2 w-full text-sm">
              <thead><tr className="text-left text-xs text-ink-muted"><th className="py-1 font-medium">Page</th><th className="font-medium">Vues</th><th className="font-medium">Contacts</th><th className="font-medium">Taux</th></tr></thead>
              <tbody className="divide-y divide-line">
                {pages.map((x) => (
                  <tr key={x.p} className={x.p === '/offre' ? 'font-semibold text-brand-deep' : 'text-ink'}>
                    <td className="py-1.5">{x.p === '/' ? 'Accueil' : x.p}</td><td>{x.v}</td><td>{x.c}</td><td>{pct(x.c, x.v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">Pas encore de visite sur cette période.</p>
          )}

          <h3 className="mt-6 font-bold text-ink">D’où viennent les visiteurs</h3>
          {sources.length ? (
            <ul className="mt-2 space-y-1 text-sm">{sources.map((x) => <li key={x.src} className="flex justify-between"><span className="text-ink">{x.src}</span><span className="text-ink-muted">{x.v} vues</span></li>)}</ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">Accès direct ou source inconnue. Ajoute « ?src=insta » à tes liens pour savoir d’où viennent les gens.</p>
          )}
          <p className="mt-5 text-xs text-ink-muted">Mesure anonyme, sans cookie. Les robots sont exclus. « Contacts » = formulaires envoyés + clics WhatsApp, téléphone et e-mail.</p>
        </>
      )}
    </div>
  )
}
