import type { Metadata } from 'next'
import AuthForm from '@/components/AuthForm'

export const metadata: Metadata = { title: 'Connexion', robots: { index: false } }

export default function Page({ searchParams }: { searchParams: { plan?: string } }) {
  return (
    <div lang="fr" className="bg-hero min-h-[80vh]">
      <section className="container-site pb-20 pt-28 md:pt-36">
        <AuthForm lang="fr" mode="login" plan={searchParams.plan} />
      </section>
    </div>
  )
}
