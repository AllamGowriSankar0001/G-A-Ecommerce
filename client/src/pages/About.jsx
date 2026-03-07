import "../index.css";
import { Link } from "react-router-dom";

function About() {
  const heroData = {
    eyebrow: "About Us",
    title: "Designed With Purpose.",
    titleLine2: "Built With Integrity.",
    subtitle: "We create thoughtfully designed fashion for all genders — quality apparel, footwear, and accessories that balance comfort, style, and everyday versatility.",
    ctaText: "Explore Our Collection",
    ctaLink: "/collection"
  };

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">{heroData.eyebrow}</span>
          <h1>{heroData.title}<br />{heroData.titleLine2}</h1>
          <p>{heroData.subtitle}</p>
          <div className="about-hero-cta">
            <Link to={heroData.ctaLink} className="btn about-btn">
              {heroData.ctaText}
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <h2>Our Story</h2>
          <div className="about-story-content">
            <p className="about-story-lead">
              <strong>Great design should feel effortless.</strong>
            </p>
            <p>
              G&A was founded on this simple belief. What began as a small idea has grown into a brand committed to creating fashion that works for everyone — products as practical as they are refined.
            </p>
            <p>
              We focus on quality materials, thoughtful details, and responsible production. Every piece we create is built to last, both in style and durability.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section light">
        <div className="about-container">
          <h2>What We Stand For</h2>
          <div className="values-grid">
            <div className="value">
              <div className="value-number">01</div>
              <h3>Quality First</h3>
              <p>
                Premium craftsmanship and materials that deliver lasting value. No shortcuts, ever.
              </p>
            </div>
            <div className="value">
              <div className="value-number">02</div>
              <h3>Timeless Design</h3>
              <p>
                Designs guided by longevity, not trends. Good style never expires.
              </p>
            </div>
            <div className="value">
              <div className="value-number">03</div>
              <h3>Responsible Choices</h3>
              <p>
                Trusted partners committed to ethical and sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <h2>How We Work</h2>
          <p className="about-process-intro">
            Every product is designed with your comfort and confidence in mind. Here's what that means for you:
          </p>
          <ul className="process-list">
            <li>
              <strong>Thoughtful Design</strong> — Products that fit your lifestyle, not just the moment
            </li>
            <li>
              <strong>Premium Materials</strong> — Quality fabrics and construction that last season after season
            </li>
            <li>
              <strong>Rigorous Testing</strong> — Every item checked for comfort, durability, and style before it reaches you
            </li>
            <li>
              <strong>Ongoing Refinement</strong> — We listen to feedback and continuously improve what we create
            </li>
          </ul>
        </div>
      </section>

      <section className="about-section light">
        <div className="about-container">
          <h2>Trusted by Thousands</h2>
          <p className="about-trust-intro">
            Our community grows through genuine recommendations and repeat customers. Here's what real shoppers are saying:
          </p>
          <div className="trust-stats">
            <div className="trust-stat-item">
              <strong>10K+</strong>
              <span>Happy Customers</span>
              <small>Based on verified purchases</small>
            </div>
            <div className="trust-stat-item">
              <strong>4.8★</strong>
              <span>Average Rating</span>
              <small>From customer reviews</small>
            </div>
            <div className="trust-stat-item">
              <strong>5+</strong>
              <span>Years of Craft</span>
              <small>Building trust since 2019</small>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <h2>Our Promise</h2>
          <p>
            We don't chase trends or overproduce. We create meaningful
            products, stand behind our quality, and treat every
            customer relationship with care and respect.
          </p>
          <p className="about-promise-close">Thank you for being part of our journey.</p>
          
        </div>
      </section>
    </main>
  );
}

export default About;
