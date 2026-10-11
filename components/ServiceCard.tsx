import Link from 'next/link'
import type { Service } from '@/lib/constants'

export default function ServiceCard({ service, detailed = false }: { service: Service; detailed?: boolean }) {
  return (
    <article id={service.id} className="card flex scroll-mt-28 flex-col">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-ink">{service.title}</h3>
        <p className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand-deep">
          {service.price}
          {service.priceNote && <span className="font-medium">{service.priceNote}</span>}
        </p>
      </div>
      <p className="mt-3 text-ink-soft leading-relaxed">{service.description}</p>
      <ul className="mt-5 space-y-2">
        {service.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink">
            <svg className="mt-0.5 shrink-0 text-teal" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12l5 5L20 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      {detailed && (
        <p className="mt-5 text-sm text-ink-muted">
          <span className="font-semibold text-ink-soft">Idéal pour :</span> {service.forWho}
        </p>
      )}
      <div className="mt-auto pt-6">
        <Link href={`/contact?service=${service.id}`} className="text-sm font-semibold text-brand-deep hover:underline">
          Demander un devis →
        </Link>
      </div>
    </article>
  )
}
