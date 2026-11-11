'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE, LAST_UPDATE } from '@/lib/constants'
import Logo from '@/components/Logo'
import { langOf, r } from '@/lib/i18n'

const T = {
  fr: {
    pitch: 'Agence digitale en Guadeloupe. Visibilité locale (photo, vidéo, réseaux, sites) et Automation Lab : des automatisations IA construites avec Claude, 100 % à distance.',
    lab: 'Automation Lab',
    local: 'Visibilité locale',
    company: 'Entreprise',
    contact: 'Contact',
    labLinks: [['lab', 'Solutions'], ['pricing', 'Tarifs'], ['demo', 'Démo LeadFlow'], ['book', 'Réserver un appel'], ['quote', 'Demander un devis'], ['dashboard', 'Espace client']],
    localLinks: [['services', 'Services & tarifs'], ['work', 'Réalisations'], ['guides', 'Guides gratuits']],
    companyLinks: [['about', 'À propos'], ['contact', 'Contact'], ['legal', 'Mentions légales'], ['privacy', 'Confidentialité']],
    rights: 'entrepreneur individuel',
    updated: 'Mis à jour le',
  },
  en: {
    pitch: 'Digital agency based in Guadeloupe (French Caribbean). Automation Lab: AI automations built with Claude for agencies and consultancies, delivered 100% remotely.',
    lab: 'Automation Lab',
    local: 'Local visibility (FR)',
    company: 'Company',
    contact: 'Contact',
    labLinks: [['lab', 'Solutions'], ['pricing', 'Pricing'], ['demo', 'LeadFlow demo'], ['book', 'Book a call'], ['quote', 'Request a quote'], ['dashboard', 'Client area']],
    localLinks: [['services', 'Services (French)'], ['work', 'Our work (French)']],
    companyLinks: [['about', 'About'], ['contact', 'Contact'], ['legal', 'Legal notice (FR)'], ['privacy', 'Privacy (FR)']],
    rights: 'sole proprietor',
    updated: 'Updated',
  },
} as const

export default function Footer() {
  const pathname = usePathname()
  const lang = langOf(pathname)
  const t = T[lang]
  const col = (title: string, items: readonly (readonly [string, string])[]) => (
    <div>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="space-y-2.5 text-sm">
        {items.map(([k, label]) => (
          <li key={k}>
            <Link href={r(k as Parameters<typeof r>[0], lang)} className="hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <footer className="bg-ink px-4 pb-8 pt-16 text-white/70" lang={lang}>
      <div className="mx-auto max-w-site sm:px-2">
        <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href={r('home', lang)} aria-label="RCKY DIGITAL">
              <Logo light />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{t.pitch}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white">
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#F2A65A]">LinkedIn</a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#F2A65A]">Instagram</a>
              <a href={SITE.social.google} target="_blank" rel="noopener noreferrer" className="hover:text-[#F2A65A]">Google</a>
            </div>
            <ul className="mt-6 space-y-1.5 text-sm">
              <li><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
              <li><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-white">{SITE.phone}</a></li>
            </ul>
          </div>
          {col(t.lab, t.labLinks)}
          {col(t.local, t.localLinks)}
          {col(t.company, t.companyLinks)}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/55 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name} · {SITE.owner}, {t.rights} · SIRET {SITE.siret}
          </p>
          <p>
            {t.updated}{' '}
            <time dateTime={LAST_UPDATE}>
              {new Date(LAST_UPDATE + 'T12:00:00').toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          </p>
        </div>
      </div>
    </footer>
  )
}
