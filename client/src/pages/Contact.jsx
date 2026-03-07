import "../index.css";

const Contact = () => {
  return (
    <main className="about-page">
      <section className="about-section contact-section">
        <div className="contact-layout">
          <div className="contact-copy">
            <h2>We are here to help!</h2>
            <p>
              Let us know how we can best serve you. Use the contact form to
              email us or select from the topics below that best fit your needs.
              It&apos;s an honor to support you in your journey towards better
              health.
            </p>
          </div>

          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="contact-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="contact-input"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              className="contact-input"
            />
            <textarea
              name="message"
              placeholder="Comment"
              className="contact-textarea"
              rows={4}
              required
            />
            <button type="submit" className="contact-submit">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;