import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySupabaseJwt } from '@/lib/server/jwt';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';
const ACCESS_COOKIE = 'sb-access-token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;

    if (!accessToken || !JWT_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { payload, valid } = verifySupabaseJwt(accessToken, JWT_SECRET);

    if (!valid || payload?.app_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
