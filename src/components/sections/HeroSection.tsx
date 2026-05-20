"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { PLAN, getTodayStr } from "@/lib/trainingPlan";

/* ─── Strava Tile ───────────────────────────────────────────────────────── */
function StravaTile() {
  const todayStr = getTodayStr();
  const todayEntry = PLAN.find(e => e.date === todayStr) ?? null;
  const weekNum = todayEntry?.w ?? null;

  const { weekRows, weekMiles, cumMiles, bars } = useMemo(() => {
    if (!weekNum) return { weekRows: [], weekMiles: 0, cumMiles: null, bars: [] };
    const rows = PLAN.filter(e => e.w === weekNum);
    const wMiles = rows.reduce((s, e) => s + (e.mi ?? 0), 0);
    const cum = [...rows].reverse().find(e => e.cum != null)?.cum ?? null;
    const mileValues = rows.map(e => e.mi ?? 0);
    const maxMi = Math.max(...mileValues, 1);
    const b = mileValues.map(m => Math.max(4, Math.round((m / maxMi) * 38)));
    return { weekRows: rows, weekMiles: wMiles, cumMiles: cum, bars: b };
  }, [weekNum]);

  const isRunningDay = todayEntry && todayEntry.mi != null;
  const todayLabel = todayEntry?.type ?? "Off plan";
  const todayDesc  = todayEntry?.wk   ?? "—";

  const label = weekNum
    ? `Week ${weekNum} · ${todayEntry?.phase ?? ""} · Training plan`
    : "Training plan";

  void weekRows;

  return (
    <BentoTile col="span 2" row="span 1" shadow="#e2c48d" label={label}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        {/* Left: today's run */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              padding: "2px 8px", borderRadius: 4,
              background: isRunningDay ? "#f6bf10" : "rgba(58,44,26,0.08)",
              fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#3a2c1a", fontWeight: 600,
            }}>today</span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "#3a2c1a", opacity: 0.85, fontWeight: 600 }}>{todayLabel}</span>
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, color: "#3a2c1a", opacity: 0.6, marginTop: 5 }}>
            {todayDesc}
          </div>
          <a href="#running" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, padding: "8px 16px", borderRadius: 9999, border: "1.5px solid #1a1208", background: "#3a2c1a", color: "#fff8e7", fontFamily: "var(--font-serif)", fontSize: 13, textDecoration: "none" }}>Running →</a>
        </div>
        {/* Right: bars + mileage */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 38 }}>
            {bars.map((h, i) => {
              const isT = weekRows[i]?.date === todayStr;
              return (
                <div key={i} style={{ width: 7, height: `${h}px`, background: isT ? "#f6bf10" : "#3a2c1a", borderRadius: 2, opacity: isT ? 1 : 0.7 }} />
              );
            })}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: 34, color: "#3a2c1a", lineHeight: 1 }}>
              {weekMiles}<span style={{ fontSize: 18, opacity: 0.55 }}> mi</span>
            </div>
            {cumMiles != null && (
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, color: "#3a2c1a", opacity: 0.55, marginTop: 3 }}>
                {cumMiles} mi total
              </div>
            )}
          </div>
        </div>
      </div>
    </BentoTile>
  );
}

/* ─── Video Playlist ────────────────────────────────────────────────────── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  const buf = new Uint32Array(a.length);
  crypto.getRandomValues(buf);
  for (let i = a.length - 1; i > 0; i--) {
    const j = buf[i] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface VideoPlaylistProps {
  srcs: string[];
  style?: React.CSSProperties;
}

function VideoPlaylist({ srcs, style }: VideoPlaylistProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const orderRef = useRef<string[]>([]);
  const posRef   = useRef(0);

  useEffect(() => {
    orderRef.current = shuffle([...srcs]);
    posRef.current   = 0;
    const v = videoRef.current;
    if (!v) return;
    v.src = orderRef.current[0];
    v.load();
    v.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEnded() {
    posRef.current += 1;
    if (posRef.current >= orderRef.current.length) {
      orderRef.current = shuffle([...srcs]);
      posRef.current   = 0;
    }
    const v = videoRef.current;
    if (!v) return;
    v.src = orderRef.current[posRef.current];
    v.load();
    v.play().catch(() => {});
  }

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      onEnded={handleEnded}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }}
    />
  );
}

/* ─── Shared BentoTile ──────────────────────────────────────────────────── */
interface BentoTileProps {
  col?: string;
  row?: string;
  shadow: string;
  label?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function BentoTile({ col, row, shadow, label, style, children }: BentoTileProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        gridColumn: col,
        gridRow: row,
        background: "#fffaf0",
        border: "1.5px solid #1a1208",
        borderRadius: 18,
        boxShadow: hovered ? `12px 14px 0 ${shadow}` : `8px 10px 0 ${shadow}`,
        padding: 22,
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        transform: hovered ? "translate(-2px,-3px)" : "none",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {label && (
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#3a2c1a", opacity: 0.55, marginTop: 14 }}>
          {label}
        </div>
      )}
    </div>
  );
}

/* ─── Spotify Tile ──────────────────────────────────────────────────────── */
interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  progress_ms: number;
  duration_ms: number;
}

function SpotifyTile() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrack = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify/current-track");
      if (res.ok) {
        const data = await res.json();
        setTrack(data.track ?? null);
      }
    } catch {
      // silently fail — show placeholder
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, [fetchTrack]);

  const progressPct = track && track.duration_ms > 0
    ? Math.round((track.progress_ms / track.duration_ms) * 100)
    : 42;

  return (
    <BentoTile col="span 2" row="span 1" shadow="#3a2c1a" label="Now playing · Spotify">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {track?.album?.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.album.images[0].url}
            alt={track.album.name}
            style={{ width: 80, height: 80, flex: "0 0 auto", borderRadius: 10, objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: 80, height: 80, flex: "0 0 auto", border: "1px dashed rgba(26,18,8,0.3)", borderRadius: 10, background: "repeating-linear-gradient(135deg, rgba(26,18,8,0.04) 0 6px, transparent 6px 12px)" }} />
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 16, color: "#3a2c1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {loading ? "Loading…" : track ? track.name : "Nothing playing"}
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, color: "#3a2c1a", opacity: 0.6 }}>
            {track ? `${track.artists.map(a => a.name).join(", ")} · ${track.album.name}` : "Open Spotify to start listening"}
          </div>
          <div style={{ height: 3, background: "#1a1208", borderRadius: 9999, marginTop: 8, position: "relative", opacity: 0.15 }}>
            <div style={{ position: "absolute", inset: 0, width: `${progressPct}%`, background: "#3a2c1a", borderRadius: 9999, opacity: 1 }} />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}

/* ─── Chat Tile ─────────────────────────────────────────────────────────── */
function ChatTile() {
  const [msg, setMsg] = useState("");
  const [thread] = useState([
    { from: "mh", text: "Hey — this little chat box is wired up, but it's still under construction. Drop a note and I'll get back to you soon." },
  ]);

  return (
    <BentoTile col="5 / 7" row="span 2" shadow="#3a2c1a" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "#3a2c1a" }}>Let&rsquo;s chat</div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#3a2c1a", background: "repeating-linear-gradient(135deg, #f6bf10 0 6px, #1a1208 6px 12px)", padding: "4px 8px", borderRadius: 4, border: "1.5px solid #1a1208" }}>
          <span style={{ background: "#fff8e7", padding: "1px 6px", borderRadius: 2 }}>Under construction</span>
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: "4px 2px", marginBottom: 10 }}>
        {thread.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === "you" ? "flex-end" : "flex-start", maxWidth: "88%", padding: "8px 12px", borderRadius: 12, border: "1.5px solid #1a1208", background: m.from === "you" ? "#3a2c1a" : "#fff8e7", color: m.from === "you" ? "#fff8e7" : "#3a2c1a", fontFamily: "var(--font-serif)", fontSize: 13.5, lineHeight: 1.4 }}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={e => e.preventDefault()} style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Say hi…"
          style={{ flex: 1, minWidth: 0, padding: "10px 12px", border: "1.5px solid #1a1208", borderRadius: 10, background: "#fff8e7", fontFamily: "var(--font-serif)", fontSize: 14, color: "#3a2c1a", outline: "none" }}
        />
        <button type="submit" style={{ padding: "10px 16px", border: "1.5px solid #1a1208", borderRadius: 10, background: "#3a2c1a", color: "#fff8e7", fontFamily: "var(--font-serif)", fontSize: 14, cursor: "not-allowed", opacity: 0.5 }}>Send</button>
      </form>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#3a2c1a", opacity: 0.55, marginTop: 8 }}>Real inbox coming soon</div>
    </BentoTile>
  );
}

/* ─── Hero Section ──────────────────────────────────────────────────────── */
const DRINK_VIDEOS = [
  "/videos/drink/drink_apple.mp4",
  "/videos/drink/drink_chai.mp4",
  "/videos/drink/drink_coke.mp4",
  "/videos/drink/drink_protein.mp4",
  "/videos/drink/drink_red_bull.mp4",
  "/videos/drink/drink_smoothie.mp4",
  "/videos/drink/drink_water.mp4",
];

const GLASSES_VIDEOS = [
  "/videos/glasses/glasses_brown.mp4",
  "/videos/glasses/glasses_contacts.mp4",
  "/videos/glasses/glasses_gold.mp4",
  "/videos/glasses/glasses_green.mp4",
  "/videos/glasses/glasses_sun.mp4",
  "/videos/glasses/glasses_tortoise.mp4",
];

const TECH_STACK = ["Java", "Kafka", "React", "TypeScript", "PostgreSQL", "AWS", "Claude", "Cursor"];
const SOCIAL_LINKS = [
  { label: "LinkedIn",  href: "https://linkedin.com/in/myles-harris" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Strava",    href: "https://strava.com" },
  { label: "GitHub",    href: "https://github.com/myles-harris" },
  { label: "Email",     href: "#contact" },
];

export default function HeroSection() {
  return (
    <section id="home" style={{ minHeight: "100svh", padding: "110px 0 60px", position: "relative" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #fff8e7 0%, #fdf1d8 100%)", zIndex: -1 }} />

      <div className="container-wide" style={{ containerType: "inline-size" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#a67c52" }}>Portfolio · 2026</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#a67c52" }}>Atlanta born · LA based</div>
        </div>

        <div className="bento-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoFlow: "dense",
          gridAutoRows: "minmax(calc((100cqi - 5 * 22px) / 6), auto)",
          gap: 22,
        }}>
          {/* TITLE */}
          <BentoTile col="span 4" row="span 2" shadow="#f6bf10">
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#a67c52", marginBottom: 14 }}>Hello, I&rsquo;m</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, color: "#3a2c1a", letterSpacing: "-0.01em", lineHeight: 0.95, fontSize: "clamp(56px, 9vw, 128px)", margin: 0 }}>Myles<br />Harris</h1>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(16px, 1.8vw, 22px)", color: "#3a2c1a", opacity: 0.78, marginTop: 18, maxWidth: 520, lineHeight: 1.45 }}>
                Engineer · Photographer · Distance Runner.<br />Building software, telling stories, taking the scenic route.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="#about" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 9999, border: "1.5px solid #1a1208", background: "#3a2c1a", color: "#fff8e7", fontFamily: "var(--font-serif)", fontSize: 14, textDecoration: "none" }}>About me →</a>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 9999, border: "1.5px solid #1a1208", background: "transparent", color: "#3a2c1a", fontFamily: "var(--font-serif)", fontSize: 14, textDecoration: "none" }}>Get in touch</a>
            </div>
          </BentoTile>

          {/* HEADSHOT */}
          <BentoTile col="span 2" row="span 2" shadow="#a67c52" style={{ padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/headshot.jpg" alt="Myles Harris" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", flex: 1, borderRadius: 16 }} />
          </BentoTile>

          {/* DRINK VIDEO */}
          <BentoTile col="span 2" row="span 3" shadow="#e2c48d" style={{ padding: 0, aspectRatio: "9/16" }}>
            <VideoPlaylist srcs={DRINK_VIDEOS} style={{ transform: "scale(1.08)", transformOrigin: "center bottom" }} />
          </BentoTile>

          {/* SPOTIFY */}
          <SpotifyTile />

          {/* STRAVA */}
          <StravaTile />

          {/* LIFESTYLE VIDEO */}
          <BentoTile col="span 4" row="span 1" shadow="#a67c52" style={{ padding: 0 }}>
            <video src="/videos/lifestyle.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", flex: 1, borderRadius: 16 }} />
          </BentoTile>

          {/* FILM SCAN */}
          <BentoTile col="span 1" row="span 1" shadow="#f6bf10" label="Latest film roll">
            <div style={{ flex: 1, minHeight: 80, border: "1px dashed rgba(26,18,8,0.3)", borderRadius: 10, background: "repeating-linear-gradient(135deg, rgba(26,18,8,0.04) 0 8px, transparent 8px 16px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "rgba(58,44,26,0.55)", fontFamily: "var(--font-sans)", aspectRatio: "1 / 1" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.55 }}>Photo · square</div>
              <div style={{ fontSize: 13, letterSpacing: "0.04em", color: "rgba(58,44,26,0.7)" }}>coming soon</div>
            </div>
          </BentoTile>

          {/* GLASSES */}
          <BentoTile col="span 3" row="span 1" shadow="#3a2c1a" style={{ padding: 0 }}>
            <VideoPlaylist srcs={GLASSES_VIDEOS} style={{ transform: "scale(1.08)" }} />
          </BentoTile>

          {/* CHAT */}
          <ChatTile />

          {/* TECH STACK */}
          <BentoTile col="span 4" row="span 1" shadow="#f6bf10" label="Currently working with">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {TECH_STACK.map(t => (
                <span key={t} style={{ fontFamily: "var(--font-serif)", fontSize: 14, padding: "6px 14px", borderRadius: 9999, border: "1.5px solid #1a1208", background: "#fff8e7", color: "#3a2c1a" }}>{t}</span>
              ))}
            </div>
          </BentoTile>

          {/* FIND ME */}
          <BentoTile col="1 / 7" row="span 1" shadow="#a67c52" label="Find me elsewhere">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }} className="find-me-row">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ flex: "1 1 0", minWidth: 120, textDecoration: "none", padding: "12px 16px", border: "1.5px solid #1a1208", borderRadius: 10, background: "#fff8e7", fontFamily: "var(--font-serif)", fontSize: 15, color: "#3a2c1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {s.label}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </BentoTile>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: minmax(calc((100cqi - 22px) / 2), auto) !important;
          }
          .bento-grid > * { grid-column: span 2 !important; grid-row: auto !important; }
          .find-me-row > * { flex: 1 1 45% !important; }
        }
        @media (min-width: 901px) and (max-width: 1200px) {
          .bento-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            grid-auto-rows: minmax(calc((100cqi - 3 * 22px) / 4), auto) !important;
          }
        }
      `}</style>
    </section>
  );
}
