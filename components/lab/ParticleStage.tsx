'use client'

// Scène de particules de la maquette « nouveau design » :
// - en haut : le phénix RCKY dessiné en particules (il s'écarte sous la souris) ;
// - en descendant : il se disperse et disparaît ;
// - dans la section des services : les particules se reforment en icône du service affiché,
//   puis passent d'une icône à l'autre au fil du défilement.
import { useEffect, useRef } from 'react'

export type ShapeId = 'phoenix' | 'lead' | 'night' | 'team' | 'admin' | 'check'
const S = 420 // taille du canevas de dessin des formes

function drawShape(id: ShapeId, g: CanvasRenderingContext2D, logo: HTMLImageElement | null) {
  g.clearRect(0, 0, S, S)
  g.fillStyle = '#fff'
  g.strokeStyle = '#fff'
  const cut = (fn: () => void) => { g.globalCompositeOperation = 'destination-out'; fn(); g.globalCompositeOperation = 'source-over' }
  switch (id) {
    case 'phoenix':
      if (logo && logo.complete && logo.naturalWidth) {
        const r = Math.min(S / logo.naturalWidth, S / logo.naturalHeight) * 0.98
        const w = logo.naturalWidth * r, h = logo.naturalHeight * r
        g.drawImage(logo, (S - w) / 2, (S - h) / 2, w, h)
      } else { g.beginPath(); g.arc(S / 2, S / 2, 150, 0, 7); g.fill() }
      break
    case 'lead': // bulle de message avec trois points
      g.beginPath(); g.roundRect(40, 80, 340, 220, 60); g.fill()
      g.beginPath(); g.moveTo(110, 290); g.lineTo(90, 370); g.lineTo(185, 295); g.fill()
      cut(() => { [140, 210, 280].forEach((x) => { g.beginPath(); g.arc(x, 190, 24, 0, 7); g.fill() }) })
      break
    case 'night': // croissant de lune et étoiles
      g.beginPath(); g.arc(200, 220, 150, 0, 7); g.fill()
      cut(() => { g.beginPath(); g.arc(270, 170, 135, 0, 7); g.fill() })
      ;[[320, 290, 16], [355, 215, 10], [300, 360, 9]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill() })
      break
    case 'team': { // réseau d'agents reliés
      const n: [number, number, number][] = [[210, 210, 62], [90, 115, 38], [330, 105, 38], [75, 295, 36], [345, 300, 38], [210, 370, 32], [210, 50, 30]]
      g.lineWidth = 20
      n.slice(1).forEach(([x, y]) => { g.beginPath(); g.moveTo(210, 210); g.lineTo(x, y); g.stroke() })
      g.beginPath(); g.moveTo(90, 110); g.lineTo(210, 55); g.lineTo(330, 100); g.moveTo(70, 290); g.lineTo(210, 370); g.lineTo(350, 300); g.stroke()
      n.forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill() })
      break
    }
    case 'admin': // document avec coin plié et lignes
      g.beginPath(); g.moveTo(110, 40); g.lineTo(260, 40); g.lineTo(320, 100); g.lineTo(320, 380); g.lineTo(110, 380); g.closePath(); g.fill()
      cut(() => {
        g.beginPath(); g.moveTo(255, 40); g.lineTo(255, 105); g.lineTo(320, 105); g.lineTo(320, 95); g.lineTo(265, 95); g.lineTo(265, 40); g.fill()
        ;[170, 220, 270, 320].forEach((y, i) => { g.beginPath(); g.roundRect(145, y, i === 3 ? 90 : 140, 16, 8); g.fill() })
      })
      break
    case 'check': // cercle validé
      g.beginPath(); g.arc(210, 210, 165, 0, 7); g.fill()
      cut(() => { g.beginPath(); g.arc(210, 210, 135, 0, 7); g.fill() })
      g.lineWidth = 36; g.lineCap = 'round'; g.lineJoin = 'round'
      g.beginPath(); g.moveTo(140, 215); g.lineTo(190, 265); g.lineTo(285, 160); g.stroke()
      break
  }
}

function sample(id: ShapeId, n: number, logo: HTMLImageElement | null): Float32Array {
  const c = document.createElement('canvas'); c.width = S; c.height = S
  const g = c.getContext('2d', { willReadFrequently: true })!
  drawShape(id, g, logo)
  const d = g.getImageData(0, 0, S, S).data
  const pts: number[] = []
  for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2) if (d[(y * S + x) * 4 + 3] > 120) pts.push(x - S / 2, y - S / 2)
  const out = new Float32Array(n * 2)
  const m = pts.length / 2 || 1
  for (let i = 0; i < n; i++) { const k = Math.floor(Math.random() * m) * 2; out[i * 2] = (pts[k] || 0) + (Math.random() - 0.5) * 2; out[i * 2 + 1] = (pts[k + 1] || 0) + (Math.random() - 0.5) * 2 }
  return out
}

const COLORS = ['#F2A65A', '#E8742A', '#FFD08A', '#FFF1DA', '#7FD3E2']

export default function ParticleStage({ steps }: { steps: ShapeId[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const N = mobile ? 2000 : 4200
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let W = 0, H = 0
    const resize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    resize()

    // particules : position, vitesse, profondeur, couleur, direction de dispersion
    const px = new Float32Array(N), py = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N)
    const pz = new Float32Array(N), dir = new Float32Array(N * 2), col = new Uint8Array(N)
    for (let i = 0; i < N; i++) {
      px[i] = Math.random() * W; py[i] = Math.random() * H; pz[i] = Math.random()
      const a = Math.random() * Math.PI * 2, r = 0.4 + Math.random()
      dir[i * 2] = Math.cos(a) * r; dir[i * 2 + 1] = Math.sin(a) * r
      col[i] = Math.random() < 0.12 ? 4 : Math.floor(Math.random() * 4)
    }
    // étoiles de fond (fixes)
    const stars = Array.from({ length: mobile ? 90 : 180 }, () => [Math.random(), Math.random(), Math.random() * 1.2 + 0.2, Math.random() * 6])

    const logo = new Image()
    const shapes: Partial<Record<ShapeId, Float32Array>> = {}
    const build = () => { (['phoenix', ...steps] as ShapeId[]).forEach((s) => (shapes[s] = sample(s, N, logo))) }
    logo.onload = build
    logo.src = '/logo-phenix.webp'
    build()

    const mouse = { x: -9999, y: -9999 }
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)

    const smooth = (x: number) => x * x * (3 - 2 * x)
    let raf = 0, t0 = performance.now()
    const frame = (now: number) => {
      const t = (now - t0) / 1000
      // ---- état selon le défilement ----
      const hero = document.getElementById('lab-hero')
      const svc = document.getElementById('lab-services')
      const sy = window.scrollY
      const heroH = hero ? hero.offsetHeight : H
      const disperse = Math.min(1, Math.max(0, sy / (heroH * 0.7)))
      let shapeA: Float32Array | undefined = shapes.phoenix, shapeB: Float32Array | undefined, mix = 0
      let cx = W / 2, cy = (hero ? hero.offsetTop + heroH * 0.46 : H * 0.45) - sy
      let scale = Math.min(W * (mobile ? 0.95 : 0.5), H * 0.62) / S
      let spread = disperse, alpha = 1 - disperse * 0.85
      let inSvc = false
      if (svc) {
        const r = svc.getBoundingClientRect()
        const total = svc.offsetHeight - H
        const q = Math.min(1, Math.max(0, -r.top / Math.max(1, total)))
        if (r.top < H * 0.6 && r.bottom > H * 0.4) {
          inSvc = true
          const f = q * steps.length
          const i = Math.min(steps.length - 1, Math.floor(f))
          const frac = f - i
          shapeA = shapes[steps[i]]
          shapeB = shapes[steps[Math.min(steps.length - 1, i + 1)]]
          mix = i < steps.length - 1 ? smooth(Math.min(1, Math.max(0, (frac - 0.62) / 0.38))) : 0
          // entrée / sortie de la section : les particules se rassemblent puis se dispersent
          const enter = Math.min(1, Math.max(0, (H * 0.6 - r.top) / (H * 0.5)))
          const leave = Math.min(1, Math.max(0, (H * 0.9 - r.bottom) / (H * 0.5)))
          spread = 1 - enter + leave
          alpha = Math.max(0.15, 1 - spread * 0.85)
          cx = mobile ? W / 2 : W * 0.7
          cy = mobile ? H * 0.34 : H * 0.52
          scale = Math.min(W * (mobile ? 0.9 : 0.42), H * (mobile ? 0.42 : 0.7)) / S
        }
      }
      if (!inSvc && disperse >= 1) { spread = 1.4; alpha = 0.25 }

      // ---- dessin ----
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#04060B'
      ctx.fillRect(0, 0, W, H)
      for (const [sx, syy, r, ph] of stars) { ctx.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t * 0.5 + ph)); ctx.fillStyle = '#fff'; ctx.fillRect(sx * W, syy * H, r, r) }
      ctx.globalCompositeOperation = 'lighter'
      const sway = reduce ? 0 : Math.sin(t * 0.6) * 0.18
      for (let i = 0; i < N; i++) {
        let tx: number, ty: number
        if (shapeA) {
          let ax = shapeA[i * 2], ay = shapeA[i * 2 + 1]
          if (shapeB && mix > 0) { ax += (shapeB[i * 2] - ax) * mix; ay += (shapeB[i * 2 + 1] - ay) * mix }
          // léger effet 3D : rotation autour de l'axe vertical selon la profondeur
          const z = (pz[i] - 0.5) * 120
          const xr = ax * Math.cos(sway) + z * Math.sin(sway)
          tx = cx + xr * scale; ty = cy + ay * scale
        } else { tx = px[i]; ty = py[i] }
        // dispersion vers l'extérieur
        tx += dir[i * 2] * spread * Math.max(W, H) * 0.55
        ty += dir[i * 2 + 1] * spread * Math.max(W, H) * 0.55 - spread * 120
        // bruit vivant
        if (!reduce) { tx += Math.sin(t * 1.3 + i) * 1.6; ty += Math.cos(t * 1.1 + i * 0.7) * 1.6 }
        // la souris écarte les particules
        const dx = px[i] - mouse.x, dy = py[i] - mouse.y, d2 = dx * dx + dy * dy, R = mobile ? 70 : 110
        if (d2 < R * R && !reduce) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 9; vx[i] += (dx / d) * f; vy[i] += (dy / d) * f }
        vx[i] += (tx - px[i]) * (reduce ? 1 : 0.045); vy[i] += (ty - py[i]) * (reduce ? 1 : 0.045)
        vx[i] *= reduce ? 0 : 0.82; vy[i] *= reduce ? 0 : 0.82
        if (reduce) { px[i] = tx; py[i] = ty } else { px[i] += vx[i]; py[i] += vy[i] }
        if (px[i] < -20 || px[i] > W + 20 || py[i] < -20 || py[i] > H + 20) continue
        const size = 0.9 + pz[i] * 1.7
        ctx.globalAlpha = Math.min(1, alpha * (0.5 + pz[i] * 0.7))
        ctx.fillStyle = COLORS[col[i]]
        ctx.fillRect(px[i], py[i], size, size)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [steps])
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
}
