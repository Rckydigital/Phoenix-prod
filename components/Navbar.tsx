'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/constants'
import Logo from '@/components/Logo'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setIsOpen(false), [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Landing page : barre réduite au logo + un seul bouton (aucune sortie vers le reste du site)
  if (pathname?.startsWith('/offre')) {
    return (
      <header className="material-bar fixed inset-x-0 top-0 z-50 py-3">
        <nav className="container-site flex items-center justify-between" aria-label="Navigation">
          <span aria-label="RCKY DIGITAL"><Logo /></span>
          <a href="#reserver" data-track="Barre : réserver" className="btn-primary whitespace-nowrap px-4 py-2 text-sm"><span className="sm:hidden">Réserver</span><span className="hidden sm:inline">Réserver ma place</span></a>
        </nav>
      </header>
    )
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        scrolled || isOpen ? 'material-bar py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-site flex items-center justify-between" aria-label="Navigation principale">
        <Link href="/" aria-label="RCKY DIGITAL, accueil">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? 'text-brand-deep' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary px-5 py-2.5 text-sm">
            Échange gratuit
          </Link>
        </div>

        <button
          type="button"
          className="press rounded-full p-2 text-ink md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {/* Toujours monté pour pouvoir animer l'entrée ET la sortie (même chemin) */}
      <div
        data-open={isOpen}
        aria-hidden={!isOpen}
        className="menu-panel material-thick absolute inset-x-0 top-full rounded-b-3xl md:hidden"
      >
        <div className="container-site space-y-1 pb-6 pt-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={isOpen ? 0 : -1}
              className={`press block rounded-xl px-3 py-3 font-medium ${
                pathname === link.href ? 'bg-brand-soft text-brand-deep' : 'text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" tabIndex={isOpen ? 0 : -1} className="btn-primary mt-4 w-full">
            Réserver un échange gratuit
          </Link>
        </div>
      </div>
    </header>
  )
}
