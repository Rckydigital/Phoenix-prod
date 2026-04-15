# Guide de déploiement — Phoenix Prod sur Vercel

## Prérequis
- Node.js 18+ installé
- Compte Vercel (gratuit sur vercel.com)
- Vercel CLI : `npm install -g vercel`

---

## 1. Installation locale

```bash
cd phoenix-prod-nextjs
npm install
cp .env.example .env.local
# Éditez .env.local avec vos vraies valeurs
npm run dev
# → Ouvrir http://localhost:3000
```

---

## 2. Premier déploiement sur Vercel

```bash
# Connexion à Vercel
vercel login

# Déploiement en production
vercel --prod
```

Vercel vous posera 3 questions :
- **Set up and deploy?** → Y
- **Which scope?** → Votre compte
- **Link to existing project?** → N (première fois)

---

## 3. Variables d'environnement sur Vercel

Dans le dashboard Vercel → Settings → Environment Variables, ajoutez :

| Variable | Valeur |
|----------|--------|
| `RESEND_API_KEY` | Votre clé API Resend |
| `CONTACT_EMAIL` | contact@rckydigital.com |
| `NEXT_PUBLIC_SITE_URL` | https://votre-domaine.fr |
| `NEXT_PUBLIC_CALENDLY_URL` | Votre lien Calendly |

---

## 4. Domaine personnalisé

Dans Vercel → Settings → Domains :
1. Ajouter votre domaine (ex: phoenixprod.fr)
2. Copier les DNS records
3. Configurer chez votre registrar (OVH, Gandi, etc.)

---

## 5. Mises à jour futures

```bash
# Modifier les fichiers, puis :
vercel --prod
# C'est tout — Vercel redéploie en ~30 secondes
```

---

## 6. Activer les emails (formulaire de contact)

1. Créer un compte sur resend.com (gratuit jusqu'à 100 emails/jour)
2. Ajouter votre domaine dans Resend
3. Copier la clé API dans RESEND_API_KEY
4. Dans `app/api/contact/route.ts`, décommenter le bloc Resend
