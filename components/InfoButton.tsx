'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { InfoBlock } from '@/lib/constants'

/**
 * Petit « i » cliquable : ouvre une bulle d'infos ancrée au bouton
 * (posée dans la carte parente, qui doit être en position relative). Échap ou un clic à côté la ferme.
 */
export default function InfoButton({ title, blocks }: { title: string; blocks: InfoBlock[] }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  if (!blocks?.length) return null

  return (
    <span ref={wrap} className="inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Plus d’infos : ${title}`}
        className="press flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-sm font-bold italic text-teal-deep hover:border-teal hover:bg-teal-soft"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        i
      </button>
      <span
        id={id}
        role="dialog"
        aria-label={`Détails : ${title}`}
        data-open={open}
        className="info-pop material-thick absolute inset-x-3 top-14 z-30 max-w-sm rounded-2xl p-4 text-left font-normal not-italic"
      >
        <span className="block text-sm font-bold text-ink">{title}</span>
        {blocks.map((b) => (
          <span key={b.label} className="mt-3 block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-brand-deep">{b.label}</span>
            <span className="mt-1 block space-y-1">
              {b.items.map((it) => (
                <span key={it} className="flex gap-2 text-sm leading-snug text-ink-soft">
                  <span className="text-teal" aria-hidden="true">•</span>
                  {it}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
