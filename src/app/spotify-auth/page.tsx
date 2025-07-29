"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SpotifyAuth() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      // Handle callback
      handleCallback(code);
    } else {
      // Get auth URL
      getAuthUrl();
    }
  }, [searchParams]);

  const getAuthUrl = async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      
      if (data.authUrl) {
        setAuthUrl(data.authUrl);
      } else {
        setError(data.error || 'Failed to get authorization URL');
      }
    } catch (err) {
      setError('Failed to initialize Spotify authorization');
    } finally {
      setLoading(false);
    }
  };

  const handleCallback = async (code: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/spotify/callback?code=${code}`);
      const data = await response.json();
      
      if (data.success) {
        setTokens(data);
        // Store tokens (in production, use secure storage)
        localStorage.setItem('spotify_tokens', JSON.stringify(data));
        setError(null);
      } else {
        setError(data.error || 'Authorization failed');
      }
    } catch (err) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (tokens) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authorization Successful!</h2>
            <p className="text-gray-600 mb-6">Your Spotify account is now connected.</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Access Token:</p>
              <p className="text-xs font-mono text-gray-800 break-all">
                {tokens.access_token.substring(0, 20)}...
              </p>
            </div>
            <a
              href="/misc"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Go to Misc Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✗</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authorization Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">♪</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Spotify</h2>
          <p className="text-gray-600 mb-6">
            Authorize this app to access your Spotify account for the music player.
          </p>
          <button
            onClick={handleAuth}
            className="bg-green-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-600 transition-colors text-lg"
          >
            Connect Spotify Account
          </button>
        </div>
      </div>
    </div>
  );
} 