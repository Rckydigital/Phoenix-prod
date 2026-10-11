import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Phoenix Prod <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'rckydigital@outlook.fr',
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message via le site Phoenix Prod</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.redirect(new URL('/contact?sent=true', request.url))
  } catch (error) {
    console.error('Erreur formulaire contact:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
