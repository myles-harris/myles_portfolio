"use client";
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check URL parameters on mount
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    if (success === 'true') {
      // Tokens have been saved on the server
      setTokens({
        success: true,
        access_token: 'stored_on_server',
        refresh_token: 'stored_on_server',
        expires_in: 3600,
        token_type: 'Bearer'
      });
      setLoading(false);
    } else {
      getAuthUrl();
    }
  }, []);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !authUrl && !error) {
        setError('Timeout loading authorization. Please refresh the page.');
        setLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [loading, authUrl, error]);

  const getAuthUrl = async () => {
    try {
      console.log('Fetching Spotify auth URL...');
      setLoading(true);
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      console.log('Auth response:', data);

      if (response.ok) {
        setAuthUrl(data.authUrl);
        console.log('Auth URL set:', data.authUrl);
      } else {
        console.error('Auth error:', data.error);
        setError(data.error || 'Failed to get authorization URL');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to get authorization URL');
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
            <p className="text-gray-600 mb-6">Your Spotify account has been connected successfully. Tokens are securely stored on the server.</p>
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