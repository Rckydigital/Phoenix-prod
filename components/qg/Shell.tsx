'use client'

// Coque du QG (refonte 26/11/2026) : trois vues autour des vraies données du cerveau.
//  - Pipeline : les fiches prospects (pôle 1 + pôle 2) en 4 étapes, filtres, panneau de détail.
//  - L'agence : les mêmes fiches en PNJ dans l'agence 3D, les agents à leur poste (activité réelle).
//  - Bureau : l'ancien QG complet (agents, réunion, Trésorerie, site, fichiers).
import { useEffect, useState } from 'react'
import type { QGData } from '@/lib/vault'
import type { FichePipeline } from '@/lib/qgPipeline'
import Office from '@/components/qg/Office'
import Pipeline from '@/components/qg/Pipeline'
import Agence3D from '@/components/qg/Agence3D'
import FichePanel from '@/components/qg/FichePanel'

type Vue = 'pipeline' | 'agence' | 'bureau'
const VUES: { id: Vue; titre: string; aide: string }[] = [
  { id: 'pipeline', titre: 'Pipeline', aide: 'Tes prospects par étape' },
  { id: 'agence', titre: 'L’agence', aide: 'Vue vivante en 3D' },
  { id: 'bureau', titre: 'Bureau', aide: 'Agents, Trésorerie, site, fichiers' },
]
const CLE = 'qg-vue'

// publique = page /demo/crm : données fictives, sans connexion, sans l'onglet Bureau (fichiers, Trésorerie)
export default function Shell({ data, demo = false, publique = false }: { data: QGData; demo?: boolean; publique?: boolean }) {
  const vues = publique
    ? VUES.filter((v) => v.id !== 'bureau').map((v) => (v.id === 'pipeline' ? { ...v, aide: 'Vos prospects par étape' } : v))
    : VUES
  const [vue, setVue] = useState<Vue>('pipeline')
  const [ouverte, setOuverte] = useState<FichePipeline | null>(null)

  useEffect(() => {
    try {
      const v = localStorage.getItem(CLE) as Vue | null
      if (v && vues.some((x) => x.id === v)) setVue(v)
    } catch { /* stockage indisponible */ }
  }, [])
  const choisir = (v: Vue) => {
    setVue(v); setOuverte(null)
    try { localStorage.setItem(CLE, v) } catch { /* ignoré */ }
  }

  const dues = data.pipeline.filter((f) => f.relanceDue).length
  const enCours = data.pipeline.filter((f) => f.colonne === 'contacte').length
  const clients = data.pipeline.filter((f) => f.colonne === 'gagne').length

  return (
    <section className="bg-sand pt-28 md:pt-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{publique ? 'Démo · données fictives' : 'QG privé'}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{publique ? 'LeadFlow, le CRM qui ressemble à votre agence' : 'Le QG de RCKY DIGITAL'}</h1>
            <p className="mt-1 text-ink-soft">
              {new Date(data.today + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              {' · '}{data.pipeline.length} fiches · {enCours} en cours · {clients} client(s)
              {dues > 0 && <span className="ml-2 rounded-full bg-[#FDE9E4] px-2 py-0.5 text-xs font-bold text-[#B4511A]">{dues} relance(s) due(s)</span>}
            </p>
          </div>
          {publique ? (
            <a href="/rendez-vous" className="btn-primary px-4 py-2 text-sm">Le même pour mon entreprise</a>
          ) : (
            <form action="/api/qg/login" method="POST">
              <input type="hidden" name="action" value="logout" />
              <button className="btn-outline px-4 py-2 text-sm">Se déconnecter</button>
            </form>
          )}
        </div>

        {data.error && (
          <p role="alert" className="mt-6 rounded-2xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8F1F22]">
            Lecture du cerveau impossible ({data.error}). Vérifie la variable CRM_GITHUB_TOKEN dans Vercel.
          </p>
        )}

        {/* Onglets */}
        <nav aria-label="Vues du QG" className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-line bg-white p-1.5">
          {vues.map((v) => (
            <button
              key={v.id}
              type="button"
              data-vue={v.id}
              onClick={() => choisir(v.id)}
              aria-current={vue === v.id ? 'page' : undefined}
              className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-left transition-colors ${vue === v.id ? 'bg-ink text-white' : 'text-ink-soft hover:bg-sand'}`}
            >
              <span className="block text-sm font-bold">{v.titre}</span>
              <span className={`hidden text-xs sm:block ${vue === v.id ? 'text-white/70' : 'text-ink-muted'}`}>{v.aide}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {vue === 'pipeline' && (
          <div className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
            <Pipeline fiches={data.pipeline} onOuvrir={setOuverte} />
          </div>
        )}
        {vue === 'agence' && (
          <div className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
            <Agence3D data={data} onOuvrir={setOuverte} choisie={ouverte?.id ?? null} />
          </div>
        )}
        {vue === 'bureau' && !publique && <Office data={data} embedded />}
      </div>

      <FichePanel fiche={ouverte} demo={demo} onFermer={() => setOuverte(null)} />
    </section>
  )
}
