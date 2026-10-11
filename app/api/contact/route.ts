import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SITE } from '@/lib/constants'

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
    return back('/contact?error=1') ?? NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY manquante : message non envoyé', { name: data.name, email: data.email })
    return back('/contact?error=config') ?? NextResponse.json({ error: 'Envoi non configuré' }, { status: 500 })
  }

  try {
    const resend = new Resend(apiKey)
    const rows = [
      ['Nom', data.name],
      ['Email', data.email],
      ['Téléphone', data.phone || '—'],
      ['Entreprise', data.business || '—'],
      ['Service', data.service || '—'],
    ]
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'RCKY DIGITAL <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || SITE.email,
      reply_to: data.email,
      subject: `Nouvelle demande site : ${data.name}${data.business ? ` (${data.business})` : ''}`,
      html: `<h2>Nouvelle demande depuis le site</h2>
<table>${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>
<p><strong>Message :</strong></p><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`,
    })
  } catch (err) {
    console.error('Erreur Resend', err)
    return back('/contact?error=1') ?? NextResponse.json({ error: 'Erreur envoi' }, { status: 500 })
  }

  return back('/contact/merci') ?? NextResponse.json({ message: 'Message reçu' })
}
