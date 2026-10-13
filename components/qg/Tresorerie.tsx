'use client'

import { useMemo, useState } from 'react'
import type { Operation } from '@/lib/vault'

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const eur = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
const signed = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '') + eur(Math.abs(n))
const fileUrl = (path: string) => `/api/qg/file?path=${encodeURIComponent(path)}`

function Arrow({ dir, onClick, label }: { dir: 'l' | 'r'; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-sand">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === 'l' ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  )
}

export default function Tresorerie({ operations, today }: { operations: Operation[]; today: string }) {
  const [year, setYear] = useState(Number(today.slice(0, 4)))
  const [month, setMonth] = useState(Number(today.slice(5, 7)) - 1)
  const [view, setView] = useState<'mois' | 'annee'>('mois')

  const total = (ops: Operation[]) => {
    const e = ops.filter((o) => o.sens === 'Entrée').reduce((s, o) => s + o.montant, 0)
    const x = ops.filter((o) => o.sens === 'Sortie').reduce((s, o) => s + o.montant, 0)
    return { e, x, solde: e - x }
  }

  const ofYear = useMemo(() => operations.filter((o) => o.date.startsWith(String(year))), [operations, year])
  const key = `${year}-${String(month + 1).padStart(2, '0')}`
  const ofMonth = ofYear.filter((o) => o.date.startsWith(key))
  const tm = total(ofMonth)
  const ty = total(ofYear)
  const perMonth = MOIS.map((_, i) => total(ofYear.filter((o) => o.date.slice(5, 7) === String(i + 1).padStart(2, '0'))))
  const max = Math.max(1, ...perMonth.map((m) => Math.max(m.e, m.x)))

  const shiftMonth = (d: number) => {
    let m = month + d, y = year
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonth(m); setYear(y)
  }

  const subs = operations
    .filter((o) => o.recurrence !== 'Ponctuel' && o.prochain_renouvellement)
    .sort((a, b) => a.prochain_renouvellement.localeCompare(b.prochain_renouvellement))
  const aSaisir = operations.filter((o) => o.abby.toLowerCase().startsWith('à saisir') || o.abby.toLowerCase().startsWith('a saisir'))
  const avances = operations.filter((o) => o.sens === 'Sortie' && o.paye_par === 'Perso').reduce((t, o) => t + o.montant, 0)
  const rembourse = operations.filter((o) => o.sens === 'Sortie' && o.categorie.toLowerCase().startsWith('remboursement')).reduce((t, o) => t + o.montant, 0)
  const duARicky = Math.max(0, avances - rembourse)
  const daysTo = (d: string) => Math.round((Date.parse(d) - Date.parse(today)) / 86400000)

  const shown = view === 'mois' ? ofMonth : ofYear
  const t = view === 'mois' ? tm : ty

  return (
    <div>
      <p className="text-sm font-semibold text-ink-muted">Bureau Finance</p>
      <h2 className="mt-1 text-2xl font-extrabold text-ink">Trésorerie</h2>

      {/* Sélecteur */}
      <div className="mt-4 flex rounded-full bg-sand p-1 text-sm font-semibold">
        {(['mois', 'annee'] as const).map((v) => (
          <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v}
            className={`flex-1 rounded-full px-3 py-1.5 ${view === v ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'}`}>
            {v === 'mois' ? 'Par mois' : 'Par année'}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {view === 'mois' ? (
          <>
            <Arrow dir="l" onClick={() => shiftMonth(-1)} label="Mois précédent" />
            <p className="text-lg font-bold text-ink" aria-live="polite">{MOIS[month]} {year}</p>
            <Arrow dir="r" onClick={() => shiftMonth(1)} label="Mois suivant" />
          </>
        ) : (
          <>
            <Arrow dir="l" onClick={() => setYear(year - 1)} label="Année précédente" />
            <p className="text-lg font-bold text-ink" aria-live="polite">{year}</p>
            <Arrow dir="r" onClick={() => setYear(year + 1)} label="Année suivante" />
          </>
        )}
      </div>

      {/* Totaux */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-[#E8F3EC] px-3 py-3">
          <p className="text-xs text-[#2F6B45]">Entrées</p>
          <p className="mt-1 text-base font-extrabold text-[#2F6B45]">{eur(t.e)}</p>
        </div>
        <div className="rounded-2xl bg-[#FDECEC] px-3 py-3">
          <p className="text-xs text-[#8F1F22]">Sorties</p>
          <p className="mt-1 text-base font-extrabold text-[#8F1F22]">{eur(t.x)}</p>
        </div>
        <div className="rounded-2xl bg-sand px-3 py-3">
          <p className="text-xs text-ink-muted">Solde</p>
          <p className={`mt-1 text-base font-extrabold ${t.solde < 0 ? 'text-[#8F1F22]' : 'text-ink'}`}>{signed(t.solde)}</p>
        </div>
      </div>

      {duARicky > 0 && (
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-dashed border-line px-4 py-3">
          <div>
            <p className="text-xs text-ink-muted">Avancé par toi (payé avec ton argent perso)</p>
            <p className="text-[11px] text-ink-muted">À te rembourser quand le compte pro encaissera</p>
          </div>
          <p className="text-base font-extrabold text-ink">{eur(duARicky)}</p>
        </div>
      )}

      {/* Mini graphique annuel (clic = ouvrir le mois) */}
      <div className="mt-5">
        <p className="text-xs font-semibold text-ink-muted">{year} mois par mois · touche un mois pour l’ouvrir</p>
        <div className="mt-2 flex h-24 items-end gap-1">
          {perMonth.map((m, i) => (
            <button key={i} type="button" onClick={() => { setMonth(i); setView('mois') }}
              aria-label={`${MOIS[i]} ${year} : entrées ${eur(m.e)}, sorties ${eur(m.x)}`}
              className={`flex h-full flex-1 flex-col items-center justify-end gap-0.5 rounded-md pb-0.5 ${view === 'mois' && i === month ? 'bg-sand' : ''}`}>
              <div className="flex w-full flex-1 items-end justify-center gap-[2px]">
                <span className="w-1/3 rounded-t-sm bg-[#3F9A62]" style={{ height: `${(m.e / max) * 100}%`, minHeight: m.e ? 3 : 0 }} />
                <span className="w-1/3 rounded-t-sm bg-[#C8383C]" style={{ height: `${(m.x / max) * 100}%`, minHeight: m.x ? 3 : 0 }} />
              </div>
              <span className="text-[10px] text-ink-muted">{MOIS[i].slice(0, 1)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Opérations */}
      <h3 className="mt-6 font-bold text-ink">Opérations ({shown.length})</h3>
      {shown.length ? (
        <ul className="mt-2 divide-y divide-line">
          {shown.map((o) => (
            <li key={o.path} className="flex items-start justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <a href={fileUrl(o.path)} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-medium text-ink hover:text-brand-deep">{o.libelle}</a>
                <p className="text-xs text-ink-muted">
                  {new Date(o.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: view === 'annee' ? undefined : undefined })}
                  {o.tiers && ` · ${o.tiers}`}{o.categorie && ` · ${o.categorie}`}
                  {o.paye_par === 'Perso' && <span className="ml-1 rounded-full bg-sand px-1.5 py-0.5 font-semibold text-ink-soft">payé perso</span>}
                  {o.sens === 'Sortie' && o.abby.toLowerCase().includes('saisir') && <span className="ml-1 rounded-full bg-brand-soft px-1.5 py-0.5 font-semibold text-brand-deep">à saisir dans Abby</span>}
                </p>
              </div>
              <span className={`shrink-0 text-sm font-bold ${o.sens === 'Entrée' ? 'text-[#2F6B45]' : 'text-[#8F1F22]'}`}>
                {o.sens === 'Entrée' ? '+' : '−'}{eur(o.montant)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-ink-soft">Aucune opération sur cette période.</p>
      )}

      {/* Abonnements */}
      <h3 className="mt-6 font-bold text-ink">Abonnements & renouvellements</h3>
      {subs.length ? (
        <ul className="mt-2 space-y-2">
          {subs.map((o) => {
            const n = daysTo(o.prochain_renouvellement)
            return (
              <li key={o.path} className={`rounded-xl border px-3 py-2 text-sm ${n <= 30 ? 'border-brand bg-brand-soft' : 'border-line'}`}>
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-ink">{o.tiers || o.libelle}</span>
                  <span className="font-semibold text-ink">{o.montant_renouvellement ? eur(o.montant_renouvellement) : eur(o.montant)}</span>
                </div>
                <p className="text-xs text-ink-muted">
                  {o.recurrence} · renouvellement le {new Date(o.prochain_renouvellement + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {n >= 0 && ` (dans ${n} j)`}
                </p>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-ink-soft">Aucun abonnement suivi.</p>
      )}

      {aSaisir.length > 0 && (
        <p className="mt-5 rounded-xl bg-brand-soft px-3 py-2 text-sm text-ink">
          {aSaisir.length} dépense{aSaisir.length > 1 ? 's' : ''} à reporter dans Abby (le connecteur ne permet pas de les saisir).
        </p>
      )}
      <p className="mt-4 text-xs text-ink-muted">Source : notes du dossier Finance › Opérations, tenues par l’agent Finance chaque vendredi.</p>
    </div>
  )
}
