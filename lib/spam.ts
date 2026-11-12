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

// Expéditeurs déjà repérés comme spam (le nom d'entreprise est usurpé à chaque fois)
const BLOCKED_NAMES = ['secafi']
// Extensions de domaine très utilisées par le spam et l'hameçonnage
const RISKY_TLD = /\.(my\.id|xyz|top|online|shop|click|site|icu|buzz|live|rest|cfd|sbs|lol|monster|quest|info)(\/|\b|$)/i

const SHORTENERS = /(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|cutt\.ly|rebrand\.ly|shorturl|rb\.gy)/i

export function spamScore(f: { name: string; email: string; message: string; business?: string }) {
  const email = f.email.toLowerCase()
  const text = `${f.name} ${f.business || ''} ${f.message}`.toLowerCase()
  const reasons: string[] = []
  let score = 0

  const links = (f.message.match(/(https?:\/\/|\bwww\.)[^\s]+/gi) || []).filter((u) => !/^www\./i.test(u) || !/https?:\/\/www\./i.test(f.message)).length
  if (links >= 2) { score += 2; reasons.push(`${links} liens`) }
  else if (links === 1) { score += 1; reasons.push('1 lien') }
  if (SHORTENERS.test(f.message)) { score += 2; reasons.push('lien raccourci') }

  // Lien vers un autre site que celui de l'expéditeur (« le détail est ici : https://… »)
  const domains = (f.message.match(/https?:\/\/([^\/\s]+)/gi) || []).map((u) => u.replace(/https?:\/\//i, '').toLowerCase().replace(/[.,;:!?)»"']+$/, ''))
  const emailDomain = email.split('@')[1] || ''
  if (domains.some((d) => !emailDomain || !d.endsWith(emailDomain.replace(/^www\./, '')))) {
    if (/(le détail|les détails|details?\b|\bvoir\b|consulter|\bici\b|\bhere\b|\blien\b|\blink\b|document|devis complet)/i.test(f.message)) { score += 2; reasons.push('lien externe « voir le détail »') }
  }
  if (domains.some((d) => RISKY_TLD.test(d))) { score += 2; reasons.push('lien vers un domaine à risque') }
  if (RISKY_TLD.test(emailDomain)) { score += 2; reasons.push(`adresse e-mail en ${emailDomain.split('.').slice(-2).join('.')}`) }
  if (/\d{4,}@/.test(email)) { score += 1; reasons.push('adresse avec suite de chiffres') }
  const who = `${f.name} ${f.business || ''}`.toLowerCase()
  if (BLOCKED_NAMES.some((n) => who.includes(n))) { score += 3; reasons.push('expéditeur déjà signalé comme spam') }

  const hits = KEYWORDS.filter((k) => text.includes(k))
  if (hits.length) { score += Math.min(3, hits.length * 1.5); reasons.push(`mots suspects : ${hits.slice(0, 3).join(', ')}`) }

  if (/[Ѐ-ӿ一-鿿؀-ۿ]/.test(text)) { score += 2; reasons.push('alphabet inhabituel') }
  if (/<a\s|\[url=|<\/?[a-z]+>/i.test(f.message)) { score += 2; reasons.push('code HTML') }
  if (f.name.length > 3 && f.name === f.name.toUpperCase() && /\d/.test(f.name)) { score += 1; reasons.push('nom bizarre') }
  if (f.message.replace(/\s/g, '').length < 15) { score += 1; reasons.push('message vide') }

  return { score, spam: score >= 3, reasons }
}
