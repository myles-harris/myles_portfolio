/* Photography — two infinite marquee rows scrolling in opposite directions */

const ROW1_PHOTOS = [
  "/film/IMG3435-R01-008.jpg",
  "/film/IMG3435-R01-019.jpg",
  "/film/IMG8357-R01-007A.jpg",
  "/film/IMG8357-R01-015A.jpg",
  "/film/IMG8358-R01-021.jpg",
  "/film/IMG8358-R01-031.jpg",
  "/film/IMG8359-R01-025A.jpg",
  "/film/IMG8359-R01-032A.jpg",
];

const ROW2_PHOTOS = [
  "/film/IMG8359-R01-037A.jpg",
  "/film/IMG8360-R01-009A.jpg",
  "/film/IMG8360-R01-026A.jpg",
  "/film/IMG8362-R01-006A.jpg",
  "/film/IMG8362-R01-022A.jpg",
  "/film/IMG8363-R01-006A.jpg",
  "/film/IMG8363-R01-021A.jpg",
  "/film/IMG8363-R01-035A.jpg",
];

const PHOTO_WIDTH = "clamp(220px, 26vw, 360px)";
const SHADOW = "0 8px 24px rgba(0,0,0,0.45)";

function MarqueeRow({ photos, direction, aspect }: { photos: string[]; direction: "ltr" | "rtl"; aspect: string }) {
  const doubled = [...photos, ...photos];
  const cls = direction === "ltr" ? "ticker-track-ltr" : "ticker-track-rtl";
  return (
    <div className="ticker-mask">
      <div className={cls}>
        {doubled.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            style={{
              width: PHOTO_WIDTH,
              aspectRatio: aspect,
              objectFit: "cover",
              borderRadius: 6,
              boxShadow: SHADOW,
              display: "block",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PhotographySection() {
  return (
    <section id="photography" className="reveal" style={{ padding: "80px 0", overflow: "hidden" }}>
      <div className="container" style={{ marginBottom: 40 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Photography</div>
        <h2 className="mh-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 0" }}>On film</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <MarqueeRow photos={ROW1_PHOTOS} direction="ltr" aspect="4 / 3" />
        <MarqueeRow photos={ROW2_PHOTOS} direction="rtl" aspect="3 / 4" />
      </div>
    </section>
  );
}
