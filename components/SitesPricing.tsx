import Link from 'next/link'
import { Check, IconTile } from '@/components/ui'
import { SITE_DEVIS } from '@/lib/constants'

// Création de site internet : types de sites, tous sur devis (pas de prix affiché).
const TYPES = [
  {
    icon: 'globe',
    name: 'Site vitrine',
    forWho: 'Artisans, indépendants, prestataires de services',
    text: 'Quelques pages pour présenter votre activité, vos prestations, vos réalisations et vos coordonnées. Le client comprend en quelques secondes ce que vous faites, où, et comment vous joindre.',
    items: ['Accueil, services, réalisations, à propos, contact', 'Bouton WhatsApp et appel en un clic', 'Plan d’accès et zone d’intervention'],
  },
  {
    icon: 'calendar',
    name: 'Site avec réservation',
    forWho: 'Beauté, bien-être, lavage auto, gîtes, excursions',
    text: 'Vos clients voient vos disponibilités et réservent seuls, de jour comme de nuit. Moins d’allers-retours sur WhatsApp, moins de rendez-vous oubliés.',
    items: ['Agenda en ligne et confirmation automatique', 'Rappels avant le rendez-vous', 'Acompte en ligne possible'],
  },
  {
    icon: 'inbox',
    name: 'Boutique en ligne',
    forWho: 'Commerces, créateurs, produits locaux',
    text: 'Vendez vos produits en ligne avec paiement sécurisé. Pensée pour les Antilles : retrait en boutique, livraison locale et frais d’envoi adaptés à l’archipel.',
    items: ['Catalogue, panier et paiement par carte', 'Retrait sur place ou livraison', 'Suivi des commandes simple'],
  },
  {
    icon: 'bolt',
    name: 'Page de vente',
    forWho: 'Lancement d’une offre, événement, campagne de publicité',
    text: 'Une seule page, construite pour une seule action : réserver, s’inscrire ou acheter. Idéale derrière une publicité Facebook ou Instagram.',
    items: ['Un message clair et un seul bouton', 'Formulaire ou réservation intégrés', 'Rapide à mettre en ligne'],
  },
  {
    icon: 'clock',
    name: 'Refonte de site',
    forWho: 'Vous avez déjà un site lent, daté ou introuvable',
    text: 'On repart de votre site existant : on garde ce qui fonctionne, on modernise le reste. Plus rapide, lisible sur mobile, et mieux compris par Google et les IA.',
    items: ['Audit de l’existant avant devis', 'Reprise de vos contenus', 'Redirections pour ne pas perdre votre référencement'],
  },
]

const INCLUDED = [
  'Création sur mesure, améliorée grâce à l’IA : livrée plus vite, à moindre coût',
  'Adapté au mobile, là où vos clients vous cherchent',
  'Pensé pour Google et les IA comme ChatGPT (GEO)',
  'Relié à votre fiche Google et à vos réseaux',
  'Nom de domaine à votre nom : votre site vous appartient',
]

const STEPS = [
  ['Appel de 15 min', 'Votre activité, vos clients, ce que le site doit faire.'],
  ['Audit offert', 'On regarde si Google et les IA vous trouvent aujourd’hui.'],
  ['Devis sous 48 h', 'Un prix clair, détaillé, sans engagement.'],
]

export default function SitesPricing() {
  return (
    <section id="sites" className="scroll-mt-24 pb-6">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <span className="kicker">Sites internet</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">Création de site internet : sur devis</h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
            Chaque entreprise a des besoins différents. Choisissez le type de site qui vous ressemble : on vous envoie un devis gratuit sous 48 h, adapté à votre projet.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((s, i) => (
            <div key={s.name} className="card flex flex-col p-7">
              <IconTile name={s.icon} tone={i % 2 ? 'teal' : 'brand'} />
              <h3 className="mt-5 text-xl font-bold text-ink">{s.name}</h3>
              <p className="mt-1 text-sm font-medium text-brand-deep">{s.forWho}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-sm text-ink"><Check />{it}</li>
                ))}
              </ul>
              <p className="mt-6 text-lg font-extrabold text-ink">Sur devis</p>
              <Link href={`/contact?service=${SITE_DEVIS.id}`} data-track={`Tarifs : site ${s.name}`} className="btn-outline mt-4 w-full">
                Demander un devis
              </Link>
            </div>
          ))}

          <div className="flex flex-col rounded-3xl bg-ink p-7 text-white">
            <h3 className="text-xl font-bold">Inclus dans chaque site</h3>
            <ul className="mt-5 flex-1 space-y-3">
              {INCLUDED.map((it) => (
                <li key={it} className="flex gap-2.5 text-sm text-white/85"><Check className="h-5 w-5 shrink-0 text-[#F2A65A]" />{it}</li>
              ))}
            </ul>
            <ol className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2A65A] text-xs font-bold text-ink">{i + 1}</span>
                  <span><strong className="text-white">{title}</strong> <span className="text-white/70">{text}</span></span>
                </li>
              ))}
            </ol>
            <Link href="/rendez-vous?sujet=site" data-track="Tarifs : rendez-vous site" className="btn-primary mt-7 w-full">
              Réserver mon appel
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
