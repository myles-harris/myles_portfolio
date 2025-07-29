import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Spotify access token available' },
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
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Access token expired' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch current track' },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      track: data.item,
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