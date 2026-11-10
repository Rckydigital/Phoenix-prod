// Client Supabase côté serveur avec la clé « service role » (jamais exposée au navigateur).
// Sert à vérifier un utilisateur connecté et à mettre à jour son abonnement (webhook Stripe).
import { createClient } from '@supabase/supabase-js'

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

// Retrouve l'utilisateur à partir du jeton envoyé par le navigateur (en-tête Authorization: Bearer …)
export async function userFromRequest(req: Request) {
  const admin = supabaseAdmin()
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!admin || !token) return { admin, user: null }
  const { data } = await admin.auth.getUser(token)
  return { admin, user: data.user ?? null }
}
