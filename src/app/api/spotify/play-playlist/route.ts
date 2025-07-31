import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { playlistId, deviceId } = await request.json();
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Spotify access token available' },
        { status: 500 }
      );
    }

    // First, set shuffle to true
    const shuffleResponse = await fetch('https://api.spotify.com/v1/me/player/shuffle?state=true', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!shuffleResponse.ok && shuffleResponse.status !== 204) {
      console.error('Failed to set shuffle:', shuffleResponse.status);
    }

    // Then start playing the playlist
    const playResponse = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: `spotify:playlist:${playlistId}`,
        device_id: deviceId || null
      }),
    });

    if (!playResponse.ok) {
      if (playResponse.status === 401) {
        return NextResponse.json(
          { error: 'Access token expired' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to start playback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Spotify play playlist error:', error);
    return NextResponse.json(
      { error: 'Failed to start playlist' },
      { status: 500 }
    );
  }
} 