import { SITE, SERVICES, OPTIONS, FAQ, LAST_UPDATE } from '@/lib/constants'

export const dynamic = 'force-static'

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `Agence de communication digitale basée en Guadeloupe (971), fondée par ${SITE.owner}. Clients : petites entreprises locales (gîtes, villas, excursions, salons de coiffure, instituts de beauté, barbiers, commerces). Prix finaux, TVA non applicable (art. 293 B du CGI). Devis gratuit. Mise à jour : ${LAST_UPDATE}.`,
    '',
    '## Pages',
    `- [Accueil](${SITE.url}/): présentation de l'agence et de ses services`,
    `- [Services et tarifs](${SITE.url}/services): détail des offres et prix de départ`,
    `- [Réalisations](${SITE.url}/realisations): projets réels et vidéos`,
    `- [À propos](${SITE.url}/a-propos): qui est derrière RCKY DIGITAL`,
    `- [Contact](${SITE.url}/contact): demande de devis gratuit`,
    '',
    '## Services et tarifs',
    ...SERVICES.map((s) => `- ${s.title} (${s.price}${s.priceNote ? ' ' + s.priceNote : ''}) : ${s.description}`),
    ...OPTIONS.map((p) => `- Option : ${p.title} (${p.price}${p.priceNote ? ' ' + p.priceNote : ''}) : ${p.description}`),
    '',
    '## Questions fréquentes',
    ...FAQ.map((f) => `- ${f.q} ${f.a}`),
    '',
    '## Contact',
    `- Téléphone / WhatsApp : ${SITE.phone}`,
    `- E-mail : ${SITE.email}`,
    `- Instagram : ${SITE.social.instagram}`,
    `- Zone : toute la Guadeloupe, et à distance`,
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
