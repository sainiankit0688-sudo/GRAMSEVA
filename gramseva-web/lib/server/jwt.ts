import { createHmac, timingSafeEqual } from 'crypto';

export interface JwtPayload {
  sub: string;
  email?: string;
  app_metadata: { role?: string; [key: string]: unknown };
  user_metadata: Record<string, unknown>;
  exp: number;
  iat: number;
  aud: string;
  [key: string]: unknown;
}

export interface JwtVerifyResult {
  payload: JwtPayload | null;
  valid: boolean;
}

export function verifySupabaseJwt(token: string, secret: string): JwtVerifyResult {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { payload: null, valid: false };

    const [headerB64, payloadB64, signatureB64] = parts;

    const signature = Buffer.from(signatureB64, 'base64url');
    const hmac = createHmac('sha256', secret);
    hmac.update(`${headerB64}.${payloadB64}`);
    const expected = hmac.digest();

    if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) {
      return { payload: null, valid: false };
    }

    const payload: JwtPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));

    if (Date.now() >= payload.exp * 1000) {
      return { payload, valid: false };
    }

    return { payload, valid: true };
  } catch {
    return { payload: null, valid: false };
  }
}

export function getJwtPayload(token: string): JwtPayload | null {
  try {
    const payloadB64 = token.split('.')[1];
    return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}
