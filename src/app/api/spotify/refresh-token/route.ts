import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST() {
  try {
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 400 }
      );
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Spotify client credentials not configured' },
        { status: 500 }
      );
    }

    // Exchange refresh token for new access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token refresh error:', errorData);
      return NextResponse.json(
        { error: 'Failed to refresh access token' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Update .env.local file with new access token
    try {
      const envPath = join(process.cwd(), '.env.local');
      const envContent = await readFile(envPath, 'utf-8');

      // Replace the access token line
      const updatedContent = envContent.replace(
        /SPOTIFY_ACCESS_TOKEN=.*/,
        `SPOTIFY_ACCESS_TOKEN=${data.access_token}`
      );

      await writeFile(envPath, updatedContent, 'utf-8');

      // Also update the process.env for immediate use
      process.env.SPOTIFY_ACCESS_TOKEN = data.access_token;

      return NextResponse.json({
        success: true,
        message: 'Access token refreshed successfully',
        expires_in: data.expires_in
      });
    } catch (fileError) {
      console.error('Failed to update .env.local:', fileError);
      // Still return success if token refresh worked, even if file write failed
      process.env.SPOTIFY_ACCESS_TOKEN = data.access_token;
      return NextResponse.json({
        success: true,
        message: 'Access token refreshed (in memory only)',
        expires_in: data.expires_in
      });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

// Import readFile
import { readFile } from 'fs/promises';
