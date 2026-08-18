import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getRedirectUri } from '@/lib/spotify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'spotify_oauth_state';

const SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-private',
  'user-read-email',
].join(' ');

export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Spotify client ID not configured' },
      { status: 500 },
    );
  }

  const redirectUri = getRedirectUri(request);
  const state = randomBytes(16).toString('hex');

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state,
  })}`;

  // Echo redirectUri in the response body — useful for debugging dashboard mismatches.
  const response = NextResponse.json({ authUrl, redirectUri });

  // SameSite=Lax is required: the callback arrives as a top-level cross-site
  // GET navigation from accounts.spotify.com.
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });

  return response;
}
