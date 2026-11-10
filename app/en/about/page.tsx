import type { Metadata } from 'next'
import Link from 'next/link'
import { PhoenixIcon } from '@/components/Logo'
import { Check } from '@/components/ui'

export const metadata: Metadata = {
  title: 'About',
  description: 'RCKY DIGITAL is a digital agency founded by Ricky GALIN in Guadeloupe (French Caribbean). Automation Lab builds AI automations with Claude, delivered remotely.',
  alternates: { canonical: '/en/about', languages: { fr: '/a-propos', en: '/en/about' } },
  openGraph: { locale: 'en_US' },
}

export default function Page() {
  return (
    <div lang="en">
      <section className="bg-hero pb-14 pt-28 md:pt-36">
        <div className="container-site grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="kicker">About</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">A Caribbean agency that runs on its own automations.</h1>
            <p className="mt-5 text-lg text-ink-soft">RCKY DIGITAL was founded in Guadeloupe by Ricky GALIN, with a bachelor’s degree in digital marketing and a master’s in e-business. Our Automation Lab builds AI automations with Claude for agencies, consulting firms and small businesses, delivered 100% remotely.</p>
          </div>
          <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center rounded-full bg-white shadow-[0_30px_80px_-30px_rgba(30,42,51,0.35)]">
            <PhoenixIcon className="h-4/5 w-4/5" title="RCKY DIGITAL phoenix logo" large />
          </div>
        </div>
      </section>
      <section className="py-16 md:py-20">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
            <h2 className="section-title">Our mission</h2>
            <p>Make AI a practical growth tool for small teams: fewer repetitive tasks, faster replies, no lead left behind.</p>
            <p>We test everything on ourselves first. Our own agency runs with a team of AI agents that prospect, research, check the books and draft content every night, and a briefing every morning.</p>
          </div>
          <div>
            <h2 className="section-title">How we work</h2>
            <ul className="mt-5 space-y-3 text-ink">
              {['Clear prices and free quotes', 'Your accounts stay in your name', 'Human approval for anything sensitive', 'Only real projects and real numbers'].map((x) => (
                <li key={x} className="flex gap-2.5"><Check />{x}</li>
              ))}
            </ul>
            <Link href="/en/quote" className="btn-primary mt-8">Talk about your project</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
