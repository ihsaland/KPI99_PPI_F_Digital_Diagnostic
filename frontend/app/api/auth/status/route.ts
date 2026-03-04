import { NextResponse } from 'next/server'

export async function GET() {
  const enabled = process.env.PASSWORD_PROTECTION_ENABLED === 'true'
  const hasSecret = !!process.env.SITE_PASSWORD
  return NextResponse.json({ protected: enabled && hasSecret })
}
