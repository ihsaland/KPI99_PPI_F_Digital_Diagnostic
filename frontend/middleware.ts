import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'site_access'
const UNLOCK_PATH = '/unlock'

async function computeToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode('granted')
  )
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function middleware(request: NextRequest) {
  const enabled = process.env.PASSWORD_PROTECTION_ENABLED === 'true'
  const secret = process.env.SITE_PASSWORD

  if (!enabled || !secret) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (pathname === UNLOCK_PATH || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value
  const expected = await computeToken(secret)
  if (cookie === expected) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = UNLOCK_PATH
  url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)',
  ],
}
