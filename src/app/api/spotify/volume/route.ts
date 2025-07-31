import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { volume_percent, device_id } = await request.json();
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Spotify access token available' },
        { status: 500 }
      );
    }

    if (volume_percent < 0 || volume_percent > 100) {
      return NextResponse.json(
        { error: 'Volume must be between 0 and 100' },
        { status: 400 }
      );
    }

    const url = new URL('https://api.spotify.com/v1/me/player/volume');
    url.searchParams.set('volume_percent', volume_percent.toString());
    if (device_id) {
      url.searchParams.set('device_id', device_id);
    }

    const response = await fetch(url.toString(), {
      method: 'PUT',
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
        { error: 'Failed to set volume' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Spotify volume error:', error);
    return NextResponse.json(
      { error: 'Failed to set volume' },
      { status: 500 }
    );
  }
} 