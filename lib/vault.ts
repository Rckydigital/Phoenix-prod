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

export type TreeFile = { path: string; size: number }

export async function listTree(): Promise<TreeFile[]> {
  const local = await localFs()
  if (local) {
    const out: TreeFile[] = []
    const walk = async (rel: string) => {
      const entries = await local.fs.readdir(local.p.join(local.dir, rel), { withFileTypes: true }).catch(() => [])
      for (const e of entries) {
        if (e.name.startsWith('.git') && e.name !== '.gitkeep') continue
        const r = rel ? `${rel}/${e.name}` : e.name
        if (e.isDirectory()) await walk(r)
        else out.push({ path: r, size: (await local.fs.stat(local.p.join(local.dir, r))).size })
      }
    }
    await walk('')
    return out
  }
  const token = process.env.CRM_GITHUB_TOKEN
  if (!token) throw new Error('CRM_GITHUB_TOKEN manquant')
  const res = await fetch(`https://api.github.com/repos/${REPO()}/git/trees/HEAD?recursive=1`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    next: { revalidate: 120 },
  })
  if (!res.ok) throw new Error(`GitHub ${res.status} (arborescence)`)
  const json = await res.json()
  return (json.tree || []).filter((t: { type: string }) => t.type === 'blob').map((t: { path: string; size: number }) => ({ path: t.path, size: t.size || 0 }))
}

// Lecture brute d'un fichier (pour l'affichage / le téléchargement depuis le QG)
export async function readRaw(path: string): Promise<ArrayBuffer | null> {
  const local = await localFs()
  if (local) {
    const buf = await local.fs.readFile(local.p.join(local.dir, path)).catch(() => null)
    return buf ? buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer : null
  }
  const token = process.env.CRM_GITHUB_TOKEN
  if (!token) return null
  const url = `https://api.github.com/repos/${REPO()}/contents/${path.split('/').map(encodeURIComponent).join('/')}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.raw', 'X-GitHub-Api-Version': '2022-11-28' },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.arrayBuffer()
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
  folder: string // dossier de fichiers dans le cerveau
  color: string
}

export const AGENTS: AgentDef[] = [
  { id: 'directeur', folder: '70 - Fichiers/Directeur', name: 'Directeur', role: 'Chef d’orchestre, briefing et mails', schedule: 'Lun-ven · 6h45', match: ['directeur'], color: '#E8742A' },
  { id: 'commercial', folder: '70 - Fichiers/Commercial', name: 'Commercial', role: 'Prospects, relances, devis', schedule: 'Lundi · 5h50', match: ['commercial'], reportPrefix: 'Commercial', color: '#2A93A8' },
  { id: 'marketing', folder: '70 - Fichiers/Marketing', name: 'Marketing', role: 'Contenus et visibilité de l’agence', schedule: 'Mercredi · 19h50', match: ['marketing'], reportPrefix: 'Contenu', color: '#7A2E6B' },
  { id: 'finance', folder: '70 - Fichiers/Finance', name: 'Finance & Admin', role: 'CA, factures, échéances', schedule: 'Vendredi · 12h35', match: ['finance'], reportPrefix: 'Finance', color: '#C8383C' },
  { id: 'secretaire', folder: '70 - Fichiers/Secrétaire', name: 'Secrétaire', role: 'Agenda, rendez-vous, accueil', schedule: 'Lun-ven · 6h45', match: ['secrétaire', 'secretaire'], reportPrefix: 'Secrétaire', color: '#C9A227' },
  { id: 'veille', folder: '70 - Fichiers/Veille', name: 'Veille', role: 'Tendances, ressources, apprentissage', schedule: 'Mardi et jeudi', match: ['veille'], reportPrefix: 'Veille', color: '#3F7D4E' },
]

export type AgentFile = { path: string; name: string; group: string; size: number; ext: string }
export type Post = { path: string; name: string; statut: string; date_prevue: string; date_publication: string; canva: string; format: string }

export type Operation = {
  path: string
  date: string
  sens: 'Entrée' | 'Sortie'
  montant: number
  libelle: string
  categorie: string
  tiers: string
  recurrence: string
  prochain_renouvellement: string
  montant_renouvellement: number
  abby: string
  paye_par: 'Pro' | 'Perso'
}

export const OPS_FOLDER = '70 - Fichiers/Finance/Opérations'

export type QGData = {
  today: string
  agents: (AgentDef & {
    last?: JournalEntry
    recent: JournalEntry[]
    report?: { name: string; excerpt: string }
    files: AgentFile[]
    groups: string[]
    posts?: Post[]
  })[]
  aValider: string[]
  priorites: string[]
  crm: { total: number; nouveaux: number; prospects: number; enCours: number; actifs: number; recents: { nom: string; statut: string; source: string }[] }
  objectifs: { clientsActifs: number; clientsCible: number }
  journal: JournalEntry[]
  operations: Operation[]
  error?: string
}

export function todayGP() {
  return new Date(Date.now() - 4 * 3600 * 1000).toISOString().slice(0, 10)
}

export async function loadQG(): Promise<QGData> {
  const today = todayGP()
  const empty: QGData = {
    today,
    agents: AGENTS.map((a) => ({ ...a, recent: [], files: [], groups: [] })),
    aValider: [],
    priorites: [],
    crm: { total: 0, nouveaux: 0, prospects: 0, enCours: 0, actifs: 0, recents: [] },
    objectifs: { clientsActifs: 0, clientsCible: 4 },
    journal: [],
    operations: [],
  }

  try {
    const [journalMd, dashboardMd, reports, fiches, tree] = await Promise.all([
      readFile('30 - Agents/Journaux/Journal.md'),
      readFile('Tableau de bord.md'),
      listDir('30 - Agents/Journaux'),
      listDir('50 - Clients/Fiches'),
      listTree().catch(() => [] as TreeFile[]),
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
        const groups = Array.from(
          new Set(
            tree
              .filter((t) => t.path.startsWith(a.folder + '/'))
              .map((t) => t.path.slice(a.folder.length + 1).split('/'))
              .filter((p) => p.length > 1)
              .map((p) => p[0]),
          ),
        ).sort()
        const files: AgentFile[] = tree
          .filter((t) => t.path.startsWith(a.folder + '/') && !t.path.endsWith('.gitkeep') && !t.path.endsWith('.base'))
          .map((t) => {
            const rest = t.path.slice(a.folder.length + 1)
            const parts = rest.split('/')
            const name = parts[parts.length - 1]
            return { path: t.path, name, group: parts.length > 1 ? parts[0] : 'Général', size: t.size, ext: (name.split('.').pop() || '').toLowerCase() }
          })
          .sort((x, y) => x.group.localeCompare(y.group) || x.name.localeCompare(y.name))
        let posts: Post[] | undefined
        if (a.id === 'marketing') {
          const postFiles = files.filter((f) => f.group === 'Posts' && f.ext === 'md')
          posts = await Promise.all(
            postFiles.map(async (f) => {
              const fm = frontmatter((await readFile(f.path)) || '')
              return {
                path: f.path,
                name: f.name.replace(/\.md$/, ''),
                statut: fm.statut || 'À valider',
                date_prevue: fm.date_prevue || '',
                date_publication: fm.date_publication || '',
                canva: fm.canva || '',
                format: fm.format || '',
              }
            }),
          )
        }
        return { ...a, last: mine[0], recent: mine.slice(0, 5), report, groups: groups.filter((g) => !(a.id === 'marketing' && g === 'Posts')), files: files.filter((f) => !(a.id === 'marketing' && f.group === 'Posts')), posts }
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

    const num = (v: string) => Number(String(v || '0').replace(',', '.').replace(/[^0-9.-]/g, '')) || 0
    const opFiles = tree.filter((t) => t.path.startsWith(OPS_FOLDER + '/') && t.path.endsWith('.md'))
    const operations: Operation[] = (
      await Promise.all(
        opFiles.map(async (f) => {
          const o = frontmatter((await readFile(f.path)) || '')
          if (!/^\d{4}-\d{2}-\d{2}/.test(o.date || '')) return null
          return {
            path: f.path,
            date: o.date.slice(0, 10),
            sens: (o.sens || '').toLowerCase().startsWith('e') ? 'Entrée' : 'Sortie',
            montant: Math.abs(num(o.montant)),
            libelle: o.libelle || f.path.split('/').pop()!.replace(/\.md$/, ''),
            categorie: o.categorie || '',
            tiers: o.tiers || '',
            recurrence: o.recurrence || 'Ponctuel',
            prochain_renouvellement: (o.prochain_renouvellement || '').slice(0, 10),
            montant_renouvellement: num(o.montant_renouvellement),
            abby: o.abby || '',
            paye_par: (o.paye_par || '').toLowerCase().startsWith('perso') ? 'Perso' : 'Pro',
          } as Operation
        }),
      )
    )
      .filter((o): o is Operation => o !== null)
      .sort((a, b) => b.date.localeCompare(a.date))

    return {
      today,
      operations,
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
