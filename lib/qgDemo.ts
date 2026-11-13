// Mode démo du QG : données 100 % fictives pour montrer le système à un prospect
// sans jamais afficher de vrais noms de prospects, de clients ou de chiffres.
import { AGENTS, todayGP, type QGData, type JournalEntry } from '@/lib/vault'

const NUIT: [string, string, string][] = [
  ['00:21', 'Veille', 'Sujet de la nuit : nouvelles aides régionales au numérique (4 sources officielles)'],
  ['01:22', 'Finance', '2 factures en retard repérées, brouillons de relance prêts'],
  ['02:24', 'Commercial', '3 prospects vérifiés (Exemple Immo, Exemple Conciergerie, Exemple Studio) + 3 brouillons'],
  ['03:12', 'Dev', 'Démo « commande en ligne » prête pour un prospect'],
  ['03:52', 'Marketing', '1 post préparé : « 3 erreurs sur votre fiche Google »'],
  ['04:44', 'Commercial P2', '12 prospects (agences immobilières, conciergeries) + 12 brouillons'],
  ['06:46', 'Secrétaire', 'Agenda de la semaine : 2 créneaux libres, aucun conflit'],
  ['06:50', 'Directeur', 'Briefing : 4 actions pour aujourd’hui, 38 min au total'],
]

export function demoQG(): QGData {
  const today = todayGP()
  const journal: JournalEntry[] = NUIT.map(([time, agent, what]) => ({ date: today, time, agent, what, files: '(données fictives)' }))
  const agents = AGENTS.map((a) => {
    const recent = journal.filter((j) => a.match.some((m) => j.agent.toLowerCase().includes(m)) && (a.id !== 'commercial' || j.agent === 'Commercial'))
    return {
      ...a,
      last: recent[recent.length - 1],
      recent,
      report: recent.length ? { name: `${a.name} — exemple`, excerpt: `Exemple de rapport de nuit (données fictives) : ${recent[recent.length - 1].what}.` } : undefined,
      files: [],
      groups: [],
    }
  })
  return {
    today,
    agents,
    aValider: [
      'Commercial : 3 brouillons à relire et envoyer (exemple)',
      'Finance : 2 relances de factures à valider (exemple)',
      'Marketing : 1 post à valider (exemple)',
    ],
    priorites: ['Relire les brouillons de prospection (15 min)', 'Valider les relances (5 min)', 'Publier le post (2 min)'],
    crm: { total: 24, nouveaux: 3, prospects: 15, enCours: 4, actifs: 2, clients: ['Client Exemple A', 'Client Exemple B'], recents: [
      { nom: 'Exemple Immo', statut: 'Prospect', source: 'Prospection' },
      { nom: 'Exemple Conciergerie', statut: 'Prospect', source: 'Prospection' },
      { nom: 'Exemple Studio', statut: 'Contacté', source: 'Prospection' },
    ] },
    objectifs: { clientsActifs: 2, clientsCible: 4 },
    journal,
    operations: [],
    site: { configured: false, rows: [] },
  }
}
