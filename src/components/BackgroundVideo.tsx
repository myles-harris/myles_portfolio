"use client";

import { useState, useEffect } from 'react';

export default function BackgroundVideo() {
  const [videoId, setVideoId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videos = [
      '1TMk9SKISQY', // smoothie video
      'xpLPij-lwDs'  // walking jazz video
    ];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setVideoId(randomVideo);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!videoId) return null;

  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-black" />
      )}
      <div className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] -translate-x-1/2 -translate-y-1/2">
        <iframe
          className="w-full h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0&version=3&enablejsapi=1&playsinline=1&iv_load_policy=3&start=1&origin=${encodeURIComponent(window.location.origin)}`}
          title="YouTube video background"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onLoad={handleIframeLoad}
          loading="eager"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
} 