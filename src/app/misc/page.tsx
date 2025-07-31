"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import NavLogo from '@/components/NavLogo';
import BackgroundVideo from '@/components/BackgroundVideo';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  onMove: (id: string, x: number, y: number) => void;
}

function DraggableWindow({ id, title, children, position, onMove }: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onMove(id, newX, newY);
    }
  }, [isDragging, dragOffset, onMove, id]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  // Different sizes for different windows
  const getWindowSize = () => {
    if (title.includes('Training')) {
      return 'min-w-[350px] min-h-[250px]';
    }
    return 'min-w-[400px] min-h-[300px]';
  };

  return (
    <div
      ref={windowRef}
      className={`absolute bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 cursor-move ${getWindowSize()}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 1000 : 10,
        userSelect: isDragging ? 'none' : 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-6 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default function Misc() {
  const [windows, setWindows] = useState([
    {
      id: 'spotify',
      title: 'Spotify Player',
      position: { x: 50, y: 50 },
      isOpen: true,
    },
    {
      id: 'training',
      title: 'Marathon Training Plan',
      position: { x: 500, y: 100 },
      isOpen: true,
    },
    {
      id: 'github',
      title: 'GitHub Activity',
      position: { x: 200, y: 400 },
      isOpen: true,
    },
  ]);

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, position: { x, y } } : window
    ));
  };

  return (
    <>
      <BackgroundVideo />
      <NavLogo />
      <main className="min-h-screen relative overflow-hidden">

        {/* Draggable Windows */}
        {windows.filter(w => w.isOpen).map(window => (
          <DraggableWindow
            key={window.id}
            id={window.id}
            title={window.title}
            position={window.position}
            onMove={moveWindow}
          >
            {window.id === 'spotify' && <SpotifyWindow />}
            {window.id === 'training' && <TrainingWindow />}
            {window.id === 'github' && <GitHubWindow />}
          </DraggableWindow>
        ))}
    </main>
    </>
  );
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  volume_percent: number;
}

function SpotifyWindow() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(50);

  useEffect(() => {
    fetchSpotifyData();
    fetchDevices();
  }, []);

  const fetchSpotifyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch playlists
      const playlistsResponse = await fetch('/api/spotify/playlists');
      if (!playlistsResponse.ok) {
        throw new Error('Failed to fetch playlists');
      }
      const playlistsData = await playlistsResponse.json();
      setPlaylists(playlistsData.playlists || []);

      // Fetch current track
      const currentTrackResponse = await fetch('/api/spotify/current-track');
      if (currentTrackResponse.ok) {
        const trackData = await currentTrackResponse.json();
        setCurrentTrack(trackData.track);
        setIsPlaying(trackData.is_playing);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Spotify data');
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/spotify/devices');
      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
        
        // Auto-select the user's current device (Computer)
        const currentDevice = data.devices?.find((device: SpotifyDevice) => 
          device.type === 'Computer' || 
          device.name.toLowerCase().includes('mac') ||
          device.name.toLowerCase().includes('windows') ||
          device.name.toLowerCase().includes('chrome') ||
          device.name.toLowerCase().includes('safari') ||
          device.name.toLowerCase().includes('firefox')
        );
        
        if (currentDevice) {
          setSelectedDevice(currentDevice.id);
        } else if (data.devices && data.devices.length > 0) {
          // Fallback to first available device
          setSelectedDevice(data.devices[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    }
  };

  const handlePlayPause = async () => {
    try {
      const response = await fetch('/api/spotify/play-pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isPlaying ? 'pause' : 'play' }),
      });

      if (response.ok) {
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      console.error('Failed to toggle play/pause:', err);
    }
  };

  const handlePlaylistSelect = async (playlistId: string) => {
    try {
      setSelectedPlaylist(playlistId);
      const response = await fetch('/api/spotify/play-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playlistId: playlistId,
          deviceId: selectedDevice 
        }),
      });

      if (response.ok) {
        setIsPlaying(true);
        // Refresh current track after a short delay
        setTimeout(fetchSpotifyData, 1000);
      }
    } catch (err) {
      console.error('Failed to play playlist:', err);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    try {
      setVolume(newVolume);
      const response = await fetch('/api/spotify/volume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          volume_percent: newVolume,
          device_id: selectedDevice 
        }),
      });

      if (!response.ok) {
        console.error('Failed to set volume');
      }
    } catch (err) {
      console.error('Failed to set volume:', err);
    }
  };

  const handleMuteToggle = async () => {
    try {
      if (isMuted) {
        // Unmute - restore previous volume
        await handleVolumeChange(previousVolume);
        setIsMuted(false);
      } else {
        // Mute - save current volume and set to 0
        setPreviousVolume(volume);
        await handleVolumeChange(0);
        setIsMuted(true);
      }
    } catch (err) {
      console.error('Failed to toggle mute:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-red-500 text-center mb-4">
          <p className="text-sm font-medium">Spotify API Error</p>
          <p className="text-xs opacity-75">{error}</p>
        </div>
        <button
          onClick={fetchSpotifyData}
          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Current Device Indicator */}
      {selectedDevice && (
        <div className="mb-3 text-xs text-gray-500 flex items-center">
          <span className="mr-1">🎵</span>
          Playing on: {devices.find(d => d.id === selectedDevice)?.name || 'Your device'}
        </div>
      )}

      {/* Volume Controls */}
      <div className="mb-4 flex items-center space-x-3">
        <button
          onClick={handleMuteToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
            isMuted 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <span className="text-xs text-gray-600 w-8 text-center">
          {isMuted ? 0 : volume}%
        </span>
      </div>

      {/* Playlists */}
      <div className="mb-6">
        <h4 className="text-gray-900 font-semibold mb-4 text-xl">My Playlists</h4>
        <div className="grid grid-cols-1 gap-3">
          {playlists.map((playlist) => {
            const name = playlist.name.toLowerCase();
            
            // Check for explicit daylist keywords
            const hasDaylistKeyword = name.includes('daylist') || name.includes('daily');
            
            // Check for the dynamic daylist pattern: descriptive words + day + time
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const timePeriods = ['early morning', 'morning', 'afternoon', 'evening', 'night', 'late night'];
            
            // Check if the playlist name contains a day of the week
            const hasDay = days.some(day => name.includes(day));
            
            // Check if the playlist name contains a time period
            const hasTimePeriod = timePeriods.some(time => name.includes(time));
            
            // Also check for common daylist descriptive words
            const descriptiveWords = ['cool', 'collaboration', 'vibes', 'mood', 'energy', 'flow', 'groove', 'chill', 'upbeat', 'relaxed', 'focused', 'creative', 'productive'];
            const hasDescriptiveWord = descriptiveWords.some(word => name.includes(word));
            
            const isDaylist = hasDaylistKeyword || 
                             (hasDay && hasTimePeriod) ||
                             (hasDescriptiveWord && (hasDay || hasTimePeriod));
            
            return (
              <button
                key={playlist.id}
                onClick={() => handlePlaylistSelect(playlist.id)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border text-left ${
                  selectedPlaylist === playlist.id
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : isDaylist 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 hover:from-purple-100 hover:to-pink-100'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {playlist.images[0] && (
                    <Image
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      width={32}
                      height={32}
                      className="rounded-md"
                      unoptimized
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      {playlist.name}
                      {isDaylist && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {playlist.tracks.total} tracks
                      {isDaylist && ' • Updates throughout the day'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {isDaylist ? '🎵' : '🔀'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Current Track */}
      <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 flex flex-col justify-center items-center border border-green-200">
        <div className="text-center">
          {currentTrack ? (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                {currentTrack.album.images[0] ? (
                  <Image 
                    src={currentTrack.album.images[0].url} 
                    alt="Album cover"
                    width={80}
                    height={80}
                    className="w-full h-full rounded-xl object-cover"
                    unoptimized
                    onError={(e) => {
                      // Fallback to music icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('span');
                        fallback.className = 'text-white text-3xl';
                        fallback.textContent = '♪';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <span className="text-white text-3xl">♪</span>
                )}
              </div>
              <h5 className="text-gray-900 font-semibold mb-2 text-lg">{currentTrack.name}</h5>
              <p className="text-gray-600 text-sm mb-6">{currentTrack.artists.map(a => a.name).join(', ')}</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-3xl">♪</span>
              </div>
              <h5 className="text-gray-900 font-semibold mb-2 text-lg">No track playing</h5>
              <p className="text-gray-600 text-sm mb-6">Select a playlist to start</p>
            </>
          )}
          
          <div className="flex items-center justify-center space-x-4">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all duration-200 shadow-sm">
              ⏮
            </button>
            <button 
              onClick={handlePlayPause}
              className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-xl shadow-lg"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all duration-200 shadow-sm">
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainingWindow() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [currentWeek, setCurrentWeek] = useState(1);
  
  const trainingPlan = [
    {
      week: 1,
      dates: 'Jul 22–28',
      mileage: '20–22 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '4 mi EZ + 6×20" strides', type: 'easy' },
        { day: 'Wed', workout: '3–4 mi EZ (or XT 40\')', type: 'easy' },
        { day: 'Thu', workout: '5 mi EZ rolling hills', type: 'easy' },
        { day: 'Fri', workout: 'XT 30–40\' + mobility', type: 'xt' },
        { day: 'Sat', workout: '4 mi EZ + 6×10" hill sprints', type: 'easy' },
        { day: 'Sun', workout: 'LR 8–9 mi EZ (last 2 mi steady but NOT hard)', type: 'long' }
      ]
    },
    {
      week: 2,
      dates: 'Jul 29–Aug 4',
      mileage: '26–28 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '5 mi EZ + 6×20" strides', type: 'easy' },
        { day: 'Wed', workout: '4 mi EZ or XT 45\'', type: 'easy' },
        { day: 'Thu', workout: '6 mi w/ 2×8\' @ T (6:25–6:35) w/ 3\' jog', type: 'tempo' },
        { day: 'Fri', workout: 'XT 30\' + mobility', type: 'xt' },
        { day: 'Sat', workout: '4 mi EZ + 6×10" hill sprints', type: 'easy' },
        { day: 'Sun', workout: 'LR 10–11 mi EZ', type: 'long' }
      ]
    },
    {
      week: 3,
      dates: 'Aug 5–11',
      mileage: '32–34 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '6 mi EZ + strides', type: 'easy' },
        { day: 'Wed', workout: '5 mi EZ or XT 45\'', type: 'easy' },
        { day: 'Thu', workout: '7 mi w/ 3×7\' @ T (3\' jog)', type: 'tempo' },
        { day: 'Fri', workout: '3–4 mi recovery', type: 'recovery' },
        { day: 'Sat', workout: '5 mi EZ w/ rolling hills', type: 'easy' },
        { day: 'Sun', workout: 'LR 12 mi EZ (last 3 mi steady ~7:30–7:40)', type: 'long' }
      ]
    },
    {
      week: 4,
      dates: 'Aug 12–18',
      mileage: '38–40 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '7 mi: 6×800m @ I (5:55–6:10) w/ 400m jog + WU/CD', type: 'interval' },
        { day: 'Wed', workout: '5 mi EZ or XT 45\'', type: 'easy' },
        { day: 'Thu', workout: '6 mi EZ + strides', type: 'easy' },
        { day: 'Fri', workout: '4 mi recovery + mobility', type: 'recovery' },
        { day: 'Sat', workout: '5 mi EZ + 8×10" hill sprints', type: 'easy' },
        { day: 'Sun', workout: 'LR 13–14 mi EZ', type: 'long' }
      ]
    },
    {
      week: 5,
      dates: 'Aug 19–25',
      mileage: '44–46 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '7 mi w/ 4×6\' @ T (2\' jog)', type: 'tempo' },
        { day: 'Wed', workout: '6 mi EZ', type: 'easy' },
        { day: 'Thu', workout: '7 mi EZ w/ last 2 mi @ MP (6:50)', type: 'marathon-pace' },
        { day: 'Fri', workout: 'XT 45\' or 4 mi recovery', type: 'xt' },
        { day: 'Sat', workout: '5 mi EZ + strides', type: 'easy' },
        { day: 'Sun', workout: 'LR 15 mi (first 10 EZ, last 5 steady ~7:15–7:25)', type: 'long' }
      ]
    },
    {
      week: 6,
      dates: 'Aug 26–Sep 1',
      mileage: '50 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '8 mi: 5×1k @ I (5:55–6:05) w/ 400m jog + WU/CD', type: 'interval' },
        { day: 'Wed', workout: '6 mi EZ or XT 45\'', type: 'easy' },
        { day: 'Thu', workout: '7 mi EZ + strides', type: 'easy' },
        { day: 'Fri', workout: '5 mi recovery', type: 'recovery' },
        { day: 'Sat', workout: '6 mi EZ + 10×10" hill sprints', type: 'easy' },
        { day: 'Sun', workout: 'LR 16 mi EZ', type: 'long' }
      ]
    },
    {
      week: 7,
      dates: 'Sep 2–8',
      mileage: '55 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '9 mi w/ 3×12\' @ T (3\' jog)', type: 'tempo' },
        { day: 'Wed', workout: '6 mi EZ', type: 'easy' },
        { day: 'Thu', workout: '8 mi EZ w/ last 3 mi @ MP', type: 'marathon-pace' },
        { day: 'Fri', workout: '4–5 mi recovery + mobility', type: 'recovery' },
        { day: 'Sat', workout: '6 mi EZ + strides', type: 'easy' },
        { day: 'Sun', workout: 'LR 17 mi (include 2×3 mi @ MP w/ 1 mi EZ between)', type: 'long' }
      ]
    },
    {
      week: 8,
      dates: 'Sep 9–15',
      mileage: 'Peak 60 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '9 mi: 6×1k @ I OR 5×1200m @ I (full jog rec)', type: 'interval' },
        { day: 'Wed', workout: '7 mi EZ or XT 50\'', type: 'easy' },
        { day: 'Thu', workout: 'Medium-Long 10 mi EZ (last 2 mi steady)', type: 'easy' },
        { day: 'Fri', workout: '5 mi recovery', type: 'recovery' },
        { day: 'Sat', workout: '6 mi EZ + 8×20" strides', type: 'easy' },
        { day: 'Sun', workout: 'LR 18 mi (first 12 EZ, last 6 @ MP)', type: 'long' }
      ]
    },
    {
      week: 9,
      dates: 'Sep 16–22',
      mileage: '58 mi',
      runs: [
        { day: 'Mon', workout: 'Rest + S&C', type: 'rest' },
        { day: 'Tue', workout: '9 mi: 5×5\' @ T (2\' jog) + strides', type: 'tempo' },
        { day: 'Wed', workout: '7 mi EZ', type: 'easy' },
        { day: 'Thu', workout: '9 mi EZ w/ last 4 mi progressive to MP-10"', type: 'marathon-pace' },
        { day: 'Fri', workout: '4–5 mi recovery + mobility', type: 'recovery' },
        { day: 'Sat', workout: '6 mi EZ + 6×10" hill sprints', type: 'easy' },
        { day: 'Sun', workout: 'LR 16 mi w/ 10 mi steady (7:10–7:20)', type: 'long' }
      ]
    },
    {
      week: 10,
      dates: 'Sep 23–29',
      mileage: 'Taper 1 (~48 mi)',
      runs: [
        { day: 'Mon', workout: 'Rest + light S&C (cut volume 50%)', type: 'rest' },
        { day: 'Tue', workout: '8 mi: 4×1k @ I (just touch speed) + strides', type: 'interval' },
        { day: 'Wed', workout: '6 mi EZ', type: 'easy' },
        { day: 'Thu', workout: '8 mi w/ 2×3 mi @ MP (2\' jog)', type: 'marathon-pace' },
        { day: 'Fri', workout: '4 mi recovery', type: 'recovery' },
        { day: 'Sat', workout: '5 mi EZ + 4×20" strides', type: 'easy' },
        { day: 'Sun', workout: 'LR 13–14 mi EZ', type: 'long' }
      ]
    },
    {
      week: 11,
      dates: 'Sep 30–Oct 5',
      mileage: 'Race Week (~32–34 mi)',
      runs: [
        { day: 'Mon', workout: 'Rest + mobility only', type: 'rest' },
        { day: 'Tue', workout: '6 mi EZ + 6×20" strides', type: 'easy' },
        { day: 'Wed', workout: '5 mi EZ', type: 'easy' },
        { day: 'Thu', workout: '4 mi w/ 2×1 mi @ MP (2\' jog)', type: 'marathon-pace' },
        { day: 'Fri', workout: '3 mi shakeout', type: 'recovery' },
        { day: 'Sat', workout: 'OFF or 2 mi jog + strides (if you like)', type: 'rest' },
        { day: 'Sun', workout: 'RACE – 26.2 mi @ 6:52/mi goal', type: 'race' }
      ]
    }
  ];

  const toggleCompleted = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Week Selector */}
      <div className="mb-4">
        <div className="flex space-x-1 overflow-x-auto pb-1">
          {trainingPlan.map((week) => (
            <button
              key={week.week}
              onClick={() => setCurrentWeek(week.week)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                currentWeek === week.week
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              W{week.week}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {trainingPlan.filter(w => w.week === currentWeek).map((week) => (
          <div key={week.week}>
            <div className="mb-3">
              <h4 className="text-gray-900 font-semibold text-base mb-1">
                Week {week.week} ({week.dates})
              </h4>
              <p className="text-gray-600 text-xs">{week.mileage}</p>
            </div>

            <div className="space-y-2">
              {week.runs.map((run) => {
                const id = `week${week.week}-${run.day}`;
                const isCompleted = completed.has(id);
                return (
                  <div
                    key={id}
                    className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200 shadow-sm' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                    }`}
                    onClick={() => toggleCompleted(id)}
                  >
                    <div className="absolute left-3 top-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {isCompleted && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="ml-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-semibold ${
                          isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                        }`}>
                          {run.day}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          run.type === 'easy' ? 'bg-blue-100 text-blue-700' :
                          run.type === 'tempo' ? 'bg-orange-100 text-orange-700' :
                          run.type === 'interval' ? 'bg-purple-100 text-purple-700' :
                          run.type === 'marathon-pace' ? 'bg-green-100 text-green-700' :
                          run.type === 'long' ? 'bg-red-100 text-red-700' :
                          run.type === 'recovery' ? 'bg-gray-100 text-gray-700' :
                          run.type === 'xt' ? 'bg-yellow-100 text-yellow-700' :
                          run.type === 'rest' ? 'bg-gray-200 text-gray-600' :
                          run.type === 'race' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {run.type}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        isCompleted ? 'text-green-600 line-through' : 'text-gray-700'
                      }`}>
                        {run.workout}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  repository: {
    name: string;
  };
}

function GitHubWindow() {
  const [activeTab, setActiveTab] = useState<'repos' | 'commits'>('repos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const fetchGitHubData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch repositories
      const reposResponse = await fetch('/api/github/repos');
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const reposData = await reposResponse.json();
      setRepos(reposData.repos || []);

      // Fetch recent commits
      const commitsResponse = await fetch('/api/github/commits');
      if (commitsResponse.ok) {
        const commitsData = await commitsResponse.json();
        setCommits(commitsData.commits || []);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load GitHub data');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-red-500 text-center mb-4">
          <p className="text-sm font-medium">GitHub API Error</p>
          <p className="text-xs opacity-75">{error}</p>
        </div>
        <button
          onClick={fetchGitHubData}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h4 className="text-gray-900 font-semibold mb-4 text-xl">GitHub</h4>
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('repos')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'repos'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Repositories
          </button>
          <button
            onClick={() => setActiveTab('commits')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'commits'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recent Commits
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {activeTab === 'repos' ? (
          <div className="space-y-4">
            {repos.map((repo) => (
              <div key={repo.id} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all duration-200 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="text-gray-900 font-semibold text-base">{repo.name}</h5>
                  <span className="text-xs text-gray-500">⭐ {repo.stargazers_count}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{repo.description || 'No description'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{repo.language || 'Unknown'}</span>
                  <span className="text-gray-500 text-xs">{formatDate(repo.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {commits.map((commit, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all duration-200 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm font-medium mb-1">{commit.commit.message}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{commit.repository.name}</span>
                      <span className="text-xs text-gray-500">{formatDate(commit.commit.author.date)}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{commit.sha.substring(0, 7)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}