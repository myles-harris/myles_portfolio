import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

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

    // Save tokens to .env.local file
    try {
      const envPath = join(process.cwd(), '.env.local');
      const envContent = await readFile(envPath, 'utf-8');

      // Replace the token lines
      let updatedContent = envContent.replace(
        /SPOTIFY_ACCESS_TOKEN=.*/,
        `SPOTIFY_ACCESS_TOKEN=${tokenData.access_token}`
      );
      updatedContent = updatedContent.replace(
        /SPOTIFY_REFRESH_TOKEN=.*/,
        `SPOTIFY_REFRESH_TOKEN=${tokenData.refresh_token}`
      );

      await writeFile(envPath, updatedContent, 'utf-8');

      // Update process.env for immediate use
      process.env.SPOTIFY_ACCESS_TOKEN = tokenData.access_token;
      process.env.SPOTIFY_REFRESH_TOKEN = tokenData.refresh_token;

      console.log('✅ Tokens saved to .env.local successfully');
    } catch (fileError) {
      console.error('Failed to update .env.local:', fileError);
      // Continue anyway - tokens will be in memory
      process.env.SPOTIFY_ACCESS_TOKEN = tokenData.access_token;
      process.env.SPOTIFY_REFRESH_TOKEN = tokenData.refresh_token;
    }

    // Redirect back to spotify-auth page with success message
    // Force 127.0.0.1 to match the redirect URI
    const redirectUrl = new URL('/spotify-auth', 'http://127.0.0.1:3000');
    redirectUrl.searchParams.set('success', 'true');

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Spotify callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process authorization callback' },
      { status: 500 }
    );
  }
} 