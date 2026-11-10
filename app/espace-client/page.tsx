import type { Metadata } from 'next'
import Dashboard from '@/components/Dashboard'

export const metadata: Metadata = { title: 'Espace client', robots: { index: false } }

export default function Page({ searchParams }: { searchParams: { paiement?: string; payment?: string; reset?: string; plan?: string } }) {
  const stripeTest = (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test')
  return (
    <div lang="fr" className="min-h-[80vh] bg-sand">
      <section className="container-site pb-20 pt-28 md:pt-32">
        <Dashboard lang="fr" paid={searchParams.paiement === 'ok' || searchParams.payment === 'ok'} reset={searchParams.reset === '1'} plan={searchParams.plan} stripeTest={stripeTest} />
      </section>
    </div>
  )
}
