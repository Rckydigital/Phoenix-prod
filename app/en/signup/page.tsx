import type { Metadata } from 'next'
import AuthForm from '@/components/AuthForm'

export const metadata: Metadata = { title: '14-day free trial', robots: { index: false } }

export default function Page({ searchParams }: { searchParams: { plan?: string } }) {
  return (
    <div lang="en" className="bg-hero min-h-[80vh]">
      <section className="container-site pb-20 pt-28 md:pt-36">
        <AuthForm lang="en" mode="signup" plan={searchParams.plan} />
      </section>
    </div>
  )
}
