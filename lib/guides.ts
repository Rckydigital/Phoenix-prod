// Guides pratiques : pages qui répondent aux questions que les entrepreneurs posent à Google et aux IA.
// Règle : uniquement des informations vraies et vérifiables, prix = ceux de lib/constants.ts.

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'h2'; text: string }
  | { type: 'callout'; title: string; text: string; href?: string; cta?: string }

export type Guide = {
  slug: string
  title: string
  metaTitle: string
  description: string
  answer: string // réponse courte, en tête de page (reprise par les IA)
  published: string
  updated: string
  readingMinutes: number
  body: GuideBlock[]
  faq: { q: string; a: string }[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'prix-site-internet-guadeloupe',
    title: 'Combien coûte un site internet en Guadeloupe ?',
    metaTitle: 'Prix d’un site internet en Guadeloupe : ce qu’il faut prévoir',
    description:
      'Prix d’un site internet pour une petite entreprise en Guadeloupe : ce qui fait varier le tarif, les coûts à prévoir chaque mois et nos prix fixes (site avec réservation 790 €).',
    answer:
      'Chez RCKY DIGITAL, un site jusqu’à 5 pages avec réservation en ligne coûte 790 €, prix final. Il faut ajouter l’abonnement de la plateforme à votre nom (environ 30 € par mois chez Wix, forfait payé à l’année) et le nom de domaine (offert la première année par Wix, puis environ 15 à 25 € par an). Un site à votre nom vous permet de recevoir des réservations en direct, sans passer par une plateforme qui vous facture et affiche vos concurrents à côté de vous.',
    published: '2026-10-16',
    updated: '2026-10-16',
    readingMinutes: 4,
    body: [
      { type: 'h2', text: 'Ce qui fait varier le prix d’un site' },
      {
        type: 'list',
        items: [
          'Le nombre de pages : un site d’une page ne demande pas le même travail qu’un site de 10 pages.',
          'La réservation ou le paiement en ligne : c’est souvent ce qui fait la différence de prix.',
          'Les textes et les photos : sont-ils fournis par vous, ou rédigés et réalisés par le prestataire ?',
          'Le référencement local : titres, descriptions, fiche Google reliée au site.',
          'La suite : formation pour modifier le site seul, maintenance, mises à jour.',
        ],
      },
      {
        type: 'p',
        text: 'Les devis varient beaucoup d’un prestataire à l’autre. Comparez ce qui est inclus, pas seulement le prix affiché.',
      },
      { type: 'h2', text: 'Les coûts à prévoir après la création' },
      {
        type: 'list',
        items: [
          'L’abonnement de la plateforme (Wix, WordPress hébergé, etc.) : chez Wix, le premier forfait qui accepte les réservations payées en ligne coûte environ 30 € par mois, payé à l’année.',
          'Le nom de domaine (votre-entreprise.fr) : offert la première année avec un forfait Wix annuel, puis environ 15 à 25 € par an.',
          'La maintenance, si vous ne voulez pas vous en occuper : chez nous, 39 € par mois, en option.',
        ],
      },
      {
        type: 'p',
        text: 'Point important : l’abonnement et le nom de domaine doivent être à votre nom. Le site vous appartient, même si vous changez de prestataire.',
      },
      { type: 'h2', text: 'Plateforme de réservation ou site à votre nom ?' },
      {
        type: 'p',
        text: 'Booksy, Planity, Goldie ou les plateformes d’activités sont pratiques pour démarrer. Mais elles vous facturent un abonnement ou une commission, et sur leur page vos clients voient aussi les autres professionnels autour de vous. Un site à votre nom travaille uniquement pour vous :',
      },
      {
        type: 'list',
        items: [
          'Des réservations en direct, sans commission sur chaque client.',
          'Votre image, vos photos et vos prix, sans concurrent affiché à côté.',
          'Un site qui apparaît sur Google quand on cherche votre nom ou votre activité dans votre commune.',
          'Un lien unique à mettre partout : Instagram, fiche Google, WhatsApp, cartes de visite.',
        ],
      },
      {
        type: 'p',
        text: 'Vous pouvez aussi garder votre plateforme et y relier votre site : le site présente votre activité et donne envie, la plateforme gère l’agenda.',
      },
      {
        type: 'callout',
        title: 'Nos prix, sans surprise',
        text: 'Réservation en ligne : 790 € (site jusqu’à 5 pages, réservation, référencement local de base, 1 h de formation, 1 mois de maintenance offert, en ligne en 3 semaines). Vitrine Pro : 390 € (photos, Reels, grille de prix, fiche Google), si vous voulez d’abord des images qui donnent envie.',
        href: '/services',
        cta: 'Voir le détail des offres',
      },
    ],
    faq: [
      {
        q: 'Combien de temps faut-il pour créer un site avec réservation ?',
        a: 'Chez RCKY DIGITAL, le site est en ligne en 3 semaines : appel de cadrage, maquette à J+7, site complet à J+14, corrections, puis mise en ligne et formation.',
      },
      {
        q: 'Pourrai-je modifier mes prix et mes horaires moi-même ?',
        a: 'Oui. Une heure de formation est incluse pour que vous puissiez modifier vos prix, vos horaires et vos photos sans dépendre de nous.',
      },
      {
        q: 'Le prix affiché est-il le prix final ?',
        a: 'Oui, nos prix sont finaux, sans TVA à ajouter (TVA non applicable, art. 293 B du CGI). Seuls l’abonnement de la plateforme et le nom de domaine sont à payer en plus, directement à votre nom.',
      },
    ],
  },
  {
    slug: 'etre-trouve-sur-google-guadeloupe',
    title: 'Comment être trouvé sur Google quand on est une petite entreprise en Guadeloupe ?',
    metaTitle: 'Être trouvé sur Google en Guadeloupe : le guide pour les petites entreprises',
    description:
      'Fiche Google, avis, photos, informations identiques partout : les étapes concrètes pour qu’un client vous trouve quand il cherche votre activité en Guadeloupe.',
    answer:
      'Pour une petite entreprise locale, la fiche d’établissement Google (Google Business Profile) compte plus que le site : elle est gratuite et c’est elle qui apparaît sur Google Maps et en haut des résultats. Remplissez-la entièrement, ajoutez des photos récentes, demandez un avis à chaque client satisfait et gardez le même nom, téléphone et adresse partout.',
    published: '2026-10-16',
    updated: '2026-10-16',
    readingMinutes: 4,
    body: [
      { type: 'h2', text: '1. Créer et remplir sa fiche Google' },
      {
        type: 'list',
        items: [
          'Créez la fiche sur business.google.com (gratuit) et validez-la.',
          'Choisissez la bonne catégorie principale (par exemple « Salon de coiffure » ou « Institut de beauté »).',
          'Renseignez les horaires, le téléphone, la zone desservie ou l’adresse, et le lien de réservation.',
          'Écrivez une description simple : ce que vous faites, où, et pour qui.',
          'Si vous travaillez chez vous ou à domicile, choisissez « zone desservie » : votre adresse personnelle n’apparaît pas.',
        ],
      },
      { type: 'h2', text: '2. Ajouter des photos récentes' },
      {
        type: 'p',
        text: 'Une fiche sans photo inspire peu confiance. Ajoutez votre devanture ou votre lieu, vos réalisations, votre équipe et vos prix. Ajoutez-en régulièrement : une fiche qui vit donne envie.',
      },
      { type: 'h2', text: '3. Demander des avis, et y répondre' },
      {
        type: 'list',
        items: [
          'Demandez un avis à chaque client satisfait, au bon moment (juste après la prestation), avec le lien direct de votre fiche.',
          'Répondez à tous les avis, même aux négatifs, calmement et poliment.',
          'N’achetez jamais de faux avis : Google les supprime et peut suspendre la fiche.',
        ],
      },
      { type: 'h2', text: '4. Les mêmes informations partout' },
      {
        type: 'p',
        text: 'Votre nom, votre téléphone et votre zone doivent être identiques sur Google, Instagram, Facebook, les annuaires (PagesJaunes…) et votre site. Les moteurs de recherche, et les IA comme ChatGPT, font davantage confiance à une entreprise décrite de la même façon partout.',
      },
      { type: 'h2', text: '5. Un lien vers où réserver' },
      {
        type: 'p',
        text: 'Site, page de réservation, lien WhatsApp : le client qui vous trouve doit pouvoir vous contacter ou réserver en un clic.',
      },
      {
        type: 'callout',
        title: 'On peut s’en occuper pour vous',
        text: 'Fiche Google optimisée : 99 € (photos, horaires, description, catégories, lien de réservation). Elle est incluse dans la Vitrine Pro à 390 €. Vous ne savez pas par où commencer ? Demandez l’audit gratuit : une note sur 10 et 3 actions concrètes.',
        href: '/contact?service=audit',
        cta: 'Demander mon audit gratuit',
      },
    ],
    faq: [
      {
        q: 'La fiche Google est-elle payante ?',
        a: 'Non, la fiche d’établissement Google est gratuite. Vous pouvez la créer et la gérer seul ; vous ne payez que si vous confiez ce travail à un prestataire.',
      },
      {
        q: 'Faut-il un site internet pour apparaître sur Google ?',
        a: 'Non, ce n’est pas obligatoire : une fiche Google complète peut suffire pour apparaître sur Google Maps. Un site aide ensuite à donner plus d’informations et à recevoir des réservations directes.',
      },
      {
        q: 'En combien de temps verrai-je des résultats ?',
        a: 'Cela dépend de votre activité et de la concurrence autour de vous. Comptez en général quelques semaines après une fiche bien remplie et les premiers avis ; ce n’est pas une garantie de position.',
      },
    ],
  },
  {
    slug: 'photographe-professionnel-instagram',
    title: 'Faut-il un photographe professionnel pour son Instagram ?',
    metaTitle: 'Photographe professionnel pour Instagram : est-ce nécessaire ?',
    description:
      'Smartphone ou photographe professionnel pour l’Instagram de votre entreprise ? Ce que vous pouvez faire seul, quand un pro fait la différence, et nos conseils pour de meilleures photos au téléphone.',
    answer:
      'Pas pour tout. Un smartphone récent suffit pour les stories et le quotidien. Un photographe professionnel fait la différence pour les images qui restent : photos de votre lieu, de vos réalisations et de votre équipe, utilisées sur votre fiche Google, votre site, Airbnb ou Booking et vos posts importants. Une séance par saison suffit souvent.',
    published: '2026-10-16',
    updated: '2026-10-16',
    readingMinutes: 3,
    body: [
      { type: 'h2', text: 'Ce que vous pouvez faire seul, au téléphone' },
      {
        type: 'list',
        items: [
          'Les stories du jour : coulisses, disponibilités, petites annonces.',
          'Les avant/après rapides, à condition de toujours garder le même cadrage et la même lumière.',
          'Les vidéos spontanées : elles plaisent justement parce qu’elles sont naturelles.',
        ],
      },
      { type: 'h2', text: 'Quand un professionnel fait la différence' },
      {
        type: 'list',
        items: [
          'Les photos « vitrine » : votre lieu, vos chambres, vos réalisations, votre équipe.',
          'Les images utilisées partout et longtemps : fiche Google, site, Airbnb ou Booking, flyers.',
          'Les Reels montés (rythme, sous-titres, musique) qui présentent votre activité.',
          'Les lieux difficiles : intérieurs sombres, contre-jour, grands espaces.',
        ],
      },
      { type: 'h2', text: '5 conseils pour de meilleures photos au téléphone' },
      {
        type: 'list',
        items: [
          'Nettoyez l’objectif avant chaque photo.',
          'Photographiez à la lumière du jour, près d’une fenêtre ou dehors à l’ombre, sans flash.',
          'Évitez le zoom numérique : rapprochez-vous plutôt.',
          'Pour Instagram, cadrez en vertical (format 4:5) : la photo prend plus de place dans le fil.',
          'Rangez le décor avant de photographier : un détail qui traîne attire l’œil.',
        ],
      },
      {
        type: 'callout',
        title: 'La Vitrine Pro : 390 €',
        text: 'Une séance photo et vidéo de 2 h sur place, 25 photos retouchées, 3 Reels montés, une grille de prix illustrée et votre fiche Google optimisée. Livré en 7 jours.',
        href: '/services',
        cta: 'Voir la Vitrine Pro',
      },
    ],
    faq: [
      {
        q: 'Combien de photos faut-il pour bien démarrer ?',
        a: 'Une vingtaine de bonnes photos (lieu, réalisations, équipe, détails) suffit pour alimenter une fiche Google, un site et plusieurs semaines de publications. La Vitrine Pro en inclut 25.',
      },
      {
        q: 'Puis-je utiliser les photos partout ?',
        a: 'Oui, pour faire la promotion de votre activité : réseaux sociaux, fiche Google, site, Airbnb ou Booking, newsletters et supports imprimés, dans le monde entier et pendant 10 ans après le paiement. Une publicité télévisée, un grand panneau ou une revente se discutent à part.',
      },
      {
        q: 'Faut-il refaire des photos souvent ?',
        a: 'Pas forcément. Une séance par saison, ou quand votre lieu ou votre offre change, suffit dans la plupart des cas. Le quotidien peut se faire au téléphone.',
      },
    ],
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
