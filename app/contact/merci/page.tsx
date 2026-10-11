import type { Metadata } from 'next'
import Link from 'next/link'
import { PhoenixIcon } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Message envoyé',
  description: 'Votre message a bien été reçu. Réponse sous 48 h.',
  robots: { index: false, follow: false },
}

export default function MerciPage() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-sand px-4 pb-20 pt-32">
      <div className="max-w-lg text-center">
        <PhoenixIcon className="mx-auto h-24 w-24" />
        <h1 className="mt-6 text-3xl font-extrabold text-ink md:text-4xl">Message bien reçu, merci !</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Je vous réponds sous 48 h pour fixer un échange. En attendant, découvrez les services et tarifs.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/services" className="btn-primary">Services et tarifs</Link>
          <Link href="/" className="btn-outline">Retour à l’accueil</Link>
        </div>
      </div>
    </section>
  )
}
