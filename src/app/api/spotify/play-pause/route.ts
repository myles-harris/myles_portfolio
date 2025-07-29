import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Spotify access token not configured' },
        { status: 500 }
      );
    }

    const { action } = await request.json();
    
    if (!action || (action !== 'play' && action !== 'pause')) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "play" or "pause"' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Spotify play/pause error:', error);
    return NextResponse.json(
      { error: 'Failed to control playback' },
      { status: 500 }
    );
  }
} 