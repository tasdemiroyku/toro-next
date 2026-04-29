import { NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/proxy'

const PROTECTED_ROUTES = ['/profile', '/listings/create', '/listings/my', '/inbox']

export async function proxy(request) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isDynamicProtected = /^\/listings\/[^/]+\/edit$/.test(pathname)

  if (
    (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) || isDynamicProtected)
    && !user
  ) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

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