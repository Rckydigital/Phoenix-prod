import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SITE, SERVICES, PACKS } from '@/lib/constants'
import { crmConfigured, saveLeadToCrm } from '@/lib/crm'
import { track } from '@/lib/track'

// Reçoit le formulaire de contact (envoi classique ou JSON),
// envoie un email à l'agence via Resend si RESEND_API_KEY est configurée,
// puis redirige vers la page de remerciement.

function clean(value: unknown, max = 2000) {
  return String(value ?? '').trim().slice(0, max)
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

export async function POST(request: NextRequest) {
  const isJson = (request.headers.get('content-type') || '').includes('application/json')
  const back = (path: string) =>
    isJson ? null : NextResponse.redirect(new URL(path, request.url), { status: 303 })

  let raw: Record<string, unknown> = {}
  try {
    if (isJson) {
      raw = await request.json()
    } else {
      const form = await request.formData()
      raw = Object.fromEntries(form.entries())
    }
  } catch {
    return back('/contact?error=1') ?? NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  // Champ piège anti-robots : rempli = robot, on ignore silencieusement.
  if (clean(raw.website)) {
    return back('/contact/merci') ?? NextResponse.json({ message: 'ok' })
  }

  const data = {
    name: clean(raw.name, 120),
    email: clean(raw.email, 200),
    phone: clean(raw.phone, 40),
    business: clean(raw.business, 160),
    service: clean(raw.service, 60),
    message: clean(raw.message, 4000),
    rgpd: clean(raw.rgpd, 10),
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  if (!data.name || !emailOk || !data.message || !data.rgpd) {
    return back(clean(raw.page, 60) === '/offre' ? '/offre?error=1#reserver' : '/contact?error=1') ?? NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const serviceTitle =
    [...SERVICES, ...PACKS].find((s) => s.id === data.service)?.title || data.service

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey && !crmConfigured()) {
    console.error('Ni RESEND_API_KEY ni CRM_GITHUB_TOKEN : demande non enregistrée', { name: data.name })
    return back('/contact?error=config') ?? NextResponse.json({ error: 'Envoi non configuré' }, { status: 500 })
  }

  // 1. Fiche client dans le cerveau (CRM Obsidian)
  let savedToCrm = false
  if (crmConfigured()) {
    try {
      await saveLeadToCrm({ ...data, service: serviceTitle })
      savedToCrm = true
    } catch (err) {
      console.error('Erreur CRM', err)
    }
  }

  // 2. Email de notification
  let emailed = false
  if (apiKey) {
    try {
      const resend = new Resend(apiKey)
      const rows = [
        ['Nom', data.name],
        ['Email', data.email],
        ['Téléphone', data.phone || '—'],
        ['Entreprise', data.business || '—'],
        ['Service', serviceTitle || '—'],
      ]
      const { error } = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL || 'RCKY DIGITAL <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'rckydigital@outlook.fr', // destinataire du formulaire inchangé (compte Resend)
        reply_to: data.email,
        subject: `Nouvelle demande site : ${data.name}${data.business ? ` (${data.business})` : ''}`,
        html: `<h2>Nouvelle demande depuis le site</h2>
<table>${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>
<p><strong>Message :</strong></p><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
<p>${savedToCrm ? 'Fiche créée dans le CRM du cerveau.' : 'Attention : fiche CRM non créée.'}</p>`,
      })
      if (error) throw error
      emailed = true
    } catch (err) {
      console.error('Erreur Resend', err)
    }
  }

  if (!savedToCrm && !emailed) {
    return back('/contact?error=1') ?? NextResponse.json({ error: 'Erreur envoi' }, { status: 500 })
  }

  await track('formulaire', clean(raw.page, 60) || '/contact', serviceTitle || '', clean(raw.src, 40))
  return back('/contact/merci') ?? NextResponse.json({ message: 'Message reçu' })
}
