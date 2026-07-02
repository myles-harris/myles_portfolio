"use client";
import { useState } from "react";

const INVOLVEMENTS = [
  {
    eyebrow: "Community",
    title: "National Society of Black Engineers",
    sub: "Atlanta & Los Angeles Professionals Chapter",
    period: "2022 – Present",
    shadow: "#f6bf10",
    bullets: [
      "Active chapter member across the Atlanta and Los Angeles Professionals chapters.",
      "Volunteered as a technical recruiter, conducting internship interviews for Dell Technologies and Northrop Grumman over 4 years.",
    ],
  },
  {
    eyebrow: "Certification",
    title: "IBM Agentic AI & RAG Professional Certificate",
    sub: "Coursera",
    period: "Completed June 2026",
    shadow: "#a67c52",
    bullets: [
      "Completed IBM's professional certification covering RAG pipelines, agentic AI systems, LangChain, LangGraph, vector databases, and multi-agent orchestration.",
    ],
  },
  {
    eyebrow: "Teaching",
    title: "Robotics & English Instructor",
    sub: "Cheonan, South Korea",
    period: "",
    shadow: "#e2c48d",
    bullets: [
      "Taught robotics and English to students in Cheonan, South Korea, combining technical education with language instruction.",
    ],
  },
];

function InvolvementCard({ item, index }: { item: typeof INVOLVEMENTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: "#fffaf0",
        border: "1.5px solid #1a1208",
        borderRadius: 18,
        boxShadow: hovered ? `12px 14px 0 ${item.shadow}` : `8px 10px 0 ${item.shadow}`,
        padding: "28px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "transform 220ms ease, box-shadow 220ms ease",
        transform: hovered ? "translate(-2px,-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Eyebrow + index */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a67c52", opacity: 0.55 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a67c52" }}>
          {item.eyebrow}
        </span>
      </div>

      {/* Title + period */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(17px, 1.6vw, 20px)", color: "#3a2c1a", lineHeight: 1.3 }}>
          {item.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "#3a2c1a", opacity: 0.65 }}>{item.sub}</span>
          {item.period && (
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 13, padding: "3px 10px", borderRadius: 9999, background: "rgba(226,196,141,0.35)", color: "#3a2c1a", border: "1px solid rgba(58,44,26,0.15)" }}>
              {item.period}
            </span>
          )}
        </div>
      </div>

      {/* Bullets */}
      <ul style={{ margin: 0, padding: 0, listStyle: "none", borderLeft: "1px solid #e2c48d", paddingLeft: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {item.bullets.map((b, i) => (
          <li key={i} style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.6, color: "#3a2c1a", opacity: 0.85, fontWeight: 300 }}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}

export default function InvolvementSection() {
  return (
    <section id="involvement" className="reveal" style={{ padding: "80px 0" }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Involvement</div>
        <h2 className="mh-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 32px" }}>Beyond the code</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {INVOLVEMENTS.map((item, i) => (
            <InvolvementCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
