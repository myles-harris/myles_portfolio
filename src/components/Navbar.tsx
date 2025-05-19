"use client";
import { useState, useEffect } from "react";

const MENU = [
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Photography", href: "/photography" },
  { label: "Contact", href: "/contact" },
  { label: "Misc", href: "/misc" },
];

const LINE_HEIGHT = 4; // px
const LINE_GAP = 8; // px
const PRONG_WIDTHS = [176, 144, 112, 80, 48].map(w => w * 1.75 * 2); // px, top is longest, bottom is shortest, all 200% longer than previous
const PRONG_TRANSITION = 900; // ms
const PRONG_STAGGER = 80; // ms

export default function Navbar() {
  const [hovered, setHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="fixed top-0 right-0 h-screen z-50 select-none">
      <div
        className="relative flex flex-col items-end h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ 
          minWidth: isMounted ? (hovered ? '19rem' : '4rem') : '4rem',
          transition: 'all 400ms ease-in-out',
          position: 'relative'
        }}
      >
        {/* Gradient blur overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: isMounted && hovered ? 'blur(8px)' : 'none',
            WebkitBackdropFilter: isMounted && hovered ? 'blur(8px)' : 'none',
            maskImage: isMounted && hovered ? 'linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))' : 'none',
            WebkitMaskImage: isMounted && hovered ? 'linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))' : 'none',
            transition: 'all 400ms ease-in-out',
            pointerEvents: 'none'
          }}
        />
        {/* Content container to ensure it stays above the blur overlay */}
        <div className="relative z-10">
          {/* Hamburger Icon */}
          <button
            className={`w-16 h-16 flex flex-col justify-center items-center transition-transform duration-[400ms] ${isMounted && hovered ? 'rotate-[270deg]' : ''} mt-6 mr-6`}
            aria-label="Open menu"
            tabIndex={0}
            style={{ transformOrigin: '50% 50%' }}
          >
            <div className={`relative w-16 h-32 ${isMounted && hovered ? '' : 'flex flex-col justify-between items-center'}`} style={!hovered ? {gap: `${LINE_GAP}px`} : {}}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`bg-[#e2c48d] rounded transition-all duration-[900ms] ease-in-out w-16` +
                    ` h-1` +
                    ` ${isMounted && hovered ? 'absolute right-0' : ''}` +
                    ` ${isMounted && hovered ? 'shadow-lg' : ''}`
                  }
                  style={{
                    transitionDelay: isMounted && hovered ? `${i * PRONG_STAGGER}ms` : `${(4-i) * 60}ms`,
                    ...(isMounted && hovered
                      ? {
                          bottom: `${i * (LINE_HEIGHT + LINE_GAP)}px`,
                          right: 0,
                          width: `${PRONG_WIDTHS[i]}px`,
                        }
                      : {}),
                  }}
                >
                  {/* Menu label slides out from prong */}
                  <a
                    href={MENU[4-i].href}
                    className={`absolute left-0 top-0 px-8 pt-2 pb-0 font-serif font-semibold text-2xl tracking-wide text-[#3a2c1a] whitespace-nowrap transition-all duration-[900ms] ease-in-out ${isMounted && hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    style={{
                      transitionDelay: isMounted && hovered
                        ? `${PRONG_TRANSITION + i * PRONG_STAGGER}ms`
                        : '0ms',
                      transform: `${isMounted && hovered ? 'translateY(0)' : 'translateY(4rem)'} translateX(calc(-100% + 4rem - 1.2rem)) rotate(90deg)`,
                      transformOrigin: 'top right',
                    }}
                  >
                    {MENU[4-i].label}
                  </a>
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 