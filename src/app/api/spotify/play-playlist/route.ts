import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Spotify access token not configured' },
        { status: 500 }
      );
    }

    const { playlist_id } = await request.json();
    
    if (!playlist_id) {
      return NextResponse.json(
        { error: 'Playlist ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: `spotify:playlist:${playlist_id}`
      }),
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Spotify play playlist error:', error);
    return NextResponse.json(
      { error: 'Failed to play playlist' },
      { status: 500 }
    );
  }
} 