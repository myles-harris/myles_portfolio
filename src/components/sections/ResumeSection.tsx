"use client";
import { useEffect, useRef } from "react";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const JOBS = [
  {
    company: "Dell Technologies",
    role: "Software Engineer II",
    note: "",
    period: "Sep 2023 — April 2026",
    current: true,
    bullets: [
      "Built and owned REST APIs across distributed Java/Spring Boot services, leveraging async processing for high-throughput event handling; increased automated test coverage to over 90%.",
      "Led organization-wide Java 25 and Spring Boot 4 upgrade across 1,300+ repositories; authored spec-driven migration recipes for phased AI-assisted execution, and defined manual validation checkpoints for code owners.",
      "Boosted development speed 40% using LLM tooling (Windsurf, Claude, Cursor) and prompt engineering to automate code generation, testing, and documentation.",
    ],
    tags: ["Java", "Spring Boot", "REST API", "Async Processing", "Distributed Systems", "LLM-Assisted Development", "Claude", "Cursor", "Windsurf", "Prompt Engineering", "CI/CD", "Test Automation", "Migration Planning"],
  },
  {
    company: "Moogsoft",
    role: "Software Engineer II",
    note: "Acquired by Dell",
    period: "Nov 2022 — Sep 2023",
    current: false,
    bullets: [
      "Designed and tested a real-time, event-driven incident-correlation microservice (Java, Kafka, Elasticsearch) that ingests 2B+ events/day and cut MTTR by up to 35% across Fortune 100 customers.",
      "Built a performance monitoring platform (JMeter) that load-tested distributed microservices, reducing manual QA cycles by 75% and defining scalability metrics for executive decisions. Integrated into CI/CD pipeline (Jenkins).",
      "Developed mock OAuth service using AWS Lambda to simulate authentication flows for integration testing across distributed microservices.",
    ],
    tags: ["Java", "Kafka", "Elasticsearch", "Event-Driven Architecture", "Microservices", "Performance Testing", "JMeter", "Jenkins", "CI/CD", "AWS Lambda", "OAuth", "Integration Testing", "Distributed Systems"],
  },
  {
    company: "Northrop Grumman",
    role: "Software Engineer",
    note: "Enterprise Top Performer 2021–2022",
    period: "Jul 2019 — Oct 2022",
    current: false,
    bullets: [
      "Led software delivery for GPS/Inertial Navigation Systems, meeting DO-178C standards while developing sensor/radar libraries (C++) as a technical Scrum Master.",
      "Managed program-level technical delivery across 8 cross-functional teams (~80 engineers), identifying and resolving cross-team blockers to reduce rework cycles and recover 2 weeks of engineering capacity per quarter.",
      "Built JavaFX UI integrated with C++ backend for satellite defense system, adopted by nearly 100 mission operators.",
    ],
    tags: ["C++", "JavaFX", "DO-178C", "Safety-Critical Software", "GPS / Inertial Navigation", "Scrum Master", "Agile", "Defense Systems", "Embedded Software", "Cross-Team Leadership", "Sensor/Radar Libraries"],
  },
];

const SKILL_GROUPS = [
  {
    label: "Languages",
    shadow: "#f6bf10",
    items: ["Java", "Python", "C++", "SQL", "JavaScript", "TypeScript"],
  },
  {
    label: "Frameworks",
    shadow: "#a67c52",
    items: ["Node.js", "Express.js", "React", "Angular", "JUnit", "TestNG", "Guice", "Spring Boot"],
  },
  {
    label: "Developer Tools",
    shadow: "#e2c48d",
    items: ["Git", "Kubernetes", "Docker", "AWS", "Jenkins", "Kafka", "Grafana", "Maven", "Redis"],
  },
  {
    label: "LLM Tools",
    shadow: "#3a2c1a",
    items: ["Claude", "Cursor", "Windsurf", "ChatGPT", "GitHub Copilot"],
  },
  {
    label: "Libraries",
    shadow: "#f6bf10",
    items: ["Pandas", "NumPy", "Matplotlib", "SciPy", "Scikit-Learn"],
  },
];

/* ─── Job Card ──────────────────────────────────────────────────────────── */
function JobCard({ job }: { job: typeof JOBS[0] }) {
  return (
    <div style={{
      flex: "0 0 clamp(420px, 50vw, 640px)",
      minHeight: "clamp(420px, 56vh, 560px)",
      background: "#fff",
      borderRadius: 12,
      padding: "32px 36px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: 20,
    }}>
      {/* Duration pill */}
      <span style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 9999,
        background: job.current ? "#f6bf10" : "#e2c48d",
        fontFamily: "var(--font-serif)",
        fontSize: 15,
        fontWeight: 500,
        color: "#3a2c1a",
        alignSelf: "flex-start",
      }}>
        {job.period}
      </span>

      {/* Header */}
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(22px, 2.6vw, 30px)", color: "#3a2c1a", margin: "0 0 4px" }}>{job.company}</h3>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "#3a2c1a", opacity: 0.8, margin: 0 }}>{job.role}{job.note && <span style={{ opacity: 0.55 }}> · {job.note}</span>}</p>
      </div>

      {/* Bullets */}
      <ul style={{ margin: 0, padding: 0, listStyle: "none", borderLeft: "1px solid #e2c48d", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {job.bullets.map((b, i) => (
          <li key={i} style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.55, color: "#3a2c1a", opacity: 0.88 }}>• {b}</li>
        ))}
      </ul>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {job.tags.map(t => (
          <span key={t} style={{ fontFamily: "var(--font-serif)", fontSize: 14, padding: "6px 14px", borderRadius: 9999, border: "1px solid rgba(58,44,26,0.25)", background: "rgba(226,196,141,0.22)", color: "#3a2c1a" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Skills Grid ───────────────────────────────────────────────────────── */
export function SkillsGrid() {
  return (
    <div style={{ padding: "80px 0" }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Skills</div>
        <h2 className="mh-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 40px" }}>What I work with</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 }}>
          {SKILL_GROUPS.map((g, i) => (
            <SkillGroupCard key={i} group={g} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillGroupCard({ group, index }: { group: typeof SKILL_GROUPS[0]; index: number }) {
  return (
    <div
      style={{
        background: "#fffaf0",
        border: "1.5px solid #1a1208",
        borderRadius: 18,
        boxShadow: `8px 10px 0 ${group.shadow}`,
        padding: "24px 22px",
        transition: "transform 220ms ease, box-shadow 220ms ease",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-2px,-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `12px 14px 0 ${group.shadow}`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = `8px 10px 0 ${group.shadow}`; }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a67c52", opacity: 0.55 }}>{String(index + 1).padStart(2, "0")}</span>
        <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 16, color: "#3a2c1a", margin: 0 }}>{group.label}</h3>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#3a2c1a", opacity: 0.55, marginLeft: "auto" }}>{group.items.length} items</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {group.items.map(item => (
          <span key={item} style={{ fontFamily: "var(--font-serif)", fontSize: 13, padding: "5px 12px", borderRadius: 9999, border: "1px solid rgba(58,44,26,0.2)", background: "rgba(255,248,231,0.9)", color: "#3a2c1a" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Resume Section ────────────────────────────────────────────────────── */
export default function ResumeSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const onScroll = () => {
      const { top, height } = outer.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -top / scrollable));
      const maxShift = track.scrollWidth - window.innerWidth + 48;
      track.style.transform = `translateX(-${progress * maxShift}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Height = viewport height + track overflow so scroll drives the horizontal pan
  const trackCount = JOBS.length;
  const cardWidth = 640;
  const gap = 24;
  const totalWidth = trackCount * cardWidth + (trackCount - 1) * gap;

  return (
    <section id="experience" style={{ position: "relative" }}>
      {/* Horizontal scroll experience */}
      <div
        ref={outerRef}
        style={{ height: `calc(100svh + ${totalWidth}px)`, position: "relative" }}
        className="resume-exp-outer"
      >
        <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>
          <div style={{ paddingTop: 80, marginBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }} className="container">
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Experience</div>
              <h2 className="mh-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 0" }}>Where I&rsquo;ve worked</h2>
            </div>
            <a
              href="/mylesHarris_Resume_v10.pdf"
              download
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9999, border: "1.5px solid #1a1208", background: "#3a2c1a", color: "#fff8e7", fontFamily: "var(--font-serif)", fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Download Resume ↓
            </a>
          </div>
          <div ref={trackRef} style={{ display: "flex", gap, paddingLeft: "max(0px, calc((100vw - 1100px) / 2))", paddingRight: 24, paddingBottom: 48, willChange: "transform", transition: "none" }}>
            {JOBS.map((job, i) => <JobCard key={i} job={job} />)}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .resume-exp-outer { height: auto !important; }
          .resume-exp-outer > div {
            position: relative !important;
            height: auto !important;
            overflow: visible !important;
          }
          .resume-exp-outer > div > div:last-child {
            flex-direction: column !important;
            transform: none !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .resume-exp-outer > div > div:last-child > div {
            flex: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
