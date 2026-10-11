// Enregistre chaque demande du formulaire comme fiche client dans le cerveau
// (dépôt GitHub privé, lu par Obsidian et par les agents).
// Variables d'environnement :
//   CRM_GITHUB_TOKEN : jeton GitHub (accès « Contents : Read and write » au seul dépôt du cerveau)
//   CRM_GITHUB_REPO  : « propriétaire/dépôt » (par défaut Rckydigital/cerveau-ricky-galin)
//   CRM_FOLDER       : dossier des fiches (par défaut « 50 - Clients/Fiches »)

export type Lead = {
  name: string
  email: string
  phone: string
  business: string
  service: string
  message: string
}

export function crmConfigured() {
  return Boolean(process.env.CRM_GITHUB_TOKEN)
}

function slug(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 60)
}

// JSON.stringify produit une chaîne valide en YAML (guillemets et échappements)
const y = (v: string) => JSON.stringify(v)

export async function saveLeadToCrm(lead: Lead) {
  const token = process.env.CRM_GITHUB_TOKEN
  if (!token) throw new Error('CRM_GITHUB_TOKEN manquant')
  const repo = process.env.CRM_GITHUB_REPO || 'Rckydigital/cerveau-ricky-galin'
  const folder = process.env.CRM_FOLDER || '50 - Clients/Fiches'

  const now = new Date()
  // Heure de Guadeloupe (UTC-4, pas d'heure d'été)
  const local = new Date(now.getTime() - 4 * 3600 * 1000)
  const date = local.toISOString().slice(0, 10)
  const time = local.toISOString().slice(11, 16).replace(':', 'h')
  const title = slug(lead.business || lead.name) || 'Demande'
  const path = `${folder}/${title} (${date} ${time}).md`

  const content = `---
type: client
statut: Nouveau
source: Site web
nom: ${y(lead.name)}
entreprise: ${y(lead.business)}
email: ${y(lead.email)}
telephone: ${y(lead.phone)}
service: ${y(lead.service)}
secteur: ""
date_contact: ${date}
prochaine_action: "Répondre sous 48 h"
montant:
---

# ${lead.business || lead.name}

> Demande reçue via le formulaire du site le ${date} à ${time.replace('h', ':')}.

## Message
${lead.message.replace(/^---$/gm, '- - -')}

## Historique
| Date | Action | Résultat |
|---|---|---|
| ${date} | Demande via le site | — |
`

  const url = `https://api.github.com/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Nouvelle demande site : ${title}`,
      content: Buffer.from(content, 'utf8').toString('base64'),
    }),
  })
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
}
