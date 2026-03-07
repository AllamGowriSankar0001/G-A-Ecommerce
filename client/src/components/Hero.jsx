import "../index.css";

function Hero() {
  const heroData = {
    eyebrow: "New Collection — 2026",
    title: "Fashion for Everyone",
    subtitle: "Quality apparel, footwear & accessories for all genders. Shop curated collections designed for everyday life.",
    ctaText: "Explore Collection",
    ctaLink: "/collection"
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "80vh" , marginTop: "59px"}} className="hero-container">
      <video
        src="/Hero_section_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.18), rgb(0, 0, 0))",
          pointerEvents: "none",
        }}
      />
      <div className="hero-inner">
        <div className="hero-left">
          <span className="hero-eyebrow">{heroData.eyebrow}</span>

          <h1>{heroData.title}</h1>

          <p>{heroData.subtitle}</p>

          <div className="hero-actions">
            <a href={heroData.ctaLink} className="btn primary">
              {heroData.ctaText}
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-line"></div>
          <span className="hero-scroll">Scroll</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
