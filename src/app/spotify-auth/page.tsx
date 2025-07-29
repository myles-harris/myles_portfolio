"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface TokenResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export default function SpotifyAuth() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenResponse | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleCallback(code);
    } else {
      getAuthUrl();
    }
  }, [searchParams]);

  const getAuthUrl = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      
      if (response.ok) {
        setAuthUrl(data.authUrl);
      } else {
        setError(data.error || 'Failed to get authorization URL');
      }
    } catch {
      setError('Failed to get authorization URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCallback = async (code: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/spotify/callback?code=${code}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store tokens in localStorage (for development/demo purposes)
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
        localStorage.setItem('spotify_expires_at', String(Date.now() + data.expires_in * 1000));
        
        setTokens(data);
        setError(null);
      } else {
        setError(data.error || 'Authorization failed');
      }
    } catch {
      setError('Failed to complete authorization');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (tokens) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">Your Spotify account has been connected successfully.</p>
            <button
              onClick={() => window.location.href = '/misc'}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Go to Misc Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✗</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={getAuthUrl}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">♪</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Spotify</h2>
          <p className="text-gray-600 mb-6">Connect your Spotify account to access your music and playlists.</p>
          <button
            onClick={handleAuth}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            Connect to Spotify
          </button>
        </div>
      </div>
    </div>
  );
} 