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
    metaTitle: 'Prix d’un site internet en Guadeloupe (2026)',
    description:
      'Prix d’un site internet pour une petite entreprise en Guadeloupe : ce qui fait varier le tarif, les coûts mensuels et comment obtenir un devis gratuit.',
    answer:
      'Le prix d’un site dépend surtout de son type (vitrine, réservation, boutique en ligne, page de vente, refonte), du nombre de pages et de ce que vous fournissez. Chez RCKY DIGITAL, chaque site est sur devis, gratuit et envoyé sous 48 h. Il faut ajouter l’abonnement de la plateforme à votre nom (environ 30 € par mois chez Wix, forfait payé à l’année) et le nom de domaine (offert la première année par Wix, puis environ 15 à 25 € par an). Un site à votre nom vous permet de recevoir des réservations en direct, sans passer par une plateforme qui vous facture et affiche vos concurrents à côté de vous.',
    published: '2026-10-16',
    updated: '2026-11-14',
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
        title: 'Votre devis gratuit sous 48 h',
        text: 'Site vitrine, réservation en ligne, boutique, page de vente ou refonte : chaque site est créé sur mesure et amélioré grâce à l’IA, pour être livré plus vite et à moindre coût. Vous recevez un prix clair et détaillé, sans engagement.',
        href: '/tarifs#sites',
        cta: 'Voir les types de sites',
      },
    ],
    faq: [
      {
        q: 'Combien de temps faut-il pour créer un site avec réservation ?',
        a: 'Le délai dépend du type de site et est précisé sur le devis : une page de vente ou un site vitrine simple va plus vite qu’une boutique en ligne. Les étapes restent les mêmes : appel de cadrage, maquette, site complet, corrections, puis mise en ligne et formation.',
      },
      {
        q: 'Pourrai-je modifier mes prix et mes horaires moi-même ?',
        a: 'Oui. Une heure de formation est incluse pour que vous puissiez modifier vos prix, vos horaires et vos photos sans dépendre de nous.',
      },
      {
        q: 'Le prix du devis est-il le prix final ?',
        a: 'Oui, le prix indiqué sur le devis est final, sans TVA à ajouter (TVA non applicable, art. 293 B du CGI). Seuls l’abonnement de la plateforme et le nom de domaine sont à payer en plus, directement à votre nom.',
      },
    ],
  },
  {
    slug: 'etre-trouve-sur-google-guadeloupe',
    title: 'Comment être trouvé sur Google quand on est une petite entreprise en Guadeloupe ?',
    metaTitle: 'Être trouvé sur Google en Guadeloupe',
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
    metaTitle: 'Photographe pro pour Instagram : utile ?',
    description:
      'Smartphone ou photographe pro pour l’Instagram de votre entreprise ? Ce que vous pouvez faire seul, quand un pro fait la différence, et nos conseils photo.',
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
  {
    slug: 'etre-recommande-par-chatgpt-guadeloupe',
    title: 'Comment être recommandé par ChatGPT quand on est une entreprise en Guadeloupe ?',
    metaTitle: 'Être recommandé par ChatGPT en Guadeloupe',
    description:
      'De plus en plus de clients demandent conseil à une IA. Les étapes concrètes pour que votre entreprise de Guadeloupe soit citée par ChatGPT et Google.',
    answer:
      'Les IA comme ChatGPT, Gemini ou Perplexity recommandent les entreprises qu’elles trouvent décrites clairement et de la même façon à plusieurs endroits : fiche Google complète, site qui répond aux vraies questions (prix, zone, horaires), annuaires, avis réels et mentions sur d’autres sites. Ce travail s’appelle le GEO (Generative Engine Optimization). Il prolonge le référencement Google classique, il ne le remplace pas.',
    published: '2026-11-14',
    updated: '2026-11-14',
    readingMinutes: 5,
    body: [
      { type: 'h2', text: 'Ce qui change : on ne cherche plus seulement, on demande' },
      {
        type: 'p',
        text: 'Au lieu de taper « garage Baie-Mahault » et de comparer dix liens, un client peut maintenant demander à une IA : « Quel garage sérieux à Baie-Mahault pour une vidange ce samedi ? ». L’IA répond avec deux ou trois noms. Si le vôtre n’y est pas, le client ne saura jamais que vous existez.',
      },
      { type: 'h2', text: '1. Testez d’abord où vous en êtes' },
      {
        type: 'list',
        items: [
          'Posez à ChatGPT, Gemini et Perplexity 3 à 5 questions qu’un client poserait : votre activité + votre commune, « pas cher », « ouvert le dimanche », etc.',
          'Notez si vous êtes cité, et surtout qui est cité à votre place, et d’où l’IA tire ses informations (les liens sous la réponse).',
          'Refaites le test plusieurs fois : les réponses des IA changent d’une fois à l’autre.',
        ],
      },
      { type: 'h2', text: '2. Une fiche Google complète' },
      {
        type: 'p',
        text: 'Gemini et les réponses IA de Google s’appuient sur les mêmes informations que Google Maps. Une fiche d’établissement remplie à 100 % (catégorie, horaires, zone, photos, description, lien) reste la base. Notre guide dédié explique comment faire.',
      },
      { type: 'h2', text: '3. Un site qui répond aux vraies questions' },
      {
        type: 'list',
        items: [
          'Dites en une phrase, en haut de la page, ce que vous faites, où et pour qui.',
          'Affichez vos prix ou au moins des fourchettes : une IA ne peut pas recommander un tarif qu’elle ne trouve nulle part.',
          'Ajoutez une rubrique de questions fréquentes, avec les questions telles que vos clients les posent.',
          'Indiquez la date de mise à jour : les IA préfèrent les informations récentes.',
        ],
      },
      { type: 'h2', text: '4. Les mêmes informations partout' },
      {
        type: 'p',
        text: 'Nom, téléphone, zone, activité : décrivez-vous de la même façon sur votre site, Google, Facebook, Instagram et les annuaires (PagesJaunes, annuaires professionnels…). Quand plusieurs sources disent la même chose, les IA vous font davantage confiance.',
      },
      { type: 'h2', text: '5. Être mentionné ailleurs que chez vous' },
      {
        type: 'list',
        items: [
          'Des avis réels de vos clients, sur Google en priorité. N’achetez jamais de faux avis.',
          'Une inscription dans les annuaires sérieux de votre métier et de la Guadeloupe.',
          'Un article dans la presse locale, un partenaire ou une association qui parle de vous et met un lien vers votre site.',
        ],
      },
      { type: 'h2', text: 'Ce qu’il ne faut pas faire' },
      {
        type: 'p',
        text: 'Répéter des mots-clés partout, publier des dizaines de pages vides ou inventer des avis : c’est inefficace et risqué. Google rappelle d’ailleurs qu’aucun fichier ou balisage spécial n’est obligatoire pour ses réponses IA : un contenu utile, clair et à jour reste la règle.',
      },
      {
        type: 'callout',
        title: 'On fait le test pour vous, gratuitement',
        text: 'On pose aux IA les questions que vos clients posent sur votre activité et votre commune. Vous recevez sous 48 h le résultat (cité ou non, qui est cité à votre place) et 3 actions concrètes.',
        href: '/audit-ia',
        cta: 'Demander mon audit gratuit',
      },
    ],
    faq: [
      {
        q: 'C’est quoi le GEO ?',
        a: 'Le GEO (Generative Engine Optimization) regroupe ce qui aide une entreprise à être citée dans les réponses des IA comme ChatGPT, Gemini ou Perplexity. Il s’appuie sur les bases du référencement Google : informations claires, à jour, cohérentes et reprises par d’autres sites.',
      },
      {
        q: 'Est-ce que ça remplace le référencement Google ?',
        a: 'Non, ça le prolonge. Les réponses IA de Google s’appuient sur son moteur de recherche, et les autres IA lisent souvent les mêmes pages. Une entreprise bien présente sur Google part avec une longueur d’avance.',
      },
      {
        q: 'Faut-il un site internet pour être cité par une IA ?',
        a: 'Ce n’est pas obligatoire, mais c’est un gros avantage : c’est la source la plus complète sur votre entreprise. Une fiche Google et des annuaires bien remplis aident déjà.',
      },
      {
        q: 'En combien de temps verrai-je un résultat ?',
        a: 'Personne ne peut garantir une citation ni un délai : les IA mettent à jour leurs sources à leur rythme. Comptez plutôt en semaines qu’en jours, et mesurez en refaisant régulièrement les mêmes questions.',
      },
    ],
  },
  {
    slug: 'site-internet-ou-instagram',
    title: 'Instagram suffit-il, ou faut-il un site internet pour son entreprise ?',
    metaTitle: 'Instagram ou site internet : que choisir ?',
    description:
      'Instagram et Facebook suffisent-ils pour une petite entreprise en Guadeloupe ? Ce que les réseaux font bien, leurs limites, et quand un site devient utile.',
    answer:
      'Les réseaux sociaux sont parfaits pour vous faire connaître, mais votre compte ne vous appartient pas : un piratage, une suspension ou un changement de règles peut vous couper de vos clients du jour au lendemain. Un site à votre nom reste en place, apparaît sur Google et dans les réponses des IA, et peut recevoir des réservations. L’idéal : les réseaux attirent, le site convertit.',
    published: '2026-11-25',
    updated: '2026-11-25',
    readingMinutes: 4,
    body: [
      { type: 'h2', text: 'Ce que les réseaux sociaux font très bien' },
      {
        type: 'list',
        items: [
          'Montrer votre travail en images et en vidéos, au quotidien.',
          'Créer un lien avec vos clients : commentaires, messages, stories.',
          'Toucher des personnes qui ne vous connaissaient pas, grâce au partage et à la publicité.',
        ],
      },
      { type: 'h2', text: 'Leurs limites' },
      {
        type: 'list',
        items: [
          'Le compte appartient à la plateforme : piratage, suspension ou changement de règles, et vos abonnés, vos photos et vos messages deviennent inaccessibles.',
          'Les publications sont peu visibles sur Google : quand un client cherche « votre métier + votre commune », c’est surtout la fiche Google et les sites qui apparaissent.',
          'Les réservations en message privé se perdent facilement entre deux clients, et il faut répondre soi-même à chaque question.',
          'Les informations importantes (prix, horaires, zone, conditions) sont dispersées dans les publications.',
        ],
      },
      { type: 'h2', text: 'Ce qu’un site apporte en plus' },
      {
        type: 'list',
        items: [
          'Une adresse à votre nom (votre-entreprise.fr), que personne ne peut vous retirer.',
          'Une page claire par prestation, avec prix ou « à partir de », trouvable sur Google.',
          'Une source complète que les IA comme ChatGPT peuvent lire et citer.',
          'La réservation, la demande de devis ou la commande en ligne, même la nuit.',
        ],
      },
      { type: 'h2', text: 'Les 3 réflexes à avoir dès maintenant' },
      {
        type: 'list',
        items: [
          'Activez la double authentification sur tous vos comptes.',
          'Gardez la liste de vos clients ailleurs que dans vos messages privés.',
          'Mettez en bio un lien vers un endroit qui vous appartient : site, page de réservation ou fiche Google.',
        ],
      },
      {
        type: 'callout',
        title: 'Où en êtes-vous ?',
        text: 'On regarde gratuitement comment votre entreprise apparaît sur Google et dans les IA, et on vous envoie 3 actions concrètes sous 48 h, sans engagement.',
        href: '/audit-ia',
        cta: 'Demander mon audit gratuit',
      },
    ],
    faq: [
      {
        q: 'Mon Instagram a beaucoup d’abonnés, un site est-il vraiment utile ?',
        a: 'Oui, si vous voulez être trouvé par des personnes qui ne vous suivent pas encore, notamment sur Google, et ne pas dépendre d’une seule plateforme. Gardez vos réseaux : ils montrent le chemin vers le site.',
      },
      {
        q: 'Un site remplace-t-il les réseaux sociaux ?',
        a: 'Non. Les deux se complètent : les réseaux font connaître l’entreprise, le site rassure, informe et prend les demandes.',
      },
      {
        q: 'Combien coûte un site pour une petite entreprise ?',
        a: 'Cela dépend du nombre de pages et des fonctions (réservation, boutique…). Chez RCKY DIGITAL, les sites sont sur devis gratuit sous 48 h ; notre guide sur le prix d’un site détaille ce qui fait varier le tarif.',
      },
    ],
  },
  {
    slug: 'site-internet-gite-location-guadeloupe',
    title: 'Faut-il un site internet pour son gîte ou sa location saisonnière en Guadeloupe ?',
    metaTitle: 'Site internet pour gîte en Guadeloupe',
    description:
      'Gîte, villa ou location saisonnière en Guadeloupe : pourquoi un site à votre nom en plus des plateformes, ce qu’il doit contenir et pourquoi penser à l’anglais.',
    answer:
      'Les plateformes de réservation restent utiles pour être vu, mais elles prennent une commission et gardent la relation avec le voyageur. Un site à votre nom permet de recevoir des réservations directes, de faire revenir vos anciens clients et d’être trouvé sur Google. Pour un gîte, il doit montrer de belles photos, les disponibilités, les tarifs et un moyen simple de réserver, idéalement aussi en anglais.',
    published: '2026-11-25',
    updated: '2026-11-25',
    readingMinutes: 5,
    body: [
      { type: 'h2', text: 'Plateformes et site : les deux ensemble' },
      {
        type: 'p',
        text: 'Les grandes plateformes apportent de la visibilité, surtout au début. Mais chaque réservation passe par elles, avec leurs frais et leurs règles. Un site vous donne un deuxième canal : les voyageurs qui vous ont trouvé une première fois, ou qui cherchent directement votre nom, peuvent réserver chez vous.',
      },
      { type: 'h2', text: 'Ce qu’un site de gîte doit contenir' },
      {
        type: 'list',
        items: [
          'Des photos récentes et lumineuses : extérieur, chambres, salle de bain, vue, piscine.',
          'Le calendrier des disponibilités, à jour.',
          'Les tarifs (ou « à partir de ») et les conditions : caution, ménage, durée minimale.',
          'La localisation : commune, plages et commerces à proximité, temps de trajet depuis l’aéroport.',
          'Un moyen simple de réserver ou de demander les dates : formulaire, réservation en ligne, WhatsApp.',
          'Vos avis, avec un lien vers votre fiche Google.',
        ],
      },
      { type: 'h2', text: 'Pourquoi penser à l’anglais' },
      {
        type: 'p',
        text: 'En Guadeloupe, la clientèle hôtelière reste majoritairement française : en 2024, environ 14 % des nuitées dans les hôtels étaient celles de clients non résidents (Insee). Cette part est petite, mais ces voyageurs (Canada, États-Unis, Europe) comparent dans leur langue : selon une étude CSA Research de 2020 menée dans 29 pays, 76 % des acheteurs en ligne préfèrent les informations dans leur langue et 40 % n’achètent jamais sur un site dans une autre langue. Une version anglaise, même courte, vous ouvre à eux.',
      },
      { type: 'h2', text: 'Être trouvé sur Google et par les IA' },
      {
        type: 'list',
        items: [
          'Créez et remplissez votre fiche d’établissement Google (gratuite).',
          'Utilisez les mots que tapent les voyageurs : « gîte Sainte-Anne piscine », « villa Deshaies vue mer ».',
          'Gardez le même nom, téléphone et adresse partout (site, Google, plateformes, réseaux).',
          'Demandez un avis à chaque voyageur satisfait.',
        ],
      },
      {
        type: 'callout',
        title: 'Un site de gîte, en français et en anglais',
        text: 'RCKY DIGITAL crée des sites sur mesure pour les gîtes et locations de Guadeloupe : photos mises en valeur, disponibilités, réservation ou demande de dates, version anglaise. Devis gratuit sous 48 h.',
        href: '/tarifs#sites',
        cta: 'Voir les types de sites',
      },
    ],
    faq: [
      {
        q: 'Faut-il quitter les plateformes de réservation ?',
        a: 'Non. Gardez-les pour la visibilité ; le site sert à recevoir aussi des réservations directes et à garder le contact avec vos clients.',
      },
      {
        q: 'Peut-on afficher le même calendrier que sur les plateformes ?',
        a: 'Oui, la plupart des outils de réservation peuvent se synchroniser avec les calendriers des plateformes pour éviter les doubles réservations. On choisit l’outil avec vous selon votre situation.',
      },
      {
        q: 'Une traduction automatique suffit-elle pour la version anglaise ?',
        a: 'Elle peut servir de base, mais faites relire les pages importantes (description, conditions, réservation) : un texte maladroit fait perdre confiance au voyageur.',
      },
    ],
  },
  {
    slug: 'reservation-en-ligne-petite-entreprise',
    title: 'Prise de rendez-vous en ligne : comment faire pour une petite entreprise en Guadeloupe ?',
    metaTitle: 'Prise de rendez-vous en ligne en Guadeloupe',
    description:
      'Salon, institut, lavage auto, artisan, traiteur : comment proposer la prise de rendez-vous ou la demande en ligne, sans perdre le contact avec vos clients.',
    answer:
      'La prise de rendez-vous en ligne permet au client de choisir sa prestation et son créneau seul, à toute heure, au lieu d’attendre une réponse par message. Pour une petite entreprise, le plus simple est une page de réservation ou de demande sur votre site, reliée à votre agenda ou à votre e-mail, avec des règles claires (délai, horaires, acompte si besoin). Vous gardez la main : vous pouvez toujours rappeler le client.',
    published: '2026-11-25',
    updated: '2026-11-25',
    readingMinutes: 4,
    body: [
      { type: 'h2', text: 'Le problème des demandes par message' },
      {
        type: 'p',
        text: 'Quand tout passe par les messages privés ou le téléphone, il faut souvent plusieurs échanges pour connaître la date, la prestation, le nombre de personnes ou le véhicule. Un message oublié entre deux clients, c’est une demande perdue et un créneau vide.',
      },
      { type: 'h2', text: 'Deux façons de faire' },
      {
        type: 'list',
        items: [
          'Réservation directe : le client choisit un créneau libre et reçoit une confirmation (salon, institut, lavage auto, coach).',
          'Demande guidée : le client remplit un formulaire en quelques étapes et vous recevez une demande complète, puis vous le rappelez (traiteur, artisan, événementiel, devis).',
        ],
      },
      { type: 'h2', text: 'Les règles à décider avant' },
      {
        type: 'list',
        items: [
          'Les prestations proposées et leur durée.',
          'Vos horaires et le délai minimum (par exemple 24 h, ou plusieurs semaines pour un événement).',
          'Ce qui se fait toujours par téléphone (dernière minute, gros devis).',
          'Un acompte ou non, et la politique d’annulation.',
          'Où arrivent les demandes : e-mail, agenda, WhatsApp.',
        ],
      },
      { type: 'h2', text: 'Garder le contact humain' },
      {
        type: 'p',
        text: 'La réservation en ligne ne remplace pas votre façon de travailler : elle vous évite seulement les allers-retours. Beaucoup de professionnels continuent d’appeler chaque client, mais en sachant déjà tout ce qu’il veut.',
      },
      {
        type: 'callout',
        title: 'Voir à quoi ça ressemble pour vous',
        text: 'On prépare gratuitement une maquette de votre page de réservation ou de demande, avec vos prestations, avant tout engagement.',
        href: '/rendez-vous?sujet=site',
        cta: 'Réserver un appel de 15 min',
      },
    ],
    faq: [
      {
        q: 'Faut-il un site internet pour proposer la réservation en ligne ?',
        a: 'Ce n’est pas obligatoire, mais une page de réservation sur votre propre site vous appartient, apparaît sur Google et peut être reliée à votre fiche Google et à vos réseaux.',
      },
      {
        q: 'Mes clients préfèrent appeler, est-ce utile ?',
        a: 'Oui, si une partie de vos clients écrit le soir ou le week-end. Ceux qui préfèrent appeler peuvent toujours le faire.',
      },
      {
        q: 'Peut-on demander un acompte en ligne ?',
        a: 'Oui, avec un paiement en ligne sécurisé. Ce n’est pas obligatoire : beaucoup commencent sans acompte et l’ajoutent plus tard.',
      },
    ],
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
