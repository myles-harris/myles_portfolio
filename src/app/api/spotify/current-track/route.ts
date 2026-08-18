import { NextResponse } from 'next/server';
import { spotifyFetch, SpotifyAuthError } from '@/lib/spotify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await spotifyFetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
    );

    // 204 = nothing playing; 202 = no active device
    if (response.status === 204 || response.status === 202) {
      return NextResponse.json({ track: null, is_playing: false });
    }

    if (!response.ok) {
      console.error(`[spotify] currently-playing returned ${response.status}`);
      return NextResponse.json(
        { error: 'spotify_api_error', status: response.status },
        { status: 502 },
      );
    }

    const data = await response.json();

    // Podcast episodes have a different shape the tile doesn't understand
    if (!data.item || data.currently_playing_type !== 'track') {
      return NextResponse.json({ track: null, is_playing: Boolean(data.is_playing) });
    }

    // progress_ms lives at the top level of the response, not inside `item`
    return NextResponse.json({
      track: { ...data.item, progress_ms: data.progress_ms ?? 0 },
      is_playing: Boolean(data.is_playing),
    });
  } catch (error) {
    if (error instanceof SpotifyAuthError) {
      console.error('[spotify]', error.message);
      return NextResponse.json({ error: 'not_authorized', message: error.message }, { status: 503 });
    }
    console.error('[spotify] current track error:', error);
    return NextResponse.json({ error: 'unexpected_error' }, { status: 500 });
  }
}
