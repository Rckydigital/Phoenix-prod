// ============================================================
// FICHIER CENTRAL DE CONFIGURATION
// Toutes les données du site sont ici : nom, contact, services, prix…
// Règle : n'afficher que des informations vraies et vérifiables.
// ============================================================

export const SITE = {
  name: 'RCKY DIGITAL',
  owner: 'Ricky GALIN',
  tagline: 'Photos, vidéos et sites qui donnent envie de réserver',
  description:
    "RCKY DIGITAL, agence digitale en Guadeloupe : shooting photo et vidéo, gestion des réseaux sociaux et sites avec réservation pour le tourisme, la beauté et le bien-être.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://phoenix-prod-two.vercel.app',
  email: 'rckydigital@outlook.fr',
  phone: '+590 690 57 38 70',
  address: 'Guadeloupe (971)',
  siret: '980 046 965 00011',
  // Lien de prise de RDV (Calendly ou autre). Laisser vide pour masquer le bloc.
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || '',
  social: {
    instagram: 'https://www.instagram.com/_rcky_digital/',
  },
}

// Offre de lancement (à retirer quand les 3 premiers clients sont signés)
export const LAUNCH_OFFER = {
  active: true,
  title: 'Offre de lancement : -30 %',
  text: "Pour nos 3 premiers clients, en échange d'un avis et de l'autorisation de montrer le projet dans notre portfolio.",
}

export type Service = {
  id: string
  title: string
  price: string
  priceNote?: string
  description: string
  features: string[]
  forWho: string
}

export const SERVICES: Service[] = [
  {
    id: 'shooting',
    title: 'Shooting photo & vidéo',
    price: 'dès 150 €',
    description:
      "Nous venons sur place photographier et filmer votre lieu, vos prestations et votre ambiance. Vous repartez avec des visuels prêts pour votre site, vos annonces et vos réseaux.",
    features: ['Séance sur place', 'Photos retouchées', '2 à 3 vidéos courtes montées', 'Formats réseaux sociaux'],
    forWho: 'Gîtes, villas, excursions, salons, instituts',
  },
  {
    id: 'reseaux',
    title: 'Gestion des réseaux sociaux',
    price: 'dès 200 €',
    priceNote: '/ mois',
    description:
      'Nous créons et publions vos contenus chaque mois, avec une ligne éditoriale claire, pour que votre compte travaille pour vous pendant que vous gérez votre activité.',
    features: ['8 à 12 publications / mois', 'Création des visuels', 'Publication et légendes', 'Rapport mensuel'],
    forWho: 'Toute entreprise qui veut être visible régulièrement',
  },
  {
    id: 'site',
    title: 'Site internet avec réservation',
    price: 'dès 450 €',
    description:
      "Un site vitrine moderne, adapté au mobile, avec réservation ou prise de rendez-vous en ligne. Vos clients réservent même quand vous êtes occupé.",
    features: ['Design adapté au mobile', 'Réservation / prise de RDV', 'Référencement local de base', 'Maintenance dès 30 €/mois'],
    forWho: 'Hébergements, activités, salons, instituts',
  },
  {
    id: 'montage',
    title: 'Montage vidéo',
    price: 'dès 80 €',
    description:
      'Vous avez filmé, nous faisons le reste : montage dynamique, sous-titres et formats adaptés à Instagram, TikTok ou à votre site.',
    features: ['Montage à partir de vos vidéos', 'Sous-titres', 'Musique libre de droits', 'Formats verticaux et horizontaux'],
    forWho: 'Ceux qui filment déjà mais manquent de temps',
  },
  {
    id: 'grille',
    title: 'Grille de prix & visuels illustrés',
    price: 'dès 60 €',
    description:
      'Une présentation claire et élégante de vos prestations et de vos tarifs, en post pour les réseaux et en flyer à imprimer.',
    features: ['Carte des services', 'Version réseaux sociaux', 'Version flyer imprimable', 'Aux couleurs de votre marque'],
    forWho: 'Salons, instituts, barbiers, activités',
  },
  {
    id: 'conseil',
    title: 'Conseil & stratégie marketing',
    price: 'Sur devis',
    description:
      "Un regard extérieur sur votre présence en ligne : ce qui fonctionne, ce qui freine vos réservations, et un plan d'action simple sur 3 mois.",
    features: ['Audit de votre présence en ligne', 'Plan d’action priorisé', 'Newsletter & e-mailing', 'Accompagnement mensuel possible'],
    forWho: 'Ceux qui veulent un plan clair avant de se lancer',
  },
]

export const PACKS = [
  {
    id: 'saison',
    title: 'Pack Saison Tourisme',
    price: 'dès 350 €',
    description: 'Tout pour être prêt avant la haute saison.',
    features: ['Shooting photo & vidéo', 'Grille de prix illustrée', '10 publications prêtes à poster'],
    highlight: true,
  },
]

export const SECTORS = [
  {
    id: 'tourisme',
    title: 'Tourisme',
    text: 'Gîtes, villas, locations saisonnières, excursions, activités nautiques. Des images qui font rêver et un site où l’on réserve en deux clics.',
  },
  {
    id: 'beaute',
    title: 'Beauté & bien-être',
    text: 'Instituts, coiffeurs, barbiers, spas, ongleries. Des visuels qui montrent votre savoir-faire et une prise de RDV en ligne.',
  },
  {
    id: 'commerces',
    title: 'Commerces & indépendants',
    text: 'Boutiques, produits du terroir, coachs, professions libérales. Une présence en ligne claire, professionnelle et régulière.',
  },
]

// Réalisations : uniquement des projets réels.
export const REALISATIONS = [
  {
    id: 'nailsgoto',
    title: 'Nailsgoto',
    category: 'Beauté',
    description: 'Création du compte Instagram, puis création et publication des premiers posts.',
    link: 'https://www.instagram.com/nailsgoto/',
  },
]

export const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services & tarifs' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/contact', label: 'Contact' },
]
