// lib/epoAuth.ts
// Server-Side OAuth2 Token Manager for EPO Open Patent Services (OPS) v3.2
// Caches access_token in server memory and refreshes before its 20-minute expiry

interface EpoTokenState {
  accessToken: string;
  issuedAt: number;
  expiresAt: number;
}

export class MissingEpoCredentialsError extends Error {
  constructor() {
    super(
      'EPO_OPS_CONSUMER_KEY and/or EPO_OPS_SECRET are missing from server environment (.env.local).'
    );
    this.name = 'MissingEpoCredentialsError';
  }
}

// Singleton token cache in Node.js server memory across warm invocations
let tokenCache: EpoTokenState | null = null;
const PRE_EXPIRY_BUFFER_MS = 90 * 1000; // Refresh 90 seconds before 20-minute expiration

export async function getEpoAccessToken(forceRefresh = false): Promise<{
  accessToken: string;
  cacheStatus: 'HIT' | 'REFRESHED';
  ttlSecondsRemaining: number;
}> {
  const consumerKey = process.env.EPO_OPS_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.EPO_OPS_SECRET?.trim();

  if (
    !consumerKey ||
    !consumerSecret ||
    consumerKey === 'your_epo_consumer_key_here' ||
    consumerSecret === 'your_epo_consumer_secret_here'
  ) {
    throw new MissingEpoCredentialsError();
  }

  const now = Date.now();
  if (!forceRefresh && tokenCache && now < tokenCache.expiresAt - PRE_EXPIRY_BUFFER_MS) {
    return {
      accessToken: tokenCache.accessToken,
      cacheStatus: 'HIT',
      ttlSecondsRemaining: Math.max(0, Math.round((tokenCache.expiresAt - now) / 1000)),
    };
  }

  const credentialsBase64 = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const tokenUrl = process.env.EPO_OPS_TOKEN_URL || 'https://ops.epo.org/3.2/auth/accesstoken';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentialsBase64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`EPO OAuth2 Authentication Failed (HTTP ${response.status}): ${errText}`);
  }

  const payload = await response.json();
  const expiresInSeconds = Number(payload.expires_in) || 1200; // Default 20 minutes

  tokenCache = {
    accessToken: payload.access_token,
    issuedAt: now,
    expiresAt: now + expiresInSeconds * 1000,
  };

  return {
    accessToken: tokenCache.accessToken,
    cacheStatus: 'REFRESHED',
    ttlSecondsRemaining: expiresInSeconds,
  };
}

