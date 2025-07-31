import { NextResponse } from 'next/server';

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

async function getValidAccessToken() {
  // Use the new access token from the successful OAuth flow
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('No Spotify access token available');
  }
  return accessToken;
}

export async function GET() {
  try {
    const accessToken = await getValidAccessToken();
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        throw new Error('Access token expired');
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      playlists: data.items.map((playlist: SpotifyPlaylist) => ({
        id: playlist.id,
        name: playlist.name,
        images: playlist.images,
        tracks: { total: playlist.tracks.total }
      }))
    });
  } catch (error) {
    console.error('Spotify playlists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists. Please re-authorize at /spotify-auth' },
      { status: 500 }
    );
  }
} 