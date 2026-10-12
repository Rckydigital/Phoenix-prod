import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { QG_COOKIE, isLoggedIn } from '@/lib/qgAuth'
import { loadQG } from '@/lib/vault'
import Office from '@/components/qg/Office'
import { PhoenixIcon } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'QG',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function QGPage({ searchParams }: { searchParams: { erreur?: string } }) {
  const logged = isLoggedIn(cookies().get(QG_COOKIE)?.value)

  if (!logged) {
    const configured = Boolean(process.env.QG_PASSWORD)
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-sand px-4 pb-16 pt-32">
        <form action="/api/qg/login" method="POST" className="card w-full max-w-sm p-8 text-center">
          <PhoenixIcon className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-extrabold text-ink">QG RCKY DIGITAL</h1>
          <p className="mt-2 text-sm text-ink-soft">Espace privé de pilotage des agents.</p>
          {!configured && (
            <p className="mt-4 rounded-xl bg-[#FDECEC] px-3 py-2 text-sm text-[#8F1F22]">
              Ajoute la variable QG_PASSWORD dans Vercel pour activer l’accès.
            </p>
          )}
          {searchParams.erreur && (
            <p role="alert" className="mt-4 rounded-xl bg-[#FDECEC] px-3 py-2 text-sm text-[#8F1F22]">
              Mot de passe incorrect.
            </p>
          )}
          <label htmlFor="password" className="mt-6 block text-left text-sm font-medium text-ink">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
          <button type="submit" className="btn-primary mt-6 w-full">Entrer</button>
        </form>
      </section>
    )
  }

  const data = await loadQG()
  return <Office data={data} />
}
