"use client";
import { useState } from "react";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    name: "Orbit",
    sub: "Video conferencing app",
    shadow: "#f6bf10",
    bgImage: "/projects/orbit-bg.png",
    frontTone: "light" as const,
    bullets: [
      "Built a group video-calling platform with Daily.co for real-time video and Twilio for SMS/OTP. Designed stateless APIs for call scheduling/orchestration and optimized PostgreSQL schemas to support 100+ concurrent calls.",
      "Developed end-to-end with LLM-assisted tooling from system design and prompt-driven feature buildout to automated testing and deployment, enabling 20% faster iteration on new features.",
    ],
    tech: ["TypeScript", "React", "Express", "PostgreSQL", "Twilio", "Daily.co", "WebRTC", "BullMQ", "Redis", "REST API", "Claude Code", "LLM-Assisted Development", "System Design"],
  },
  {
    name: "ML Stock Screener",
    sub: "Machine learning pipeline for S&P 500",
    shadow: "#a67c52",
    bgImage: "/projects/nyse-bg.png",
    frontTone: "light" as const,
    bullets: [
      "Built scalable pipeline for ingesting, processing, and analyzing 10+ years of S&P 500 data using LSTM and K-Means Clustering; achieved 0.92 F1 score, serving 1K+ weekly queries.",
    ],
    tech: ["Python", "Scikit-Learn", "TensorFlow", "LSTM", "K-Means Clustering", "Pandas", "NumPy", "Data Pipelines", "Machine Learning"],
  },
  {
    name: "Electric Prosthetic Arm",
    sub: "EMG-controlled prosthetic prototype",
    shadow: "#e2c48d",
    bgImage: "/projects/prosthetic-team.jpg",
    bgPosition: "center 30%",
    mobileBgPosition: "right 30%",
    frontTone: "light" as const,
    bullets: [
      "Led interdisciplinary team to deliver EMG-controlled prosthetic prototype 98% cheaper than commercial devices.",
    ],
    tech: ["Machine Design", "Finite Element Analysis", "PCB Design", "SolidWorks", "EMG Signal Processing", "Embedded Systems", "Mechatronics", "Interdisciplinary Team Leadership"],
  },
];

const GITHUB = {
  name: "More on GitHub",
  sub: "Side projects + scratch repos",
  shadow: "#3a2c1a",
  copy: "Side projects, scratch repos, and the half-built ideas that didn't make this page. Most of what I'm working on right now lives there first.",
  href: "https://github.com/myles-harris",
  cta: "github.com/myles-harris →",
};

/* ─── Project Tile (3D flip card) ───────────────────────────────────────── */
interface ProjectData {
  name: string;
  sub: string;
  shadow: string;
  bgImage?: string;
  bgPosition?: string;
  mobileBgPosition?: string;
  frontTone?: "light" | "dark";
  bullets: string[];
  tech?: string[];
  href?: string;
  cta?: string;
}

function ProjectTile({ project, index }: { project: ProjectData; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const light = project.frontTone === "light";
  const eyebrowColor = light ? "#f6e7c4" : "#a67c52";
  const titleColor   = light ? "#fff8e7" : "#3a2c1a";
  const subColor     = light ? "#fff8e7" : "#3a2c1a";
  const hintColor    = light ? "#fff8e7" : "#3a2c1a";

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(f => !f); }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${project.name} — ${project.sub}. Click to flip for details.`}
      aria-pressed={flipped}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={onKey}
      style={{ perspective: 1400, position: "relative", minHeight: 480, cursor: "pointer", outline: "none" }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 480,
        transformStyle: "preserve-3d",
        transition: "transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* FRONT */}
        <div className="proj-front" style={{
          position: "absolute",
          inset: 0,
          background: "#fffaf0",
          backgroundImage: project.bgImage ? `url(${project.bgImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: project.bgPosition ?? "center",
          ...({ "--mob-bg-pos": project.mobileBgPosition ?? project.bgPosition ?? "center" } as React.CSSProperties),
          border: "1.5px solid #1a1208",
          borderRadius: 18,
          boxShadow: `8px 10px 0 ${project.shadow}`,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          color: titleColor,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow: "hidden",
        }}>
          {project.bgImage && (
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,12,30,0.15) 0%, rgba(20,12,30,0.55) 100%)", pointerEvents: "none" }} />
          )}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: eyebrowColor, opacity: light ? 0.9 : 1 }}>
              Project · {String(index + 1).padStart(2, "0")}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, paddingBlock: "14px 0" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(34px, 4vw, 52px)", color: titleColor, lineHeight: 1.0, letterSpacing: "-0.005em", textShadow: light ? "0 2px 24px rgba(0,0,0,0.35)" : "none" }}>{project.name}</h3>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(15px, 1.4vw, 18px)", color: subColor, opacity: light ? 0.92 : 0.72, lineHeight: 1.4, textShadow: light ? "0 1px 12px rgba(0,0,0,0.4)" : "none" }}>{project.sub}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: "auto" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: hintColor, opacity: light ? 0.85 : 0.55 }}>Tap to flip</span>
              <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 9999, border: light ? "1.5px solid rgba(255,248,231,0.7)" : "1.5px solid #1a1208", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: hintColor, background: light ? "rgba(20,12,30,0.25)" : "transparent", backdropFilter: light ? "blur(2px)" : "none" }}>↻</span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "#fffaf0",
          border: "1.5px solid #1a1208",
          borderRadius: 18,
          boxShadow: `8px 10px 0 ${project.shadow}`,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          color: "#3a2c1a",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          overflow: "hidden",
        }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a67c52", marginBottom: 10 }}>
            Project · {String(index + 1).padStart(2, "0")}
          </div>
          <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(20px, 2.2vw, 24px)", color: "#3a2c1a" }}>{project.name}</h3>
          <div style={{ opacity: 0.65, fontSize: 13.5, marginTop: 2, marginBottom: 12, color: "#3a2c1a" }}>{project.sub}</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", borderLeft: "1px solid #e2c48d", paddingLeft: 14, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {project.bullets.map((b, i) => (
              <li key={i} style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.55, color: "#3a2c1a", opacity: 0.88, fontWeight: 300 }}>• {b}</li>
            ))}
          </ul>
          {project.tech && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto", paddingTop: 18 }}>
              {project.tech.map(t => (
                <span key={t} style={{ fontFamily: "var(--font-serif)", fontSize: 12, padding: "4px 10px", borderRadius: 9999, border: "1px solid rgba(58,44,26,0.25)", background: "rgba(226,196,141,0.22)", color: "#3a2c1a", whiteSpace: "nowrap" }}>{t}</span>
              ))}
            </div>
          )}
          <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#3a2c1a", opacity: 0.5 }}>Tap to flip back ↺</div>
        </div>
      </div>
    </div>
  );
}

/* ─── GitHub CTA tile (static, no flip) ────────────────────────────────── */
function GitHubTile() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: "#fffaf0",
        border: "1.5px solid #1a1208",
        borderRadius: 18,
        boxShadow: hovered ? `12px 14px 0 ${GITHUB.shadow}` : `8px 10px 0 ${GITHUB.shadow}`,
        padding: 28,
        minHeight: 480,
        display: "flex",
        flexDirection: "column",
        color: "#3a2c1a",
        position: "relative",
        overflow: "hidden",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        transform: hovered ? "translate(-2px,-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a67c52", marginBottom: 10 }}>Keep digging</div>
      <h3 style={{ margin: "0 0 4px", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(20px, 2.2vw, 24px)", color: "#3a2c1a" }}>{GITHUB.name}</h3>
      <div style={{ opacity: 0.65, fontSize: 13.5, marginBottom: 12, color: "#3a2c1a" }}>{GITHUB.sub}</div>
      <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.55, color: "#3a2c1a", opacity: 0.88, paddingLeft: 14, borderLeft: "1px solid #e2c48d", fontWeight: 300 }}>{GITHUB.copy}</p>
      <div style={{ display: "flex", marginTop: "auto", paddingTop: 18 }}>
        <a href={GITHUB.href} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: "var(--font-serif)", fontSize: 14, padding: "8px 16px", borderRadius: 9999, border: "1.5px solid #1a1208", background: "#3a2c1a", color: "#fff8e7", textDecoration: "none" }}>{GITHUB.cta}</a>
      </div>
    </div>
  );
}

/* ─── Projects Section ──────────────────────────────────────────────────── */
export default function ProjectsSection() {
  return (
    <section id="projects" className="reveal" style={{ padding: "80px 0" }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Projects</div>
        <h2 className="mh-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 32px" }}>Things I&rsquo;ve built</h2>

        <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {PROJECTS.map((p, i) => <ProjectTile key={i} project={p} index={i} />)}
          <GitHubTile />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .proj-grid { grid-template-columns: 1fr !important; }
          .proj-front { background-position: var(--mob-bg-pos) !important; }
        }
      `}</style>
    </section>
  );
}
