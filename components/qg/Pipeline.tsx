'use client'

// Pipeline du QG : 4 colonnes, filtres (recherche, pôle, relances dues), cartes compactes.
import { useMemo, useState } from 'react'
import type { Colonne, FichePipeline } from '@/lib/qgPipeline'

export const ETAPES: { id: Colonne; titre: string; sous: string; couleur: string }[] = [
  { id: 'nouveau', titre: 'À traiter', sous: 'Prospects, à contacter', couleur: '#3B8BD4' },
  { id: 'contacte', titre: 'En cours', sous: 'Contactés, en discussion, devis', couleur: '#8B5CF6' },
  { id: 'gagne', titre: 'Clients', sous: 'Clients actifs et anciens', couleur: '#1D9A5B' },
  { id: 'perdu', titre: 'En veille', sous: 'Perdus, écartés, en pause', couleur: '#9B9389' },
]
export const CHALEUR = {
  chaud: { label: 'Chaud', fg: '#B4511A', bg: '#FDE9E4', barre: '#E0572A' },
  tiede: { label: 'Tiède', fg: '#8A6100', bg: '#FDF3D8', barre: '#F0B429' },
  froid: { label: 'Froid', fg: '#1F5E96', bg: '#E5F0FA', barre: '#3B8BD4' },
} as const

const PAR_COLONNE = 12

function joursDepuis(iso: string) {
  if (!iso) return ''
  const j = Math.floor((Date.now() - Date.parse(iso + 'T12:00:00')) / 86400000)
  return j <= 0 ? 'aujourd’hui' : j === 1 ? 'hier' : `il y a ${j} j`
}

export default function Pipeline({ fiches, onOuvrir }: { fiches: FichePipeline[]; onOuvrir: (f: FichePipeline) => void }) {
  const [q, setQ] = useState('')
  const [pole, setPole] = useState<'' | 'Pôle 1' | 'Pôle 2'>('')
  const [duesSeules, setDuesSeules] = useState(false)
  const [ouvertes, setOuvertes] = useState<Record<string, boolean>>({})

  const filtrees = useMemo(() => {
    const t = q.trim().toLowerCase()
    return fiches.filter((f) =>
      (!pole || f.pole === pole) &&
      (!duesSeules || f.relanceDue) &&
      (!t || [f.nom, f.contact, f.secteur, f.commune, f.statut, f.prochaine_action].join(' ').toLowerCase().includes(t)),
    )
  }, [fiches, q, pole, duesSeules])

  const dues = fiches.filter((f) => f.relanceDue).length

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[220px] flex-[2]">
          <span className="block text-xs font-semibold text-ink-soft">Rechercher</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Entreprise, secteur, commune, action…"
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
        </label>
        <div className="flex gap-1 rounded-xl border border-line bg-white p-1" role="group" aria-label="Pôle">
          {(['', 'Pôle 1', 'Pôle 2'] as const).map((p) => (
            <button key={p || 'tous'} type="button" onClick={() => setPole(p)} aria-pressed={pole === p}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${pole === p ? 'bg-ink text-white' : 'text-ink-soft hover:bg-sand'}`}>
              {p || 'Tous'}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setDuesSeules((v) => !v)} aria-pressed={duesSeules}
          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${duesSeules ? 'border-[#E0572A] bg-[#FDE9E4] text-[#B4511A]' : 'border-line bg-white text-ink-soft hover:bg-sand'}`}>
          ⏰ Relances dues ({dues})
        </button>
      </div>

      <div className="mt-5 grid snap-x snap-mandatory grid-flow-col gap-4 overflow-x-auto pb-3 [grid-auto-columns:85%] sm:[grid-auto-columns:minmax(260px,1fr)] lg:grid-flow-row lg:grid-cols-4">
        {ETAPES.map((e) => {
          const liste = filtrees.filter((f) => f.colonne === e.id)
          const tout = ouvertes[e.id]
          const visibles = tout ? liste : liste.slice(0, PAR_COLONNE)
          return (
            <section key={e.id} data-colonne={e.id} className="flex min-h-[360px] min-w-0 snap-start flex-col rounded-2xl border border-line bg-white/60">
              <header className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.couleur }} />
                <div>
                  <h2 className="text-sm font-bold text-ink">{e.titre}</h2>
                  <p className="text-xs text-ink-muted">{e.sous}</p>
                </div>
                <span className="ml-auto rounded-full border border-line bg-sand px-2 py-0.5 text-xs font-bold text-ink-soft">{liste.length}</span>
              </header>
              <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-2.5 p-3">
                {visibles.length === 0 && <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-sm text-ink-muted">Rien ici pour ces filtres.</p>}
                {visibles.map((f) => {
                  const c = CHALEUR[f.chaleur]
                  return (
                    <button
                      key={f.path}
                      type="button"
                      data-fiche={f.id}
                      onClick={() => onOuvrir(f)}
                      className="relative w-full min-w-0 overflow-hidden rounded-xl border border-line bg-white px-3.5 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                    >
                      <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r" style={{ background: c.barre }} />
                      <span className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide" style={{ color: c.fg, background: c.bg }}>{c.label}</span>
                        <span className="rounded-md bg-sand px-1.5 py-0.5 font-semibold">{f.pole}</span>
                        <span className="ml-auto whitespace-nowrap">{f.date_contact ? joursDepuis(f.date_contact) : 'jamais contacté'}</span>
                      </span>
                      <span className="mt-1.5 block font-bold leading-snug text-ink [overflow-wrap:anywhere]">{f.nom}</span>
                      <span className="block truncate text-[13px] text-ink-soft">{[f.statut, f.secteur, f.commune].filter(Boolean).join(' · ')}</span>
                      {f.prochaine_action && (
                        <span className={`mt-2 line-clamp-2 block rounded-lg px-2 py-1 text-xs ${f.relanceDue ? 'bg-[#FDE9E4] font-semibold text-[#B4511A]' : 'bg-sand text-ink-soft'}`}>
                          {f.relanceDue ? '⏰ ' : '→ '}{f.prochaine_action}
                        </span>
                      )}
                    </button>
                  )
                })}
                {liste.length > PAR_COLONNE && (
                  <button type="button" onClick={() => setOuvertes((o) => ({ ...o, [e.id]: !tout }))} className="rounded-xl py-2 text-sm font-semibold text-teal-deep hover:bg-sand">
                    {tout ? 'Réduire' : `Voir les ${liste.length - PAR_COLONNE} autres`}
                  </button>
                )}
              </div>
            </section>
          )
        })}
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        Lecture seule : pour changer une étape, modifie le statut dans la fiche (Obsidian) ou laisse l’agent le faire. Le QG se met à jour en 2 minutes.
      </p>
    </div>
  )
}
