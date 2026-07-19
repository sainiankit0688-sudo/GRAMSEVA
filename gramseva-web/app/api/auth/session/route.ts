import { NextRequest, NextResponse } from 'next/server';
import { verifySupabaseJwt } from '@/lib/server/jwt';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';
const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';
const ACCESS_MAX_AGE = 60 * 60;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.access_token || !body?.refresh_token) {
    return NextResponse.json({ error: 'Missing tokens.' }, { status: 400 });
  }

  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'Server not configured.' }, { status: 500 });
  }

  const { valid } = verifySupabaseJwt(body.access_token, JWT_SECRET);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
  }

  const isSecure = process.env.NODE_ENV === 'production';

  const response = NextResponse.json({ success: true });

  response.cookies.set(ACCESS_COOKIE, body.access_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_MAX_AGE,
  });

  response.cookies.set(REFRESH_COOKIE, body.refresh_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_MAX_AGE,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ACCESS_COOKIE, '', { maxAge: 0, path: '/' });
  response.cookies.set(REFRESH_COOKIE, '', { maxAge: 0, path: '/' });

  return response;
}
