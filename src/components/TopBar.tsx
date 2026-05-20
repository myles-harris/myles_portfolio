"use client";
import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "#about",       label: "About" },
  { href: "#experience",  label: "Experience" },
  { href: "#projects",    label: "Projects" },
  { href: "#photography", label: "Photography" },
  { href: "#running",     label: "Running" },
  { href: "#contact",     label: "Contact" },
];

export default function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      background: "rgba(255,248,231,0.78)",
      borderBottom: "1px solid rgba(58,44,26,0.10)",
    }}>
      <div className="container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
        {/* Wordmark */}
        <a
          href="#home"
          className="mh-word"
          style={{ fontSize: "clamp(22px, 3vw, 32px)", textDecoration: "none" }}
        >
          Myles Harris
        </a>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 24 }} className="mh-topbar-nav">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: "#3a2c1a",
                textDecoration: "none",
                fontFamily: "var(--font-serif)",
                fontSize: 15,
                opacity: 0.85,
                letterSpacing: "0.04em",
                transition: "color 200ms ease, opacity 200ms ease",
              }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = "#a67c52"; (e.target as HTMLAnchorElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = "#3a2c1a"; (e.target as HTMLAnchorElement).style.opacity = "0.85"; }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          className="mh-topbar-burger"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
        >
          <div style={{ width: 28, height: 2, background: "#3a2c1a", margin: "5px 0", borderRadius: 2, transition: "transform 300ms", transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <div style={{ width: 28, height: 2, background: "#3a2c1a", margin: "5px 0", borderRadius: 2, opacity: open ? 0 : 1, transition: "opacity 200ms" }} />
          <div style={{ width: 28, height: 2, background: "#3a2c1a", margin: "5px 0", borderRadius: 2, transition: "transform 300ms", transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mh-topbar-mobile" style={{ padding: "8px 24px 24px", display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid rgba(58,44,26,0.10)" }}>
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ color: "#3a2c1a", textDecoration: "none", fontFamily: "var(--font-serif)", fontSize: 20, padding: "10px 0", opacity: 0.9 }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mh-topbar-nav    { display: none !important; }
          .mh-topbar-burger { display: block !important; }
        }
        @media (min-width: 769px) {
          .mh-topbar-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
