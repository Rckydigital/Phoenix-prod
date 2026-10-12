import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { QG_COOKIE, isLoggedIn } from '@/lib/qgAuth'
import { readRaw } from '@/lib/vault'

// Sert un fichier du cerveau au QG (accès réservé, dossiers autorisés uniquement).
const ALLOWED = ['70 - Fichiers/', '30 - Agents/Journaux/', '50 - Clients/']
const TYPES: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
  pdf: 'application/pdf', mp4: 'video/mp4', mov: 'video/quicktime',
  md: 'text/plain; charset=utf-8', txt: 'text/plain; charset=utf-8', csv: 'text/csv; charset=utf-8',
}

export async function GET(request: NextRequest) {
  if (!isLoggedIn(cookies().get(QG_COOKIE)?.value)) {
    return new NextResponse('Accès refusé', { status: 401 })
  }
  const path = request.nextUrl.searchParams.get('path') || ''
  if (!ALLOWED.some((a) => path.startsWith(a)) || path.includes('..') || path.includes('\\')) {
    return new NextResponse('Chemin non autorisé', { status: 400 })
  }
  const data = await readRaw(path)
  if (!data) return new NextResponse('Fichier introuvable', { status: 404 })
  const name = path.split('/').pop() || 'fichier'
  const ext = (name.split('.').pop() || '').toLowerCase()
  const download = request.nextUrl.searchParams.get('download') === '1'
  return new NextResponse(data, {
    headers: {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(name)}`,
      'Cache-Control': 'private, max-age=60',
      'X-Content-Type-Options': 'nosniff',
      ...(ext === 'svg' ? { 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'" } : {}),
    },
  })
}
