import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This is a simple example. In a real app, you'd check for valid auth tokens
  const { pathname } = request.nextUrl

  // Allow public routes
  if (pathname === '/' || pathname === '/signin' || pathname === '/signup') {
    return NextResponse.next()
  }

  // For protected routes, redirect to home if not authenticated
  // Note: This is a basic example. In practice, you'd check for actual auth tokens
  return NextResponse.next()
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
