import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Message envoyé — Phoenix Prod',
  description: 'Votre message a bien été reçu. Nous vous répondons sous 24h ouvrées.',
  robots: { index: false, follow: false },
}

export default function MerciPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-black text-white mb-4">Message bien reçu !</h1>
        <p className="text-gray-400 mb-4 leading-relaxed">
          Merci pour votre message. Nous vous répondrons sous <strong className="text-white">24h ouvrées</strong>.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          En attendant, n&apos;hésitez pas à consulter nos réalisations ou à nous appeler directement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/realisations" className="btn-primary">
            Voir nos réalisations
          </Link>
          <Link href="/" className="btn-outline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
