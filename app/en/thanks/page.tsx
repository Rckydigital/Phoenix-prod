import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Thank you', robots: { index: false } }

export default function Page() {
  return (
    <div lang="en" className="bg-hero">
      <section className="container-site max-w-2xl pb-24 pt-36 text-center md:pt-44">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal text-2xl text-white" aria-hidden="true">✓</span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink">Thank you, your request is in.</h1>
        <p className="mt-4 text-lg text-ink-soft">We will get back to you within 48 hours. Meanwhile, you can try the LeadFlow demo.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/en/demo" className="btn-primary">See the demo</Link>
          <Link href="/en" className="btn-outline">Back to home</Link>
        </div>
      </section>
    </div>
  )
}
