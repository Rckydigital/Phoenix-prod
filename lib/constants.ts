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
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rckydigital.fr',
  email: 'contact@rckydigital.fr',
  phone: '+590 690 05 73 87',
  address: 'Guadeloupe (971)',
  siret: '980 046 965 00011',
  // Lien de prise de RDV (Calendly ou autre). Laisser vide pour masquer le bloc.
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || '',
  social: {
    instagram: 'https://www.instagram.com/_rcky_digital/',
    google: 'https://share.google/eoM0Q4PmMPo3JHaZK',
  },
}

// Offre de lancement (à retirer quand les 3 premiers clients sont signés)
// La remise s'applique UNIQUEMENT aux offres marquées launch: true (pas au site).
export const LAUNCH_OFFER = {
  active: true,
  title: 'Offre de lancement : -30 %',
  text: "Sur la Vitrine Pro ou vos 3 premiers mois de Visibilité Mensuelle, pour nos 3 premiers clients, en échange d'un avis et de l'autorisation de montrer le projet dans notre portfolio.",
  placesTotal: 3,
  placesRestantes: 3, // à mettre à jour à chaque client signé
  remise: 0.3,
}

export type Service = {
  id: string
  title: string
  price: string
  priceNote?: string
  promise: string
  description: string
  delay?: string
  features: string[]
  forWho: string
  launch?: boolean
}

// Porte d'entrée gratuite
export const AUDIT = {
  id: 'audit',
  title: 'Audit Visibilité offert',
  text: "Une note sur 10 de votre présence en ligne (fiche Google, Instagram, photos, prix, réservation), les 3 points qui vous font perdre des clients et 3 actions concrètes. Reçu sous 48 h, sans engagement.",
}

// Les 3 offres (catalogue validé par Ricky le 2026-10-14)
export const SERVICES: Service[] = [
  {
    id: 'vitrine',
    title: 'Vitrine Pro',
    price: '390 €',
    promise: 'Des images qui donnent envie de réserver chez vous.',
    description:
      'Je viens chez vous photographier et filmer votre lieu, vos prestations et votre ambiance, puis je mets en valeur vos prix et votre fiche Google.',
    delay: 'Livré en 7 jours',
    features: [
      'Séance photo et vidéo sur place (2 h)',
      '25 photos retouchées (réseaux, Google, site, Airbnb/Booking)',
      '3 Reels montés (sous-titres, musique libre de droits)',
      'Grille de prix illustrée (post + flyer)',
      'Fiche Google optimisée (photos, horaires, description)',
    ],
    forWho: 'Gîtes, villas, activités, instituts, salons dont les photos ne font pas honneur au lieu',
    launch: true,
  },
  {
    id: 'reservation',
    title: 'Réservation en ligne',
    price: '790 €',
    promise: 'Vos clients réservent seuls, 24 h/24.',
    description:
      'Un site simple et rapide, pensé pour le téléphone, avec réservation ou prise de rendez-vous en ligne. Vous gardez la main sur vos prix et vos horaires.',
    delay: 'En ligne en 3 semaines',
    features: [
      'Site Wix jusqu’à 5 pages, adapté au mobile',
      'Réservation / prise de rendez-vous en ligne',
      'Référencement local de base + fiche Google reliée',
      '1 h de formation pour tout modifier seul',
      '1 mois de maintenance offert (ensuite 39 €/mois, facultatif)',
      'Abonnement Wix (~30 €/mois) et nom de domaine au nom du client',
    ],
    forWho: 'Hébergements, activités, salons qui prennent encore leurs réservations par téléphone ou par messages',
  },
  {
    id: 'visibilite',
    title: 'Visibilité Mensuelle',
    price: '349 €',
    priceNote: '/ mois',
    promise: 'Votre Instagram et votre fiche Google vivent toute l’année.',
    description:
      'Chaque mois, je tourne sur place et je publie pour vous, avec de vraies images de chez vous. Vous validez le calendrier en 10 minutes.',
    delay: '3 mois minimum, puis sans engagement',
    features: [
      '1 séance de tournage sur place par mois (1 h 30)',
      '8 publications dont 4 Reels + 8 stories',
      'Instagram + Facebook',
      '2 publications sur la fiche Google + réponse aux avis',
      'Réponses aux messages et commentaires (jours ouvrés, sous 48 h)',
      'Rapport mensuel d’une page',
    ],
    forWho: 'Ceux qui savent qu’il faut publier, mais n’ont pas le temps',
    launch: true,
  },
]

// Options à la carte
export const OPTIONS = [
  { id: 'saison', title: 'Vitrine Pro édition Tourisme', price: '490 €', description: 'La Vitrine Pro + 10 publications prêtes à poster pour la haute saison.' },
  { id: 'montage', title: 'Montage vidéo', price: '80 €', priceNote: '/ vidéo', description: 'À partir de vos vidéos (jusqu’à 60 s) : montage, sous-titres, musique libre de droits.' },
  { id: 'grille', title: 'Grille de prix illustrée', price: '90 €', description: 'Vos prestations et tarifs, en post et en flyer à imprimer.' },
  { id: 'google', title: 'Fiche Google optimisée', price: '99 €', description: 'Photos, horaires, description, catégories et lien de réservation.' },
  { id: 'reseau', title: 'Réseau supplémentaire', price: '+50 €', priceNote: '/ mois', description: 'TikTok, LinkedIn… en plus de la Visibilité Mensuelle.' },
  { id: 'maintenance', title: 'Maintenance du site', price: '39 €', priceNote: '/ mois', description: 'Mises à jour et petites modifications (1 h par mois).' },
  { id: 'conseil', title: 'Conseil & stratégie', price: '120 €', description: '1 h 30 d’échange + un plan d’action écrit sur 3 mois.' },
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
    id: 'nails-to-go',
    title: 'Nails to go',
    category: 'Beauté',
    description: 'Création du compte Instagram, puis création et publication des premiers posts.',
    link: 'https://www.instagram.com/_nails_to.go_/',
  },
  {
    id: 'cfa-iuts',
    title: 'CFA IUTS',
    category: 'Formation',
    description:
      "Création et animation du compte Instagram d'un centre de formation, réalisées dans le cadre de mon alternance.",
    link: 'https://www.instagram.com/cfa_iuts/',
  },
  {
    id: 'certylux',
    title: 'CertyLux',
    category: 'E-commerce',
    description:
      "Projet de master : conception d'une marque fictive de luxe de seconde main et de son site e-commerce complet (WordPress, WooCommerce), du catalogue au parcours d'achat.",
    link: 'https://certylux.fr',
  },
]

// Vidéos affichées dans « Réalisations » (Instagram : post ou reel ; YouTube : vidéo ou short).
// Ajouter une ligne par vidéo : { platform: 'instagram' | 'youtube', url: '…', title: '…', client: '…' }
export const VIDEOS: { platform: 'youtube' | 'instagram'; url: string; title: string; client?: string }[] = [
  {
    platform: 'youtube',
    url: 'https://youtu.be/ir8422oiO5A',
    title: 'Le Moule en 4K, vue du ciel (DJI Mini 2)',
    client: 'Guadeloupe · Cinématique',
  },
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/DO1TWzsCZsf/',
    title: 'Effet hologramme (entraînement)',
    client: 'Montage · Effets visuels',
  },
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/DJmvCrXPzHl/',
    title: 'Présentation de la post-production vidéo',
    client: 'Montage · Post-production',
  },
]

export const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services & tarifs' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

// FAQ (page Services, données structurées et /ai/faq.json). Doit rester cohérente avec les CGV.
export const FAQ = [
  {
    q: 'Les prix affichés sont-ils définitifs ?',
    a: 'Oui : chaque offre a un contenu et un prix fixes. Nos prix sont finaux : TVA non applicable (art. 293 B du CGI), rien ne s’ajoute. Seuls les frais de déplacement hors Grande-Terre et les options choisies sont indiqués en plus sur le devis.',
  },
  {
    q: 'Est-ce que vous vous déplacez ?',
    a: 'Oui, partout en Guadeloupe pour les shootings (frais de déplacement indiqués sur le devis hors Grande-Terre). Le reste (montage, réseaux, site) se fait à distance, avec des points réguliers.',
  },
  {
    q: 'Qui possède les photos et vidéos ?',
    a: 'Une fois le projet réglé, vous pouvez utiliser les contenus pour la promotion de votre activité : site, réseaux sociaux, plateformes de réservation, newsletters et supports imprimés. Les droits cédés sont précisés sur le devis et dans nos conditions générales de vente.',
  },
  {
    q: 'Comment se passe le paiement ?',
    a: 'Un acompte de 40 % à la commande, le solde à la livraison, par virement ou par carte bancaire grâce au lien de paiement sécurisé joint au devis et à la facture. Les forfaits mensuels (réseaux sociaux, maintenance) se règlent en début de mois, avec une durée minimale de 3 mois puis un préavis de 30 jours.',
  },
  {
    q: 'Quels types d’entreprises accompagnez-vous ?',
    a: 'Surtout les petites entreprises de Guadeloupe : gîtes, villas et locations saisonnières, excursions et activités, salons de coiffure, instituts de beauté, barbiers, ongleries et commerces locaux.',
  },
  {
    q: 'Le site avec réservation inclut-il l’abonnement ?',
    a: 'Le site est créé sur Wix avec réservation ou prise de rendez-vous en ligne. L’abonnement Wix (environ 30 € par mois) est pris au nom du client, qui reste propriétaire de son site et de son nom de domaine.',
  },
]

// Mise à jour du contenu (signal de fraîcheur pour Google et les IA)
export const LAST_UPDATE = '2026-10-14'

export const priceNumber = (p: string) => {
  const m = p.match(/(\d[\d\s]*)/)
  return m ? Number(m[1].replace(/\s/g, '')) : undefined
}
