import { SITE, LAST_UPDATE } from '@/lib/constants'
export const dynamic = 'force-static'
export function GET() {
  return Response.json({
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    founder: SITE.owner,
    location: 'Guadeloupe (971), France',
    audience: 'Petites entreprises de Guadeloupe : tourisme, beauté et bien-être, commerces',
    language: 'fr',
    contact: { phone: SITE.phone, email: SITE.email, instagram: SITE.social.instagram },
    updated: LAST_UPDATE,
  })
}
