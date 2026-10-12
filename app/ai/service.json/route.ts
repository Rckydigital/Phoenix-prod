import { SERVICES, PACKS, SITE, LAST_UPDATE, priceNumber } from '@/lib/constants'
export const dynamic = 'force-static'
export function GET() {
  return Response.json({
    provider: SITE.name,
    area: 'Guadeloupe',
    currency: 'EUR',
    taxes: 'TVA non applicable, art. 293 B du CGI (prix finaux)',
    updated: LAST_UPDATE,
    services: [
      ...SERVICES.map((s) => ({ name: s.title, from: priceNumber(s.price) ?? null, unit: s.priceNote?.includes('mois') ? 'per_month' : 'one_time', description: s.description, includes: s.features, for: s.forWho })),
      ...PACKS.map((p) => ({ name: p.title, from: priceNumber(p.price) ?? null, unit: 'one_time', description: p.description, includes: p.features })),
    ],
    quote: `${SITE.url}/contact`,
  })
}
