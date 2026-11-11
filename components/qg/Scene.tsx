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

// ---------- Mini-ville autour du bâtiment ----------
const CITY = { x0: -3, x1: 26, y0: -3.6, y1: 17.6 }
const SLOTS = 8 // places du parking clients
const slotY = (i: number) => 0.45 + i * 1.25
const CAR_COLORS = ['#C8383C', '#2A93A8', '#E3A21A', '#3F7D4E', '#7A2E6B', '#E9ECEF', '#1E2A33', '#E8742A']

function Palm({ x, y, h = 70, t = 0, lean = 0.25 }: { x: number; y: number; h?: number; t?: number; lean?: number }) {
  const [bx, by] = P(x, y)
  const [tx, ty] = P(x + lean, y - lean * 0.2, h)
  const sway = Math.sin(t * 0.9 + x + y) * 3
  const fronds = [-150, -110, -70, -30, 10, 50, 200, 160]
  return (
    <g>
      <ellipse cx={bx} cy={by + 2} rx={16} ry={7} fill="rgba(30,42,51,0.13)" />
      <path d={`M${bx - 3} ${by} Q${(bx + tx) / 2 - 8} ${(by + ty) / 2} ${tx - 2} ${ty} L${tx + 2} ${ty} Q${(bx + tx) / 2 - 3} ${(by + ty) / 2} ${bx + 3} ${by} Z`} fill="#9B7651" />
      <g transform={`rotate(${sway} ${tx} ${ty})`}>
        {fronds.map((a, i) => {
          const r = (a * Math.PI) / 180
          const ex = tx + Math.cos(r) * 30
          const ey = ty + Math.sin(r) * 13 + 9
          return <path key={i} d={`M${tx} ${ty} Q${(tx + ex) / 2} ${ty - 12 + Math.sin(r) * 4} ${ex} ${ey}`} fill="none" stroke={i % 2 ? '#3F7D4E' : '#58A06B'} strokeWidth={7} strokeLinecap="round" />
        })}
        <circle cx={tx - 3} cy={ty + 3} r={3.5} fill="#7A5A3A" />
        <circle cx={tx + 3} cy={ty + 4} r={3.5} fill="#7A5A3A" />
      </g>
    </g>
  )
}

// Case créole : murs colorés, toit à quatre pans, volets
function House({ x, y, w, d, h, wall, roof, shutter = '#FFFFFF' }: { x: number; y: number; w: number; d: number; h: number; wall: string; roof: string; shutter?: string }) {
  const apex = P(x + w / 2, y + d / 2, h + 26)
  const win = (wx: number, k: string) => (
    <polygon key={k} points={pts(P(wx, y + d, 10), P(wx + 0.45, y + d, 10), P(wx + 0.45, y + d, 26), P(wx, y + d, 26))} fill={shutter} stroke={shade(wall, -60)} strokeWidth={1} />
  )
  return (
    <g>
      <Box x={x} y={y} w={w} d={d} h={h} color={wall} />
      {w > 1.6 && win(x + 0.3, 'w1')}
      {w > 1.6 && win(x + w - 0.75, 'w2')}
      <polygon points={pts(P(x + w / 2 - 0.3, y + d, 0), P(x + w / 2 + 0.3, y + d, 0), P(x + w / 2 + 0.3, y + d, 24), P(x + w / 2 - 0.3, y + d, 24))} fill={shade(wall, -70)} />
      <polygon points={pts(P(x - 0.15, y + d + 0.15, h), P(x + w + 0.15, y + d + 0.15, h), apex)} fill={roof} />
      <polygon points={pts(P(x + w + 0.15, y - 0.15, h), P(x + w + 0.15, y + d + 0.15, h), apex)} fill={shade(roof, -30)} />
    </g>
  )
}

function Tower({ x, y, w, d, h, color }: { x: number; y: number; w: number; d: number; h: number; color: string }) {
  const rows = Math.floor((h - 20) / 22)
  const win: JSX.Element[] = []
  for (let r = 0; r < rows; r++) {
    const z = 16 + r * 22
    for (let c = 0; c < Math.floor(w / 0.7); c++) {
      const wx = x + 0.2 + c * 0.7
      win.push(<polygon key={`f${r}-${c}`} points={pts(P(wx, y + d, z), P(wx + 0.4, y + d, z), P(wx + 0.4, y + d, z + 12), P(wx, y + d, z + 12))} fill="#BFE3EE" opacity={0.85} />)
    }
    for (let c = 0; c < Math.floor(d / 0.7); c++) {
      const wy = y + 0.2 + c * 0.7
      win.push(<polygon key={`s${r}-${c}`} points={pts(P(x + w, wy, z), P(x + w, wy + 0.4, z), P(x + w, wy + 0.4, z + 12), P(x + w, wy, z + 12))} fill="#9FCAD8" opacity={0.85} />)
    }
  }
  return (
    <g>
      <Box x={x} y={y} w={w} d={d} h={h} color={color} />
      {win}
    </g>
  )
}

function Car({ x, y, color }: { x: number; y: number; color: string }) {
  const wheel = (wx: number, k: string) => {
    const [cx, cy] = P(wx, y + 0.85, 3)
    return <ellipse key={k} cx={cx} cy={cy} rx={5} ry={4} fill="#15121F" />
  }
  return (
    <g>
      <polygon points={pts(P(x + 0.05, y + 0.1), P(x + 1.85, y + 0.1), P(x + 1.85, y + 1.0), P(x + 0.05, y + 1.0))} fill="rgba(30,42,51,0.18)" />
      <Box x={x} y={y} w={1.7} d={0.85} h={11} z={3} color={color} shadow={false} />
      <Box x={x + 0.4} y={y + 0.07} w={0.95} d={0.71} h={10} z={14} color="#9FD3E2" top={color} shadow={false} />
      {wheel(x + 0.3, 'a')}
      {wheel(x + 1.35, 'b')}
      {(() => {
        const [lx, ly] = P(x, y + 0.2, 9)
        const [lx2, ly2] = P(x, y + 0.65, 9)
        return (
          <>
            <circle cx={lx} cy={ly} r={2} fill="#FFF6C8" />
            <circle cx={lx2} cy={ly2} r={2} fill="#FFF6C8" />
          </>
        )
      })()}
    </g>
  )
}

function Road({ x0, y0, x1, y1, dir }: { x0: number; y0: number; x1: number; y1: number; dir: 'x' | 'y' }) {
  const dashes: JSX.Element[] = []
  if (dir === 'x') {
    const my = (y0 + y1) / 2
    for (let a = x0 + 0.3; a < x1 - 0.5; a += 1.4) dashes.push(<line key={a} x1={P(a, my)[0]} y1={P(a, my)[1]} x2={P(a + 0.7, my)[0]} y2={P(a + 0.7, my)[1]} stroke="#F2F0EC" strokeWidth={2.5} />)
  } else {
    const mx = (x0 + x1) / 2
    for (let a = y0 + 0.3; a < y1 - 0.5; a += 1.4) dashes.push(<line key={a} x1={P(mx, a)[0]} y1={P(mx, a)[1]} x2={P(mx, a + 0.7)[0]} y2={P(mx, a + 0.7)[1]} stroke="#F2F0EC" strokeWidth={2.5} />)
  }
  return (
    <g>
      <polygon points={pts(P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1))} fill="#5B6770" />
      {dashes}
    </g>
  )
}

// ---------- Coin Dev (gaming) ----------
const rgb = (t: number) => `hsl(${Math.round((t * 50) % 360)}, 90%, 62%)`

function GamingDesk({ x, y, on, t }: { x: number; y: number; on: boolean; t: number }) {
  const scr = (x1: number, x2: number, z1: number, z2: number, fill: string, k: string) => (
    <polygon key={k} points={pts(P(x1, y + 0.2, z1), P(x2, y + 0.2, z1), P(x2, y + 0.2, z2), P(x1, y + 0.2, z2))} fill={fill} stroke="#0B0A12" strokeWidth={2} />
  )
  const [lx, ly] = P(x + 0.95, y + 0.2, 44)
  return (
    <g>
      <Box x={x} y={y} w={2.2} d={0.9} h={26} color="#20202A" top="#2B2B38" />
      {/* bande LED RGB sous le plateau */}
      <polygon points={pts(P(x, y + 0.9, 22), P(x + 2.2, y + 0.9, 22), P(x + 2.2, y + 0.9, 25), P(x, y + 0.9, 25))} fill={rgb(t)} filter="url(#neon)" />
      {/* 3 écrans */}
      {scr(x + 0.12, x + 0.72, 30, 48, on ? '#A855F7' : '#2E3B45', 's1')}
      {scr(x + 0.78, x + 1.48, 29, 52, on ? '#0F172A' : '#2E3B45', 's2')}
      {scr(x + 1.54, x + 2.12, 30, 48, on ? '#22D3EE' : '#2E3B45', 's3')}
      {on && (
        <g transform={`translate(${lx} ${ly}) skewY(26.565)`}>
          {[0, 1, 2, 3].map((r) => (
            <rect key={r} x={2 + (r % 2) * 5} y={-15 + r * 3.6 - ((t * 6) % 3.6)} width={10 + ((r * 7) % 9)} height={1.6} fill={r % 2 ? '#4ADE80' : '#F472B6'} />
          ))}
        </g>
      )}
      {/* clavier RGB + souris */}
      <Box x={x + 0.75} y={y + 0.5} w={0.7} d={0.2} h={2} z={26} color="#15121F" top={rgb(t + 2)} shadow={false} />
      <Box x={x + 1.6} y={y + 0.52} w={0.12} d={0.16} h={2} z={26} color="#15121F" top="#22D3EE" shadow={false} />
      {/* canette */}
      <Box x={x + 0.25} y={y + 0.55} w={0.12} d={0.12} h={7} z={26} color="#16A34A" shadow={false} />
    </g>
  )
}

function GamingChair({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Box x={x - 0.28} y={y - 0.28} w={0.56} d={0.56} h={12} color="#15121F" top="#C8383C" />
      <Box x={x - 0.28} y={y - 0.36} w={0.56} d={0.12} h={30} z={12} color="#15121F" top="#C8383C" shadow={false} />
      <Box x={x - 0.12} y={y - 0.37} w={0.24} d={0.02} h={22} z={16} color="#C8383C" shadow={false} />
    </g>
  )
}

// ---------- Personnages ----------
type PersonProps = { x: number; y: number; color: string; skin?: string; hair?: string; walking?: boolean; seated?: boolean; phase?: number; dim?: boolean; headset?: string }
function Person({ x, y, color, skin = '#E5B993', hair = '#2B2420', walking, seated, phase = 0, dim, headset }: PersonProps) {
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
      {headset && (
        <g>
          <path d={`M${px - 11} ${by - 48} Q${px} ${by - 68} ${px + 11} ${by - 48}`} fill="none" stroke="#15121F" strokeWidth={3} />
          <rect x={px - 13.5} y={by - 52} width={5.5} height={9} rx={2.5} fill="#15121F" stroke={headset} strokeWidth={1.2} />
          <rect x={px + 8} y={by - 52} width={5.5} height={9} rx={2.5} fill="#15121F" stroke={headset} strokeWidth={1.2} />
          <path d={`M${px - 11} ${by - 45} Q${px - 9} ${by - 39} ${px - 3} ${by - 40}`} fill="none" stroke="#15121F" strokeWidth={1.5} />
        </g>
      )}
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
  secretaire: { x: 11.3, y: 7.6, seat: [12.6, 7.25] }, // derrière le comptoir d'accueil
  dev: { x: 13.6, y: 3.4, seat: [14.6, 2.95] }, // coin gaming, au fond de l'open space
}

// Trajet aller (bureau → café) ; le retour est le chemin inverse
const ROUTES: Record<string, Way[]> = {
  directeur: [{ x: 2.5, y: 1.05, wait: 14 }, { x: 4.2, y: 2.9 }, { x: 5.6, y: 3.6 }, { x: 5.6, y: 7.0 }, { x: 7.0, y: 8.2, wait: 5 }],
  commercial: [{ x: 7.3, y: 1.05, wait: 11 }, { x: 9.2, y: 1.05 }, { x: 9.2, y: 7.0 }, { x: 7.6, y: 8.9, wait: 5 }],
  marketing: [{ x: 11.3, y: 1.05, wait: 16 }, { x: 9.4, y: 1.05 }, { x: 9.4, y: 7.0 }, { x: 8.6, y: 8.2, wait: 4 }],
  finance: [{ x: 7.3, y: 3.75, wait: 19 }, { x: 9.2, y: 3.75 }, { x: 9.2, y: 7.0 }, { x: 8.4, y: 9.4, wait: 5 }],
  veille: [{ x: 11.3, y: 3.75, wait: 13 }, { x: 9.4, y: 3.75 }, { x: 9.4, y: 7.2 }, { x: 14.6, y: 8.6, wait: 3 }],
  secretaire: [{ x: 12.6, y: 7.25, wait: 20 }, { x: 10.9, y: 7.25 }, { x: 9.6, y: 7.6 }, { x: 8.9, y: 8.8, wait: 4 }],
  // Le Dev code longtemps, puis va souffler à côté du pouf
  dev: [{ x: 14.6, y: 2.95, wait: 24 }, { x: 12.75, y: 2.95 }, { x: 12.75, y: 5.6 }, { x: 13.6, y: 5.6, wait: 7 }],
}
const OFFSET: Record<string, number> = { directeur: 3, commercial: 9, marketing: 0, finance: 15, veille: 6, secretaire: 11, dev: 2 }
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
  const [view, setView] = useState<'ville' | 'bureau'>('ville')
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
    add(5.9, <Plant key="os-plant2" x={5.5} y={0.5} />)

    // Coin Dev (gaming) : PC tour RGB, borne d'arcade, pouf, mini-frigo
    add(17.0, <g key="dev-tower"><Box x={15.75} y={3.5} w={0.22} d={0.75} h={46} color="#17141F" top="#2A2438" /><polygon points={pts(P(15.75, 3.62, 8), P(15.75, 4.13, 8), P(15.75, 4.13, 40), P(15.75, 3.62, 40))} fill="rgba(124,58,237,0.55)" stroke="#22D3EE" strokeWidth={1.2} /></g>)
    add(17.6, <g key="dev-arcade"><Box x={15.15} y={2.1} w={0.75} d={0.75} h={66} color="#2B1E4A" top="#3B2A63" /><polygon points={pts(P(15.15, 2.17, 34), P(15.15, 2.77, 34), P(15.15, 2.77, 56), P(15.15, 2.17, 56))} fill="#0B0A12" stroke="#F472B6" strokeWidth={1.5} /><polygon points={pts(P(15.15, 2.17, 58), P(15.15, 2.77, 58), P(15.15, 2.77, 66), P(15.15, 2.17, 66))} fill="#F59E0B" /><Box x={14.9} y={2.15} w={0.25} d={0.65} h={3} z={30} color="#15121F" shadow={false} /></g>)
    add(20.0, <g key="dev-bean"><ellipse cx={P(14.2, 5.9)[0]} cy={P(14.2, 5.9)[1] - 6} rx={20} ry={11} fill="#22D3EE" /><ellipse cx={P(14.2, 5.9)[0] - 3} cy={P(14.2, 5.9)[1] - 11} rx={12} ry={6} fill="#67E8F9" /></g>)
    add(16.1, <g key="dev-fridge"><Box x={12.95} y={2.2} w={0.55} d={0.55} h={24} color="#E9ECEF" /><polygon points={pts(P(12.95, 2.75, 4), P(13.5, 2.75, 4), P(13.5, 2.75, 22), P(12.95, 2.75, 22))} fill="rgba(34,211,238,0.35)" /></g>)

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
    add(20.6, <g key="reception"><Box x={11.3} y={7.6} w={2.6} d={0.8} h={34} color="#E8742A" top="#F2F0EC" /></g>)
    add(24.9, <g key="sofa"><Box x={12.6} y={9.9} w={3.0} d={0.9} h={14} color="#2A93A8" /><Box x={12.6} y={10.6} w={3.0} d={0.25} h={32} color="#237E90" shadow={false} /></g>)
    add(23.8, <Box key="low-table" x={13.2} y={8.9} w={1.6} d={0.7} h={10} color="#C9A27A" top="#D9B58F" />)
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
    if (a.id === 'dev') {
      items.push({ depth: d.x + 1 + d.y + 0.45, node: <g key="desk-dev" {...click('dev')}><GamingDesk x={d.x} y={d.y} on={st.key === 'on'} t={t} /></g> })
    } else if (a.id !== 'secretaire') items.push({
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
    items.push({ depth: d.seat[0] + d.seat[1] - 0.3, node: <g key={`chair-${a.id}`}>{a.id === 'dev' ? <GamingChair x={d.seat[0]} y={d.seat[1] - 0.15} /> : <Chair x={d.seat[0]} y={d.seat[1] - 0.15} />}</g> })
    // Agent
    items.push({
      depth: pos.x + pos.y + (atDesk ? 0 : 0.2),
      node: (
        <g key={`ag-${a.id}`} {...click(a.id)}>
          <Person x={pos.x} y={pos.y} color={a.color} skin={SKINS[i % SKINS.length]} hair={HAIRS[i % HAIRS.length]} walking={pos.walking} seated={atDesk} phase={pos.phase} headset={a.id === 'dev' ? rgb(t) : undefined} />
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

  // ---------- Ville : décor arrière (derrière le bâtiment) ----------
  const cityBack = (
    <g>
      <polygon points={pts(P(CITY.x0, CITY.y0), P(CITY.x1, CITY.y0), P(CITY.x1, CITY.y1), P(CITY.x0, CITY.y1))} fill="#CFE2B0" onClick={() => setSel(null)} />
      {/* plage et mer, en bas à droite */}
      <polygon points={pts(P(16.8, 14.8), P(CITY.x1, 14.8), P(CITY.x1, CITY.y1), P(16.8, CITY.y1))} fill="#F1DFB5" />
      <polygon points={pts(P(18.2, 16.3), P(CITY.x1, 16.3), P(CITY.x1, CITY.y1), P(18.2, CITY.y1))} fill="#5BC0D6" />
      <path d={`M${P(18.2, 16.3)[0]} ${P(18.2, 16.3)[1]} L${P(CITY.x1, 16.3)[0]} ${P(CITY.x1, 16.3)[1]}`} stroke="#E8F7FA" strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-t * 6} />
      {/* trottoir autour du bâtiment */}
      <polygon points={pts(P(-0.8, -0.8), P(16.9, -0.8), P(16.9, 12.3), P(-0.8, 12.3))} fill="#E6DED2" />
      <Road x0={CITY.x0} y0={12.4} x1={23.6} y1={14.4} dir="x" />
      <Road x0={21.6} y0={CITY.y0} x1={23.6} y1={12.4} dir="y" />
      <polygon points={pts(P(21.6, 12.4), P(23.6, 12.4), P(23.6, 14.4), P(21.6, 14.4))} fill="#5B6770" />
      {/* parking clients */}
      <polygon points={pts(P(16.9, 0), P(21.6, 0), P(21.6, 11.4), P(16.9, 11.4))} fill="#7A848C" />
      {Array.from({ length: SLOTS + 1 }, (_, i) => (
        <line key={`slot${i}`} x1={P(17.0, slotY(i))[0]} y1={P(17.0, slotY(i))[1]} x2={P(19.1, slotY(i))[0]} y2={P(19.1, slotY(i))[1]} stroke="#F2F0EC" strokeWidth={2} />
      ))}
      {Array.from({ length: SLOTS }, (_, i) => {
        const [px, py] = P(18.05, slotY(i) + 0.62)
        return <text key={`p${i}`} x={px} y={py + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill="rgba(255,255,255,0.35)">P</text>
      })}
      {[2.5, 6.5].map((ay) => (
        <path key={`ar${ay}`} d={`M${P(20.3, ay)[0]} ${P(20.3, ay)[1]} L${P(20.3, ay + 1.4)[0]} ${P(20.3, ay + 1.4)[1]}`} stroke="#F2F0EC" strokeWidth={2.5} markerEnd="url(#arrow)" />
      ))}
      {/* immeubles en fond */}
      <Tower x={0.5} y={-3.3} w={3} d={2} h={150} color="#E7D7C9" />
      <Tower x={4.8} y={-3.1} w={2.6} d={1.9} h={110} color="#CFE0E6" />
      <Tower x={8.9} y={-3.4} w={3.2} d={2.1} h={185} color="#F2D7C4" />
      <Tower x={13.4} y={-3.2} w={2.6} d={2} h={135} color="#DCE7D3" />
      <House x={17.4} y={-3.2} w={2.6} d={2} h={40} wall="#F6C9D5" roof="#B4511A" />
      <Palm x={20.6} y={-2.2} h={80} t={t} />
      <Palm x={-2} y={-1.8} h={90} t={t} />
    </g>
  )

  // ---------- Ville : décor avant (voitures = clients, cases, palmiers) ----------
  const clients = data.crm.clients.length ? data.crm.clients : Array.from({ length: data.crm.actifs }, (_, i) => `Client ${i + 1}`)
  const parked = clients.slice(0, SLOTS)
  const front: Item[] = []
  const carTags: JSX.Element[] = []
  parked.forEach((name, i) => {
    const y = slotY(i) + 0.2
    front.push({ depth: 17 + y + 1, node: <g key={`car-${i}`} {...click('crm')}><Car x={17.2} y={y} color={CAR_COLORS[i % CAR_COLORS.length]} /></g> })
    carTags.push(<g key={`cartag-${i}`} {...click('crm')}><Tag x={18} y={y + 0.4} z={46} label={name.length > 16 ? name.slice(0, 15) + '…' : name} color="#2FA65A" dot="#2FA65A" selected={sel === 'crm'} /></g>)
  })
  const deco: [number, JSX.Element][] = [
    [16.5, <House key="h1" x={0.2} y={15.2} w={2.4} d={1.9} h={36} wall="#F7D774" roof="#C8383C" shutter="#2A93A8" />],
    [19.7, <House key="h2" x={3.4} y={15.4} w={2.2} d={1.8} h={34} wall="#9ED3E0" roof="#B4511A" />],
    [23.0, <House key="h3" x={6.6} y={15.2} w={2.6} d={1.9} h={38} wall="#C9E4B4" roof="#C8383C" shutter="#E8742A" />],
    [26.0, <g key="lolo"><House x={10.2} y={15.3} w={2.6} d={1.8} h={36} wall="#FFFFFF" roof="#2A93A8" shutter="#E3A21A" /><g transform={`translate(${P(10.5, 17.1, 30)[0]} ${P(10.5, 17.1, 30)[1]}) skewY(-26.565)`}><rect x={-2} y={-11} width={44} height={14} rx={2} fill="#E3A21A" /><text x={20} y={0} textAnchor="middle" fontSize={10} fontWeight={800} fill="#1E2A33">LOLO</text></g></g>],
    [29.5, <Palm key="pf1" x={14.2} y={15.6} h={78} t={t} />],
    [32.0, <Palm key="pf2" x={16.3} y={15.9} h={66} t={t} lean={-0.2} />],
    [33.5, <g key="umbrella"><line x1={P(20.5, 15.4)[0]} y1={P(20.5, 15.4)[1]} x2={P(20.5, 15.4, 40)[0]} y2={P(20.5, 15.4, 40)[1]} stroke="#5B6770" strokeWidth={2} /><path d={`M${P(20.5, 15.4, 40)[0] - 22} ${P(20.5, 15.4, 40)[1] + 6} Q${P(20.5, 15.4, 40)[0]} ${P(20.5, 15.4, 40)[1] - 16} ${P(20.5, 15.4, 40)[0] + 22} ${P(20.5, 15.4, 40)[1] + 6} Z`} fill="#E8742A" /></g>],
    [25.2, <Palm key="pr1" x={24.6} y={0.6} h={84} t={t} />],
    [29.4, <Palm key="pr2" x={24.9} y={4.5} h={70} t={t} lean={-0.2} />],
    [33.0, <Palm key="pr3" x={24.5} y={8.5} h={88} t={t} />],
    [30.0, <g key="lamp"><line x1={P(21.2, 8.8)[0]} y1={P(21.2, 8.8)[1]} x2={P(21.2, 8.8, 64)[0]} y2={P(21.2, 8.8, 64)[1]} stroke="#3E4A54" strokeWidth={3} /><circle cx={P(21.2, 8.8, 64)[0]} cy={P(21.2, 8.8, 64)[1]} r={4} fill="#FFF6C8" /></g>],
    [21.5, <g key="psign" {...click('crm')}><line x1={P(21.2, 0.3)[0]} y1={P(21.2, 0.3)[1]} x2={P(21.2, 0.3, 58)[0]} y2={P(21.2, 0.3, 58)[1]} stroke="#3E4A54" strokeWidth={3} /><rect x={P(21.2, 0.3, 58)[0] - 13} y={P(21.2, 0.3, 58)[1] - 26} width={26} height={26} rx={5} fill="#2A6FDB" stroke="#FFFFFF" strokeWidth={2} /><text x={P(21.2, 0.3, 58)[0]} y={P(21.2, 0.3, 58)[1] - 7} textAnchor="middle" fontSize={17} fontWeight={800} fill="#FFFFFF">P</text></g>],
  ]
  deco.forEach(([depth, node]) => front.push({ depth, node }))
  front.sort((a, b) => a.depth - b.depth)

  const zone = (id: string, label: string, x: number, y: number, color: string, dot?: string) => (
    <g key={`zone-${id}`} {...click(id)}>
      <Tag x={x} y={y} z={0} label={label} color={color} selected={sel === id} dot={dot} />
    </g>
  )

  // Ancrages des textes muraux
  const [lx, ly] = P(5.6, 0, 118)
  const [cbx, cby] = P(0, 4.6, 46)

  return (
    <div className="relative">
    <div className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-full border border-line bg-white/95 text-xs font-semibold shadow-sm">
      {(['ville', 'bureau'] as const).map((v) => (
        <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} className={`px-3 py-1.5 transition-colors ${view === v ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'}`}>
          {v === 'ville' ? 'Ville' : 'Bureau'}
        </button>
      ))}
    </div>
    <svg viewBox={view === 'ville' ? '-250 -40 1720 960' : '20 25 990 650'} className={`block h-auto w-full ${view === 'ville' ? 'min-w-[1000px]' : 'min-w-[820px]'} lg:h-[calc(100vh-230px)] lg:min-h-[600px] lg:min-w-0`} role="group" aria-label="Quartier RCKY DIGITAL : touchez un poste, la salle de réunion, l’accueil ou le parking clients">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#F2F0EC" /></marker>
        <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CDEBF4" />
          <stop offset="1" stopColor="#F2FAFC" />
        </linearGradient>
      </defs>

      {view === 'ville' && cityBack}

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
      {(['commercial', 'marketing', 'finance', 'veille'] as const).map((k) => DESKS[k]).map((d, i) => (
        <polygon key={`rug${i}`} points={pts(P(d.x - 0.3, d.y - 1.0), P(d.x + 2.3, d.y - 1.0), P(d.x + 2.3, d.y + 1.2), P(d.x - 0.3, d.y + 1.2))} fill={['#E7F4F6', '#F5EAF2', '#FBE9E9', '#EAF3EC'][i]} />
      ))}

      {/* Sol du coin Dev : dalle sombre, grille et bordure néon */}
      <g onClick={() => setSel(null)}>
        <polygon points={pts(P(12.85, 2.0), P(W, 2.0), P(W, 6.95), P(12.85, 6.95))} fill="#1B1530" />
        {[3.0, 4.0, 5.0, 6.0].map((gy) => <line key={`dg-y${gy}`} x1={P(12.85, gy)[0]} y1={P(12.85, gy)[1]} x2={P(W, gy)[0]} y2={P(W, gy)[1]} stroke="#3B2A63" />)}
        {[13.85, 14.85].map((gx) => <line key={`dg-x${gx}`} x1={P(gx, 2.0)[0]} y1={P(gx, 2.0)[1]} x2={P(gx, 6.95)[0]} y2={P(gx, 6.95)[1]} stroke="#3B2A63" />)}
        <polygon points={pts(P(12.85, 2.0), P(W, 2.0), P(W, 6.95), P(12.85, 6.95))} fill="none" stroke={rgb(t)} strokeWidth={2.5} filter="url(#neon)" />
      </g>

      {items.map((it) => it.node)}
      {view === 'ville' && front.map((f) => f.node)}
      {tags}
      {view === 'ville' && carTags}

      {/* Étiquettes de pièces */}
      {zone('reunion', 'Salle de réunion', 2.5, 10.9, '#1E2A33', data.aValider.length ? '#E3A21A' : '#2FA65A')}
      {zone('crm', visitors.length ? `Accueil · ${visitors.length} en attente` : 'Accueil · personne en attente', 13.4, 11.3, '#C8383C', visitors.length ? '#C8383C' : '#9AA3AB')}
      {zone('directeur', 'Bureau du Directeur', 2.4, 4.3, '#E8742A')}
      {zone('dev', 'Labo Dev', 13.7, 6.75, '#7C3AED')}
      {view === 'ville' && zone('crm', parked.length ? `Parking clients · ${clients.length} client${clients.length > 1 ? 's' : ''}` : 'Parking clients · vide pour l’instant', 19.6, 10.6, '#2FA65A', parked.length ? '#2FA65A' : '#9AA3AB')}
    </svg>
    </div>
  )
}
