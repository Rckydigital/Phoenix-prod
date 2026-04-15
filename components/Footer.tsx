import Link from 'next/link'
import { SITE, NAV_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-dark-100 border-t border-dark-300 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Colonne brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-black text-white">
              PHOENIX<span className="text-brand">PROD</span>
            </Link>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-sm">
              {SITE.tagline}. Basés en Guadeloupe, nous intervenons partout aux Antilles.
            </p>
            <div className="flex gap-4 mt-6">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand transition-colors text-sm">
                Instagram
              </a>
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand transition-colors text-sm">
                LinkedIn
              </a>
              <a href={SITE.social.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand transition-colors text-sm">
                YouTube
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-brand transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-brand transition-colors">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-brand transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.address}</li>
            </ul>
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="border-t border-dark-300 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} {SITE.agency} — {SITE.name}. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <Link href="/mentions-legales" className="hover:text-gray-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-gray-400 transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
