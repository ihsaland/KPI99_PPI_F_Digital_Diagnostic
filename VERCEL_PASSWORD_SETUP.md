# Vercel Password Protection Setup

## Overview

Vercel offers built-in password protection that can be enabled per deployment or per project. This provides the first layer of security for the diagnostic tool.

## Method 1: Deployment Protection (Recommended)

### Enable Password Protection

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to **Settings** → **Deployment Protection**

2. **Enable Password Protection**
   - Toggle "Password Protection" to ON
   - Enter a password
   - Click "Save"

3. **Protection Scope**
   - **All Deployments**: Protects all deployments (production, preview, etc.)
   - **Preview Deployments Only**: Only protects preview deployments

### Access Control

- Password is required to access any page on the site
- Works with all routes and API rewrites
- Password is shared across all users (single password)

## Method 2: Environment-Based Protection

For more granular control, you can implement password protection in your Next.js app:

### Create Password Protection Middleware

Create `frontend/middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if password protection is enabled
  const passwordProtection = process.env.PASSWORD_PROTECTION_ENABLED === 'true'
  const expectedPassword = process.env.SITE_PASSWORD
  
  if (!passwordProtection || !expectedPassword) {
    return NextResponse.next()
  }
  
  // Check for password in cookie or header
  const password = request.cookies.get('site_password')?.value
  
  if (password === expectedPassword) {
    return NextResponse.next()
  }
  
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    const [type, credentials] = authHeader.split(' ')
    if (type === 'Basic') {
      const decoded = Buffer.from(credentials, 'base64').toString()
      const [username, password] = decoded.split(':')
      if (password === expectedPassword) {
        const response = NextResponse.next()
        response.cookies.set('site_password', password, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        return response
      }
    }
  }
  
  // Return 401 with WWW-Authenticate header
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="PPI-F Diagnostic Tool"',
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### Add Environment Variables

In Vercel dashboard, add:
```
PASSWORD_PROTECTION_ENABLED=true
SITE_PASSWORD=your-secure-password
```

## Method 3: API Route Protection

For API-specific protection, create `frontend/app/api/auth/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const expectedPassword = process.env.SITE_PASSWORD
  
  if (password === expectedPassword) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('site_password', password, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response
  }
  
  return NextResponse.json({ success: false }, { status: 401 })
}
```

## Recommended Approach

**Use Vercel's Built-in Password Protection (Method 1)** because:
- ✅ Simple to set up
- ✅ No code changes required
- ✅ Works immediately
- ✅ Secure and reliable
- ✅ Easy to update password

**Combine with API Key Authentication** for organization-level access:
- Vercel password = First layer (site access)
- API key = Second layer (organization data access)

## Testing

1. **Enable Password Protection** in Vercel dashboard
2. **Visit the site** - should prompt for password
3. **Enter password** - should grant access
4. **Test API key** - should work after password authentication

## Security Notes

- Vercel password protection uses HTTP Basic Auth
- Password is transmitted over HTTPS (secure)
- Consider rotating password periodically
- Use strong passwords (12+ characters, mixed case, numbers, symbols)



