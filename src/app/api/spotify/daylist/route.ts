import { NextResponse } from 'next/server';

interface SpotifyDaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

async function getValidAccessToken() {
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('No Spotify access token available');
  }
  return accessToken;
}

export async function GET() {
  try {
    const accessToken = await getValidAccessToken();
    
    // First, get all user's playlists to find the daylist
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Access token expired');
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Look for a playlist that contains "daylist" in the name (case insensitive)
    const daylist = data.items.find((playlist: any) => {
      const name = playlist.name.toLowerCase();
      
      // Check for explicit daylist keywords
      if (name.includes('daylist') || name.includes('daily')) {
        return true;
      }
      
      // Check for the dynamic daylist pattern: descriptive words + day + time
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const timePeriods = ['early morning', 'morning', 'afternoon', 'evening', 'night', 'late night'];
      
      // Check if the playlist name contains a day of the week
      const hasDay = days.some(day => name.includes(day));
      
      // Check if the playlist name contains a time period
      const hasTimePeriod = timePeriods.some(time => name.includes(time));
      
      // If it has both a day and time period, it's likely a daylist
      if (hasDay && hasTimePeriod) {
        return true;
      }
      
      // Also check for common daylist descriptive words
      const descriptiveWords = ['cool', 'collaboration', 'vibes', 'mood', 'energy', 'flow', 'groove', 'chill', 'upbeat', 'relaxed', 'focused', 'creative', 'productive'];
      const hasDescriptiveWord = descriptiveWords.some(word => name.includes(word));
      
      // If it has a descriptive word and either a day or time period, it might be a daylist
      if (hasDescriptiveWord && (hasDay || hasTimePeriod)) {
        return true;
      }
      
      return false;
    });

    if (!daylist) {
      // Return a default daylist if none found
      return NextResponse.json({
        daylist: {
          id: 'daylist',
          name: 'Spotify Daylist',
          images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526' }],
          tracks: { total: 0 }
        }
      });
    }

    return NextResponse.json({
      daylist: {
        id: daylist.id,
        name: daylist.name,
        images: daylist.images,
        tracks: { total: daylist.tracks.total }
      }
    });
  } catch (error) {
    console.error('Spotify daylist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daylist. Please re-authorize at /spotify-auth' },
      { status: 500 }
    );
  }
} 