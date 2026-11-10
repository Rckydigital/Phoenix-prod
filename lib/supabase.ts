'use client'

// Client Supabase côté navigateur (comptes clients de l'espace client).
// Variables publiques à définir dans Vercel : NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
// Sans elles, l'espace client affiche « bientôt disponible » et propose le formulaire de devis.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null | undefined

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  client = url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null
  return client
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  company: string | null
  lang: string | null
  plan: string | null
  trial_ends_at: string | null
  subscription_status: string | null
  stripe_customer_id: string | null
}

export type Automation = {
  id: string
  name: string
  kind: string | null
  status: 'en_preparation' | 'active' | 'en_pause'
  description: string | null
  created_at: string
}

export type AutomationEvent = {
  id: string
  automation_id: string
  type: 'demande' | 'reponse' | 'relance' | 'rdv' | 'autre'
  label: string | null
  created_at: string
}
