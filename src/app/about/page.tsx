"use client";

import NavLogo from '@/components/NavLogo';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Helper function to generate random rotation
const getRandomRotation = () => Math.floor(Math.random() * 31) - 15;

// Helper function to format time in 12-hour format with AM/PM
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles'
  });
};

// Helper function to format date in long format
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  });
};

export default function About() {
  const [rotations, setRotations] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [superlativeRotation, setSuperlativeRotation] = useState<number>(0);

  // Initialize random rotations and time on mount
  useEffect(() => {
    const mediaCount = 11; // 10 images + 1 video
    setRotations(Array.from({ length: mediaCount }, getRandomRotation));
    setSuperlativeRotation(getRandomRotation());
    
    // Initialize time and date
    const now = new Date();
    setCurrentTime(formatTime(now));
    setCurrentDate(formatDate(now));

    // Update time every second
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const mediaFiles = [
    'about-01.jpg', 'about-02.jpg', 'about-03.jpg', 'about-04.jpg', 'about-05.jpg',
    'about-06.jpg', 'about-07.jpg', 'about-09.jpg', 'about-10.jpg', 'about-11.jpg',
    'IMG_2266.MOV'
  ];

  // Split media files for left and right margins
  const leftMarginMedia = mediaFiles.slice(0, Math.ceil(mediaFiles.length / 2));
  const rightMarginMedia = mediaFiles.slice(Math.ceil(mediaFiles.length / 2));

  return (
    <>
      <NavLogo />
      <div className="max-w-[1800px] mx-auto">
        <main className="relative grid grid-cols-[400px_minmax(700px,_1fr)_400px] gap-12 py-24 px-8 text-white font-serif">
          {/* Left Margin */}
          <div className="relative">
            <div className="sticky top-24 space-y-16">
              {leftMarginMedia.map((file, index) => (
                <div
                  key={file}
                  className="rounded-md overflow-hidden"
                  style={{
                    transform: `rotate(${rotations[index]}deg)`,
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: file.endsWith('.MOV') ? 2 : 1,
                    width: '100%',
                    marginBottom: '3rem',
                  }}
                >
                  {file.endsWith('.MOV') ? (
                    <video
                      className="w-full h-full object-contain"
                      src={`/about/resources/pictures/${file}`}
                      controls
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="relative" style={{ paddingTop: '75%' }}>
                      <Image
                        src={`/about/resources/pictures/${file}`}
                        alt={`About section image ${index + 1}`}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            <div className="space-y-16">
              {/* Introduction */}
              <div className="space-y-8 text-2xl opacity-90">
                <h2 className="text-4xl font-bold tracking-wide text-[#e2c48d] font-[var(--font-cinzel)] italic">Who</h2>
                <p className="text-2xl">I'm Myles</p>

                <h2 className="text-4xl font-bold tracking-wide text-[#e2c48d] mt-16 font-[var(--font-cinzel)] italic">What</h2>
                <p className="text-2xl">Software Engineer, Photographer, Distance Runner, Furniture Enthusiast, Gospel Listener, Atlanta Hawks Fan, Amateur Botanist, Dog Father, Former Lego Kid</p>

                <h2 className="text-4xl font-bold tracking-wide text-[#e2c48d] mt-16 font-[var(--font-cinzel)] italic">Why</h2>
                <p className="text-2xl leading-relaxed">
                  I learned very young how strong the Lego kid to engineer adult pipeline was, so I think a lot of my family and childhood friends could've seen this coming. But the urge to build bled into every area of my life. I love telling people that I'm a third generation engineer, but I actually wanted to be an architect first because I was worried engineering would be boring. But having some <span className="text-[#e2c48d]">patience</span>, a <span className="text-[#e2c48d]">willingness to fail</span>, an <span className="text-[#e2c48d]">eye for good work</span>, and the <span className="text-[#e2c48d]">spirit of competition</span> served me through my realization that everything is engineering in some form. And now I'm not just building software - I'm bulding stories, a healthy mind and body, and a blueprint for the next Lego kid to follow.
                </p>
                <p className="text-2xl leading-relaxed">
                  As I grew up, documentation became more and more important to me and my footprint on the world. I've been blessed to build prosthetic arms, run a marathon, travel all over the world, photograph a documentary, and now I'm restoring a 1990 Cadillac Eldorado - so this portfolio is meant to be a way to share some of my favorite milestones with others.
                </p>
                <p className="text-2xl leading-relaxed">
                  Also in 8th grade I was voted 'Most Likely to Succeed' by my class and I just can't let my middle school peers down.
                </p>

                <h2 className="text-4xl font-bold tracking-wide text-[#e2c48d] mt-16 font-[var(--font-cinzel)] italic">Where</h2>
                <p className="text-2xl">Born in <span className="text-[#e2c48d]">South Atlanta</span>, but I've really been all over.</p>
                <p className="text-2xl leading-relaxed">
                  I went to college in <span className="text-[#e2c48d]">Middle Georgia</span> → spent time studying in <span className="text-[#e2c48d]">South Korea</span> and the <span className="text-[#e2c48d]">Dominican Republic</span> → Spent my first internship in <span className="text-[#e2c48d]">Topeka, Kansas</span> → Moved to <span className="text-[#e2c48d]">Huntsville, Alabama</span> for my first job out of college → relocated to <span className="text-[#e2c48d]">Woodland Hills</span>, just outside of LA → came back to <span className="text-[#e2c48d]">Atlanta</span> → and now I'm back in <span className="text-[#e2c48d]">Los Angeles</span>.
                </p>
                <p className="text-2xl">
                  Couldn't tell you where to next, but my coast is currently West and my hospitality is always Southern.
                </p>

                <h2 className="text-4xl font-bold tracking-wide text-[#e2c48d] mt-16 font-[var(--font-cinzel)] italic">When</h2>
                <p className="text-2xl">The time is currently <span className="text-[#e2c48d] font-bold">{currentTime} PST</span> on <span className="text-[#e2c48d] font-bold">{currentDate}</span>, check the home page to see what I might be up to!</p>
                
                {/* 8th Grade Superlative Image */}
                <div 
                  className="mt-8 relative mx-auto"
                  style={{ 
                    height: '400px',
                    width: '90%',
                    maxWidth: '800px',
                    padding: '40px'
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      transform: `rotate(${superlativeRotation}deg)`,
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  >
                    <Image
                      src="/about/resources/pictures/8thgradesuperlative.jpg"
                      alt="8th grade superlative - Most Likely to Succeed"
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-300 rounded-md"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Margin */}
          <div className="relative">
            <div className="sticky top-24 space-y-16">
              {rightMarginMedia.map((file, index) => (
                <div
                  key={file}
                  className="rounded-md overflow-hidden"
                  style={{
                    transform: `rotate(${rotations[index + leftMarginMedia.length]}deg)`,
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: file.endsWith('.MOV') ? 2 : 1,
                    width: '100%',
                    marginBottom: '3rem',
                  }}
                >
                  {file.endsWith('.MOV') ? (
                    <video
                      className="w-full h-full object-contain"
                      src={`/about/resources/pictures/${file}`}
                      controls
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="relative" style={{ paddingTop: '75%' }}>
                      <Image
                        src={`/about/resources/pictures/${file}`}
                        alt={`About section image ${index + leftMarginMedia.length + 1}`}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 