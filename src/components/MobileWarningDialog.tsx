"use client";

import { useEffect, useState } from 'react';

const MobileWarningDialog = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-[300px] bg-[#c0c0c0] border-t-[1px] border-l-[1px] border-white border-r-[1px] border-b-[1px] border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#008080] from-40% via-[#007070] via-65% to-[#005555] px-2 py-[2px] flex items-center">
          <div className="text-white text-sm font-['Tahoma','MS_Sans_Serif','Arial'] font-bold tracking-tight">Error!</div>
        </div>
        
        {/* Content */}
        <div className="p-2">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                {/* Stop sign octagon shape - perfect octagon with equal sides */}
                <path 
                  d="M12 0h16l12 12v16l-12 12h-16l-12-12v-16l12-12z" 
                  fill="#FF0000" 
                  stroke="#FFFFFF" 
                  strokeWidth="2"
                />
                {/* STOP text - centered and sized to fit */}
                <text
                  x="20"
                  y="23"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ fontFamily: 'Arial' }}
                >
                  STOP
                </text>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-black text-sm font-['Tahoma','MS_Sans_Serif','Arial']">
                Mobile compatibility is under construction. Try desktop!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWarningDialog; 