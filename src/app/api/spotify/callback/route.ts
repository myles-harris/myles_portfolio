import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json(
      { error: `Authorization failed: ${error}` },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback';

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Spotify client credentials not configured' },
        { status: 500 }
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code for tokens' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    
    // Store tokens securely (in production, use a database)
    // For now, we'll return them to be stored by the client
    return NextResponse.json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type
    });

  } catch (error) {
    console.error('Spotify callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process authorization callback' },
      { status: 500 }
    );
  }
} 