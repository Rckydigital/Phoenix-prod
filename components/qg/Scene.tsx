'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { QGData } from '@/lib/vault'

// ============================================================
// Bâtiment isométrique RCKY DIGITAL
// Repère : x vers la droite-bas, y vers la gauche-bas, z vers le haut
// ============================================================
const TW = 34
const TH = 17
const OX = 450
const OY = 175
const W = 16
const D = 11
const WALL = 135

type Pt = [number, number]
const P = (x: number, y: number, z = 0): Pt => [OX + (x - y) * TW, OY + (x + y) * TH - z]
const pts = (...p: Pt[]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ')

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, v + amt))
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`
}

// ---------- Primitives ----------
function Box({ x, y, w, d, h, color, z = 0, top, shadow = true }: { x: number; y: number; w: number; d: number; h: number; color: string; z?: number; top?: string; shadow?: boolean }) {
  return (
    <g>
      {shadow && z === 0 && (
        <polygon points={pts(P(x + 0.08, y + 0.12), P(x + w + 0.18, y + 0.12), P(x + w + 0.18, y + d + 0.2), P(x + 0.08, y + d + 0.2))} fill="rgba(30,42,51,0.10)" />
      )}
      <polygon points={pts(P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h))} fill={shade(color, -22)} />
      <polygon points={pts(P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h))} fill={shade(color, -44)} />
      <polygon points={pts(P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h))} fill={top || color} />
    </g>
  )
}

// Cloison vitrée (axe x si dir='x', axe y sinon), découpée par tuile pour un bon tri de profondeur
function glassSegments(dir: 'x' | 'y', fixed: number, from: number, to: number, h = 70, keyPrefix = 'g'): Item[] {
  const out: Item[] = []
  for (let a = from; a < to - 0.001; a += 1) {
    const b = Math.min(to, a + 1)
    const [x1, y1, x2, y2] = dir === 'x' ? [a, fixed, b, fixed] : [fixed, a, fixed, b]
    out.push({
      depth: (x1 + x2) / 2 + (y1 + y2) / 2 + 0.01,
      node: (
        <g key={`${keyPrefix}-${a}`}>
          <polygon points={pts(P(x1, y1), P(x2, y2), P(x2, y2, h), P(x1, y1, h))} fill="rgba(186,224,234,0.32)" />
          <line x1={P(x1, y1, h)[0]} y1={P(x1, y1, h)[1]} x2={P(x2, y2, h)[0]} y2={P(x2, y2, h)[1]} stroke="#7F98A3" strokeWidth={2.5} />
          <line x1={P(x1, y1)[0]} y1={P(x1, y1)[1]} x2={P(x2, y2)[0]} y2={P(x2, y2)[1]} stroke="#7F98A3" strokeWidth={2} />
          <line x1={P(x1, y1)[0]} y1={P(x1, y1)[1]} x2={P(x1, y1, h)[0]} y2={P(x1, y1, h)[1]} stroke="#7F98A3" strokeWidth={1.5} />
        </g>
      ),
    })
  }
  return out
}

function Plant({ x, y, big = false }: { x: number; y: number; big?: boolean }) {
  const [px, py] = P(x, y)
  const s = big ? 1.35 : 1
  return (
    <g>
      <ellipse cx={px} cy={py + 2} rx={14 * s} ry={6 * s} fill="rgba(30,42,51,0.12)" />
      <Box x={x - 0.22 * s} y={y - 0.22 * s} w={0.44 * s} d={0.44 * s} h={18 * s} color="#D9C2A5" shadow={false} />
      <circle cx={px} cy={py - 34 * s} r={13 * s} fill="#3F7D4E" />
      <circle cx={px - 9 * s} cy={py - 26 * s} r={10 * s} fill="#4F9460" />
      <circle cx={px + 9 * s} cy={py - 28 * s} r={10 * s} fill="#356F43" />
      <circle cx={px + 2 * s} cy={py - 44 * s} r={8 * s} fill="#58A06B" />
    </g>
  )
}

function Chair({ x, y, color = '#2E3B45' }: { x: number; y: number; color?: string }) {
  return (
    <g>
      <Box x={x - 0.25} y={y - 0.25} w={0.5} d={0.5} h={12} color={color} />
      <Box x={x - 0.25} y={y - 0.3} w={0.5} d={0.1} h={16} z={12} color={color} shadow={false} />
    </g>
  )
}

// ---------- Personnages ----------
type PersonProps = { x: number; y: number; color: string; skin?: string; hair?: string; walking?: boolean; seated?: boolean; phase?: number; dim?: boolean }
function Person({ x, y, color, skin = '#E5B993', hair = '#2B2420', walking, seated, phase = 0, dim }: PersonProps) {
  const [px, py] = P(x, y)
  const lift = seated ? 10 : 0
  const step = walking ? Math.sin(phase * Math.PI * 2) * 4 : 0
  const bob = walking ? Math.abs(Math.sin(phase * Math.PI * 2)) * 1.5 : 0
  const by = py - lift - bob
  return (
    <g opacity={dim ? 0.92 : 1}>
      <ellipse cx={px} cy={py + 1} rx={11} ry={5} fill="rgba(30,42,51,0.18)" />
      {!seated && (
        <>
          <rect x={px - 6 + step * 0.4} y={by - 14} width={4.5} height={14} rx={2} fill="#2F3A44" />
          <rect x={px + 1.5 - step * 0.4} y={by - 14} width={4.5} height={14} rx={2} fill="#26303A" />
        </>
      )}
      <path d={`M${px - 10} ${by - 12} Q${px - 11} ${by - 38} ${px} ${by - 40} Q${px + 11} ${by - 38} ${px + 10} ${by - 12} Z`} fill={color} />
      <rect x={px - 13} y={by - 34 + step * 0.3} width={4} height={14} rx={2} fill={shade(color, -25)} />
      <rect x={px + 9} y={by - 34 - step * 0.3} width={4} height={14} rx={2} fill={shade(color, -25)} />
      <circle cx={px} cy={by - 49} r={9.5} fill={skin} />
      <path d={`M${px - 9.5} ${by - 51} Q${px} ${by - 65} ${px + 9.5} ${by - 51} Q${px + 3} ${by - 56} ${px - 9.5} ${by - 51} Z`} fill={hair} />
    </g>
  )
}

function Tag({ x, y, z, label, color, selected, dot }: { x: number; y: number; z: number; label: string; color: string; selected?: boolean; dot?: string }) {
  const [px, py] = P(x, y, z)
  const w = Math.max(56, label.length * 7 + (dot ? 30 : 18))
  return (
    <g>
      <rect x={px - w / 2} y={py - 12} width={w} height={24} rx={12} fill={selected ? color : '#FFFFFF'} stroke={selected ? color : '#E3DCD3'} strokeWidth={1.5} />
      {dot && <circle cx={px - w / 2 + 12} cy={py} r={4.5} fill={dot} stroke="#fff" strokeWidth={1.5} />}
      <text x={px + (dot ? 7 : 0)} y={py + 4.3} textAnchor="middle" fontSize={12} fontWeight={600} fill={selected ? '#FFFFFF' : '#1E2A33'}>
        {label}
      </text>
    </g>
  )
}

// ---------- Plan et trajets ----------
type Item = { depth: number; node: JSX.Element }
type Way = { x: number; y: number; wait?: number }

const DESKS: Record<string, { x: number; y: number; seat: [number, number] }> = {
  directeur: { x: 1.4, y: 1.5, seat: [2.5, 1.05] },
  commercial: { x: 6.3, y: 1.5, seat: [7.3, 1.05] },
  marketing: { x: 10.3, y: 1.5, seat: [11.3, 1.05] },
  finance: { x: 6.3, y: 4.2, seat: [7.3, 3.75] },
  veille: { x: 10.3, y: 4.2, seat: [11.3, 3.75] },
}

// Trajet aller (bureau → café) ; le retour est le chemin inverse
const ROUTES: Record<string, Way[]> = {
  directeur: [{ x: 2.5, y: 1.05, wait: 14 }, { x: 4.2, y: 2.9 }, { x: 5.6, y: 3.6 }, { x: 5.6, y: 7.0 }, { x: 7.0, y: 8.2, wait: 5 }],
  commercial: [{ x: 7.3, y: 1.05, wait: 11 }, { x: 9.2, y: 1.05 }, { x: 9.2, y: 7.0 }, { x: 7.6, y: 8.9, wait: 5 }],
  marketing: [{ x: 11.3, y: 1.05, wait: 16 }, { x: 9.4, y: 1.05 }, { x: 9.4, y: 7.0 }, { x: 8.6, y: 8.2, wait: 4 }],
  finance: [{ x: 7.3, y: 3.75, wait: 19 }, { x: 9.2, y: 3.75 }, { x: 9.2, y: 7.0 }, { x: 8.4, y: 9.4, wait: 5 }],
  veille: [{ x: 11.3, y: 3.75, wait: 13 }, { x: 9.4, y: 3.75 }, { x: 9.4, y: 7.2 }, { x: 13.0, y: 7.4, wait: 3 }],
}
const OFFSET: Record<string, number> = { directeur: 3, commercial: 9, marketing: 0, finance: 15, veille: 6 }
const SPEED = 1.15 // tuiles par seconde

function buildTimeline(route: Way[]) {
  const loop: Way[] = [...route, ...route.slice(1, -1).reverse().map((w) => ({ x: w.x, y: w.y }))]
  const segs: { from: Way; to: Way; walk: number; wait: number }[] = []
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i]
    const b = loop[(i + 1) % loop.length]
    segs.push({ from: a, to: b, wait: a.wait || 0, walk: Math.hypot(b.x - a.x, b.y - a.y) / SPEED })
  }
  const total = segs.reduce((s, g) => s + g.wait + g.walk, 0)
  return { segs, total }
}

function positionAt(id: string, t: number) {
  const tl = TIMELINES[id]
  let r = ((t + (OFFSET[id] || 0)) % tl.total + tl.total) % tl.total
  for (let i = 0; i < tl.segs.length; i++) {
    const g = tl.segs[i]
    if (r < g.wait) return { x: g.from.x, y: g.from.y, walking: false, seated: i === 0, phase: 0 }
    r -= g.wait
    if (r < g.walk) {
      const k = r / g.walk
      return { x: g.from.x + (g.to.x - g.from.x) * k, y: g.from.y + (g.to.y - g.from.y) * k, walking: true, seated: false, phase: (r * 1.8) % 1 }
    }
    r -= g.walk
  }
  const s = tl.segs[0].from
  return { x: s.x, y: s.y, walking: false, seated: true, phase: 0 }
}
const TIMELINES: Record<string, ReturnType<typeof buildTimeline>> = Object.fromEntries(Object.entries(ROUTES).map(([k, v]) => [k, buildTimeline(v)]))

// ---------- Scène ----------
type Status = { key: 'on' | 'week' | 'off'; text: string }
const DOT = { on: '#2FA65A', week: '#E3A21A', off: '#9AA3AB' }
const SKINS = ['#E5B993', '#8D5A3B', '#C68B5E', '#5C3A24', '#F0C9A6']
const HAIRS = ['#2B2420', '#1A1412', '#4A2E1E', '#111111', '#6B4A2E']

export default function Scene({
  data,
  sel,
  setSel,
  statuses,
}: {
  data: QGData
  sel: string | null
  setSel: (s: string | null) => void
  statuses: Record<string, Status>
}) {
  const [t, setT] = useState(0)
  const start = useRef<number | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (start.current === null) start.current = now
      if (now - last > 40) {
        setT((now - start.current) / 1000)
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const click = (id: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      setSel(id)
    },
    onKeyDown: (e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && setSel(id),
    className: 'cursor-pointer focus:outline-none',
  })

  // Visiteurs : nouvelles demandes en salle d'attente, clients actifs en réunion
  const visitors = data.crm.recents.filter((c) => c.statut.toLowerCase() === 'nouveau').slice(0, 4)
  const activeClients = data.crm.recents.filter((c) => c.statut.toLowerCase() === 'client actif').slice(0, 4)

  // ---------- Éléments statiques (mobilier, cloisons) ----------
  const staticItems = useMemo<Item[]>(() => {
    const it: Item[] = []
    const add = (depth: number, node: JSX.Element) => it.push({ depth, node })

    // Bureau du Directeur
    add(0.9, <g key="dir-shelf"><Box x={0.4} y={0.15} w={2.2} d={0.4} h={74} color="#8A6A4E" top="#A07D5E" /><Box x={0.5} y={0.1} w={0.5} d={0.3} h={14} z={74} color="#E8742A" shadow={false} /><Box x={1.2} y={0.1} w={0.35} d={0.3} h={18} z={74} color="#2A93A8" shadow={false} /></g>)
    add(4.6, <Plant key="dir-plant" x={4.4} y={0.6} big />)
    add(6.4, <g key="dir-arm"><Box x={0.6} y={3.6} w={1.1} d={1.0} h={16} color="#7A2E6B" /><Box x={0.6} y={3.6} w={0.25} d={1.0} h={30} color="#6A2860" shadow={false} /></g>)

    // Open space : rangement, imprimante, plantes
    add(15.3, <g key="printer"><Box x={14.6} y={0.3} w={1.0} d={0.7} h={30} color="#E9ECEF" /><Box x={14.75} y={0.38} w={0.7} d={0.5} h={6} z={30} color="#2E3B45" shadow={false} /></g>)
    add(13.2, <Box key="cab" x={12.6} y={0.25} w={1.4} d={0.5} h={40} color="#D8C7B0" />)
    add(15.6, <Plant key="os-plant" x={15.5} y={5.8} big />)
    add(5.9, <Plant key="os-plant2" x={5.5} y={0.5} />)

    // Salle de réunion
    for (const [cx, cy] of [[1.4, 7.6], [3.6, 7.6], [1.4, 9.4], [3.6, 9.4]] as Pt[]) add(cx + cy, <Chair key={`mc-${cx}-${cy}`} x={cx} y={cy} color="#2A93A8" />)
    add(11.0, <g key="meet-table"><Box x={1.7} y={7.9} w={1.6} d={1.2} h={24} color="#E7CBA7" top="#EFD8B9" /></g>)
    add(5.6, <g key="meet-screen"><polygon points={pts(P(0.02, 7.2, 40), P(0.02, 9.8, 40), P(0.02, 9.8, 96), P(0.02, 7.2, 96))} fill="#1E2A33" /><polygon points={pts(P(0.03, 7.35, 45), P(0.03, 9.65, 45), P(0.03, 9.65, 91), P(0.03, 7.35, 91))} fill="#2A93A8" opacity={0.85} /></g>)
    add(10.8, <Plant key="meet-plant" x={0.6} y={10.3} />)

    // Coin café
    add(15.9, <g key="coffee-counter"><Box x={5.4} y={9.6} w={2.2} d={0.9} h={32} color="#3E4A54" top="#D9D2C8" /><Box x={5.6} y={9.75} w={0.5} d={0.45} h={20} z={32} color="#1E2A33" shadow={false} /><Box x={6.5} y={9.75} w={0.35} d={0.35} h={8} z={32} color="#E8742A" shadow={false} /></g>)
    add(17.4, <g key="coffee-table"><Box x={7.7} y={8.6} w={0.25} d={0.25} h={30} color="#5B6770" /><Box x={7.25} y={8.15} w={1.15} d={1.15} h={4} z={30} color="#F1E6D8" shadow={false} /></g>)
    add(20.3, <g key="water"><Box x={9.9} y={10.2} w={0.5} d={0.5} h={28} color="#E9ECEF" /><Box x={9.95} y={10.25} w={0.4} d={0.4} h={18} z={28} color="#9ED3E0" shadow={false} /></g>)

    // Salle d'attente / accueil
    add(19.0, <g key="reception"><Box x={11.3} y={7.6} w={2.6} d={0.8} h={34} color="#E8742A" top="#F2F0EC" /></g>)
    add(24.9, <g key="sofa"><Box x={12.6} y={9.9} w={3.0} d={0.9} h={14} color="#2A93A8" /><Box x={12.6} y={10.6} w={3.0} d={0.25} h={32} color="#237E90" shadow={false} /></g>)
    add(23.8, <Box key="low-table" x={13.2} y={8.9} w={1.6} d={0.7} h={10} color="#C9A27A" top="#D9B58F" />)
    add(18.6, <Plant key="wait-plant" x={15.5} y={7.4} big />)
    add(22.2, <Plant key="wait-plant2" x={11.0} y={10.6} />)

    // Cloisons vitrées
    it.push(...glassSegments('y', 5, 0, 3.2, 70, 'dir-e1'))
    it.push(...glassSegments('y', 5, 4.4, 5, 70, 'dir-e2'))
    it.push(...glassSegments('x', 5, 0, 5, 70, 'dir-s'))
    it.push(...glassSegments('y', 5, 5, 6.2, 70, 'meet-e1'))
    it.push(...glassSegments('y', 5, 7.4, 11, 70, 'meet-e2'))
    it.push(...glassSegments('y', 10.8, 8.2, 11, 46, 'wait-w'))
    return it
  }, [])

  // ---------- Éléments dynamiques ----------
  const items: Item[] = [...staticItems]
  const tags: JSX.Element[] = []

  data.agents.forEach((a, i) => {
    const d = DESKS[a.id]
    if (!d) return
    const st = statuses[a.id]
    const isSel = sel === a.id
    const pos = positionAt(a.id, t)
    const atDesk = pos.seated
    // Bureau (table + écran + chaise)
    items.push({
      depth: d.x + 1 + d.y + 0.45,
      node: (
        <g key={`desk-${a.id}`} {...click(a.id)}>
          <Box x={d.x} y={d.y} w={2.0} d={0.9} h={26} color="#F1E6D8" top="#F7EFE4" />
          <Box x={d.x + 0.65} y={d.y + 0.12} w={0.7} d={0.08} h={0} z={26} color="#1E2A33" shadow={false} />
          <polygon
            points={pts(P(d.x + 0.67, d.y + 0.17, 27), P(d.x + 1.35, d.y + 0.17, 27), P(d.x + 1.35, d.y + 0.17, 45), P(d.x + 0.67, d.y + 0.17, 45))}
            fill={st.key === 'on' ? '#8FE3F0' : '#2E3B45'}
            stroke="#1E2A33"
            strokeWidth={1.5}
          />
          <Box x={d.x + 1.55} y={d.y + 0.25} w={0.25} d={0.25} h={7} z={26} color={a.color} shadow={false} />
          <Box x={d.x + 0.2} y={d.y + 0.5} w={0.35} d={0.25} h={3} z={26} color="#FFFFFF" shadow={false} />
        </g>
      ),
    })
    items.push({ depth: d.seat[0] + d.seat[1] - 0.3, node: <g key={`chair-${a.id}`}><Chair x={d.seat[0]} y={d.seat[1] - 0.15} /></g> })
    // Agent
    items.push({
      depth: pos.x + pos.y + (atDesk ? 0 : 0.2),
      node: (
        <g key={`ag-${a.id}`} {...click(a.id)}>
          <Person x={pos.x} y={pos.y} color={a.color} skin={SKINS[i % SKINS.length]} hair={HAIRS[i % HAIRS.length]} walking={pos.walking} seated={atDesk} phase={pos.phase} />
        </g>
      ),
    })
    tags.push(
      <g key={`tag-${a.id}`} {...click(a.id)}>
        <Tag x={pos.x} y={pos.y} z={atDesk ? 92 : 84 + (i % 2) * 26} label={a.name} color={a.color} selected={isSel} dot={DOT[st.key]} />
      </g>,
    )
  })

  // Visiteurs (nouvelles demandes) sur le canapé
  visitors.forEach((v, i) => {
    const x = 13.0 + i * 0.75
    const y = 10.2
    items.push({ depth: x + y - 0.4, node: <g key={`vis-${i}`} {...click('crm')}><Person x={x} y={y} color={['#C8383C', '#3F7D4E', '#E3A21A', '#5B6770'][i]} skin={SKINS[(i + 2) % 5]} hair={HAIRS[(i + 1) % 5]} seated /></g> })
    tags.push(<g key={`vtag-${i}`} {...click('crm')}><Tag x={x} y={y} z={84} label={v.nom.length > 16 ? v.nom.slice(0, 15) + '…' : v.nom} color="#C8383C" dot="#C8383C" selected={sel === 'crm'} /></g>)
  })

  // Clients actifs en salle de réunion
  const meetSeats: Pt[] = [[1.4, 7.6], [3.6, 7.6], [1.4, 9.4], [3.6, 9.4]]
  activeClients.forEach((c, i) => {
    const [x, y] = meetSeats[i]
    items.push({ depth: x + y + 0.05, node: <g key={`cli-${i}`} {...click('crm')}><Person x={x} y={y} color={['#3F7D4E', '#E3A21A', '#5B6770', '#C8383C'][i]} skin={SKINS[(i + 1) % 5]} hair={HAIRS[(i + 3) % 5]} seated /></g> })
    tags.push(<g key={`ctag-${i}`} {...click('crm')}><Tag x={x} y={y} z={80} label={c.nom.length > 14 ? c.nom.slice(0, 13) + '…' : c.nom} color="#2FA65A" dot="#2FA65A" /></g>)
  })

  items.sort((a, b) => a.depth - b.depth)

  const zone = (id: string, label: string, x: number, y: number, color: string, dot?: string) => (
    <g key={`zone-${id}`} {...click(id)}>
      <Tag x={x} y={y} z={0} label={label} color={color} selected={sel === id} dot={dot} />
    </g>
  )

  // Ancrages des textes muraux
  const [lx, ly] = P(5.6, 0, 118)
  const [cbx, cby] = P(0, 4.6, 46)

  return (
    <svg viewBox="20 25 990 650" className="block h-auto w-full min-w-[820px] lg:h-[calc(100vh-230px)] lg:min-h-[600px] lg:min-w-0" role="group" aria-label="Bâtiment RCKY DIGITAL : touchez un poste, la salle de réunion ou l’accueil">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CDEBF4" />
          <stop offset="1" stopColor="#F2FAFC" />
        </linearGradient>
      </defs>

      {/* Dalle du bâtiment */}
      <polygon points={pts(P(W, 0), P(W, D), P(W, D, -18), P(W, 0, -18))} fill="#B9AE9F" />
      <polygon points={pts(P(0, D), P(W, D), P(W, D, -18), P(0, D, -18))} fill="#CFC5B7" />

      {/* Murs extérieurs */}
      <polygon points={pts(P(0, 0), P(W, 0), P(W, 0, WALL), P(0, 0, WALL))} fill="#F5EEE5" />
      <polygon points={pts(P(0, 0), P(0, D), P(0, D, WALL), P(0, 0, WALL))} fill="#E9DED0" />
      <polygon points={pts(P(-0.25, -0.25, WALL), P(W, -0.25, WALL), P(W, 0, WALL), P(0, 0, WALL), P(0, D, WALL), P(-0.25, D, WALL))} fill="#C95E18" />
      <polygon points={pts(P(0, 0, 10), P(W, 0, 10), P(W, 0, 0), P(0, 0, 0))} fill="#E1D5C6" />
      <polygon points={pts(P(0, 0, 10), P(0, D, 10), P(0, D, 0), P(0, 0, 0))} fill="#D6C8B7" />

      {/* Fenêtres */}
      {[6.4, 9.0, 10.9].map((wx) => (
        <g key={`win-${wx}`}>
          <polygon points={pts(P(wx, 0, 48), P(wx + 1.5, 0, 48), P(wx + 1.5, 0, 112), P(wx, 0, 112))} fill="url(#sky)" stroke="#FFFFFF" strokeWidth={4} />
          <line x1={P(wx + 0.75, 0, 48)[0]} y1={P(wx + 0.75, 0, 48)[1]} x2={P(wx + 0.75, 0, 112)[0]} y2={P(wx + 0.75, 0, 112)[1]} stroke="#FFFFFF" strokeWidth={3} />
        </g>
      ))}
      {[1.2, 2.9].map((wy) => (
        <polygon key={`winl-${wy}`} points={pts(P(0, wy, 48), P(0, wy + 1.3, 48), P(0, wy + 1.3, 112), P(0, wy, 112))} fill="url(#sky)" stroke="#FFFFFF" strokeWidth={4} />
      ))}

      {/* Enseigne murale */}
      <g transform={`translate(${lx} ${ly}) skewY(26.565)`}>
        <text x={0} y={0} fontSize={20} fontWeight={800} fill="#1E2A33">RCKY</text>
        <text x={60} y={0} fontSize={20} fontWeight={800} fill="#B4511A">DIGITAL</text>
      </g>

      {/* Tableau CRM mural (open space, au-dessus de l'armoire) */}
      <g {...click('crm')}>
        <polygon points={pts(P(12.5, 0, 56), P(15.6, 0, 56), P(15.6, 0, 118), P(12.5, 0, 118))} fill="#1E2A33" stroke={sel === 'crm' ? '#E8742A' : '#1E2A33'} strokeWidth={3} />
        <g transform={`translate(${P(12.62, 0, 66)[0]} ${P(12.62, 0, 66)[1]}) skewY(26.565)`}>
          <text x={4} y={-32} fontSize={10} fontWeight={700} fill="#F2A65A">CRM</text>
          {[
            ['Nouv.', data.crm.nouveaux],
            ['Prosp.', data.crm.prospects],
            ['Cours', data.crm.enCours],
            ['Clients', data.crm.actifs],
          ].map(([k, v], i) => (
            <g key={String(k)} transform={`translate(${4 + i * 26} 0)`}>
              <text x={0} y={-12} fontSize={14} fontWeight={800} fill="#FFFFFF">{v}</text>
              <text x={0} y={-2} fontSize={6.5} fill="#B9C3CA">{k}</text>
            </g>
          ))}
        </g>
      </g>

      {/* Tableau du Directeur : nombre d'éléments à valider */}
      <g transform={`translate(${cbx} ${cby}) skewY(-26.565)`}>
        <rect x={-6} y={-50} width={78} height={44} rx={3} fill="#FFFFFF" stroke="#D8CBB9" />
        <text x={2} y={-34} fontSize={8} fontWeight={700} fill="#B4511A">À VALIDER</text>
        <text x={2} y={-14} fontSize={18} fontWeight={800} fill="#1E2A33">{data.aValider.length}</text>
      </g>

      {/* Sols par pièce */}
      <polygon points={pts(P(0, 0), P(W, 0), P(W, D), P(0, D))} fill="#F7F2EB" onClick={() => setSel(null)} />
      {Array.from({ length: W - 5 }, (_, i) => (
        <line key={`gx${i}`} x1={P(i + 6, 0)[0]} y1={P(i + 6, 0)[1]} x2={P(i + 6, 7)[0]} y2={P(i + 6, 7)[1]} stroke="#EEE6DB" />
      ))}
      <polygon points={pts(P(0, 0), P(5, 0), P(5, 5), P(0, 5))} fill="#E6CFAE" onClick={() => setSel(null)} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`wood${i}`} x1={P(0, (i + 1) * 0.5)[0]} y1={P(0, (i + 1) * 0.5)[1]} x2={P(5, (i + 1) * 0.5)[0]} y2={P(5, (i + 1) * 0.5)[1]} stroke="#D9BF99" />
      ))}
      <polygon points={pts(P(0.8, 2.9), P(3.9, 2.9), P(3.9, 4.7), P(0.8, 4.7))} fill="#C95E18" opacity={0.55} onClick={() => setSel(null)} />
      <polygon points={pts(P(0, 5), P(5, 5), P(5, D), P(0, D))} fill="#EAE3EE" onClick={() => setSel(null)} />
      <polygon points={pts(P(5, 7.2), P(10.8, 7.2), P(10.8, D), P(5, D))} fill="#F1E8DA" onClick={() => setSel(null)} />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`ct${i}`} x1={P(5 + (i + 1) * 0.97, 7.2)[0]} y1={P(5 + (i + 1) * 0.97, 7.2)[1]} x2={P(5 + (i + 1) * 0.97, D)[0]} y2={P(5 + (i + 1) * 0.97, D)[1]} stroke="#E4D8C6" />
      ))}
      <polygon points={pts(P(10.8, 7.2), P(W, 7.2), P(W, D), P(10.8, D))} fill="#E7F3F5" onClick={() => setSel(null)} />
      <polygon points={pts(P(14, 10.6), P(15.4, 10.6), P(15.4, D), P(14, D))} fill="#1E2A33" opacity={0.75} />
      {/* Tapis open space */}
      {Object.values(DESKS).slice(1).map((d, i) => (
        <polygon key={`rug${i}`} points={pts(P(d.x - 0.3, d.y - 1.0), P(d.x + 2.3, d.y - 1.0), P(d.x + 2.3, d.y + 1.2), P(d.x - 0.3, d.y + 1.2))} fill={['#E7F4F6', '#F5EAF2', '#FBE9E9', '#EAF3EC'][i]} />
      ))}

      {items.map((it) => it.node)}
      {tags}

      {/* Étiquettes de pièces */}
      {zone('reunion', 'Salle de réunion', 2.5, 10.9, '#1E2A33', data.aValider.length ? '#E3A21A' : '#2FA65A')}
      {zone('crm', visitors.length ? `Accueil · ${visitors.length} en attente` : 'Accueil · personne en attente', 13.4, 11.3, '#C8383C', visitors.length ? '#C8383C' : '#9AA3AB')}
      {zone('directeur', 'Bureau du Directeur', 2.4, 4.3, '#E8742A')}
    </svg>
  )
}
