'use client'

// Panneau de détail d'une fiche prospect (tiroir à droite, plein écran sur mobile).
import { useEffect, useRef } from 'react'
import type { FichePipeline } from '@/lib/qgPipeline'
import { CHALEUR, ETAPES } from '@/components/qg/Pipeline'

export default function FichePanel({ fiche, demo, onFermer }: { fiche: FichePipeline | null; demo: boolean; onFermer: () => void }) {
  const fermer = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!fiche) return
    fermer.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fiche, onFermer])

  const etape = fiche && ETAPES.find((e) => e.id === fiche.colonne)
  const c = fiche && CHALEUR[fiche.chaleur]
  const lignes: [string, string, string?][] = fiche
    ? [
        ['Statut', fiche.statut],
        ['Contact', fiche.contact],
        ['Secteur', fiche.secteur],
        ['Lieu', fiche.commune],
        ['E-mail', fiche.email, fiche.email && !demo ? `mailto:${fiche.email}` : undefined],
        ['Téléphone', fiche.telephone, fiche.telephone && !demo ? `tel:${fiche.telephone.replace(/\s/g, '')}` : undefined],
        ['Site', fiche.site, /^https?:\/\//.test(fiche.site) ? fiche.site : undefined],
        ['Source', fiche.source],
        ['Dernier contact', fiche.date_contact],
      ]
    : []

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onFermer}
        className={`fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px] transition-opacity ${fiche ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={fiche ? `Fiche ${fiche.nom}` : 'Fiche'}
        aria-hidden={!fiche}
        id="qg-panneau"
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-[480px] flex-col bg-sand shadow-2xl transition-transform duration-300 ${fiche ? 'translate-x-0' : 'pointer-events-none translate-x-full'}`}
      >
        {fiche && etape && c && (
          <>
            <div className="flex items-center gap-3 border-b border-line bg-white px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink-muted">{fiche.pole} · {etape.titre}</p>
                <h2 id="qg-panneau-titre" className="truncate text-lg font-extrabold text-ink">{fiche.nom}</h2>
              </div>
              <button ref={fermer} type="button" onClick={onFermer} aria-label="Fermer la fiche" className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-sand text-lg text-ink">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide" style={{ color: c.fg, background: c.bg }}>{c.label}</span>
                <span className="rounded-full px-2.5 py-1 text-xs font-bold text-white" style={{ background: etape.couleur }}>{fiche.statut}</span>
                {fiche.relanceDue && <span className="rounded-full bg-[#FDE9E4] px-2.5 py-1 text-xs font-bold text-[#B4511A]">⏰ Relance due</span>}
              </div>

              {fiche.prochaine_action && (
                <div className={`mt-4 rounded-2xl px-4 py-3 ${fiche.relanceDue ? 'bg-[#FDE9E4]' : 'bg-white'} border border-line`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Prochaine action</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{fiche.prochaine_action}</p>
                  {fiche.relance && <p className="mt-1 text-xs text-ink-muted">Date repérée : {new Date(fiche.relance + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>}
                </div>
              )}

              <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-sm">
                {lignes.filter(([, v]) => v).map(([k, v, href]) => (
                  <div key={k} className="contents">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="min-w-0 [overflow-wrap:anywhere] text-ink">
                      {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="font-semibold text-teal-deep underline">{v}</a> : v}
                    </dd>
                  </div>
                ))}
              </dl>

              {fiche.extrait && (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Extrait de la fiche</p>
                  <p className="mt-1 whitespace-pre-line rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-soft">{fiche.extrait}</p>
                </div>
              )}

              {!demo && (
                <a href={`/api/qg/file?path=${encodeURIComponent(fiche.path)}`} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 inline-flex px-4 py-2 text-sm">
                  Ouvrir la fiche complète
                </a>
              )}
              <p className="mt-4 text-xs text-ink-muted">Pour changer l’étape : modifie « statut » dans la fiche (Obsidian). Le QG se met à jour en 2 minutes.</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
