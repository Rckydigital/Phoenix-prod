import { FAQ, LAST_UPDATE } from '@/lib/constants'
export const dynamic = 'force-static'
export function GET() {
  return Response.json({ updated: LAST_UPDATE, faq: FAQ.map((f) => ({ question: f.q, answer: f.a })) })
}
