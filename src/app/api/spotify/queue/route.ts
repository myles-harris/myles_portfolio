import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export async function GET() {
  try {
    const response = await spotifyFetch('https://api.spotify.com/v1/me/player/queue');

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch queue' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Return the next track in queue
    return NextResponse.json({
      next_track: data.queue && data.queue.length > 0 ? data.queue[0] : null,
      queue: data.queue
    });
  } catch (error) {
    console.error('Spotify queue error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    );
  }
}
