'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import { langOf, r, switchPath, type Lang } from '@/lib/i18n'

const LINKS: Record<Lang, { href: string; label: string }[]> = {
  fr: [
    { href: r('lab', 'fr'), label: 'Automation Lab' },
    { href: r('pricing', 'fr'), label: 'Tarifs' },
    { href: r('demo', 'fr'), label: 'Démo' },
    { href: r('services', 'fr'), label: 'Visibilité locale' },
    { href: r('work', 'fr'), label: 'Réalisations' },
    { href: r('about', 'fr'), label: 'À propos' },
  ],
  en: [
    { href: r('lab', 'en'), label: 'Automation Lab' },
    { href: r('pricing', 'en'), label: 'Pricing' },
    { href: r('demo', 'en'), label: 'Demo' },
    { href: r('about', 'en'), label: 'About' },
    { href: r('book', 'en'), label: 'Book a call' },
    { href: r('contact', 'en'), label: 'Contact' },
  ],
}

const T = {
  fr: { login: 'Connexion', trial: 'Réserver un appel', open: 'Ouvrir le menu', close: 'Fermer le menu', home: 'RCKY DIGITAL, accueil', lang: 'Langue' },
  en: { login: 'Log in', trial: 'Book a call', open: 'Open menu', close: 'Close menu', home: 'RCKY DIGITAL, home', lang: 'Language' },
}

function LangSwitch({ pathname, lang, onDark = false }: { pathname: string; lang: Lang; onDark?: boolean }) {
  return (
    <div className={`flex items-center rounded-full border p-0.5 text-xs font-semibold ${onDark ? 'border-line' : 'border-line'}`} role="group" aria-label={T[lang].lang}>
      {(['fr', 'en'] as Lang[]).map((l) => (
        <Link
          key={l}
          href={switchPath(pathname, l)}
          hrefLang={l}
          aria-current={l === lang ? 'true' : undefined}
          className={`rounded-full px-2.5 py-1 uppercase ${l === lang ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'}`}
        >
          {l}
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() || '/'
  const lang = langOf(pathname)
  const t = T[lang]

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
  if (pathname.startsWith('/offre')) {
    return (
      <header className="material-bar fixed inset-x-0 top-0 z-50 py-3">
        <nav className="container-site flex items-center justify-between" aria-label="Navigation">
          <span aria-label="RCKY DIGITAL"><Logo /></span>
          <a href="#reserver" data-track="Barre : réserver" className="btn-primary whitespace-nowrap px-4 py-2 text-sm"><span className="sm:hidden">Réserver</span><span className="hidden sm:inline">Réserver ma place</span></a>
        </nav>
      </header>
    )
  }

  const links = LINKS[lang]
  const active = (href: string) => pathname === href || (href !== '/' && href !== '/en' && pathname.startsWith(href + '/'))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        scrolled || isOpen || pathname.startsWith('/labo') ? 'material-bar py-2.5' : 'bg-transparent py-4'
      }`}
    >
      <nav className="container-site flex items-center justify-between gap-4" aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
        <Link href={r('home', lang)} aria-label={t.home} className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-5 xl:flex 2xl:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-sm font-medium transition-colors ${active(link.href) ? 'text-brand-deep' : 'text-ink-soft hover:text-ink'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <LangSwitch pathname={pathname} lang={lang} />
          <Link href={r('login', lang)} className="whitespace-nowrap text-sm font-semibold text-ink hover:text-brand-deep">
            {t.login}
          </Link>
          <Link href={r('book', lang)} data-track="Barre : rendez-vous" className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm">
            {t.trial}
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <LangSwitch pathname={pathname} lang={lang} />
          <button
            type="button"
            className="press rounded-full p-2 text-ink"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t.close : t.open}
            aria-expanded={isOpen}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Toujours monté pour pouvoir animer l'entrée ET la sortie */}
      <div data-open={isOpen} aria-hidden={!isOpen} className="menu-panel material-thick absolute inset-x-0 top-full rounded-b-3xl xl:hidden">
        <div className="container-site space-y-1 pb-6 pt-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={isOpen ? 0 : -1}
              className={`press block rounded-xl px-3 py-3 font-medium ${active(link.href) ? 'bg-brand-soft text-brand-deep' : 'text-ink'}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Link href={r('login', lang)} tabIndex={isOpen ? 0 : -1} className="btn-outline w-full">
              {t.login}
            </Link>
            <Link href={r('book', lang)} tabIndex={isOpen ? 0 : -1} className="btn-primary w-full">
              {t.trial}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
