// Pipeline du QG : les fiches prospects du cerveau (50 - Clients/Fiches, pôle 1
// et pôle 2) rangées en 4 étapes, pour la vue Pipeline et la vue 3D « L'agence ».
// Lecture seule : changer une étape se fait dans la fiche (Obsidian) ou par l'agent.

export type Colonne = 'nouveau' | 'contacte' | 'gagne' | 'perdu'
export type Chaleur = 'chaud' | 'tiede' | 'froid'

export type FichePipeline = {
  id: number // ordre de priorité (1 = la plus urgente)
  path: string
  nom: string
  contact: string
  statut: string
  colonne: Colonne
  chaleur: Chaleur
  pole: 'Pôle 1' | 'Pôle 2'
  secteur: string
  commune: string
  email: string
  telephone: string
  site: string
  source: string
  date_contact: string
  prochaine_action: string
  relance: string // date de relance repérée (AAAA-MM-JJ) ou ''
  relanceDue: boolean
  extrait: string
}

const COLONNES: Record<string, Colonne> = {
  prospect: 'nouveau', 'à contacter': 'nouveau', 'a contacter': 'nouveau', nouveau: 'nouveau',
  contacté: 'contacte', contacte: 'contacte', 'en discussion': 'contacte', devis: 'contacte', 'devis envoyé': 'contacte', relancé: 'contacte',
  'client actif': 'gagne', client: 'gagne', gagné: 'gagne', signé: 'gagne', 'ancien client': 'gagne',
  perdu: 'perdu', écarté: 'perdu', ecarte: 'perdu', 'en pause': 'perdu',
}

export function colonneDe(statut: string): Colonne {
  return COLONNES[(statut || '').trim().toLowerCase()] || 'nouveau'
}

export function chaleurDe(statut: string, priorite = ''): Chaleur {
  const s = (statut || '').trim().toLowerCase()
  const etoiles = (priorite.match(/★/g) || []).length
  if (colonneDe(statut) === 'perdu') return 'froid'
  if (['en discussion', 'devis', 'devis envoyé', 'client actif', 'client', 'gagné', 'signé'].includes(s) || etoiles >= 3) return 'chaud'
  if (s === 'contacté' || s === 'relancé' || etoiles === 2) return 'tiede'
  return 'froid'
}

/* Première date trouvée dans « prochaine action » : 2026-12-01 ou 01/12 (année
   déduite : on prend la plus proche d'aujourd'hui). */
export function dateRelance(texte: string, today: string): string {
  const iso = texte.match(/(20\d{2})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const fr = texte.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(20\d{2}))?\b/)
  if (!fr) return ''
  const j = Number(fr[1]), m = Number(fr[2])
  if (j < 1 || j > 31 || m < 1 || m > 12) return ''
  let an = fr[3] ? Number(fr[3]) : Number(today.slice(0, 4))
  if (!fr[3]) {
    const moisAuj = Number(today.slice(5, 7))
    if (m - moisAuj > 6) an -= 1
    else if (moisAuj - m > 6) an += 1
  }
  return `${an}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`
}

const propre = (s: string) => s.replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a).replace(/\*\*/g, '').trim()

export function construirePipeline(
  fiches: { path: string; md: string; fm: Record<string, string> }[],
  today: string,
): FichePipeline[] {
  const brut = fiches.map((f) => {
    const fm = f.fm
    const nomFichier = f.path.split('/').pop()!.replace(/\.md$/, '')
    const statut = fm.statut || 'Prospect'
    const colonne = colonneDe(statut)
    const relance = dateRelance(fm.prochaine_action || '', today)
    const corps = f.md.replace(/^---[\s\S]*?---\n?/, '')
    return {
      id: 0,
      path: f.path,
      nom: fm.entreprise || nomFichier,
      contact: fm.contact || (fm.nom && fm.nom !== fm.entreprise ? fm.nom : ''),
      statut,
      colonne,
      chaleur: chaleurDe(statut, fm.priorite || ''),
      pole: (f.path.includes('/Pôle 2/') || (fm.pole || '').includes('automation') ? 'Pôle 2' : 'Pôle 1') as FichePipeline['pole'],
      secteur: fm.secteur || '',
      commune: fm.commune || fm.pays || '',
      email: fm.email || '',
      telephone: fm.telephone || '',
      site: fm.site || '',
      source: fm.source || '',
      date_contact: (fm.date_contact || '').slice(0, 10),
      prochaine_action: propre(fm.prochaine_action || ''),
      relance,
      relanceDue: (colonne === 'nouveau' || colonne === 'contacte') && !!relance && relance <= today,
      extrait: propre(corps.split('\n').filter((l) => l.trim() && !l.startsWith('|')).slice(0, 8).join('\n')).slice(0, 600),
    }
  })
  // ordre : relances dues, puis chaleur, puis contact le plus récent
  const rang = { chaud: 0, tiede: 1, froid: 2 }
  brut.sort((a, b) =>
    Number(b.relanceDue) - Number(a.relanceDue) ||
    rang[a.chaleur] - rang[b.chaleur] ||
    b.date_contact.localeCompare(a.date_contact) ||
    a.nom.localeCompare(b.nom, 'fr'),
  )
  return brut.map((f, i) => ({ ...f, id: i + 1 }))
}
