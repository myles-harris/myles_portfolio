import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback';
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'Spotify client ID not configured' },
      { status: 500 }
    );
  }

  const scopes = [
    'playlist-read-private', 'playlist-read-collaborative', 'user-read-currently-playing',
    'user-read-playback-state', 'user-modify-playback-state', 'user-read-private', 'user-read-email'
  ].join(' ');

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code', client_id: clientId, scope: scopes, redirect_uri: redirectUri,
    state: Math.random().toString(36).substring(7)
  })}`;

  return NextResponse.json({ authUrl });
} 