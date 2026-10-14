'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { spring, project, rubberband, prefersReducedMotion, type SpringHandle } from '@/lib/spring'

/**
 * Fenêtre de détail du QG, pensée « à la Apple » :
 *  - téléphone : feuille en bas, qu'on attrape et qui suit le doigt 1:1, se lance d'une pichenette
 *    (projection de l'élan), résiste au-delà du haut (rubber-band) et repart à la vitesse du doigt ;
 *  - ordinateur : panneau qui arrive depuis la droite et repart vers la droite (même chemin) ;
 *  - toujours interruptible : on peut la rattraper pendant qu'elle se ferme ;
 *  - mouvement réduit : simple fondu, sans ressort.
 */
export default function Sheet({
  onClose,
  label,
  children,
  closeSignal,
}: {
  onClose: () => void
  label: string
  children: React.ReactNode
  /** incrémenter pour demander une fermeture animée depuis le parent (touche Échap) */
  closeSignal?: number
}) {
  const panelRef = useRef<HTMLElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const anim = useRef<SpringHandle | null>(null)
  const pos = useRef(0) // décalage courant (px) : y sur téléphone, x sur ordinateur
  const size = useRef(600)
  const [desktop, setDesktop] = useState(false)
  const reduced = useRef(false)
  const drag = useRef<{ startY: number; startPos: number; hist: { y: number; t: number }[] } | null>(null)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setDesktop(mq.matches)
    const on = () => setDesktop(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const paint = useCallback(
    (p: number) => {
      pos.current = p
      const el = panelRef.current
      if (!el) return
      el.style.transform = desktop ? `translate3d(${p}px,0,0)` : `translate3d(0,${p}px,0)`
      const progress = Math.max(0, Math.min(1, 1 - p / size.current))
      if (desktop) el.style.opacity = String(progress)
      if (scrimRef.current) scrimRef.current.style.opacity = String(progress)
    },
    [desktop],
  )

  const animateTo = useCallback(
    (target: number, opts: { velocity?: number; damping?: number; response?: number } = {}, done?: () => void) => {
      anim.current?.stop()
      if (reduced.current) {
        paint(target)
        done?.()
        return
      }
      anim.current = spring(pos.current, target, (v) => paint(v), { damping: 1, response: 0.35, ...opts }, done)
    },
    [paint],
  )

  // Entrée : depuis le bas (téléphone) ou la droite (ordinateur)
  useLayoutEffect(() => {
    reduced.current = prefersReducedMotion()
    const el = panelRef.current
    if (!el) return
    size.current = desktop ? 80 : el.getBoundingClientRect().height || 600
    paint(size.current)
    if (reduced.current) {
      el.style.transition = 'opacity 200ms ease'
      el.style.opacity = '0'
      requestAnimationFrame(() => {
        el.style.opacity = '1'
        paint(0)
      })
      return
    }
    animateTo(0, { damping: 1, response: desktop ? 0.35 : 0.3 })
    return () => anim.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop])

  // Sortie : même chemin que l'entrée
  const close = useCallback(
    (velocity = 0) => {
      animateTo(size.current, { velocity, damping: 1, response: 0.3 }, onClose)
    },
    [animateTo, onClose],
  )

  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeSignal])

  // ---------- Geste (téléphone) ----------
  const onPointerDown = (e: React.PointerEvent) => {
    if (desktop) return
    anim.current?.stop() // on rattrape la feuille là où elle est
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    drag.current = { startY: e.clientY, startPos: pos.current, hist: [{ y: e.clientY, t: performance.now() }] }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const raw = d.startPos + (e.clientY - d.startY) // suit le doigt 1:1, en respectant le point de prise
    paint(raw < 0 ? rubberband(raw, size.current) : raw)
    d.hist.push({ y: e.clientY, t: performance.now() })
    if (d.hist.length > 6) d.hist.shift()
  }
  const onPointerUp = () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const a = d.hist[0]
    const b = d.hist[d.hist.length - 1]
    const dt = (b.t - a.t) / 1000
    const v = dt > 0 ? (b.y - a.y) / dt : 0 // px/s
    const landing = pos.current + project(v)
    if (landing > size.current * 0.5) close(v)
    else animateTo(0, { velocity: v, damping: Math.abs(v) > 300 ? 0.8 : 1, response: 0.3 })
  }

  return (
    <>
      {/* Voile : seulement sur téléphone (tâche « modale ») */}
      <div
        ref={scrimRef}
        aria-hidden="true"
        onClick={() => close()}
        className="fixed inset-0 z-40 bg-ink/35 lg:hidden"
        style={{ opacity: 0 }}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] lg:absolute lg:inset-x-auto lg:bottom-4 lg:right-4 lg:top-4 lg:max-h-none lg:w-[430px]">
        <aside
          ref={panelRef}
          role="dialog"
          aria-label={label}
          className="qg-sheet relative flex h-full max-h-[78vh] flex-col overflow-hidden rounded-t-3xl border border-white/60 shadow-[0_24px_60px_-20px_rgba(30,42,51,0.45)] will-change-transform lg:max-h-none lg:rounded-3xl"
        >
          {/* Poignée : on attrape ici pour descendre / lancer la feuille */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="flex h-7 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing lg:hidden"
          >
            <span className="h-1.5 w-10 rounded-full bg-ink/20" />
          </div>
          <button
            type="button"
            onClick={() => close()}
            className="press absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-sand/90 text-ink hover:bg-line"
            aria-label="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <div className="overflow-y-auto overscroll-contain p-6 pr-14 pt-2 lg:pt-6">{children}</div>
        </aside>
      </div>
    </>
  )
}
