import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For paths that require authentication, this logic would check
  // the session from the cookie and redirect if needed.
  // We're just placing this file here to ensure Next.js doesn't
  // try to statically optimize auth-protected routes.
  return NextResponse.next()
}

export const config = {
  // Add paths that should be dynamically rendered
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/bookings/:path*',
    '/my-listings/:path*',
    '/api/auth/:path*',
  ],
} 