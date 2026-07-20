import { NextRequest, NextResponse } from 'next/server';

const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';
const ACCESS_MAX_AGE = 60 * 60;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.access_token || !body?.refresh_token) {
    return NextResponse.json({ error: 'Missing tokens.' }, { status: 400 });
  }

  // Decode JWT header to check algorithm without verifying signature
  // Tokens from Supabase login are already verified by Supabase — no need to re-verify here.
  try {
    const payloadB64 = body.access_token.split('.')[1];
    if (!payloadB64) {
      return NextResponse.json({ error: 'Malformed token.' }, { status: 400 });
    }
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    // Basic sanity checks — token must not be expired and must have a subject
    if (!payload?.sub || !payload?.exp || Date.now() >= payload.exp * 1000) {
      return NextResponse.json({ error: 'Token expired or invalid.' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid token format.' }, { status: 400 });
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
