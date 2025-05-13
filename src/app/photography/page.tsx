"use client";
import { useEffect, useState } from 'react';
import FilmStrip from '@/components/FilmStrip';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Photography() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        const response = await fetch('/film/images.json');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('No images found');
        }
        // Prepend /film/ to each filename
        setImages(shuffleArray(data.map((f: string) => `/film/${f}`)));
      } catch (error) {
        console.error('Error loading images:', error);
        setError(error instanceof Error ? error.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    }
    loadImages();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#3a2c1a] opacity-80">Loading images...</p>
      </main>
    );
  }

  if (error || images.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#3a2c1a] opacity-80">
          {error || 'No images found'}
        </p>
      </main>
    );
  }

  // Ensure we have enough images for all strips
  const numStrips = 4;
  const minImagesPerStrip = 6;
  const totalImagesNeeded = numStrips * 2 * minImagesPerStrip;
  
  // Duplicate images if we don't have enough
  let extendedImages = [...images];
  while (extendedImages.length < totalImagesNeeded) {
    extendedImages = [...extendedImages, ...images];
  }

  // Split images into groups for horizontal and vertical strips
  const strips = Array.from({ length: numStrips * 2 }, (_, i) => {
    const start = i * minImagesPerStrip;
    const stripImages = extendedImages.slice(start, start + minImagesPerStrip);
    return shuffleArray(stripImages); // Shuffle each strip individually
  });

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#3a2c1a]/5">
      <div className="absolute inset-0 flex flex-col justify-between py-16">
        {/* Horizontal Strips */}
        <div className="space-y-32">
          {strips.slice(0, numStrips).map((stripImages, index) => (
            <FilmStrip
              key={`h-${index}`}
              images={stripImages}
              direction="horizontal"
              scrollDirection={index % 2 === 0 ? 'forward' : 'backward'}
              speed={30 + (index * 5)}
            />
          ))}
        </div>
      </div>
      
      {/* Vertical Strips */}
      <div className="absolute inset-0 flex justify-between px-16">
        {strips.slice(numStrips).map((stripImages, index) => (
          <FilmStrip
            key={`v-${index}`}
            images={stripImages}
            direction="vertical"
            scrollDirection={index % 2 === 0 ? 'forward' : 'backward'}
            speed={30 + (index * 5)}
          />
        ))}
      </div>
    </main>
  );
} 