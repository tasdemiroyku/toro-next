import { NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/proxy'

const PROTECTED_ROUTES = ['/profile', '/listings/create']

export async function proxy(request) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Redirect to login if accessing protected route without auth
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if accessing login while already logged in
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}