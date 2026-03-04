import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'site_access'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function signToken(secret: string): string {
  return createHmac('sha256', secret).update('granted').digest('base64url')
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export async function POST(request: NextRequest) {
  const enabled = process.env.PASSWORD_PROTECTION_ENABLED === 'true'
  const secret = process.env.SITE_PASSWORD

  if (!enabled || !secret) {
    return NextResponse.json({ success: true })
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const password = body.password
  if (typeof password !== 'string' || !safeCompare(password, secret)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = signToken(secret)
  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
  return res
}
