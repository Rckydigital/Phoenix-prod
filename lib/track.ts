// Mesure d'audience SANS cookie ni identifiant : de simples compteurs agrégés par jour.
// Stockage : Redis Upstash (intégration Vercel). Sans configuration, tout est ignoré sans erreur.

const url = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const token = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
export const trackingConfigured = () => Boolean(url() && token())

export const EVENTS = ['vue', 'formulaire', 'whatsapp', 'telephone', 'email', 'instagram', 'cta'] as const
export type TrackEvent = (typeof EVENTS)[number]
export const CONVERSIONS: TrackEvent[] = ['formulaire', 'whatsapp', 'telephone', 'email']

const day = (d = new Date()) => new Date(d.getTime() - 4 * 3600 * 1000).toISOString().slice(0, 10) // heure Guadeloupe
const clip = (s: string, n = 80) => s.replace(/[|\s]+/g, ' ').trim().slice(0, n)

async function pipeline(cmds: (string | number)[][]) {
  if (!trackingConfigured()) return null
  const res = await fetch(`${url()}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Redis ${res.status}`)
  return (await res.json()) as { result: unknown }[]
}

export async function track(event: TrackEvent, page: string, label = '', source = '') {
  try {
    const key = `stats:${day()}`
    const field = `${event}|${clip(page, 60) || '/'}|${clip(label)}|${clip(source, 40)}`
    await pipeline([
      ['HINCRBY', key, field, 1],
      ['EXPIRE', key, 60 * 60 * 24 * 400],
    ])
  } catch (e) {
    console.error('track', e)
  }
}

export type StatRow = { date: string; event: TrackEvent; page: string; label: string; source: string; n: number }

export async function readStats(days = 60): Promise<StatRow[]> {
  if (!trackingConfigured()) return []
  const dates = Array.from({ length: days }, (_, i) => day(new Date(Date.now() - i * 86400000)))
  const out = await pipeline(dates.map((d) => ['HGETALL', `stats:${d}`]))
  const rows: StatRow[] = []
  out?.forEach((r, i) => {
    const arr = (r.result as string[]) || []
    for (let k = 0; k < arr.length; k += 2) {
      const [event, page, label, source] = arr[k].split('|')
      rows.push({ date: dates[i], event: event as TrackEvent, page, label, source, n: Number(arr[k + 1]) || 0 })
    }
  })
  return rows
}
