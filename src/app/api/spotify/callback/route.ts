import { NextRequest, NextResponse } from 'next/server';
import { getRedirectUri } from '@/lib/spotify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'spotify_oauth_state';

async function writeEnvLocal(entries: Record<string, string>): Promise<void> {
  const { readFile, writeFile } = await import('fs/promises');
  const { join } = await import('path');
  const envPath = join(process.cwd(), '.env.local');

  let content = '';
  try {
    content = await readFile(envPath, 'utf-8');
  } catch {
    // File doesn't exist yet — we'll create it.
  }

  for (const [key, value] of Object.entries(entries)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, 'm');
    content = pattern.test(content)
      ? content.replace(pattern, line)
      : `${content.replace(/\n*$/, '\n')}${line}\n`;
  }

  await writeFile(envPath, content, 'utf-8');
}

function redirectToAuthPage(request: NextRequest, params: Record<string, string>) {
  const origin = new URL(getRedirectUri(request)).origin;
  const target = new URL('/spotify-auth', origin);
  for (const [key, value] of Object.entries(params)) {
    target.searchParams.set(key, value);
  }

  const response = NextResponse.redirect(target.toString());
  response.cookies.delete(STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  if (error) {
    return redirectToAuthPage(request, { error });
  }

  if (!code) {
    return redirectToAuthPage(request, { error: 'missing_code' });
  }

  // CSRF check: the state we handed to Spotify must match the httpOnly cookie
  // set by /api/spotify/auth.
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;
  if (!expectedState || !state || state !== expectedState) {
    return redirectToAuthPage(request, { error: 'state_mismatch' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectToAuthPage(request, { error: 'credentials_not_configured' });
  }

  const redirectUri = getRedirectUri(request);

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      console.error('[spotify] code exchange failed:', await tokenResponse.text());
      return redirectToAuthPage(request, { error: 'token_exchange_failed' });
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      refresh_token?: string;
    };

    if (!tokenData.refresh_token) {
      console.error('[spotify] no refresh_token in token response');
      return redirectToAuthPage(request, { error: 'no_refresh_token' });
    }

    // The refresh token is the only thing worth keeping. In production the
    // filesystem is read-only — log it and copy it into your host's env vars.
    if (process.env.NODE_ENV === 'production') {
      console.log(
        '[spotify] authorization complete. Set this as SPOTIFY_REFRESH_TOKEN in your ' +
          'environment variables and redeploy:\n' +
          tokenData.refresh_token,
      );
    } else {
      try {
        await writeEnvLocal({ SPOTIFY_REFRESH_TOKEN: tokenData.refresh_token });
        console.log('[spotify] SPOTIFY_REFRESH_TOKEN written to .env.local — restart the dev server');
      } catch (fileError) {
        console.error('[spotify] could not write .env.local:', fileError);
        console.log('[spotify] SPOTIFY_REFRESH_TOKEN=' + tokenData.refresh_token);
      }
    }

    process.env.SPOTIFY_REFRESH_TOKEN = tokenData.refresh_token;

    return redirectToAuthPage(request, { success: 'true' });
  } catch (err) {
    console.error('[spotify] callback error:', err);
    return redirectToAuthPage(request, { error: 'callback_failed' });
  }
}
