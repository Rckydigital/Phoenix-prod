'use client'

// Vue « L'agence » du QG : la scène 3D de LeadFlow (public/qg/agence3d.js, three.js,
// chargée seulement à l'ouverture) alimentée par les vraies fiches du cerveau.
// Sources du module : cerveau › 80 - Outils/labo/leadflow/agence3d (npm run build).
import { useEffect, useRef, useState } from 'react'
import type { QGData } from '@/lib/vault'
import type { FichePipeline } from '@/lib/qgPipeline'

type Agence = {
  maj: (leads: unknown[]) => void
  actif: (b: boolean) => void
  choisir: (id: number | null) => void
  etiquettes: (b: boolean) => void
  musique: (b: boolean) => boolean
  statutAgents: (m: Record<string, string>) => void
  recentrer: () => void
  detruire: () => void
  erreur?: boolean
}

// noms des agents du QG → noms des PNJ de la scène
const NOMS: Record<string, string> = { directeur: 'Directeur', commercial: 'Commercial', marketing: 'Marketing', finance: 'Finance', secretaire: 'Secrétaire', veille: 'Veille', dev: 'Dev' }

function statut(date: string | undefined, today: string) {
  if (!date) return 'off'
  const n = Math.round((Date.parse(today) - Date.parse(date)) / 86400000)
  return n <= 0 ? 'on' : n <= 7 ? 'week' : 'off'
}

export default function Agence3D({ data, onOuvrir, choisie }: { data: QGData; onOuvrir: (f: FichePipeline) => void; choisie: number | null }) {
  const scene = useRef<HTMLDivElement>(null)
  const agence = useRef<Agence | null>(null)
  const ouvrir = useRef(onOuvrir)
  ouvrir.current = onOuvrir
  const fiches = useRef(data.pipeline)
  fiches.current = data.pipeline
  const [etat, setEtat] = useState<'chargement' | 'pret' | 'erreur'>('chargement')
  const [etiquettes, setEtiquettes] = useState(false)
  const [musique, setMusique] = useState(false)

  useEffect(() => {
    let vivant = true
    ;(async () => {
      try {
        const m = await import(/* webpackIgnore: true */ '/qg/agence3d.js' as string)
        if (!vivant || !scene.current) return
        const a: Agence = m.creerAgence(scene.current, {
          surClic: (id: number) => { const f = fiches.current.find((x) => x.id === id); if (f) ouvrir.current(f) },
        })
        agence.current = a
        setEtat(a.erreur ? 'erreur' : 'pret')
      } catch {
        if (vivant) setEtat('erreur')
      }
    })()
    return () => { vivant = false; agence.current?.detruire(); agence.current = null }
  }, [])

  useEffect(() => {
    const a = agence.current
    if (!a || etat !== 'pret') return
    a.maj(data.pipeline.map((f) => ({ id: f.id, nom: f.nom, statut: f.colonne, temperature: f.chaleur, alerte: f.relanceDue })))
    a.statutAgents(Object.fromEntries(data.agents.map((g) => [NOMS[g.id] || g.name, statut(g.last?.date, data.today)])))
  }, [data, etat])

  useEffect(() => { agence.current?.choisir(choisie) }, [choisie, etat])
  useEffect(() => { agence.current?.etiquettes(etiquettes) }, [etiquettes, etat])

  const dues = data.pipeline.filter((f) => f.relanceDue).length
  const chaudsAccueil = data.pipeline.filter((f) => f.colonne === 'nouveau' && f.chaleur === 'chaud').length
  const enCours = data.pipeline.filter((f) => f.colonne === 'contacte').length
  const clients = data.pipeline.filter((f) => f.colonne === 'gagne').length

  return (
    <div>
      <style>{CSS}</style>
      <div className="agence-cadre">
        <div className="agence-scene" ref={scene} id="qg-agence-scene" />
        {etat === 'chargement' && <p className="agence-chargement">Ouverture de l’agence…</p>}
        {etat === 'erreur' && <p className="agence-chargement">La vue 3D n’a pas pu se charger sur cet appareil. Utilise le Pipeline.</p>}
        <div className="agence-resume">
          <b>L’AGENCE</b>
          <p>Chaque prospect est un client dans les locaux : accueil → bureau commercial → salle de signature. Tes agents sont à leur poste (point vert = passé aujourd’hui).</p>
          <div className="puces">
            <span className="puce">{data.pipeline.length} fiches</span>
            {dues > 0 && <span className="puce alerte">{dues} relance(s) due(s)</span>}
            {chaudsAccueil > 0 && <span className="puce alerte">{chaudsAccueil} chaud(s) à l’accueil</span>}
            <span className="puce">{enCours} en cours</span>
            <span className="puce">{clients} client(s)</span>
          </div>
          <div className="legende"><span><i style={{ background: '#e0572a' }} />Chaud</span><span><i style={{ background: '#f0b429' }} />Tiède</span><span><i style={{ background: '#3b8bd4' }} />Froid</span><span><i style={{ background: '#e0572a', boxShadow: '0 0 0 2px #fff,0 0 0 3px #e0572a' }} />Relance due</span></div>
        </div>
        <div className="agence-outils">
          <button type="button" className="agence-btn" aria-pressed={musique} aria-label="Musique d’ambiance"
            onClick={() => { const a = agence.current; if (a) setMusique(a.musique(!musique)) }}>♪</button>
          <button type="button" className="agence-btn" aria-label="Recentrer la vue" onClick={() => agence.current?.recentrer()}>⟲</button>
          <label className="agence-interrupteur"><input type="checkbox" role="switch" checked={etiquettes} onChange={(e) => setEtiquettes(e.target.checked)} /> Étiquettes</label>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-muted">Glisse pour tourner autour de l’agence, molette ou pincement pour zoomer. Clique sur un client pour ouvrir sa fiche. La scène montre au plus 12 clients par pièce (les plus urgents d’abord) : le Pipeline les liste tous.</p>
    </div>
  )
}

const CSS = `
.agence-cadre { position: relative; height: min(76vh, 760px); min-height: 460px; border-radius: 24px; overflow: hidden; border: 1px solid #ECE6DF; box-shadow: 0 1px 2px rgba(40,30,20,.06), 0 4px 14px rgba(40,30,20,.06); background: radial-gradient(120% 90% at 50% 10%, #e8f5f8 0%, #f4ede2 60%, #e9dfd0 100%); }
.agence-scene { position: absolute; inset: 0; }
.agence-canvas { width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.agence-canvas:active { cursor: grabbing; }
.agence-calque { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.agence-chargement, .agence-erreur { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; padding: 24px; text-align: center; color: #6b655e; font-weight: 600; }
.agence-etiquette { position: absolute; left: 0; top: 0; pointer-events: auto; display: flex; align-items: center; gap: 6px; background: rgba(12,30,44,.88); color: #fff; border: 0; border-radius: 999px; padding: 3px 10px 3px 7px; font: 600 12px system-ui, sans-serif; white-space: nowrap; cursor: pointer; visibility: hidden; margin-top: -4px; }
.agence-etiquette[hidden] { display: none !important; }
.agence-etiquette i { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.agence-etiquette em { display: none; }
.agence-etiquette.alerte em { display: grid; place-items: center; visibility: visible; position: absolute; right: -9px; top: -9px; width: 18px; height: 18px; border-radius: 50%; background: #e0572a; color: #fff; font: 800 12px system-ui, sans-serif; font-style: normal; border: 2px solid #fff; }
.montrer-etiquettes .agence-etiquette, .agence-etiquette.survol, .agence-etiquette.choisi, .agence-etiquette:focus-visible { visibility: visible; }
.agence-etiquette.choisi { background: #e0572a; }
.agence-etiquette.perdu { opacity: .75; }
.agence-agent { position: absolute; left: 0; top: 0; font: 700 10.5px system-ui, sans-serif; background: rgba(255,255,255,.92); color: #1d1b19; padding: 2px 8px; border-radius: 999px; border: 1px solid #e4dfd8; white-space: nowrap; }
.agence-agent[data-statut]::before { content: ""; display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 5px; background: #c9c2b9; vertical-align: 0; }
.agence-agent[data-statut="on"]::before { background: #1d9a5b; box-shadow: 0 0 0 3px rgba(29,154,91,.2); }
.agence-agent[data-statut="week"]::before { background: #f0b429; }
.agence-zone { position: absolute; left: 0; top: 0; text-align: center; white-space: nowrap; }
.agence-zone b { display: block; font: 900 12.5px system-ui, sans-serif; letter-spacing: .14em; color: #1d1b19; background: rgba(255,255,255,.9); padding: 4px 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(40,30,20,.12); }
.agence-zone span { display: inline-block; margin-top: 3px; font: 700 11px system-ui, sans-serif; color: #fff; background: rgba(29,27,25,.7); padding: 1px 8px; border-radius: 999px; }
.agence-zone.salle span { background: rgba(224,87,42,.85); }
.agence-resume { position: absolute; bottom: 14px; left: 14px; background: rgba(255,255,255,.95); color: #1d1b19; border-radius: 16px; padding: 12px 14px; box-shadow: 0 6px 20px rgba(0,30,50,.18); max-width: 300px; pointer-events: none; }
.agence-resume b { display: block; font-size: 1rem; letter-spacing: .02em; }
.agence-resume p { margin: 2px 0 8px; font-size: .78rem; color: #5d574f; }
.agence-resume .puces { display: flex; flex-wrap: wrap; gap: 6px; }
.agence-resume .puce { font-size: .72rem; font-weight: 700; padding: 3px 8px; border-radius: 999px; background: #f1ece5; color: #5d574f; }
.agence-resume .puce.alerte { background: #fde9e4; color: #b4511a; }
.agence-resume .legende { display: flex; flex-wrap: wrap; gap: 4px 10px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #ece6de; font-size: .72rem; font-weight: 600; color: #5d574f; }
.agence-resume .legende i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 5px; }
.agence-outils { position: absolute; top: 14px; right: 14px; display: flex; gap: 8px; }
.agence-btn { background: rgba(255,255,255,.95); color: #1d1b19; border: 0; width: 36px; height: 34px; border-radius: 999px; font-size: 1.05rem; box-shadow: 0 4px 14px rgba(0,30,50,.15); }
.agence-btn[aria-pressed="true"] { background: #e0572a; color: #fff; }
.agence-interrupteur { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.95); color: #1d1b19; padding: 7px 12px; border-radius: 999px; font-size: .82rem; font-weight: 700; box-shadow: 0 4px 14px rgba(0,30,50,.15); cursor: pointer; }
.agence-interrupteur input { appearance: none; width: 34px; height: 20px; border-radius: 999px; background: #cfc8bf; position: relative; cursor: pointer; margin: 0; }
.agence-interrupteur input::after { content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: left .15s; }
.agence-interrupteur input:checked { background: #1d9a5b; }
.agence-interrupteur input:checked::after { left: 17px; }
@media (max-width: 860px) {
  .agence-cadre { height: 66vh; min-height: 420px; }
  .agence-resume { left: 10px; right: 10px; bottom: 10px; max-width: none; padding: 8px 10px; }
  .agence-resume b, .agence-resume p, .agence-resume .legende { display: none; }
  .agence-resume .puce { font-size: .68rem; padding: 2px 7px; }
  .agence-outils { top: 10px; right: 10px; }
  .agence-zone b { font-size: 10px; padding: 3px 7px; }
  .agence-agent { display: none; }
  .agence-etiquette { font-size: 10.5px; padding: 2px 8px 2px 6px; }
}
`
