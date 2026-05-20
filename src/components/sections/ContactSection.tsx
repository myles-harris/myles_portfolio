const QR_CARDS = [
  {
    label: "LinkedIn",
    cta: "Connect with me",
    name: "Myles Harris",
    link: "linkedin.com/in/mylescharris",
    href: "https://www.linkedin.com/in/mylescharris",
    qr: "/contact/social/linkedin.jpg",
  },
  {
    label: "Instagram",
    cta: "Follow along",
    name: "@millennium_myles",
    link: "instagram.com/millennium_myles",
    href: "https://www.instagram.com/millennium_myles",
    qr: "/contact/social/ig.jpg",
  },
  {
    label: "Strava",
    cta: "Keep my pace",
    name: "Myles Harris",
    link: "strava.com/athletes/136978271",
    href: "https://www.strava.com/athletes/136978271",
    qr: "/contact/social/strava.jpg",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="reveal" style={{ padding: "80px 0" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Contact</div>
        <h2 className="mh-display" style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "8px 0 40px" }}>Let&rsquo;s connect</h2>

        {/* QR Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 48, justifyItems: "center" }}>
          {QR_CARDS.map(card => (
            <a
              key={card.label}
              href={card.href}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 28, background: "#fffaf0", border: "1.5px solid #1a1208", borderRadius: 18, boxShadow: "8px 10px 0 #e2c48d", transition: "transform 220ms ease, box-shadow 220ms ease", width: "100%", maxWidth: 280 }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translate(-2px,-3px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "12px 14px 0 #e2c48d"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "8px 10px 0 #e2c48d"; }}
            >
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "#3a2c1a", opacity: 0.55 }}>{card.label}</div>

              {/* QR code */}
              <div style={{ width: 200, height: 200, background: "#fff", borderRadius: 16, padding: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.qr} alt={`${card.label} QR code`} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }} />
              </div>

              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20, color: "#3a2c1a", marginBottom: 4 }}>{card.cta}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "#3a2c1a", opacity: 0.65 }}>{card.name}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#a67c52", marginTop: 4, letterSpacing: "0.04em" }}>{card.link}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Email CTA */}
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(17px, 2vw, 20px)", color: "#3a2c1a", opacity: 0.85 }}>
          Or send me an email at{" "}
          <a href="mailto:mylescharris18@gmail.com" style={{ color: "#a67c52", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid #a67c52" }}>mylescharris18@gmail.com</a>
        </p>
      </div>

    </section>
  );
}
