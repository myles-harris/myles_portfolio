'use client';

import { ReactNode } from 'react';

interface TickerBorderProps {
  text: string;
  children: ReactNode;
}

export default function TickerBorder({ text, children }: TickerBorderProps) {
  const repeatedText = Array(8).fill(text).join(' • ');
  
  return (
    <>
      <style global jsx>{`
        .ticker-container {
          position: relative;
          padding: 1.25rem;
        }

        .ticker-border {
          position: absolute;
          inset: 0;
          border-radius: 0.5rem;
        }

        /* Top ticker */
        .ticker-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1.25rem;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, white 5%, white 95%, transparent);
        }

        /* Bottom ticker */
        .ticker-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1.25rem;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, white 5%, white 95%, transparent);
        }

        /* Left ticker */
        .ticker-left {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1.25rem;
          overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent, white 5%, white 95%, transparent);
        }

        /* Right ticker */
        .ticker-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 1.25rem;
          overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent, white 5%, white 95%, transparent);
        }

        .ticker-scroll-h {
          display: flex;
          animation: tickerH 15s linear infinite;
          width: fit-content;
          height: 100%;
          align-items: center;
        }

        .ticker-scroll-v {
          display: flex;
          flex-direction: column;
          animation: tickerV 15s linear infinite;
          height: fit-content;
          width: 100%;
          align-items: center;
        }

        @keyframes tickerH {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes tickerV {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        .ticker-content {
          position: relative;
          border-radius: 0.5rem;
          overflow: hidden;
          margin: 1.25rem;
        }

        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .ticker-text {
          color: white;
          font-size: 1rem;
          white-space: nowrap;
          line-height: 1;
        }
      `}</style>

      <div className="ticker-container">
        <div className="ticker-border">
          {/* Top ticker */}
          <div className="ticker-top">
            <div className="ticker-scroll-h">
              <span className="ticker-text">{repeatedText}</span>
              <span className="ticker-text">{repeatedText}</span>
            </div>
          </div>

          {/* Bottom ticker */}
          <div className="ticker-bottom">
            <div className="ticker-scroll-h">
              <span className="ticker-text">{repeatedText}</span>
              <span className="ticker-text">{repeatedText}</span>
            </div>
          </div>

          {/* Left ticker */}
          <div className="ticker-left">
            <div className="ticker-scroll-v">
              <span className="ticker-text vertical-text">{repeatedText}</span>
              <span className="ticker-text vertical-text">{repeatedText}</span>
            </div>
          </div>

          {/* Right ticker */}
          <div className="ticker-right">
            <div className="ticker-scroll-v">
              <span className="ticker-text vertical-text">{repeatedText}</span>
              <span className="ticker-text vertical-text">{repeatedText}</span>
            </div>
          </div>
        </div>
        <div className="ticker-content">
          {children}
        </div>
      </div>
    </>
  );
} 