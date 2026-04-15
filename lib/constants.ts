// ============================================================
// FICHIER CENTRAL DE CONFIGURATION — à modifier par les agents
// Toutes les données du site sont ici : nom, contact, services, etc.
// ============================================================

export const SITE = {
  name: 'Phoenix Prod',
  agency: 'Rcky Digital',
  tagline: 'Production audiovisuelle & stratégie digitale en Guadeloupe',
  description:
    'Phoenix Prod par Rcky Digital — agence de production vidéo, drone et stratégie marketing basée en Guadeloupe. Nous capturons votre vision, nous amplifions votre message.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://phoenixprod.fr',
  email: 'rckydigital@outlook.fr',
  phone: '+590 690 57 38 70',
  address: 'Guadeloupe, 971',
  siret: '980 046 965 00011',
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/rckydigital',
  social: {
    instagram: 'https://instagram.com/rckydigital',
    linkedin: 'https://linkedin.com/company/rckydigital',
    youtube: 'https://youtube.com/@rckydigital',
  },
}

export const SERVICES = [
  {
    id: 'video',
    icon: '🎬',
    title: 'Production Vidéo',
    description:
      'Films institutionnels, clips, spots publicitaires. De la conception au montage final, nous racontons votre histoire avec impact.',
    features: ['Script & storyboard', 'Tournage professionnel', 'Montage & étalonnage', 'Motion design'],
  },
  {
    id: 'drone',
    icon: '🚁',
    title: 'Prises de vue Drone',
    description:
      'Vue du ciel sur la Guadeloupe et les Antilles. Paysages, immobilier, événements — sublimez vos projets avec des images aériennes époustouflantes.',
    features: ['Pilote télépilote certifié', 'Drone 4K HDR', 'Toute la Guadeloupe', 'Livraison rapide'],
  },
  {
    id: 'marketing',
    icon: '📈',
    title: 'Stratégie Marketing',
    description:
      'Audit digital, plan d\'action, création de contenu et suivi de performance. Nous transformons votre présence en ligne en levier de croissance.',
    features: ['Audit SEO', 'Stratégie réseaux sociaux', 'Plan 90 jours', 'Reporting mensuel'],
  },
  {
    id: 'content',
    icon: '📸',
    title: 'Création de Contenu',
    description:
      'Photos, vidéos courtes, reels et stories. Un flux de contenu professionnel et régulier pour alimenter vos réseaux sociaux.',
    features: ['Pack mensuel', 'Format Reels / TikTok', 'Shooting photo', 'Rédaction caption'],
  },
]

export const REALISATIONS = [
  {
    id: 1,
    title: 'Film institutionnel — Hôtel Bwa Chik',
    category: 'Vidéo',
    description: 'Présentation complète de l\'établissement, interview des équipes, vues aériennes.',
    image: '/images/realisation-1.jpg',
  },
  {
    id: 2,
    title: 'Drone — Domaine de Séverin',
    category: 'Drone',
    description: 'Survol du domaine pour une campagne de communication touristique.',
    image: '/images/realisation-2.jpg',
  },
  {
    id: 3,
    title: 'Stratégie digitale — Boutique Créole',
    category: 'Marketing',
    description: '+240% de visibilité en 90 jours grâce à un plan SEO + social media.',
    image: '/images/realisation-3.jpg',
  },
]

export const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/contact', label: 'Contact' },
]
