import { SITE, SERVICES, OPTIONS, FAQ, LAST_UPDATE } from '@/lib/constants'
import { GUIDES } from '@/lib/guides'

export const dynamic = 'force-static'

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `Agence digitale basée en Guadeloupe (971), fondée par ${SITE.owner} (Mastère E-business). Spécialité : création de sites internet sur mesure, améliorés grâce à l’IA pour être livrés plus vite et à moindre coût, et visibilité des entreprises locales sur Google et dans les réponses des IA (ChatGPT, Gemini, Perplexity), aussi appelée GEO. Clients : petites entreprises de Guadeloupe (artisans, commerces, beauté, tourisme, services). Audit gratuit « Votre entreprise est-elle visible par l’IA ? ». Prix finaux, TVA non applicable (art. 293 B du CGI). Mise à jour : ${LAST_UPDATE}.`,
    '',
    '## Pages',
    `- [Accueil](${SITE.url}/): présentation de l'agence et de ses services`,
    `- [Audit gratuit : visible par l’IA ?](${SITE.url}/audit-ia): on vérifie si ChatGPT, Gemini, Perplexity et Google citent votre entreprise, résultat sous 48 h`,
    `- [Services et tarifs](${SITE.url}/services): détail des offres et prix fixes`,
    `- [Automation Lab](${SITE.url}/automation-lab): automatisations IA (réponses aux demandes clients) construites avec Claude`,
    `- [Réalisations](${SITE.url}/realisations): projets réels et vidéos`,
    `- [À propos](${SITE.url}/a-propos): qui est derrière RCKY DIGITAL`,
    `- [Contact](${SITE.url}/contact): demande de devis gratuit`,
    '',
    '## Guides',
    ...GUIDES.map((g) => `- [${g.title}](${SITE.url}/guides/${g.slug}): ${g.answer}`),
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
