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
    
    // Get all playlists first
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
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
    
    // Filter for specific playlists
    const targetPlaylistNames = [
      "LA Marathon",
      "ion play bout my lord & savior", 
      "in case I ever have a disco themed party"
    ];
    
    const filteredPlaylists = data.items
      .filter((playlist: SpotifyPlaylist) => 
        targetPlaylistNames.includes(playlist.name)
      )
      .map((playlist: SpotifyPlaylist) => ({
        id: playlist.id,
        name: playlist.name,
        images: playlist.images,
        tracks: { total: playlist.tracks.total }
      }));

    // Add a placeholder for Spotify Daylist (we'll need to get this separately)
    const daylistPlaylist = {
      id: 'daylist',
      name: 'Spotify Daylist',
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526' }], // Default daylist image
      tracks: { total: 0 }
    };

    return NextResponse.json({
      playlists: [...filteredPlaylists, daylistPlaylist]
    });
  } catch (error) {
    console.error('Spotify playlists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists. Please re-authorize at /spotify-auth' },
      { status: 500 }
    );
  }
} 