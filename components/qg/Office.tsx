'use client'

import { useState } from 'react'
import type { QGData, JournalEntry, AgentFile, Post } from '@/lib/vault'

// ---------- Géométrie isométrique ----------
const TW = 36 // demi-largeur d'une tuile
const TH = 18 // demi-hauteur d'une tuile
const OX = 380
const OY = 175
const W = 11
const D = 9
const WALL = 120

function P(x: number, y: number, z = 0): [number, number] {
  return [OX + (x - y) * TW, OY + (x + y) * TH - z]
}
const pts = (...p: [number, number][]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ')

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return `rgb(${r},${g},${b})`
}

function Box({ x, y, w, d, h, color, z = 0 }: { x: number; y: number; w: number; d: number; h: number; color: string; z?: number }) {
  return (
    <g>
      <polygon points={pts(P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h))} fill={shade(color, -28)} />
      <polygon points={pts(P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h))} fill={shade(color, -50)} />
      <polygon points={pts(P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h))} fill={color} />
    </g>
  )
}

function Person({ x, y, color, active }: { x: number; y: number; color: string; active: boolean }) {
  const [px, py] = P(x, y)
  return (
    <g className={active ? 'qg-bob' : undefined} style={{ transformOrigin: `${px}px ${py}px` }}>
      <ellipse cx={px} cy={py} rx={13} ry={6} fill="rgba(30,42,51,0.15)" />
      <path d={`M${px - 11} ${py - 4} Q${px - 12} ${py - 34} ${px} ${py - 36} Q${px + 12} ${py - 34} ${px + 11} ${py - 4} Z`} fill={color} />
      <circle cx={px} cy={py - 46} r={10} fill="#E9C2A0" />
      <path d={`M${px - 10} ${py - 48} Q${px} ${py - 62} ${px + 10} ${py - 48} Q${px} ${py - 54} ${px - 10} ${py - 48} Z`} fill="#2B2420" />
    </g>
  )
}

function Plant({ x, y }: { x: number; y: number }) {
  const [px, py] = P(x, y)
  return (
    <g>
      <Box x={x - 0.25} y={y - 0.25} w={0.5} d={0.5} h={18} color="#C9A27A" />
      <circle cx={px} cy={py - 34} r={14} fill="#3F7D4E" />
      <circle cx={px - 9} cy={py - 26} r={10} fill="#4F9460" />
      <circle cx={px + 9} cy={py - 28} r={10} fill="#357044" />
    </g>
  )
}

function Tag({ x, y, z, label, color, selected, status }: { x: number; y: number; z: number; label: string; color: string; selected: boolean; status: 'on' | 'week' | 'off' }) {
  const [px, py] = P(x, y, z)
  const w = Math.max(64, label.length * 7.2 + 30)
  const dot = status === 'on' ? '#2FA65A' : status === 'week' ? '#E3A21A' : '#9AA3AB'
  return (
    <g>
      <rect x={px - w / 2} y={py - 13} width={w} height={26} rx={13} fill={selected ? color : '#FFFFFF'} stroke={selected ? color : '#E3DCD3'} strokeWidth={1.5} />
      <circle cx={px - w / 2 + 13} cy={py} r={4.5} fill={dot} stroke="#fff" strokeWidth={1.5} />
      <text x={px + 7} y={py + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={selected ? '#FFFFFF' : '#1E2A33'}>
        {label}
      </text>
    </g>
  )
}

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

const DESKS: Record<string, { x: number; y: number; rug: string }> = {
  directeur: { x: 1.0, y: 1.5, rug: '#FDF0E6' },
  commercial: { x: 4.6, y: 1.5, rug: '#E7F4F6' },
  veille: { x: 8.2, y: 1.5, rug: '#EAF3EC' },
  marketing: { x: 1.0, y: 5.4, rug: '#F5EAF2' },
  finance: { x: 4.6, y: 5.4, rug: '#FBE9E9' },
}

type Sel = string // id d'agent, 'reunion' ou 'crm'

export default function Office({ data }: { data: QGData }) {
  const [sel, setSel] = useState<Sel>('directeur')
  const statuses = Object.fromEntries(data.agents.map((a) => [a.id, statusOf(a.last, data.today)]))
  const activeCount = Object.values(statuses).filter((s) => s.key === 'on').length
  const progress = Math.min(100, Math.round((data.objectifs.clientsActifs / data.objectifs.clientsCible) * 100))

  // Éléments triés par profondeur (peintre)
  type Item = { depth: number; node: JSX.Element }
  const items: Item[] = []
  const tags: JSX.Element[] = []

  data.agents.forEach((a) => {
    const d = DESKS[a.id]
    if (!d) return
    const st = statuses[a.id]
    const isSel = sel === a.id
    tags.push(
      <g key={'t-' + a.id} onClick={() => setSel(a.id)} className="cursor-pointer">
        <Tag x={d.x + 1.0} y={d.y - 0.5} z={86} label={a.name} color={a.color} selected={isSel} status={st.key} />
      </g>,
    )
    items.push({
      depth: d.x + d.y,
      node: (
        <g
          key={a.id}
          role="button"
          tabIndex={0}
          aria-label={`${a.name} : ${st.text}`}
          onClick={() => setSel(a.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(a.id)}
          className="cursor-pointer focus:outline-none"
        >
          <polygon
            points={pts(P(d.x - 0.5, d.y - 1.2), P(d.x + 2.7, d.y - 1.2), P(d.x + 2.7, d.y + 1.7), P(d.x - 0.5, d.y + 1.7))}
            fill={d.rug}
            stroke={isSel ? a.color : 'transparent'}
            strokeWidth={2}
            strokeDasharray={isSel ? '6 4' : undefined}
          />
          <Box x={d.x + 0.7} y={d.y - 0.95} w={0.6} d={0.5} h={14} color="#5B6770" />
          <Person x={d.x + 1.0} y={d.y - 0.55} color={a.color} active={st.key === 'on'} />
          <Box x={d.x} y={d.y} w={2.1} d={0.95} h={26} color="#F1E6D8" />
          <Box x={d.x + 0.7} y={d.y + 0.15} w={0.75} d={0.08} h={0} z={26} color="#1E2A33" />
          <polygon
            points={pts(P(d.x + 0.72, d.y + 0.2, 27), P(d.x + 1.42, d.y + 0.2, 27), P(d.x + 1.42, d.y + 0.2, 46), P(d.x + 0.72, d.y + 0.2, 46))}
            fill={st.key === 'on' ? '#8FE3F0' : '#2E3B45'}
            stroke="#1E2A33"
            strokeWidth={1.5}
            className={st.key === 'on' ? 'qg-glow' : undefined}
          />
          <Box x={d.x + 1.6} y={d.y + 0.25} w={0.3} d={0.3} h={8} z={26} color={a.color} />
        </g>
      ),
    })
  })

  // Salle de réunion
  const [mx, my] = [8.7, 6.0]
  tags.push(
    <g key="t-reunion" onClick={() => setSel('reunion')} className="cursor-pointer">
      <Tag x={mx + 0.3} y={my + 0.3} z={78} label="Réunion" color="#1E2A33" selected={sel === 'reunion'} status={data.aValider.length ? 'week' : 'on'} />
    </g>,
  )
  items.push({
    depth: mx + my,
    node: (
      <g key="reunion" role="button" tabIndex={0} aria-label="Salle de réunion : priorités et validations" onClick={() => setSel('reunion')} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel('reunion')} className="cursor-pointer focus:outline-none">
        <polygon points={pts(P(mx - 1.6, my - 1.4), P(mx + 2.2, my - 1.4), P(mx + 2.2, my + 2.2), P(mx - 1.6, my + 2.2))} fill="#FFFFFF" stroke={sel === 'reunion' ? '#1E2A33' : '#E3DCD3'} strokeWidth={2} strokeDasharray={sel === 'reunion' ? '6 4' : undefined} />
        {[[-0.9, 0.3], [0.3, -0.9], [1.5, 0.3], [0.3, 1.5]].map(([dx, dy], i) => (
          <Box key={i} x={mx + dx - 0.2} y={my + dy - 0.2} w={0.5} d={0.5} h={14} color={['#E8742A', '#2A93A8', '#7A2E6B', '#C8383C'][i]} />
        ))}
        <ellipse cx={P(mx + 0.3, my + 0.3)[0]} cy={P(mx + 0.3, my + 0.3, 22)[1]} rx={56} ry={28} fill="#C9A27A" />
        <ellipse cx={P(mx + 0.3, my + 0.3)[0]} cy={P(mx + 0.3, my + 0.3, 24)[1]} rx={54} ry={27} fill="#E7CBA7" />
        <rect x={P(mx + 0.3, my + 0.3)[0] - 16} y={P(mx + 0.3, my + 0.3, 24)[1] - 8} width={32} height={16} rx={3} fill="#FFFFFF" stroke="#D8CBB9" />
      </g>
    ),
  })

  items.push({ depth: 10.4 + 0.6, node: <Plant key="p1" x={10.4} y={0.6} /> })
  items.push({ depth: 0.6 + 8.4, node: <Plant key="p2" x={0.6} y={8.4} /> })
  items.push({ depth: 7.2 + 8.4, node: <Plant key="p3" x={7.2} y={8.4} /> })
  items.sort((a, b) => a.depth - b.depth)

  const [bx0, by0] = P(0, 8.0, 40)
  const [lx0, ly0] = P(5.7, 0, 104)

  return (
    <section className="bg-sand pb-16 pt-28 md:pt-32">
      <style>{`
        @keyframes qgbob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }
        .qg-bob { animation: qgbob 1.6s ease-in-out infinite }
        @keyframes qgglow { 0%,100% { opacity: 1 } 50% { opacity: .65 } }
        .qg-glow { animation: qgglow 2s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .qg-bob, .qg-glow { animation: none } }
      `}</style>

      <div className="container-site">
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
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { k: 'Agents actifs aujourd’hui', v: `${activeCount} / ${data.agents.length}` },
            { k: 'À valider par toi', v: String(data.aValider.length), on: () => setSel('reunion') },
            { k: 'Nouvelles demandes', v: String(data.crm.nouveaux), on: () => setSel('crm') },
            { k: 'Prospects en cours', v: String(data.crm.prospects + data.crm.enCours), on: () => setSel('crm') },
          ].map((s) => (
            <button key={s.k} type="button" onClick={s.on} className="rounded-2xl border border-line bg-white px-4 py-3 text-left transition-shadow hover:shadow-md">
              <p className="text-xs text-ink-muted">{s.k}</p>
              <p className="mt-1 text-2xl font-extrabold text-ink">{s.v}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Bureau isométrique */}
          <div className="overflow-hidden rounded-3xl border border-line bg-white">
            <svg viewBox="40 30 750 500" className="h-auto w-full" role="group" aria-label="Plan du bureau : cliquez sur un poste pour voir le détail">
              {/* murs */}
              <polygon points={pts(P(0, 0), P(W, 0), P(W, 0, WALL), P(0, 0, WALL))} fill="#F4EDE4" />
              <polygon points={pts(P(0, 0), P(0, D), P(0, D, WALL), P(0, 0, WALL))} fill="#EADFD1" />
              <polygon points={pts(P(0, 0, WALL), P(W, 0, WALL), P(W, 0, WALL + 8), P(0, 0, WALL + 8))} fill="#E8742A" />
              <polygon points={pts(P(0, 0, WALL), P(0, D, WALL), P(0, D, WALL + 8), P(0, 0, WALL + 8))} fill="#C95E18" />
              {/* fenêtres */}
              {[1.2, 3.2].map((wx) => (
                <polygon key={wx} points={pts(P(wx, 0, 45), P(wx + 1.4, 0, 45), P(wx + 1.4, 0, 100), P(wx, 0, 100))} fill="#CDEBF1" stroke="#FFFFFF" strokeWidth={3} />
              ))}
              {/* logo mural */}
              <g transform={`translate(${lx0} ${ly0}) skewY(26.565)`}>
                <text x={0} y={0} fontSize={22} fontWeight={800} fill="#1E2A33">RCKY</text>
                <text x={68} y={0} fontSize={22} fontWeight={800} fill="#B4511A">DIGITAL</text>
                <text x={0} y={18} fontSize={10} fill="#6B7680">Agence digitale · Guadeloupe</text>
              </g>
              {/* tableau CRM mural */}
              <g role="button" tabIndex={0} aria-label="Tableau CRM" onClick={() => setSel('crm')} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel('crm')} className="cursor-pointer focus:outline-none">
                <polygon points={pts(P(0, 4.0, 34), P(0, 8.0, 34), P(0, 8.0, 106), P(0, 4.0, 106))} fill="#1E2A33" stroke={sel === 'crm' ? '#E8742A' : '#1E2A33'} strokeWidth={3} />
                <g transform={`translate(${bx0 + 8} ${by0}) skewY(-26.565)`}>
                  <text x={8} y={-38} fontSize={11} fontWeight={700} fill="#F2A65A">CRM</text>
                  {[
                    ['Nouv.', data.crm.nouveaux],
                    ['Prosp.', data.crm.prospects],
                    ['Cours', data.crm.enCours],
                    ['Clients', data.crm.actifs],
                  ].map(([k, v], i) => (
                    <g key={String(k)} transform={`translate(${2 + i * 33} 0)`}>
                      <text x={0} y={-14} fontSize={16} fontWeight={800} fill="#FFFFFF">{v}</text>
                      <text x={0} y={-2} fontSize={7} fill="#B9C3CA">{k}</text>
                    </g>
                  ))}
                </g>
              </g>
              {/* sol */}
              <polygon points={pts(P(0, 0), P(W, 0), P(W, D), P(0, D))} fill="#FAF7F3" stroke="#E3DCD3" />
              {Array.from({ length: W - 1 }, (_, i) => (
                <line key={'gx' + i} x1={P(i + 1, 0)[0]} y1={P(i + 1, 0)[1]} x2={P(i + 1, D)[0]} y2={P(i + 1, D)[1]} stroke="#EFE8DF" />
              ))}
              {Array.from({ length: D - 1 }, (_, i) => (
                <line key={'gy' + i} x1={P(0, i + 1)[0]} y1={P(0, i + 1)[1]} x2={P(W, i + 1)[0]} y2={P(W, i + 1)[1]} stroke="#EFE8DF" />
              ))}
              {items.map((it) => it.node)}
              {tags}
            </svg>

            {/* Accès rapide (pratique sur téléphone) */}
            <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3">
              {[...data.agents.map((a) => ({ id: a.id, label: a.name, color: a.color })), { id: 'reunion', label: 'Réunion', color: '#1E2A33' }, { id: 'crm', label: 'CRM', color: '#B4511A' }].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSel(b.id)}
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

          {/* Panneau de détail */}
          <aside className="rounded-3xl border border-line bg-white p-6 lg:max-h-[760px] lg:overflow-y-auto" aria-live="polite">
            <Panel sel={sel} data={data} statuses={statuses} />
          </aside>
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
