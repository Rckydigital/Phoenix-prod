import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact RCKY DIGITAL: AI automation for agencies and consultancies, delivered remotely. Reply within 48 hours.',
  alternates: { canonical: '/en/contact', languages: { fr: '/contact', en: '/en/contact' } },
  openGraph: { locale: 'en_US' },
}

export default function Page({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div lang="en">
      <section className="bg-hero pb-10 pt-28 md:pt-36">
        <div className="container-site max-w-3xl">
          <span className="kicker">Contact</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">Let’s talk about your project.</h1>
          <p className="mt-5 text-lg text-ink-soft">A free, no-commitment conversation. Reply within 48 hours (we are in the Atlantic time zone, UTC−4).</p>
        </div>
      </section>
      <section className="pb-16 pt-6 md:pb-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <a href={`mailto:${SITE.email}`} className="card block"><p className="text-sm text-ink-muted">Email</p><p className="mt-1 break-all text-lg font-bold text-ink">{SITE.email}</p></a>
            <a href={SITE.social.linkedinFondateur} target="_blank" rel="noopener noreferrer" className="card block"><p className="text-sm text-ink-muted">LinkedIn</p><p className="mt-1 text-lg font-bold text-ink">Ricky Galin · RCKY DIGITAL</p></a>
            <div className="card"><p className="text-sm text-ink-muted">Where we work</p><p className="mt-1 text-lg font-bold text-ink">Guadeloupe, 100% remote worldwide</p></div>
            <Link href="/en/quote" className="btn-outline w-full">Need a quote instead?</Link>
          </div>
          <div className="card p-6 md:p-10">
            <h2 className="text-2xl font-bold text-ink">Send a message</h2>
            {searchParams.error && <p role="alert" className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8F1F22]">{searchParams.error === 'config' ? `The form is temporarily unavailable. Email us at ${SITE.email}.` : 'Your message could not be sent. Please check the required fields and try again.'}</p>}
            <form action="/api/contact" method="POST" className="mt-6 grid gap-5 sm:grid-cols-2">
              <div><label className="label" htmlFor="c-name">Name *</label><input id="c-name" name="name" required autoComplete="name" className="field" /></div>
              <div><label className="label" htmlFor="c-business">Company</label><input id="c-business" name="business" autoComplete="organization" className="field" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="c-email">Email *</label><input id="c-email" type="email" name="email" required autoComplete="email" className="field" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="c-message">Message *</label><textarea id="c-message" name="message" required rows={5} className="field resize-y" /></div>
              <input type="hidden" name="page" value="/en/contact" />
              <input type="hidden" name="lang" value="en" />
              <div className="hidden" aria-hidden="true"><label htmlFor="c-website">Do not fill</label><input id="c-website" type="text" name="website" tabIndex={-1} autoComplete="off" /></div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <input id="c-rgpd" type="checkbox" name="rgpd" value="oui" required className="mt-1 h-4 w-4 accent-[#B4511A]" />
                <label htmlFor="c-rgpd" className="text-sm text-ink-soft">I agree that my data will be used to answer my request, as described in the <a href="/politique-confidentialite" className="font-medium text-brand-deep underline">privacy policy (French)</a>. *</label>
              </div>
              <button type="submit" className="btn-primary py-4 text-base sm:col-span-2">Send my message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
