'use client'

// Maquette d'interface animée de LeadFlow (style « produit montré en vrai »).
// Conversation 1 (Mme Laurent) : le message arrive, l'IA l'analyse et répond seule (demande simple).
// Puis la conversation 2 (M. Bernard) s'ouvre : le message arrive, l'IA l'analyse et prépare un
// BROUILLON (négociation = cas délicat), que le gérant valide d'un clic.
import { useEffect, useRef, useState } from 'react'
import type { Lang } from '@/lib/i18n'

const T = {
  fr: {
    app: 'LeadFlow · Boîte de réception', ex: 'Exemple · données fictives', inbox: 'Demandes', live: 'Actif',
    list: [['Mme Laurent', 'Le T3 est-il disponible ?', '22:47'], ['M. Bernard', 'Le prix est-il négociable ?', '22:52'], ['Agence Dupuis', 'Estimation d’un bien', 'Hier'], ['Mme Petit', 'Merci pour la visite !', 'Hier']],
    who1: 'Mme Laurent', who2: 'M. Bernard', time: '22:47', time2: '22:52', from: 'Formulaire du site', replied: 'Répondu à 22:47', validatedShort: 'Validé',
    msg: 'Bonjour, le T3 de la rue des Flamboyants est-il toujours disponible ? Une visite serait possible samedi ?',
    analysing: 'LeadFlow analyse la demande…',
    tags: ['Demande de visite', 'Prospect chaud', 'Bien réf. 214'],
    reply: 'Bonjour Madame Laurent, oui, le T3 est toujours disponible. Je vous propose une visite samedi à 10 h ou à 11 h 30. Lequel vous convient ?',
    sign: 'Assistant IA de l’agence',
    sent: 'Envoyée à 22:47 · règle « Disponibilités »',
    msg2: 'Bonsoir, le prix du T2 avenue des Caraïbes est-il négociable ?',
    tags2: ['Négociation de prix', 'Bien réf. 187', 'À valider'],
    draft: 'Bonsoir Monsieur Bernard, merci pour votre message. Le prix se discute avec le propriétaire : je lui transmets votre demande et je reviens vers vous demain.',
    draftLabel: 'Brouillon préparé par l’IA · non envoyé',
    validateTitle: 'À valider par vous',
    validateText: 'Négociation de prix : l’IA ne répond pas seule.',
    validate: 'Valider et envoyer',
    validated: 'Validé et envoyé par vous',
  },
  en: {
    app: 'LeadFlow · Inbox', ex: 'Example · sample data', inbox: 'Requests', live: 'Live',
    list: [['Mrs Lawrence', 'Is the 2-bed still available?', '10:47pm'], ['Mr Bennett', 'Is the price negotiable?', '10:52pm'], ['Dupuis Agency', 'Property valuation', 'Yesterday'], ['Ms Price', 'Thanks for the viewing!', 'Yesterday']],
    who1: 'Mrs Lawrence', who2: 'Mr Bennett', time: '10:47pm', time2: '10:52pm', from: 'Website form', replied: 'Answered at 10:47pm', validatedShort: 'Approved',
    msg: 'Hello, is the 2-bed flat on Palm Street still available? Could I view it on Saturday?',
    analysing: 'LeadFlow is reading the request…',
    tags: ['Viewing request', 'Hot lead', 'Listing #214'],
    reply: 'Hello Mrs Lawrence, yes, the flat is still available. I can offer a viewing on Saturday at 10am or 11:30am. Which suits you?',
    sign: 'The agency’s AI assistant',
    sent: 'Sent at 10:47pm · “Availability” rule',
    msg2: 'Good evening, is the price of the flat on Caribbean Avenue negotiable?',
    tags2: ['Price negotiation', 'Listing #187', 'Needs approval'],
    draft: 'Good evening Mr Bennett, thank you for your message. The price is set with the owner: I will pass on your request and get back to you tomorrow.',
    draftLabel: 'Draft prepared by the AI · not sent',
    validateTitle: 'Needs your approval',
    validateText: 'Price negotiation: the AI does not reply on its own.',
    validate: 'Approve and send',
    validated: 'Approved and sent by you',
  },
}

// Chronologie (secondes)
const K = {
  m1: 0.4, an1: 1.4, tag1: 2.8, rep1: 3.4, sent1: 7.1, // conversation 1
  arrive2: 7.9, cursor: 8.5, click: 9.2, open: 9.35, // la 2e demande arrive, on l'ouvre
  m2: 9.7, an2: 10.5, tag2: 11.7, draft: 12.2, card: 15.4, click2: 16.6, done: 16.8, // conversation 2
}
const LOOP = 19
const CPS = 42 // caractères tapés par seconde

export default function InboxDemo({ lang }: { lang: Lang }) {
  const t = T[lang]
  const [s, setS] = useState(LOOP - 0.01) // état final par défaut (rendu serveur, animations coupées)
  const box = useRef<HTMLDivElement>(null)
  const item2 = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const forced = (window as unknown as { __inboxT?: number }).__inboxT // utilisé seulement pour enregistrer une vidéo
      setS(typeof forced === 'number' ? forced : ((now - start) / 1000) % LOOP)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const on = (a: number) => s >= a
  const sel = on(K.open) ? 1 : 0
  const typed1 = t.reply.slice(0, Math.max(0, Math.floor((s - K.rep1) * CPS)))
  const typed2 = t.draft.slice(0, Math.max(0, Math.floor((s - K.draft) * CPS)))
  const show = (a: number) => `transition-all duration-500 ${on(a) ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`

  // Curseur de souris (ordinateur seulement) : va sur la 2e demande, clique, puis sur « Valider »
  let cursor: { x: number; y: number; visible: boolean; pressed: boolean } = { x: 0, y: 0, visible: false, pressed: false }
  if (box.current && item2.current) {
    const b = box.current.getBoundingClientRect()
    const target = (el: HTMLElement | null, dx = 0.55, dy = 0.6) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left - b.left + r.width * dx, y: r.top - b.top + r.height * dy } }
    const a = target(item2.current)
    const c = target(btn.current, 0.6, 0.65)
    const lerp = (p: { x: number; y: number }, q: { x: number; y: number }, k: number) => ({ x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k })
    const ease = (k: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3)
    if (a && s >= K.cursor && s < K.m2 + 0.3) {
      const from = { x: a.x + 60, y: a.y + 120 }
      cursor = { ...lerp(from, a, ease((s - K.cursor) / 0.6)), visible: true, pressed: s >= K.click && s < K.click + 0.18 }
    } else if (a && c && s >= K.card + 0.4 && s < K.done + 0.9) {
      cursor = { ...lerp({ x: c.x + 40, y: c.y + 90 }, c, ease((s - K.card - 0.4) / 0.7)), visible: true, pressed: s >= K.click2 && s < K.click2 + 0.18 }
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-xl" aria-label={t.app}>
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-transparent to-teal/20 blur-2xl" />
      <div ref={box} className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_90px_-40px_rgba(30,42,51,0.45)]">
        {/* barre de fenêtre */}
        <div className="flex items-center gap-2 border-b border-line bg-[#F7F5F2] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" /><span className="h-3 w-3 rounded-full bg-[#FEBC2E]" /><span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 truncate text-xs font-semibold text-ink-soft">{t.app}</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-teal-soft px-2 py-0.5 text-[11px] font-semibold text-teal-deep"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />{t.live}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
          {/* liste des demandes */}
          <aside className="hidden border-r border-line bg-[#FBFAF8] p-2 text-xs sm:block">
            <p className="px-2 pb-2 pt-1 font-semibold uppercase tracking-wider text-ink-muted">{t.inbox}</p>
            {t.list.map(([n, sub, h], i) => (
              <div key={n} ref={i === 1 ? item2 : undefined} className={`mb-1 rounded-lg px-2 py-2 transition-all duration-300 ${i === sel ? 'bg-white shadow-sm ring-1 ring-line' : ''} ${i === 1 && !on(K.arrive2) ? '-translate-y-2 opacity-0' : 'translate-y-0'}`}>
                <div className="flex items-center justify-between gap-1">
                  <span className="flex items-center gap-1.5 truncate font-semibold text-ink">{i === 1 && on(K.arrive2) && !on(K.open) && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />}{n}</span>
                  <span className="shrink-0 text-[10px] text-ink-muted">{h}</span>
                </div>
                <p className="truncate text-ink-soft">{i === 0 && on(K.sent1) ? `✓ ${t.replied}` : i === 1 && on(K.done) ? `✓ ${t.validatedShort}` : sub}</p>
              </div>
            ))}
          </aside>

          {/* conversation ouverte */}
          <div className="min-h-[470px] overflow-hidden text-sm">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="font-semibold text-ink">{sel === 0 ? t.who1 : t.who2}</span>
              <span className="text-[11px] text-ink-muted">{sel === 0 ? t.time : t.time2}</span>
            </div>
            {sel === 0 ? (
              <div key="c1" className="space-y-3 p-4">
                <div className={show(K.m1)}>
                  <p className="text-[11px] text-ink-muted">{t.from}</p>
                  <div className="mt-1 max-w-[92%] rounded-2xl rounded-tl-sm bg-[#F1EFEC] px-3.5 py-2.5 text-ink">{t.msg}</div>
                </div>
                <div className={show(K.an1)}>
                  {!on(K.tag1) ? (
                    <p className="flex items-center gap-2 text-xs text-ink-muted"><span className="pulse-dot h-2 w-2 rounded-full bg-brand" />{t.analysing}</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {t.tags.map((tag, i) => <span key={tag} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 1 ? 'bg-brand-soft text-brand-deep' : 'bg-teal-soft text-teal-deep'}`}>{tag}</span>)}
                    </div>
                  )}
                </div>
                <div className={`${show(K.rep1)} ml-auto max-w-[92%]`}>
                  <div className="rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2.5 text-white">
                    {typed1 || ' '}{typed1.length < t.reply.length && on(K.rep1) ? <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-white align-middle" /> : null}
                  </div>
                  <p className="mt-1 text-right text-[11px] text-ink-muted">{t.sign}</p>
                  <p className={`mt-1 text-right text-[11px] font-semibold text-teal-deep transition-opacity duration-500 ${on(K.sent1) ? 'opacity-100' : 'opacity-0'}`}>✓ {t.sent}</p>
                </div>
              </div>
            ) : (
              <div key="c2" className="animate-[slideIn_.35s_ease-out] space-y-3 p-4">
                <div className={show(K.m2)}>
                  <p className="text-[11px] text-ink-muted">{t.from}</p>
                  <div className="mt-1 max-w-[92%] rounded-2xl rounded-tl-sm bg-[#F1EFEC] px-3.5 py-2.5 text-ink">{t.msg2}</div>
                </div>
                <div className={show(K.an2)}>
                  {!on(K.tag2) ? (
                    <p className="flex items-center gap-2 text-xs text-ink-muted"><span className="pulse-dot h-2 w-2 rounded-full bg-brand" />{t.analysing}</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {t.tags2.map((tag, i) => <span key={tag} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 0 || i === 2 ? 'bg-brand-soft text-brand-deep' : 'bg-teal-soft text-teal-deep'}`}>{tag}</span>)}
                    </div>
                  )}
                </div>
                <div className={`${show(K.draft)} ml-auto max-w-[92%]`}>
                  <div className={`rounded-2xl rounded-tr-sm px-3.5 py-2.5 transition-colors duration-500 ${on(K.done) ? 'bg-ink text-white' : 'border-2 border-dashed border-brand/40 bg-white text-ink'}`}>
                    {typed2 || ' '}{typed2.length < t.draft.length && on(K.draft) ? <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-ink align-middle" /> : null}
                  </div>
                  <p className={`mt-1 text-right text-[11px] font-semibold ${on(K.done) ? 'text-teal-deep' : 'text-brand-deep'}`}>{on(K.done) ? `✓ ${t.validated}` : t.draftLabel}</p>
                </div>
                <div className={`${show(K.card)} flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-soft/60 p-3`}>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-brand-deep">{t.validateTitle}</p>
                    <p className="mt-0.5 text-xs text-ink">{t.validateText}</p>
                  </div>
                  <span ref={btn} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-all ${on(K.done) ? 'bg-teal-deep' : 'bg-brand-deep'} ${cursor.pressed ? 'scale-95' : ''}`}>{on(K.done) ? '✓' : t.validate}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* curseur */}
        {cursor.visible && (
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" className="pointer-events-none absolute z-10 hidden drop-shadow-md sm:block" style={{ left: cursor.x, top: cursor.y, transform: `scale(${cursor.pressed ? 0.85 : 1})` }}>
            <path d="M4 2 L4 19 L8.5 14.5 L11.5 21 L14 20 L11 13.5 L17 13.5 Z" fill="#1E2A33" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        )}
        {cursor.visible && cursor.pressed && <span aria-hidden="true" className="pointer-events-none absolute z-10 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-brand/40 sm:block" style={{ left: cursor.x + 4, top: cursor.y + 3 }} />}
      </div>
      <p className="mt-3 text-center text-xs text-ink-muted">{t.ex}</p>
    </div>
  )
}
