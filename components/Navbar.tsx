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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'border-b border-line bg-white/95 backdrop-blur py-3' : 'bg-transparent py-5'
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
          className="rounded-full p-2 text-ink md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="container-site space-y-1 pb-6 pt-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-3 py-3 font-medium ${
                pathname === link.href ? 'bg-brand-soft text-brand-deep' : 'text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary mt-4 w-full">
            Réserver un échange gratuit
          </Link>
        </div>
      )}
    </header>
  )
}
