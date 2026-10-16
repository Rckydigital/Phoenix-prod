import Link from 'next/link'
import { SITE, NAV_LINKS, LAST_UPDATE } from '@/lib/constants'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="bg-ink px-4 pb-8 pt-16 text-white/80">
      <div className="max-w-site mx-auto sm:px-2">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" aria-label="RCKY DIGITAL, accueil">
              <Logo light />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Agence digitale en Guadeloupe. Photos, vidéos, réseaux sociaux et sites avec réservation pour le tourisme,
              la beauté et les indépendants.
            </p>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#F2A65A]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              @_rcky_digital
            </a>
            <a
              href={SITE.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-6 mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#F2A65A]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" />
              </svg>
              Avis Google
            </a>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Navigation</h2>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guides" className="hover:text-white">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-white">
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name} — {SITE.owner}, entrepreneur individuel. SIRET {SITE.siret} · Mis à jour le <time dateTime={LAST_UPDATE}>{new Date(LAST_UPDATE + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
