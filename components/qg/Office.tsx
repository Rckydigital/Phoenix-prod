'use client'

import { useEffect, useState } from 'react'
import type { QGData, JournalEntry, AgentFile, Post } from '@/lib/vault'
import Scene from '@/components/qg/Scene'
import Tresorerie from '@/components/qg/Tresorerie'

// ---------- Statut ----------
function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000)
}
function statusOf(last: JournalEntry | undefined, today: string): { key: 'on' | 'week' | 'off'; text: string } {
  if (!last) return { key: 'off', text: 'Pas encore passé' }
  const n = daysBetween(last.date, today)
  if (n <= 0) return { key: 'on', text: `Actif aujourd’hui à ${last.time.replace(':', 'h')}` }
  if (n <= 7) return { key: 'week', text: n === 1 ? 'Passé hier' : `Passé il y a ${n} jours` }
  return { key: 'off', text: `Dernier passage le ${last.date}` }
}

type Sel = string // id d'agent, 'reunion', 'crm' ou 'tresorerie'

export default function Office({ data }: { data: QGData }) {
  const [sel, setSel] = useState<Sel | null>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSel(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const statuses = Object.fromEntries(data.agents.map((a) => [a.id, statusOf(a.last, data.today)]))
  const activeCount = Object.values(statuses).filter((s) => s.key === 'on').length
  const progress = Math.min(100, Math.round((data.objectifs.clientsActifs / data.objectifs.clientsCible) * 100))


  return (
    <section className="bg-sand pb-16 pt-28 md:pt-32">
      <style>{`
        @keyframes qgbob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }
        .qg-bob { animation: qgbob 1.6s ease-in-out infinite }
        @keyframes qgglow { 0%,100% { opacity: 1 } 50% { opacity: .65 } }
        .qg-glow { animation: qgglow 2s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .qg-bob, .qg-glow { animation: none } }
      `}</style>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        {/* En-tête */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">QG privé</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">Le bureau de RCKY DIGITAL</h1>
            <p className="mt-1 text-ink-soft">
              {new Date(data.today + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · données du cerveau, actualisées toutes les 2 minutes
            </p>
          </div>
          <form action="/api/qg/login" method="POST">
            <input type="hidden" name="action" value="logout" />
            <button className="btn-outline px-4 py-2 text-sm">Se déconnecter</button>
          </form>
        </div>

        {data.error && (
          <p role="alert" className="mt-6 rounded-2xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8F1F22]">
            Lecture du cerveau impossible ({data.error}). Vérifie la variable CRM_GITHUB_TOKEN dans Vercel.
          </p>
        )}

        {/* Indicateurs */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { k: 'Agents actifs aujourd’hui', v: `${activeCount} / ${data.agents.length}` },
            { k: 'À valider par toi', v: String(data.aValider.length), on: () => setSel('reunion') },
            { k: 'Nouvelles demandes', v: String(data.crm.nouveaux), on: () => setSel('crm') },
            { k: 'Prospects en cours', v: String(data.crm.prospects + data.crm.enCours), on: () => setSel('crm') },
            { k: 'Solde du mois', v: (() => { const m = data.today.slice(0, 7); const s = data.operations.filter((o) => o.date.startsWith(m)).reduce((t, o) => t + (o.sens === 'Entrée' ? o.montant : -o.montant), 0); return (s < 0 ? '−' : '') + Math.abs(s).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) })(), on: () => setSel('tresorerie') },
          ].map((s) => (
            <button key={s.k} type="button" onClick={s.on} className="rounded-2xl border border-line bg-white px-4 py-3 text-left transition-shadow hover:shadow-md">
              <p className="text-xs text-ink-muted">{s.k}</p>
              <p className="mt-1 text-2xl font-extrabold text-ink">{s.v}</p>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Bureau isométrique */}
          <div className="overflow-hidden rounded-3xl border border-line bg-white">
            <div className="relative">
            {!sel && (
              <p className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink-soft shadow-sm">
                Touche un poste pour ouvrir son bureau<span className="lg:hidden"> · glisse pour explorer</span>
              </p>
            )}
            <div className="overflow-x-auto lg:overflow-visible">
              <Scene data={data} sel={sel} setSel={setSel} statuses={statuses} />
            </div>

            {/* Fenêtre de détail, posée sur le bureau */}
            {sel && (
              <div className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] lg:absolute lg:inset-x-auto lg:bottom-4 lg:right-4 lg:top-4 lg:max-h-none lg:w-[430px] lg:p-0">
                <aside
                  role="dialog"
                  aria-label="Détail du poste"
                  className="relative flex h-full max-h-[78vh] flex-col overflow-hidden rounded-t-3xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(30,42,51,0.45)] lg:max-h-none lg:rounded-3xl"
                >
                  <button
                    type="button"
                    onClick={() => setSel(null)}
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-sand text-ink hover:bg-line"
                    aria-label="Fermer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                  <div className="overflow-y-auto p-6 pr-14">
                    <Panel sel={sel} data={data} statuses={statuses} />
                  </div>
                </aside>
              </div>
            )}
            </div>

            {/* Accès rapide (pratique sur téléphone) */}
            <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3">
              {[...data.agents.map((a) => ({ id: a.id, label: a.name, color: a.color })), { id: 'reunion', label: 'Réunion', color: '#1E2A33' }, { id: 'crm', label: 'CRM', color: '#B4511A' }, { id: 'tresorerie', label: 'Trésorerie', color: '#2F6B45' }].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSel(sel === b.id ? null : b.id)}
                  aria-pressed={sel === b.id}
                  className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
                  style={sel === b.id ? { background: b.color, borderColor: b.color, color: '#fff' } : { borderColor: '#ECE6DF', color: '#1E2A33' }}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Barre objectifs */}
            <div className="border-t border-line px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">Objectif janvier : {data.objectifs.clientsCible} clients</span>
                <span className="text-ink-soft">{data.objectifs.clientsActifs} / {data.objectifs.clientsCible}</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progression vers l’objectif clients">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.max(progress, 2)}%` }} />
              </div>
            </div>
          </div>

        </div>

        {/* Journal */}
        <div className="mt-6 rounded-3xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold text-ink">Journal d’activité</h2>
          {data.journal.length === 0 ? (
            <p className="mt-3 text-ink-soft">Aucune activité enregistrée pour l’instant.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {data.journal.map((e, i) => (
                <li key={i} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
                  <span className="w-36 shrink-0 text-sm text-ink-muted">{e.date} {e.time}</span>
                  <span className="w-28 shrink-0 text-sm font-semibold text-ink">{e.agent}</span>
                  <span className="text-sm text-ink-soft">{e.what}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function Panel({ sel, data, statuses }: { sel: Sel; data: QGData; statuses: Record<string, { key: string; text: string }> }) {
  if (sel === 'reunion') {
    return (
      <div>
        <p className="text-sm font-semibold text-ink-muted">Salle de réunion</p>
        <h2 className="mt-1 text-2xl font-extrabold text-ink">Tableau de bord</h2>
        <h3 className="mt-6 font-bold text-ink">Priorités</h3>
        {data.priorites.length ? (
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">{data.priorites.map((p, i) => <li key={i}>{p}</li>)}</ol>
        ) : (
          <p className="mt-2 text-ink-soft">Le Directeur les fixera au prochain briefing.</p>
        )}
        <h3 className="mt-6 font-bold text-ink">À valider par toi ({data.aValider.length})</h3>
        {data.aValider.length ? (
          <ul className="mt-2 space-y-2">{data.aValider.map((p, i) => <li key={i} className="rounded-xl bg-brand-soft px-3 py-2 text-sm text-ink">{p}</li>)}</ul>
        ) : (
          <p className="mt-2 text-ink-soft">Rien en attente. 🎉</p>
        )}
      </div>
    )
  }

  if (sel === 'tresorerie') return <Tresorerie operations={data.operations} today={data.today} />

  if (sel === 'crm') {
    return (
      <div>
        <p className="text-sm font-semibold text-ink-muted">Mur CRM</p>
        <h2 className="mt-1 text-2xl font-extrabold text-ink">Clients et prospects</h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            ['Nouvelles demandes', data.crm.nouveaux],
            ['Prospects', data.crm.prospects],
            ['Contactés / devis', data.crm.enCours],
            ['Clients actifs', data.crm.actifs],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-2xl bg-sand px-4 py-3">
              <p className="text-xs text-ink-muted">{k}</p>
              <p className="text-2xl font-extrabold text-ink">{v}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-6 font-bold text-ink">En mouvement</h3>
        {data.crm.recents.length ? (
          <ul className="mt-2 divide-y divide-line">
            {data.crm.recents.map((c, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium text-ink">{c.nom}</span>
                <span className="rounded-full bg-teal-soft px-2 py-0.5 text-xs font-semibold text-teal-deep">{c.statut}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-ink-soft">Aucun contact en cours pour l’instant.</p>
        )}
        <p className="mt-4 text-xs text-ink-muted">Total : {data.crm.total} fiche(s) dans le CRM. Le détail est dans Obsidian.</p>
      </div>
    )
  }

  const a = data.agents.find((x) => x.id === sel)
  if (!a) return null
  const st = statuses[a.id]
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-full" style={{ background: a.color }} aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-extrabold text-ink">{a.name}</h2>
          <p className="text-sm text-ink-soft">{a.role}</p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-sand px-4 py-3">
          <dt className="text-xs text-ink-muted">Statut</dt>
          <dd className="mt-1 font-semibold text-ink">{st.text}</dd>
        </div>
        <div className="rounded-2xl bg-sand px-4 py-3">
          <dt className="text-xs text-ink-muted">Rythme</dt>
          <dd className="mt-1 font-semibold text-ink">{a.schedule}</dd>
        </div>
      </dl>
      <h3 className="mt-6 font-bold text-ink">Dernières actions</h3>
      {a.recent.length ? (
        <ul className="mt-2 space-y-2">
          {a.recent.map((e, i) => (
            <li key={i} className="rounded-xl border border-line px-3 py-2 text-sm">
              <span className="text-ink-muted">{e.date} {e.time}</span>
              <p className="text-ink">{e.what}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-ink-soft">Pas encore d’activité. {a.id === 'directeur' ? 'Premier briefing lundi à 6h45.' : 'Cet agent sera activé plus tard.'}</p>
      )}
      {a.posts && <Posts posts={a.posts} />}
      <Folder files={a.files} groups={a.groups} folder={a.folder} />
      {a.report && (
        <>
          <h3 className="mt-6 font-bold text-ink">Dernier rapport</h3>
          <p className="mt-1 text-xs text-ink-muted">{a.report.name}</p>
          <p className="mt-2 whitespace-pre-line rounded-xl bg-sand px-3 py-2 text-sm text-ink-soft">{a.report.excerpt}</p>
        </>
      )}
    </div>
  )
}

const fileUrl = (path: string, download = false) => `/api/qg/file?path=${encodeURIComponent(path)}${download ? '&download=1' : ''}`
const isImage = (ext: string) => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)
const fmtDate = (d: string) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '')
const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} Mo` : n > 1024 ? `${Math.round(n / 1024)} Ko` : `${n} o`)

function FileIcon({ ext }: { ext: string }) {
  const label = ext === 'md' ? 'FICHE' : ext.toUpperCase().slice(0, 4)
  const color = ext === 'pdf' ? '#C8383C' : ext === 'csv' ? '#3F7D4E' : ext === 'md' ? '#7A2E6B' : '#2A93A8'
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold text-white" style={{ background: color }} aria-hidden="true">
      {label}
    </span>
  )
}

function Folder({ files, groups, folder }: { files: AgentFile[]; groups: string[]; folder: string }) {
  const allGroups = Array.from(new Set([...groups, ...files.map((f) => f.group)]))
  return (
    <div className="mt-6">
      <h3 className="font-bold text-ink">Dossier</h3>
      <p className="mt-1 text-xs text-ink-muted">Dans Obsidian : {folder}</p>
      {allGroups.length === 0 && <p className="mt-2 text-sm text-ink-soft">Aucun fichier pour l’instant.</p>}
      <div className="mt-3 space-y-4">
        {allGroups.map((g) => {
          const list = files.filter((f) => f.group === g)
          return (
            <div key={g}>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{g} · {list.length}</p>
              {list.length === 0 ? (
                <p className="mt-1 text-sm text-ink-muted">Vide</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {list.map((f) => (
                    <li key={f.path} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2">
                      {isImage(f.ext) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fileUrl(f.path)} alt="" className="h-9 w-9 shrink-0 rounded-lg border border-line bg-white object-contain" />
                      ) : (
                        <FileIcon ext={f.ext} />
                      )}
                      <a href={fileUrl(f.path)} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium text-ink hover:text-brand-deep">
                        {f.name}
                      </a>
                      <span className="hidden text-xs text-ink-muted sm:inline">{fmtSize(f.size)}</span>
                      <a href={fileUrl(f.path, true)} className="rounded-full px-2 py-1 text-xs font-semibold text-brand-deep hover:bg-brand-soft" aria-label={`Télécharger ${f.name}`}>
                        ↓
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const POST_STATUS = [
  { key: 'À valider', color: 'bg-brand-soft text-brand-deep' },
  { key: 'Programmé', color: 'bg-teal-soft text-teal-deep' },
  { key: 'Publié', color: 'bg-[#EAF3EC] text-[#2E6B3C]' },
]

function Posts({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => (a.date_prevue || '').localeCompare(b.date_prevue || ''))
  return (
    <div className="mt-6">
      <h3 className="font-bold text-ink">Posts Instagram</h3>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {POST_STATUS.map((s) => (
          <span key={s.key} className={`rounded-full px-2.5 py-1 font-semibold ${s.color}`}>
            {s.key} : {posts.filter((p) => p.statut === s.key).length}
          </span>
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {sorted.map((p) => {
          const st = POST_STATUS.find((s) => s.key === p.statut) || POST_STATUS[0]
          return (
            <li key={p.path} className="rounded-xl border border-line px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <a href={fileUrl(p.path)} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-ink hover:text-brand-deep">
                  {p.name}
                </a>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.color}`}>{p.statut}</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {p.statut === 'Publié' && p.date_publication ? `Publié le ${fmtDate(p.date_publication)}` : p.date_prevue ? `Prévu le ${fmtDate(p.date_prevue)}` : 'Date à définir'}
                {p.canva && (
                  <>
                    {' · '}
                    <a href={p.canva} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-deep hover:underline">Visuel Canva</a>
                  </>
                )}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
