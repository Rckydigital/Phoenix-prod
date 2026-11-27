import type { Metadata } from 'next'
import { demoQG } from '@/lib/qgDemo'
import Shell from '@/components/qg/Shell'

// Démo publique du CRM LeadFlow (pipeline + agence 3D), sans connexion.
// Données 100 % fictives (lib/qgDemo.ts) : ne jamais brancher loadQG() ici.
export const metadata: Metadata = {
  title: 'Démo LeadFlow : le CRM qui ressemble à votre agence',
  description: 'Démo publique de LeadFlow, le CRM amélioré grâce à l’IA de Rcky Digital : pipeline en glisser-déposer, fiches clients et vue vivante de l’agence en 3D. Données fictives.',
  alternates: { canonical: '/demo/crm' },
  openGraph: {
    title: 'Démo LeadFlow : le CRM qui ressemble à votre agence',
    description: 'Pipeline, fiches clients et agence en 3D avec des agents IA. Données fictives.',
    url: '/demo/crm',
  },
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <div className="fixed inset-x-0 top-16 z-40 bg-[#F2A65A] px-4 py-1.5 text-center text-xs font-semibold text-ink md:top-20">
        Démo : toutes les données affichées sont fictives
      </div>
      <Shell data={demoQG()} demo publique />
    </>
  )
}
