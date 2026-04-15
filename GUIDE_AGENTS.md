# Guide pour les agents IA — Site Phoenix Prod

Ce fichier explique comment modifier le site de façon autonome.
Toujours tester avec `npm run dev` avant de déployer avec `vercel --prod`.

---

## Fichier central : `lib/constants.ts`

**C'est LE fichier à modifier en premier pour toute mise à jour de contenu.**

- `SITE` → nom, email, téléphone, adresse, liens réseaux sociaux, URL Calendly
- `SERVICES` → liste des services (icône, titre, description, fonctionnalités)
- `REALISATIONS` → portfolio (titre, catégorie, description)
- `NAV_LINKS` → liens de navigation

Exemple — changer le numéro de téléphone :
```ts
// Dans lib/constants.ts
phone: '+590 XXX XXX XXX',  // ← modifier ici
```

---

## Modifier le contenu d'une page

Chaque page est dans `app/[nom-page]/page.tsx`.

| Page | Fichier |
|------|---------|
| Accueil | `app/page.tsx` |
| Services | `app/services/page.tsx` |
| Réalisations | `app/realisations/page.tsx` |
| Contact | `app/contact/page.tsx` |
| Mentions légales | `app/mentions-legales/page.tsx` |
| Politique confidentialité | `app/politique-confidentialite/page.tsx` |

---

## Ajouter une nouvelle page

1. Créer le dossier : `app/nouvelle-page/`
2. Créer le fichier : `app/nouvelle-page/page.tsx`
3. Ajouter le lien dans `lib/constants.ts` → `NAV_LINKS`

Modèle minimal de page :
```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Titre de la page | Phoenix Prod',
  description: 'Description pour Google (155 caractères max)',
}

export default function NouvellePagePage() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="section-title">Titre</h1>
        {/* Contenu ici */}
      </div>
    </div>
  )
}
```

---

## Modifier le design

- **Couleurs** → `tailwind.config.ts` → `theme.extend.colors`
- **Styles globaux** → `app/globals.css`
- **Composants réutilisables** → `components/` (Navbar, Footer, CookieBanner)

Classes utilitaires disponibles (définies dans globals.css) :
- `btn-primary` → bouton orange plein
- `btn-outline` → bouton contour orange
- `section-title` → titre de section H2
- `section-subtitle` → sous-titre gris
- `card` → carte sombre avec bord

---

## Ajouter une réalisation au portfolio

Dans `lib/constants.ts`, ajouter un objet dans le tableau `REALISATIONS` :

```ts
{
  id: 4,
  title: 'Nom du projet',
  category: 'Vidéo', // ou 'Drone' ou 'Marketing'
  description: 'Description courte du projet et résultats.',
  image: '/images/realisation-4.jpg', // placer l'image dans public/images/
},
```

---

## SEO — Modifier les métadonnées

Dans chaque `page.tsx`, modifier l'objet `metadata` :

```ts
export const metadata: Metadata = {
  title: 'Titre exact pour Google (60 caractères max)',
  description: 'Description qui apparaît sous le titre sur Google (155 caractères max)',
}
```

---

## Déployer les modifications

```bash
vercel --prod
```

Le site est mis à jour en ~30 secondes.
