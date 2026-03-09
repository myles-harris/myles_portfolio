import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

export async function GET() {
  try {
    // Get all playlists first
    const response = await spotifyFetch('https://api.spotify.com/v1/me/playlists?limit=50');

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter for specific playlists
    const targetPlaylistNames = [
      "LA Marathon",
      "ion play bout my lord & savior", 
      "in case I ever have a disco themed party"
    ];
    
    const filteredPlaylists = data.items
      .filter((playlist: SpotifyPlaylist) => 
        targetPlaylistNames.includes(playlist.name)
      )
      .map((playlist: SpotifyPlaylist) => ({
        id: playlist.id,
        name: playlist.name,
        images: playlist.images,
        tracks: { total: playlist.tracks.total }
      }));

    // Find the actual Spotify Daylist
    const daylist = data.items.find((playlist: SpotifyPlaylist) => {
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

    // Add the actual daylist or a placeholder
    const daylistPlaylist = daylist ? {
      id: daylist.id,
      name: daylist.name,
      images: daylist.images,
      tracks: { total: daylist.tracks.total }
    } : {
      id: 'daylist',
      name: 'Spotify Daylist',
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526' }],
      tracks: { total: 0 }
    };

    return NextResponse.json({
      playlists: [...filteredPlaylists, daylistPlaylist]
    });
  } catch (error) {
    console.error('Spotify playlists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists. Please re-authorize at /spotify-auth' },
      { status: 500 }
    );
  }
} 