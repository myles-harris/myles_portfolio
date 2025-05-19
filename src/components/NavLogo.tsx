"use client";

import Link from 'next/link';

export default function NavLogo() {
  return (
    <Link href="/" className="fixed top-6 left-8 z-50">
      <h1 className="tracking-tight text-[#3a2c1a] font-serif">
        <span 
          className="text-5xl transition-colors duration-200 hover:text-[#a67c52] cursor-pointer font-[var(--font-cinzel)] italic"
          style={{ color: '#f6bf10' }}
        >
          Myles Harris
        </span>
      </h1>
    </Link>
  );
} 