"use client";
import { useEffect, useState } from "react";

/* All media except 8thgradesuperlative (which lives in-text) split 6/5 */
const LEFT_MEDIA = [
  { src: "/about/resources/pictures/about-01.jpg", rotation: -7,  top: "2%",  video: false },
  { src: "/about/resources/pictures/about-02.jpg", rotation:  4,  top: "16%", video: false },
  { src: "/about/resources/pictures/about-03.jpg", rotation: -5,  top: "32%", video: false },
  { src: "/about/resources/pictures/about-04.jpg", rotation:  6,  top: "48%", video: false },
  { src: "/about/resources/pictures/about-05.jpg", rotation: -3,  top: "64%", video: false },
  { src: "/about/resources/pictures/IMG_2266.MOV", rotation:  5,  top: "80%", video: true  },
];

const RIGHT_MEDIA = [
  { src: "/about/resources/pictures/about-06.jpg", rotation:  8,  top: "4%",  video: false },
  { src: "/about/resources/pictures/about-07.jpg", rotation: -5,  top: "22%", video: false },
  { src: "/about/resources/pictures/about-09.jpg", rotation:  3,  top: "40%", video: false },
  { src: "/about/resources/pictures/about-10.jpg", rotation: -6,  top: "58%", video: false },
  { src: "/about/resources/pictures/about-11.jpg", rotation: -2,  top: "76%", video: false },
];

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "America/Los_Angeles" });
}
function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "America/Los_Angeles" });
}

type MediaItem = { src: string; rotation: number; top: string; video: boolean };

function MarginItem({ src, rotation, top, video }: MediaItem) {
  return (
    <div
      className="tilt-photo"
      style={{ position: "absolute", top, width: 220, transform: `rotate(${rotation}deg)` }}
    >
      {video ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" style={{ display: "block", width: "100%", height: "auto" }} />
      )}
    </div>
  );
}

export default function AboutSection() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const sectionStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: "clamp(36px, 6vw, 56px)",
    color: "#3a2c1a",
    letterSpacing: "0.02em",
    margin: "48px 0 16px",
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(18px, 2.4vw, 22px)",
    lineHeight: 1.7,
    color: "#3a2c1a",
    opacity: 0.88,
    marginBottom: 16,
  };

  return (
    <section id="about" className="reveal" style={{ padding: "100px 0", position: "relative" }}>
      <div className="container-wide" style={{ position: "relative" }}>
        {/* Left margin — hidden below 1100px */}
        <div className="about-margin about-margin-left" style={{ position: "absolute", left: -60, top: 0, width: 220, height: "100%" }}>
          {LEFT_MEDIA.map((m, i) => <MarginItem key={i} {...m} />)}
        </div>

        {/* Right margin — hidden below 1100px */}
        <div className="about-margin about-margin-right" style={{ position: "absolute", right: -60, top: 0, width: 220, height: "100%" }}>
          {RIGHT_MEDIA.map((m, i) => <MarginItem key={i} {...m} />)}
        </div>

        {/* Main content */}
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>About</div>
          <h2 style={sectionStyle}>Who</h2>
          <p style={bodyStyle}>I&rsquo;m Myles.</p>

          <h2 style={sectionStyle}>What</h2>
          <p style={bodyStyle}>
            Software Engineer, Photographer, Distance Runner, Furniture Enthusiast, Gospel Listener, Atlanta Hawks Fan, Amateur Botanist, Dog Father, Former Lego Kid.
          </p>

          <h2 style={sectionStyle}>Why</h2>
          <p style={bodyStyle}>
            I learned very young how strong the Lego kid to engineer adult pipeline was, so I think a lot of my family and childhood friends could&rsquo;ve seen this coming. But the urge to build bled into every area of my life. I love telling people that I&rsquo;m a third generation engineer, but I actually wanted to be an architect first because I was worried engineering would be boring. But having some <span className="hl-b">patience</span>, a <span className="hl-b">willingness to fail</span>, an <span className="hl-b">eye for good work</span>, and the <span className="hl-b">spirit of competition</span> served me through my realization that everything is engineering in some form. And now I&rsquo;m not just building software — I&rsquo;m building stories, a healthy mind and body, and a blueprint for the next Lego kid to follow.
          </p>
          <p style={bodyStyle}>
            As I grew up, documentation became more and more important to me and my footprint on the world. I&rsquo;ve been blessed to build prosthetic arms, run a marathon, travel all over the world, photograph a documentary, and now I&rsquo;m restoring a 1990 Cadillac Eldorado — so this portfolio is meant to be a way to share some of my favorite milestones with others.
          </p>
          <p style={bodyStyle}>
            Also in 8th grade I was voted &lsquo;Most Likely to Succeed&rsquo; by my class and I just can&rsquo;t let my middle school peers down.
          </p>

          <h2 style={sectionStyle}>Where</h2>
          <p style={bodyStyle}>Born in <span className="hl">South Atlanta</span>, but I&rsquo;ve really been all over.</p>
          <p style={bodyStyle}>
            I went to college in <span className="hl">Middle Georgia</span> → spent time studying in <span className="hl">South Korea</span> and the <span className="hl">Dominican Republic</span> → Spent my first internship in <span className="hl">Topeka, Kansas</span> → Moved to <span className="hl">Huntsville, Alabama</span> for my first job out of college → relocated to <span className="hl">Woodland Hills</span>, just outside of LA → came back to <span className="hl">Atlanta</span> → and now I&rsquo;m back in <span className="hl">Los Angeles</span>.
          </p>
          <p style={bodyStyle}>Couldn&rsquo;t tell you where to next, but my coast is currently West and my hospitality is always Southern.</p>

          <h2 style={sectionStyle}>When</h2>
          <p style={bodyStyle}>
            The time is currently <span className="hl-b">{currentTime} PST</span> on <span className="hl-b">{currentDate}</span>, check the hero above to see what I might be up to!
          </p>

          {/* 8th grade superlative — in-text, beneath all copy */}
          <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
            <div
              className="tilt-photo"
              style={{ width: "100%", maxWidth: 560, transform: "rotate(-1deg)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about/resources/pictures/8thgradesuperlative.jpg"
                alt="8th grade superlative — Most Likely to Succeed"
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .about-margin { display: none !important; }
        }
      `}</style>
    </section>
  );
}
