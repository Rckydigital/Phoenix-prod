'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
    // TODO: activer vos outils de tracking ici (Google Analytics, etc.)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
    // Aucun cookie de tracking ne sera posé
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-dark-200 border border-dark-400 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <p className="text-white font-semibold mb-1">🍪 Gestion des cookies</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.
            En acceptant, vous consentez à notre{' '}
            <Link href="/politique-confidentialite" className="text-brand underline hover:no-underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="text-sm text-gray-400 hover:text-white border border-dark-400 hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="btn-primary text-sm py-2 px-5"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
