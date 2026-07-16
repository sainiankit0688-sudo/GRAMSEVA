const CLIENT_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const SERVER_ENV_VARS = [
  'GROQ_API_KEY',
  'OPENWEATHER_API_KEY',
] as const;

export function validateClientEnv(): void {
  const missing = CLIENT_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Please check your .env.local file.',
    );
  }
}

export function validateServerEnv(): void {
  const allVars = [...CLIENT_ENV_VARS, ...SERVER_ENV_VARS];
  const missing = allVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required server environment variables: ${missing.join(', ')}. ` +
        'Please check your .env.local file.',
    );
  }
}

export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
}

export function getEnvOr(key: string, fallback: string): string {
  return process.env[key] || fallback;
}
