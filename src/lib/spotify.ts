import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Get a valid Spotify access token, refreshing if necessary
 */
export async function getValidAccessToken(): Promise<string | null> {
  let accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  // If no access token, return null
  if (!accessToken) {
    console.log('No access token found in environment');
    return null;
  }

  // Try to use the token - if it fails with 401, we'll refresh
  // This is a simple approach - in production, you might want to track expiration time
  return accessToken;
}

/**
 * Refresh the Spotify access token using the refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Spotify client credentials not configured');
      return null;
    }

    console.log('Refreshing access token...');

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
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;

    // Update .env.local file with new access token
    try {
      const envPath = join(process.cwd(), '.env.local');
      const envContent = await readFile(envPath, 'utf-8');

      // Replace the access token line
      const updatedContent = envContent.replace(
        /SPOTIFY_ACCESS_TOKEN=.*/,
        `SPOTIFY_ACCESS_TOKEN=${newAccessToken}`
      );

      await writeFile(envPath, updatedContent, 'utf-8');
      console.log('✅ Access token refreshed and saved to .env.local');
    } catch (fileError) {
      console.error('Failed to update .env.local:', fileError);
    }

    // Update process.env for immediate use
    process.env.SPOTIFY_ACCESS_TOKEN = newAccessToken;

    return newAccessToken;
  } catch (error) {
    console.error('Refresh token error:', error);
    return null;
  }
}

/**
 * Make a Spotify API request with automatic token refresh on 401
 */
export async function spotifyFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Add authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // Make the request
  let response = await fetch(url, { ...options, headers });

  // If 401, try refreshing the token and retry once
  if (response.status === 401) {
    console.log('Token expired, refreshing...');
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new Error('Failed to refresh access token');
    }

    // Retry with new token
    headers['Authorization'] = `Bearer ${newToken}`;
    response = await fetch(url, { ...options, headers });
  }

  return response;
}
