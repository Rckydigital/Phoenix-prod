'use client'

// Maquette du nouveau design de la page Automation Lab (fond nuit, particules, phénix).
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ParticleStage, { type ShapeId } from '@/components/lab/ParticleStage'

const STEPS: ShapeId[] = ['lead', 'night', 'team', 'admin', 'check']

const SERVICES: { kicker: string; title: string; text: string; items: string[] }[] = [
  {
    kicker: 'LeadFlow',
    title: 'Chaque demande, triée en quelques secondes.',
    text: 'Formulaire, e-mail ou message : l’IA lit la demande, comprend le besoin et l’urgence, et la range au bon endroit.',
    items: ['Tri chaud / tiède / froid', 'Aucune demande oubliée', 'Tout est noté dans votre espace client'],
  },
  {
    kicker: 'Réponse immédiate',
    title: 'Une réponse, même à 22 h.',
    text: 'Pour les demandes simples (disponibilités, tarifs affichés, horaires), l’IA répond tout de suite, selon les règles que vous avez activées.',
    items: ['Règles activables une par une', 'Réponses tirées de vos informations', 'Le client sait qu’il parle à une IA'],
  },
  {
    kicker: 'L’Équipe de nuit',
    title: 'Une équipe qui prépare tout pendant que vous dormez.',
    text: 'Prospection, relances, veille, suivi des factures : vos agents travaillent la nuit, et chaque matin un briefing vous dit quoi faire.',
    items: ['Briefing chaque matin', '3 à 5 actions classées par impact', 'Environ 40 minutes de validation'],
  },
  {
    kicker: 'AdminFlow',
    title: 'Devis et relances, déjà rédigés.',
    text: 'Les brouillons de devis, de relances et de comptes rendus sont prêts. Vous relisez, vous envoyez.',
    items: ['Moins de copier-coller', 'Relances au bon moment', 'Votre ton, vos modèles'],
  },
  {
    kicker: 'Vous gardez la main',
    title: 'Rien d’important ne part sans vous.',
    text: 'Devis, cas particuliers, réclamations : tout ce qui engage votre entreprise attend votre validation. Vos données restent à vous.',
    items: ['Accès retirables en un clic', 'Tout est journalisé', 'Testé d’abord sur notre propre agence'],
  },
]

export default function DesignPreview() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('lab-services')
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const q = Math.min(0.999, Math.max(0, -r.top / Math.max(1, total)))
      setActive(Math.floor(q * STEPS.length))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative bg-[#04060B] text-white" lang="fr">
      <ParticleStage steps={STEPS} />

      {/* HÉRO : le phénix en particules, le titre de part et d'autre */}
      <section id="lab-hero" className="relative z-10 min-h-[100svh] px-4">
        <h1 className="pointer-events-none absolute inset-x-0 top-[46%] mx-auto flex w-full max-w-6xl -translate-y-1/2 flex-col items-center gap-[34vh] px-4 text-[15vw] font-medium leading-none tracking-tight md:flex-row md:justify-between md:gap-0 md:text-[6.5rem]">
          <span className="sr-only">Automation Lab, par RCKY DIGITAL</span>
          <span aria-hidden="true" className="drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]">Automation</span>
          <span aria-hidden="true" className="drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]">Lab</span>
        </h1>
        <div className="absolute inset-x-0 bottom-[7vh] mx-auto max-w-xl px-4 text-center">
          <p className="text-lg text-white/70 md:text-xl">Des agents IA qui répondent, préparent et relancent pour votre entreprise. Vous gardez la main.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/rendez-vous" className="rounded-full bg-[#E8742A] px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgba(232,116,42,0.45)] transition hover:bg-[#F2A65A]">Réserver un appel</Link>
            <a href="#lab-services" className="rounded-full bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15">Découvrir</a>
          </div>
        </div>
      </section>

      {/* SERVICES : l'icône du service se forme en particules et change au défilement */}
      <section id="lab-services" className="relative z-10" style={{ height: `${(STEPS.length + 1) * 100}vh` }}>
        <div className="sticky top-0 flex h-[100svh] items-end pb-14 md:items-center md:pb-0">
          <div className="mx-auto grid w-full max-w-6xl px-6 md:grid-cols-2">
            <div className="relative min-h-[330px] md:min-h-[420px]">
              {SERVICES.map((s, i) => (
                <article key={s.kicker} aria-hidden={i !== active} className={`absolute inset-0 transition-all duration-700 ${i === active ? 'translate-y-0 opacity-100' : i < active ? '-translate-y-6 opacity-0' : 'translate-y-6 opacity-0'}`}>
                  <p className="text-sm font-medium text-[#F2A65A]">{String(i + 1).padStart(2, '0')} · {s.kicker}</p>
                  <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight md:text-5xl">{s.title}</h2>
                  <p className="mt-4 max-w-md text-white/65 md:text-lg">{s.text}</p>
                  <ul className="mt-6 max-w-md divide-y divide-white/10 border-y border-white/10">
                    {s.items.map((it) => <li key={it} className="py-3 text-white/85">{it}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          {/* repères de progression */}
          <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
            {STEPS.map((_, i) => <span key={i} className={`h-2 w-2 rounded-full transition ${i === active ? 'bg-[#F2A65A]' : 'bg-white/20'}`} />)}
          </div>
        </div>
      </section>

      {/* VIDÉO */}
      <section className="relative z-10 px-4 py-28">
        <h2 className="text-center text-4xl font-medium tracking-tight md:text-6xl">L’Automation Lab, en vidéo.</h2>
        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-3xl bg-black/60 ring-1 ring-white/10 shadow-[0_0_80px_rgba(232,116,42,0.18)]">
          <video src="/videos/automation-lab-22h47.mp4" poster="/videos/automation-lab-22h47.jpg" controls playsInline preload="none" className="block w-full" />
        </div>
      </section>

      {/* APPEL À L'ACTION */}
      <section className="relative z-10 px-4 pb-32 text-center">
        <p className="text-sm font-medium text-[#F2A65A]">Pilote de 10 jours</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">Testez sur vos vrais messages, avant de vous engager.</h2>
        <p className="mx-auto mt-5 max-w-xl text-white/65">Remboursé si les objectifs fixés ensemble ne sont pas atteints.</p>
        <Link href="/rendez-vous" className="mt-8 inline-block rounded-full bg-[#E8742A] px-7 py-3.5 font-semibold text-white shadow-[0_0_30px_rgba(232,116,42,0.45)] transition hover:bg-[#F2A65A]">Réserver un appel</Link>
        <p className="mt-10 text-xs text-white/40">Maquette de design · RCKY DIGITAL · Là où la créativité renaît</p>
      </section>
    </div>
  )
}
