// Bilingue français / anglais.
// Le français est à la racine (/automation-lab), l'anglais sous /en (/en/automation-lab).
// Les pages du pôle « visibilité locale » (services, réalisations, guides) restent en français.

export type Lang = 'fr' | 'en'

// Correspondance des pages FR <-> EN
export const ROUTES = {
  home: { fr: '/', en: '/en' },
  lab: { fr: '/automation-lab', en: '/en/automation-lab' },
  pricing: { fr: '/tarifs', en: '/en/pricing' },
  demo: { fr: '/demo', en: '/en/demo' },
  quote: { fr: '/devis', en: '/en/quote' },
  contact: { fr: '/contact', en: '/en/contact' },
  about: { fr: '/a-propos', en: '/en/about' },
  signup: { fr: '/inscription', en: '/en/signup' },
  login: { fr: '/connexion', en: '/en/login' },
  dashboard: { fr: '/espace-client', en: '/en/dashboard' },
  services: { fr: '/services', en: '/services' },
  work: { fr: '/realisations', en: '/realisations' },
  guides: { fr: '/guides', en: '/guides' },
  legal: { fr: '/mentions-legales', en: '/mentions-legales' },
  privacy: { fr: '/politique-confidentialite', en: '/politique-confidentialite' },
} as const

export type RouteKey = keyof typeof ROUTES

export const r = (key: RouteKey, lang: Lang) => ROUTES[key][lang]

export function langOf(pathname: string | null | undefined): Lang {
  return pathname === '/en' || pathname?.startsWith('/en/') ? 'en' : 'fr'
}

// Page équivalente dans l'autre langue (accueil de la langue si pas d'équivalent)
export function switchPath(pathname: string, to: Lang): string {
  for (const k of Object.keys(ROUTES) as RouteKey[]) {
    const v = ROUTES[k]
    if (v.fr === pathname || v.en === pathname) return v[to]
  }
  return to === 'en' ? '/en' : '/'
}

// Formules Automation Lab (prix de lancement : modifiables ici, en un seul endroit).
// Micro-entreprise en franchise de TVA : prix nets.
export type PlanId = 'starter' | 'business' | 'premium'
export const PLANS: {
  id: PlanId
  setup: number
  monthly: number
  popular?: boolean
  name: Record<Lang, string>
  tagline: Record<Lang, string>
  features: Record<Lang, string[]>
}[] = [
  {
    id: 'starter',
    setup: 990,
    monthly: 149,
    name: { fr: 'Starter', en: 'Starter' },
    tagline: { fr: 'Pour automatiser un premier processus', en: 'Automate your first process' },
    features: {
      fr: ['1 automatisation (ex. LeadFlow)', 'Connexion à 2 outils (formulaire, CRM…)', 'Suivi dans votre espace client', 'Maintenance et ajustements mineurs', 'Support par e-mail (48 h ouvrées)'],
      en: ['1 automation (e.g. LeadFlow)', 'Connects 2 tools (form, CRM…)', 'Tracking in your client area', 'Maintenance and minor tweaks', 'Email support (48 business hours)'],
    },
  },
  {
    id: 'business',
    setup: 1990,
    monthly: 299,
    popular: true,
    name: { fr: 'Business', en: 'Business' },
    tagline: { fr: 'Pour connecter vos processus clés', en: 'Connect your key processes' },
    features: {
      fr: ['Jusqu’à 3 automatisations connectées', 'Connexion à 5 outils', 'Rapport mensuel des résultats', 'Point de suivi mensuel en visio (30 min)', 'Support prioritaire (24 h ouvrées)'],
      en: ['Up to 3 connected automations', 'Connects 5 tools', 'Monthly results report', 'Monthly 30-min review call', 'Priority support (24 business hours)'],
    },
  },
  {
    id: 'premium',
    setup: 3490,
    monthly: 499,
    name: { fr: 'Premium', en: 'Premium' },
    tagline: { fr: 'Pour une équipe qui veut aller loin', en: 'For teams that want to go further' },
    features: {
      fr: ['Automatisations sur devis, sans limite fixe', 'Assistant IA sur mesure (site, e-mail)', 'Tableau de bord des résultats', 'Point de suivi toutes les 2 semaines', 'Support prioritaire, jours ouvrés'],
      en: ['Automations on quote, no fixed cap', 'Custom AI assistant (website, email)', 'Results dashboard', 'Review call every 2 weeks', 'Priority support, business days'],
    },
  },
]

export const eur = (n: number, lang: Lang) =>
  lang === 'fr'
    ? n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €'
    : '€' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 })
