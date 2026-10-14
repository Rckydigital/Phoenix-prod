'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Mesure sans cookie : envoie « page vue » et les clics de contact (WhatsApp, téléphone, e-mail, Instagram, boutons marqués data-track).
function send(e: string, l = '') {
  try {
    const p = window.location.pathname
    if (p.startsWith('/qg')) return
    const q = new URLSearchParams(window.location.search)
    let s = q.get('src') || q.get('utm_source') || ''
    if (!s && document.referrer) {
      try {
        const h = new URL(document.referrer).hostname.replace(/^www\./, '')
        if (!h.endsWith('rckydigital.fr') && !h.includes('vercel.app')) s = h
      } catch {}
    }
    const body = JSON.stringify({ e, p, l, s })
    if (navigator.sendBeacon) navigator.sendBeacon('/api/t', new Blob([body], { type: 'text/plain' }))
    else fetch('/api/t', { method: 'POST', body, keepalive: true })
  } catch {}
}

export default function Tracker() {
  const pathname = usePathname()
  useEffect(() => {
    send('vue')
  }, [pathname])
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement | null)?.closest('a,button') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') || ''
      const label = (a.getAttribute('data-track') || a.textContent || '').trim().slice(0, 60)
      if (href.startsWith('https://wa.me') || href.includes('api.whatsapp.com')) send('whatsapp', label)
      else if (href.startsWith('tel:')) send('telephone', label)
      else if (href.startsWith('mailto:')) send('email', label)
      else if (href.includes('instagram.com')) send('instagram', label)
      else if (a.hasAttribute('data-track')) send('cta', label)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
