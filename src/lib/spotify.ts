const TOKEN_URL = 'https://accounts.spotify.com/api/token';

const EXPIRY_BUFFER_MS = 60_000;

export class SpotifyAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpotifyAuthError';
  }
}

let cachedToken: { value: string; expiresAt: number } | null = null;
let inFlightRefresh: Promise<string | null> | null = null;

function getClientCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function hasSpotifyCredentials(): boolean {
  return Boolean(getClientCredentials() && process.env.SPOTIFY_REFRESH_TOKEN);
}

export function getRedirectUri(request?: Request): string {
  const explicit = process.env.SPOTIFY_REDIRECT_URI;
  if (explicit) return explicit;

  if (request) {
    const url = new URL(request.url);
    const proto =
      request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '');
    const host =
      request.headers.get('x-forwarded-host') ??
      request.headers.get('host') ??
      url.host;
    return `${proto}://${host}/api/spotify/callback`;
  }

  // Spotify no longer accepts bare `http://localhost` — use the 127.0.0.1 literal.
  return 'http://127.0.0.1:3000/api/spotify/callback';
}

function basicAuthHeader(clientId: string, clientSecret: string): string {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
}

async function performRefresh(): Promise<string | null> {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refreshToken) {
    console.error('[spotify] SPOTIFY_REFRESH_TOKEN is not set — re-authorize at /spotify-auth');
    return null;
  }

  const creds = getClientCredentials();
  if (!creds) {
    console.error('[spotify] SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET are not configured');
    return null;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader(creds.clientId, creds.clientSecret),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      // 400 invalid_grant means the refresh token was revoked or client secret rotated
      console.error(`[spotify] token refresh failed (${response.status}):`, await response.text());
      cachedToken = null;
      return null;
    }

    const data = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      refresh_token?: string;
    };

    if (!data.access_token) {
      console.error('[spotify] token response contained no access_token');
      return null;
    }

    cachedToken = {
      value: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    };

    if (data.refresh_token && data.refresh_token !== refreshToken) {
      console.warn(
        '[spotify] a rotated refresh token was issued. Update SPOTIFY_REFRESH_TOKEN to:',
        data.refresh_token,
      );
    }

    return cachedToken.value;
  } catch (error) {
    console.error('[spotify] token refresh threw:', error);
    return null;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  if (inFlightRefresh) return inFlightRefresh;
  inFlightRefresh = performRefresh().finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}

export async function getValidAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - EXPIRY_BUFFER_MS) {
    return cachedToken.value;
  }

  const refreshed = await refreshAccessToken();
  if (refreshed) return refreshed;

  // Legacy bootstrap: try a hand-pasted access token rather than hard-failing.
  // Remove once fully migrated.
  const legacy = process.env.SPOTIFY_ACCESS_TOKEN;
  if (legacy) {
    console.warn('[spotify] falling back to SPOTIFY_ACCESS_TOKEN — this expires within the hour');
    return legacy;
  }

  return null;
}

export function invalidateAccessToken(): void {
  cachedToken = null;
}

export async function spotifyFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getValidAccessToken();
  if (!token) {
    throw new SpotifyAuthError('No Spotify access token available. Re-authorize at /spotify-auth');
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  let response = await fetch(url, { ...options, headers, cache: 'no-store' });

  if (response.status === 401) {
    invalidateAccessToken();
    const newToken = await refreshAccessToken();
    if (!newToken) {
      throw new SpotifyAuthError('Access token expired and refresh failed. Re-authorize at /spotify-auth');
    }
    headers.Authorization = `Bearer ${newToken}`;
    response = await fetch(url, { ...options, headers, cache: 'no-store' });
  }

  return response;
}
