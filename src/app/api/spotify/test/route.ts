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

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Spotify API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        display_name: data.display_name,
        email: data.email
      }
    });
  } catch (error) {
    console.error('Spotify test error:', error);
    return NextResponse.json(
      { error: 'Failed to test Spotify connection' },
      { status: 500 }
    );
  }
} 