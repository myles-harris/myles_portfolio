import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Spotify access token found' },
        { status: 500 }
      );
    }

    // Test the token by fetching user profile
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: `Spotify API error: ${response.status}`,
          details: errorText,
          token: accessToken.substring(0, 20) + '...' // Show first 20 chars for debugging
        },
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
      { error: 'Failed to test Spotify token' },
      { status: 500 }
    );
  }
} 