"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface FilmStripProps {
  images: string[];
  direction: 'horizontal' | 'vertical';
  scrollDirection: 'forward' | 'backward';
  speed?: number; // pixels per second
}

export default function FilmStrip({ images = [], direction, scrollDirection, speed = 50 }: FilmStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);
  const [imageSlots, setImageSlots] = useState<Array<{ src: string; zIndex: number }>>([]);

  // Get a truly random image that's different from the last image
  const getRandomImage = useCallback((lastImage?: string) => {
    if (!images || images.length === 0) return '';
    
    // Create a copy of available images excluding the last image
    const availableImages = lastImage 
      ? images.filter(img => img !== lastImage)
      : images;

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomIndex = array[0] % availableImages.length;
    return availableImages[randomIndex];
  }, [images]);

  // Get a random z-index between 1 and 10
  const getRandomZIndex = useCallback(() => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 10) + 1;
  }, []);

  // Initialize with enough images for smooth scrolling
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const initialImages: Array<{ src: string; zIndex: number }> = [];
    for (let i = 0; i < 12; i++) { // Reduced from 15 to 12 for better performance
      // For each position, get a random image different from the previous one
      const prevImage = i > 0 ? initialImages[i - 1].src : undefined;
      initialImages.push({
        src: getRandomImage(prevImage),
        zIndex: getRandomZIndex()
      });
    }
    
    setImageSlots(initialImages);
  }, [getRandomImage, getRandomZIndex, images]);

  // Periodically update z-indices with better performance
  useEffect(() => {
    if (!images || images.length === 0) return;

    const updateInterval = setInterval(() => {
      setImageSlots(prev => prev.map(slot => ({
        ...slot,
        zIndex: getRandomZIndex()
      })));
    }, 3000); // Increased from 2 seconds to 3 seconds for better performance

    return () => clearInterval(updateInterval);
  }, [getRandomZIndex, images]);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const strip = stripRef.current;
    const container = containerRef.current;
    if (!strip || !container) return;

    const animate = (timestamp: number) => {
      if (!container) return;
      
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const delta = (elapsed * speed) / 1000;
      positionRef.current += delta;

      // Get the width/height of one image plus gap
      const isHorizontal = direction === 'horizontal';
      const itemSize = isHorizontal ? 
        strip.children[0]?.getBoundingClientRect().width + 32 : // 32px is the gap
        strip.children[0]?.getBoundingClientRect().height + 32;

      if (itemSize && positionRef.current >= itemSize) {
        // When an image scrolls out of view, add a new one at the end
        positionRef.current = 0;
        setImageSlots(prev => {
          const newImages = [...prev];
          newImages.shift();
          // Get a random image different from the last one in the list
          const lastImage = newImages[newImages.length - 1].src;
          const newImage = getRandomImage(lastImage);
          newImages.push({
            src: newImage,
            zIndex: getRandomZIndex()
          });
          return newImages;
        });
      }

      const position = scrollDirection === 'forward' ? positionRef.current : -positionRef.current;
      
      const transform = direction === 'horizontal'
        ? `translate3d(${-position}px, 0, 0)`
        : `translate3d(0, ${-position}px, 0)`;
      
      container.style.transform = transform;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Clean up position reference
      positionRef.current = 0;
      lastTimeRef.current = 0;
    };
  }, [direction, scrollDirection, speed, getRandomImage, getRandomZIndex, images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden" style={{ 
      height: direction === 'vertical' ? '100vh' : 'auto',
      width: direction === 'horizontal' ? '100%' : 'auto',
      perspective: '1000px',
      contain: 'layout style paint',
      willChange: 'transform'
    }}>
      <div 
        ref={containerRef} 
        className={`${direction === 'horizontal' ? 'flex-row' : 'flex-col'} flex will-change-transform`}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transition: 'transform 0s linear'
        }}
      >
        <div 
          ref={stripRef} 
          className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} gap-8`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {imageSlots.map((slot, index) => (
            <div 
              key={`${slot.src}-${index}`}
              className={`relative ${direction === 'horizontal' ? 'h-[40vh]' : 'h-[50vh]'}`}
              style={{
                width: direction === 'horizontal' ? 'auto' : '400px',
                minWidth: direction === 'horizontal' ? '300px' : 'auto',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: slot.zIndex
              }}
            >
              <Image
                src={slot.src}
                alt={`Film photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: 'contain',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                priority={index < 6}
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 