import { NextRequest, NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playlistId = params.id;

    const response = await spotifyFetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch playlist tracks' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract just the track info from the items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tracks = data.items.map((item: any) => item.track);

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Spotify playlist tracks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist tracks' },
      { status: 500 }
    );
  }
}
