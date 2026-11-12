// Filtre anti-spam du formulaire de contact (sans service externe).
// Le champ piège « website » arrête déjà les robots simples ; ce score attrape
// le démarchage et le hameçonnage écrits « à la main ».
// Rien n'est supprimé : une demande suspecte arrive quand même par e-mail,
// marquée « [Spam probable] », mais ne crée pas de fiche dans le CRM.

const KEYWORDS = [
  // démarchage SEO / marketing
  'seo', 'backlink', 'first page of google', 'première page de google', 'guest post', 'link building',
  'web traffic', 'increase your traffic', 'rank your website', 'redesign your website', 'outsourc',
  // argent, crypto, prêts
  'crypto', 'bitcoin', 'forex', 'casino', 'loan', 'investment opportunity', 'prêt rapide',
  // hameçonnage
  'cliquez sur le lien', 'click the link', 'document partagé', 'shared document', 'voir le document',
  'vérifier votre compte', 'verify your account', 'mot de passe', 'password', 'facture en attente',
  'docusign', 'wetransfer', 'onedrive', 'sharepoint', 'dropbox',
]

const SHORTENERS = /(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|cutt\.ly|rebrand\.ly|shorturl|rb\.gy)/i

export function spamScore(f: { name: string; email: string; message: string; business?: string }) {
  const text = `${f.name} ${f.business || ''} ${f.message}`.toLowerCase()
  const reasons: string[] = []
  let score = 0

  const links = (f.message.match(/https?:\/\/|www\./gi) || []).length
  if (links >= 2) { score += 2; reasons.push(`${links} liens`) }
  else if (links === 1) { score += 1; reasons.push('1 lien') }
  if (SHORTENERS.test(f.message)) { score += 2; reasons.push('lien raccourci') }

  const hits = KEYWORDS.filter((k) => text.includes(k))
  if (hits.length) { score += Math.min(3, hits.length * 1.5); reasons.push(`mots suspects : ${hits.slice(0, 3).join(', ')}`) }

  if (/[Ѐ-ӿ一-鿿؀-ۿ]/.test(text)) { score += 2; reasons.push('alphabet inhabituel') }
  if (/<a\s|\[url=|<\/?[a-z]+>/i.test(f.message)) { score += 2; reasons.push('code HTML') }
  if (f.name.length > 3 && f.name === f.name.toUpperCase() && /\d/.test(f.name)) { score += 1; reasons.push('nom bizarre') }
  if (f.message.replace(/\s/g, '').length < 15) { score += 1; reasons.push('message vide') }

  return { score, spam: score >= 3, reasons }
}
