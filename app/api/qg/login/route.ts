import { NextRequest, NextResponse } from 'next/server'
import { QG_COOKIE, checkPassword, qgToken } from '@/lib/qgAuth'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const action = String(form.get('action') || 'login')
  const res = NextResponse.redirect(new URL('/qg', request.url), { status: 303 })

  if (action === 'logout') {
    res.cookies.delete(QG_COOKIE)
    return res
  }

  const password = String(form.get('password') || '')
  const token = qgToken()
  if (!token || !checkPassword(password)) {
    return NextResponse.redirect(new URL('/qg?erreur=1', request.url), { status: 303 })
  }
  res.cookies.set(QG_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
