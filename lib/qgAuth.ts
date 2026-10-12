import { createHash, timingSafeEqual } from 'crypto'

// Accès au QG : mot de passe défini dans la variable QG_PASSWORD (Vercel).
export const QG_COOKIE = 'qg_session'

export function qgToken(): string | null {
  const pwd = process.env.QG_PASSWORD
  if (!pwd) return null
  return createHash('sha256').update(`rcky-qg:${pwd}`).digest('hex')
}

export function checkPassword(input: string): boolean {
  const pwd = process.env.QG_PASSWORD
  if (!pwd) return false
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(pwd).digest()
  return timingSafeEqual(a, b)
}

export function isLoggedIn(cookieValue: string | undefined): boolean {
  const token = qgToken()
  if (!token || !cookieValue || cookieValue.length !== token.length) return false
  return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(token))
}
