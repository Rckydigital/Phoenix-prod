'use client'

// Agenda Calendly intégré dans la page : le visiteur réserve sans quitter le site.
// Chargé seulement après un clic (Calendly dépose ses propres cookies).
import { useState } from 'react'
import { SITE } from '@/lib/constants'
import type { Lang } from '@/lib/i18n'

const T = {
  fr: { show: 'Afficher l’agenda et choisir un créneau', note: 'L’agenda est fourni par Calendly : il s’affiche après votre clic et peut déposer ses propres cookies.', open: 'Ouvrir l’agenda dans un nouvel onglet', title: 'Agenda de réservation RCKY DIGITAL' },
  en: { show: 'Show the calendar and pick a slot', note: 'The calendar is provided by Calendly: it loads after your click and may set its own cookies.', open: 'Open the calendar in a new tab', title: 'RCKY DIGITAL booking calendar' },
}

export default function CalendlyEmbed({ lang }: { lang: Lang }) {
  const t = T[lang]
  const [on, setOn] = useState(false)
  const url = SITE.calendly
  const src = `${url}?embed_type=Inline&embed_domain=rckydigital.fr&hide_gdpr_banner=1&primary_color=b4511a&locale=${lang}`
  if (!on) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-line bg-white p-8 text-center">
        <button type="button" onClick={() => setOn(true)} data-track="Rendez-vous : agenda" className="btn-primary px-7 py-4 text-base">{t.show}</button>
        <p className="max-w-md text-sm text-ink-muted">{t.note}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-deep hover:underline">{t.open} ↗</a>
      </div>
    )
  }
  return <iframe src={src} title={t.title} className="h-[720px] w-full rounded-3xl border border-line bg-white" loading="lazy" />
}
