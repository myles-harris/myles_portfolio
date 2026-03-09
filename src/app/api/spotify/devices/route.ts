import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Try to get token from Authorization header first (from client localStorage)
    let accessToken = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    } else {
      // Fall back to environment variable
      accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Spotify access token available. Please authorize at /spotify-auth' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
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
        { error: 'Failed to fetch devices' },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ devices: data.devices });
  } catch (error) {
    console.error('Spotify devices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
} 