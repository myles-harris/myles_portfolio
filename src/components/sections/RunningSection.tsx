"use client";
import { useState, useMemo } from "react";
import { PLAN, getTodayStr } from "@/lib/trainingPlan";

const TOTAL_WEEKS = 26;

const PHASE_COLORS: Record<string, string> = {
  Base:     "#e2c48d",
  Aerobic:  "#f6bf10",
  Specific: "#a67c52",
  Taper:    "#3a2c1a",
};

function typeColor(type: string): string {
  if (type === "Long Run" || type === "Race") return "#f6bf10";
  if (type === "Tempo Run" || type === "Interval" || type === "Hill Repeats") return "#a67c52";
  if (type === "Easy Run" || type === "Strides" || type === "Shakeout") return "#e2c48d";
  return "#3a2c1a";
}

function typeOpacity(type: string): number {
  return ["Rest", "Soccer / Cross-Train", "Strength & Conditioning"].includes(type) ? 0.38 : 1;
}

export default function RunningSection() {
  const todayStr = getTodayStr();

  const defaultWeek = useMemo(() => {
    const entry = PLAN.find(e => e.date === todayStr);
    return entry ? entry.w : 1;
  }, [todayStr]);

  const [week, setWeek] = useState(defaultWeek);
  const rows = PLAN.filter(e => e.w === week);
  const weekMiles = rows.reduce((s, e) => s + (e.mi ?? 0), 0);
  const cumMiles = [...rows].reverse().find(e => e.cum != null)?.cum ?? null;
  const phase = rows[0]?.phase ?? "Base";

  const daysToRace = useMemo(() => {
    const race = new Date("2026-10-11");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    race.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((race.getTime() - today.getTime()) / 86400000));
  }, []);

  return (
    <section id="running" className="reveal" style={{ padding: "80px 0" }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Running</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 32 }}>
          <h2 className="mh-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 0", lineHeight: 1.05 }}>
            Long Beach<br />Marathon 2026
          </h2>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(48px, 7vw, 80px)", color: "#a67c52", lineHeight: 1 }}>
              {daysToRace > 0 ? daysToRace : "0"}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a67c52", opacity: 0.75, marginTop: 4 }}>
              {daysToRace > 0 ? "days to race" : "race day!"}
            </div>
          </div>
        </div>

        {/* Navigator */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => setWeek(w => Math.max(1, w - 1))}
            disabled={week === 1}
            style={{ width: 36, height: 36, borderRadius: 9999, border: "1.5px solid #1a1208", background: week === 1 ? "rgba(58,44,26,0.08)" : "#fffaf0", color: "#3a2c1a", cursor: week === 1 ? "default" : "pointer", opacity: week === 1 ? 0.35 : 1, fontFamily: "var(--font-serif)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>

          <span style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "#3a2c1a" }}>
            Week <strong>{week}</strong> of {TOTAL_WEEKS}
          </span>

          {/* Phase chip */}
          <span style={{ padding: "4px 12px", borderRadius: 9999, background: PHASE_COLORS[phase] ?? "#e2c48d", fontFamily: "var(--font-serif)", fontSize: 12, fontWeight: 600, color: phase === "Taper" ? "#fff8e7" : "#3a2c1a" }}>{phase}</span>

          <button
            onClick={() => setWeek(w => Math.min(TOTAL_WEEKS, w + 1))}
            disabled={week === TOTAL_WEEKS}
            style={{ width: 36, height: 36, borderRadius: 9999, border: "1.5px solid #1a1208", background: week === TOTAL_WEEKS ? "rgba(58,44,26,0.08)" : "#fffaf0", color: "#3a2c1a", cursor: week === TOTAL_WEEKS ? "default" : "pointer", opacity: week === TOTAL_WEEKS ? 0.35 : 1, fontFamily: "var(--font-serif)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>

          {/* Progress bar */}
          <div style={{ flex: 1, minWidth: 120, height: 4, background: "rgba(58,44,26,0.12)", borderRadius: 9999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(week / TOTAL_WEEKS) * 100}%`, background: "#f6bf10", borderRadius: 9999, transition: "width 300ms ease" }} />
          </div>
        </div>

        {/* Week table */}
        <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 560, background: "#fffaf0", border: "1.5px solid #1a1208", borderRadius: 18, overflow: "hidden" }}>
          {rows.map((row, i) => {
            const isToday = row.date === todayStr;
            const isRace  = row.type === "Race";
            const dimmed  = typeOpacity(row.type) < 1;
            const border  = typeColor(row.type);
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "140px 0.6fr 1.4fr 90px",
                alignItems: "center",
                borderBottom: i < rows.length - 1 ? "1px solid rgba(58,44,26,0.10)" : "none",
                background: isRace ? "rgba(246,191,16,0.13)" : isToday ? "rgba(246,191,16,0.06)" : "transparent",
                opacity: dimmed ? 0.38 : 1,
                borderLeft: `3px solid ${border}`,
                padding: "14px 18px",
                gap: 12,
              }}>
                {/* Day + date */}
                <div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a2c1a" }}>{row.d.slice(0, 3)}</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "#3a2c1a", opacity: 0.75, marginLeft: 8 }}>{row.date}</span>
                  {isToday && <span style={{ marginLeft: 8, padding: "1px 6px", borderRadius: 4, background: "#f6bf10", fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a2c1a" }}>today</span>}
                </div>
                {/* Type */}
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600, color: border }}>{row.type}</div>
                {/* Description */}
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "#000" }}>{row.wk}</div>
                {/* Miles */}
                <div style={{ textAlign: "right", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: 21, color: "#3a2c1a", whiteSpace: "nowrap" }}>
                  {row.mi != null ? `+ ${row.mi} mi` : "—"}
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* Summary */}
        <div style={{ marginTop: 18, display: "flex", gap: 24, fontFamily: "var(--font-serif)", fontSize: 16, color: "#a67c52" }}>
          <span>This week — <strong>{weekMiles} mi</strong></span>
          {cumMiles != null && <span>Cumulative — <strong>{cumMiles} mi</strong></span>}
        </div>
      </div>
    </section>
  );
}
