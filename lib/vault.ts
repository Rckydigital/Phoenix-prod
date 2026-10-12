// Lecture du cerveau (dépôt GitHub privé) pour le QG virtuel.
// Utilise CRM_GITHUB_TOKEN (permission Contents en lecture suffit).

const REPO = () => process.env.CRM_GITHUB_REPO || 'Rckydigital/cerveau-ricky-galin'

async function gh(path: string) {
  const token = process.env.CRM_GITHUB_TOKEN
  if (!token) throw new Error('CRM_GITHUB_TOKEN manquant')
  const url = `https://api.github.com/repos/${REPO()}/contents/${path.split('/').map(encodeURIComponent).join('/')}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate: 120 },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub ${res.status} sur ${path}`)
  return res.json()
}

// Mode test local : QG_LOCAL_VAULT=/chemin/vers/le/coffre (jamais défini en production)
async function localFs() {
  const dir = process.env.QG_LOCAL_VAULT
  if (!dir) return null
  const fs = await import('fs/promises')
  const p = await import('path')
  return { dir, fs, p }
}

async function readFile(path: string): Promise<string | null> {
  const local = await localFs()
  if (local) return local.fs.readFile(local.p.join(local.dir, path), 'utf8').catch(() => null)
  const data = await gh(path)
  if (!data || Array.isArray(data) || !data.content) return null
  return Buffer.from(data.content, 'base64').toString('utf8')
}

async function listDir(path: string): Promise<{ name: string; path: string }[]> {
  const local = await localFs()
  if (local) {
    const names = await local.fs.readdir(local.p.join(local.dir, path)).catch(() => [] as string[])
    return names.filter((n) => n.endsWith('.md')).map((name) => ({ name, path: `${path}/${name}` }))
  }
  const data = await gh(path)
  if (!Array.isArray(data)) return []
  return data.filter((f: { type: string }) => f.type === 'file').map((f: { name: string; path: string }) => ({ name: f.name, path: f.path }))
}

export function frontmatter(md: string): Record<string, string> {
  const m = md.match(/^---\n([\s\S]*?)\n---/)
  const out: Record<string, string> = {}
  if (!m) return out
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i < 1) continue
    const key = line.slice(0, i).trim()
    let val = line.slice(i + 1).trim()
    if (val.startsWith('"') && val.endsWith('"')) {
      try { val = JSON.parse(val) } catch { val = val.slice(1, -1) }
    }
    out[key] = val
  }
  return out
}

function section(md: string, startsWith: string): string[] {
  const lines = md.split('\n')
  const start = lines.findIndex((l) => l.startsWith('## ') && l.includes(startsWith))
  if (start < 0) return []
  const out: string[] = []
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) break
    out.push(lines[i])
  }
  return out
}

const clean = (s: string) => s.replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a).replace(/\*\*/g, '').trim()

export type JournalEntry = { date: string; time: string; agent: string; what: string; files: string }

export type AgentDef = {
  id: string
  name: string
  role: string
  schedule: string
  match: string[] // mots repérés dans la colonne « Agent » du journal
  reportPrefix?: string // préfixe des rapports dans 30 - Agents/Journaux
  color: string
}

export const AGENTS: AgentDef[] = [
  { id: 'directeur', name: 'Directeur', role: 'Chef d’orchestre, briefing et mails', schedule: 'Lun-ven · 6h45', match: ['directeur'], color: '#E8742A' },
  { id: 'commercial', name: 'Commercial', role: 'Prospects, relances, devis', schedule: 'Lundi', match: ['commercial'], reportPrefix: 'Commercial', color: '#2A93A8' },
  { id: 'marketing', name: 'Marketing', role: 'Contenus et visibilité de l’agence', schedule: 'Mercredi', match: ['marketing'], reportPrefix: 'Contenu', color: '#7A2E6B' },
  { id: 'finance', name: 'Finance & Admin', role: 'CA, factures, échéances', schedule: 'Vendredi', match: ['finance'], reportPrefix: 'Finance', color: '#C8383C' },
  { id: 'veille', name: 'Veille', role: 'Tendances, ressources, apprentissage', schedule: 'Mardi et jeudi', match: ['veille'], reportPrefix: 'Veille', color: '#3F7D4E' },
]

export type QGData = {
  today: string
  agents: (AgentDef & {
    last?: JournalEntry
    recent: JournalEntry[]
    report?: { name: string; excerpt: string }
  })[]
  aValider: string[]
  priorites: string[]
  crm: { total: number; nouveaux: number; prospects: number; enCours: number; actifs: number; recents: { nom: string; statut: string; source: string }[] }
  objectifs: { clientsActifs: number; clientsCible: number }
  journal: JournalEntry[]
  error?: string
}

export function todayGP() {
  return new Date(Date.now() - 4 * 3600 * 1000).toISOString().slice(0, 10)
}

export async function loadQG(): Promise<QGData> {
  const today = todayGP()
  const empty: QGData = {
    today,
    agents: AGENTS.map((a) => ({ ...a, recent: [] })),
    aValider: [],
    priorites: [],
    crm: { total: 0, nouveaux: 0, prospects: 0, enCours: 0, actifs: 0, recents: [] },
    objectifs: { clientsActifs: 0, clientsCible: 4 },
    journal: [],
  }

  try {
    const [journalMd, dashboardMd, reports, fiches] = await Promise.all([
      readFile('30 - Agents/Journaux/Journal.md'),
      readFile('Tableau de bord.md'),
      listDir('30 - Agents/Journaux'),
      listDir('50 - Clients/Fiches'),
    ])

    const journal: JournalEntry[] = (journalMd || '')
      .split('\n')
      .filter((l) => /^\d{4}-\d{2}-\d{2}/.test(l) && l.includes('|'))
      .map((l) => {
        const [dt, agent = '', what = '', files = ''] = l.split('|').map((s) => s.trim())
        const [date, time = ''] = dt.split(/\s+/)
        return { date, time, agent, what, files }
      })
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

    const agents = await Promise.all(
      AGENTS.map(async (a) => {
        const mine = journal.filter((e) => a.match.some((m) => e.agent.toLowerCase().includes(m)))
        let report: { name: string; excerpt: string } | undefined
        if (a.reportPrefix) {
          const file = reports
            .filter((f) => f.name.startsWith(a.reportPrefix + ' ') && f.name.endsWith('.md'))
            .sort((x, y) => y.name.localeCompare(x.name))[0]
          if (file) {
            const md = (await readFile(file.path)) || ''
            const body = md.replace(/^---[\s\S]*?---\n/, '')
            report = {
              name: file.name.replace(/\.md$/, ''),
              excerpt: body.split('\n').filter((l) => l.trim()).slice(0, 8).map(clean).join('\n'),
            }
          }
        }
        return { ...a, last: mine[0], recent: mine.slice(0, 5), report }
      }),
    )

    const dash = dashboardMd || ''
    const aValider = section(dash, 'À valider')
      .filter((l) => /^- \[ \]/.test(l.trim()))
      .map((l) => clean(l.replace(/^\s*- \[ \]\s*/, '')))
    const priorites = section(dash, 'Priorités')
      .filter((l) => /^\d+\./.test(l.trim()))
      .map((l) => clean(l.replace(/^\s*\d+\.\s*/, '')))
      .filter((l) => l && l !== '—')

    const fm = await Promise.all(
      fiches.filter((f) => f.name.endsWith('.md')).map(async (f) => ({ name: f.name.replace(/\.md$/, ''), fm: frontmatter((await readFile(f.path)) || '') })),
    )
    const count = (s: string) => fm.filter((f) => (f.fm.statut || '').toLowerCase() === s.toLowerCase()).length
    const crm = {
      total: fm.length,
      nouveaux: count('Nouveau'),
      prospects: count('Prospect'),
      enCours: count('Contacté') + count('Devis envoyé'),
      actifs: count('Client actif'),
      recents: fm
        .filter((f) => ['nouveau', 'contacté', 'devis envoyé', 'client actif'].includes((f.fm.statut || '').toLowerCase()))
        .slice(0, 6)
        .map((f) => ({ nom: f.fm.entreprise || f.name, statut: f.fm.statut || '', source: f.fm.source || '' })),
    }

    return {
      today,
      agents,
      aValider,
      priorites,
      crm,
      objectifs: { clientsActifs: crm.actifs, clientsCible: 4 },
      journal: journal.slice(0, 12),
    }
  } catch (err) {
    return { ...empty, error: err instanceof Error ? err.message : 'Erreur de lecture du cerveau' }
  }
}
