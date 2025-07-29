import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Spotify access token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 204) {
        // No track currently playing
        return NextResponse.json({
          track: null,
          is_playing: false
        });
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.item) {
      return NextResponse.json({
        track: null,
        is_playing: false
      });
    }

    return NextResponse.json({
      track: {
        id: data.item.id,
        name: data.item.name,
        artists: data.item.artists,
        album: data.item.album,
        duration_ms: data.item.duration_ms
      },
      is_playing: data.is_playing
    });
  } catch (error) {
    console.error('Spotify current track error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current track' },
      { status: 500 }
    );
  }
} 