'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Check } from '@/components/ui'
import { PLANS, r, type Lang } from '@/lib/i18n'
import { SITE } from '@/lib/constants'

type Mode = 'signup' | 'login'

const T = {
  fr: {
    signupTitle: 'Créez votre espace client',
    signupSub: 'Pour suivre votre pilote, vos automatisations et votre abonnement.',
    loginTitle: 'Connexion à votre espace client',
    loginSub: 'Suivez vos automatisations et votre abonnement.',
    name: 'Nom complet', company: 'Entreprise', email: 'E-mail professionnel', password: 'Mot de passe', pwHint: '8 caractères minimum',
    signup: 'Créer mon espace', login: 'Me connecter', loading: 'Un instant…',
    haveAccount: 'Déjà un compte ?', noAccount: 'Pas encore de compte ?', toLogin: 'Se connecter', toSignup: 'Créer un compte',
    forgot: 'Mot de passe oublié ?', resetSent: 'Si un compte existe pour cette adresse, un e-mail de réinitialisation vient de partir.', needEmail: 'Indiquez d’abord votre e-mail.',
    checkMail: 'Presque fini : confirmez votre adresse en cliquant sur le lien reçu par e-mail, puis connectez-vous.',
    terms1: 'En créant un compte, vous acceptez que vos données soient utilisées pour gérer votre espace, conformément à la', terms2: 'politique de confidentialité',
    unavailable: 'L’espace client ouvre très bientôt. En attendant, demandez votre devis ou écrivez-nous :',
    quote: 'Demander un devis',
    perks: ['Suivi de votre pilote de 10 jours', 'Vos automatisations et leurs résultats', 'Abonnement et factures au même endroit'],
    planChosen: 'Formule choisie',
    errors: { 'Invalid login credentials': 'E-mail ou mot de passe incorrect.', 'Email not confirmed': 'Adresse pas encore confirmée : cliquez sur le lien reçu par e-mail.', 'User already registered': 'Un compte existe déjà avec cette adresse : connectez-vous.' } as Record<string, string>,
    generic: 'Une erreur est survenue. Réessayez dans un instant.',
  },
  en: {
    signupTitle: 'Create your client account',
    signupSub: 'To follow your pilot, your automations and your subscription.',
    loginTitle: 'Log in to your client area',
    loginSub: 'Track your automations and your subscription.',
    name: 'Full name', company: 'Company', email: 'Work email', password: 'Password', pwHint: 'At least 8 characters',
    signup: 'Create my account', login: 'Log in', loading: 'One moment…',
    haveAccount: 'Already have an account?', noAccount: 'No account yet?', toLogin: 'Log in', toSignup: 'Create an account',
    forgot: 'Forgot your password?', resetSent: 'If an account exists for this address, a reset email is on its way.', needEmail: 'Enter your email first.',
    checkMail: 'Almost done: confirm your address with the link we just emailed you, then log in.',
    terms1: 'By creating an account you agree that your data is used to run your client area, as described in the', terms2: 'privacy policy (French)',
    unavailable: 'The client area opens very soon. Meanwhile, request a quote or email us:',
    quote: 'Request a quote',
    perks: ['Track your 10-day pilot', 'Your automations and their results', 'Subscription and invoices in one place'],
    planChosen: 'Selected plan',
    errors: { 'Invalid login credentials': 'Wrong email or password.', 'Email not confirmed': 'Email not confirmed yet: click the link we emailed you.', 'User already registered': 'An account already exists for this email: please log in.' } as Record<string, string>,
    generic: 'Something went wrong. Please try again.',
  },
}

export default function AuthForm({ lang, mode, plan }: { lang: Lang; mode: Mode; plan?: string }) {
  const t = T[lang]
  const router = useRouter()
  const supabase = getSupabase()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [email, setEmail] = useState('')
  const chosen = PLANS.find((p) => p.id === plan)

  const err = (m?: string) => setMsg({ ok: false, text: (m && t.errors[m]) || t.generic })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setMsg(null)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: String(f.get('email')),
          password: String(f.get('password')),
          options: {
            data: { full_name: String(f.get('name') || ''), company: String(f.get('company') || ''), lang, plan_interest: plan || '' },
            emailRedirectTo: `${window.location.origin}${r('dashboard', lang)}`,
          },
        })
        if (error) return err(error.message)
        if (data.session) router.push(r('dashboard', lang) + (plan ? `?plan=${plan}` : ''))
        else setMsg({ ok: true, text: t.checkMail })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: String(f.get('email')), password: String(f.get('password')) })
        if (error) return err(error.message)
        router.push(r('dashboard', lang))
      }
    } catch {
      err()
    } finally {
      setBusy(false)
    }
  }

  async function forgot() {
    if (!supabase) return
    if (!email) return setMsg({ ok: false, text: t.needEmail })
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}${r('dashboard', lang)}?reset=1` })
    setMsg({ ok: true, text: t.resetSent })
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="hidden lg:block">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">{mode === 'signup' ? t.signupTitle : t.loginTitle}</h1>
        <p className="mt-4 text-lg text-ink-soft">{mode === 'signup' ? t.signupSub : t.loginSub}</p>
        {mode === 'signup' && (
          <ul className="mt-8 space-y-3">
            {t.perks.map((p) => <li key={p} className="flex gap-2.5 text-ink"><Check />{p}</li>)}
          </ul>
        )}
      </div>

      <div className="card mx-auto w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-ink lg:hidden">{mode === 'signup' ? t.signupTitle : t.loginTitle}</h1>
        <p className="mt-1 text-sm text-ink-muted lg:hidden">{mode === 'signup' ? t.signupSub : t.loginSub}</p>
        {chosen && mode === 'signup' && (
          <p className="mt-4 rounded-xl bg-brand-soft px-4 py-2.5 text-sm text-brand-deep lg:mt-0">
            {t.planChosen}{lang === 'fr' ? ' : ' : ': '}<strong>{chosen.name[lang]}</strong>
          </p>
        )}

        {!supabase ? (
          <div className="mt-5 space-y-4 text-ink-soft">
            <p>{t.unavailable}</p>
            <p><a href={`mailto:${SITE.email}`} className="font-semibold text-brand-deep underline">{SITE.email}</a></p>
            <Link href={r('quote', lang) + (plan ? `?service=lab-${plan}` : '')} className="btn-primary w-full">{t.quote}</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 grid gap-4">
            {mode === 'signup' && (
              <>
                <div><label className="label" htmlFor="a-name">{t.name}</label><input id="a-name" name="name" required autoComplete="name" className="field" /></div>
                <div><label className="label" htmlFor="a-company">{t.company}</label><input id="a-company" name="company" autoComplete="organization" className="field" /></div>
              </>
            )}
            <div><label className="label" htmlFor="a-email">{t.email}</label><input id="a-email" name="email" type="email" required autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div>
              <label className="label" htmlFor="a-password">{t.password}</label>
              <input id="a-password" name="password" type="password" required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className="field" />
              {mode === 'signup' && <p className="mt-1.5 text-xs text-ink-muted">{t.pwHint}</p>}
            </div>
            {msg && <p role={msg.ok ? 'status' : 'alert'} className={`rounded-xl px-4 py-3 text-sm ${msg.ok ? 'bg-teal-soft text-teal-deep' : 'bg-[#FDECEC] text-[#8F1F22]'}`}>{msg.text}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">{busy ? t.loading : mode === 'signup' ? t.signup : t.login}</button>
            {mode === 'login' && <button type="button" onClick={forgot} className="text-sm font-medium text-ink-soft underline-offset-4 hover:underline">{t.forgot}</button>}
            {mode === 'signup' && (
              <p className="text-xs leading-relaxed text-ink-muted">{t.terms1} <a href="/politique-confidentialite" className="underline">{t.terms2}</a>.</p>
            )}
          </form>
        )}

        <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-soft">
          {mode === 'signup' ? t.haveAccount : t.noAccount}{' '}
          <Link href={mode === 'signup' ? r('login', lang) : r('signup', lang)} className="font-semibold text-brand-deep hover:underline">
            {mode === 'signup' ? t.toLogin : t.toSignup}
          </Link>
        </p>
      </div>
    </div>
  )
}
