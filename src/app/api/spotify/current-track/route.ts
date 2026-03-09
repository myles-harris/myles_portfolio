import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const response = await spotifyFetch('https://api.spotify.com/v1/me/player/currently-playing');

    if (response.status === 204) {
      // No content - nothing is currently playing
      return NextResponse.json({
        track: null,
        is_playing: false
      });
    }

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