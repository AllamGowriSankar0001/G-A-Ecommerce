import "../index.css";

const PrivacyPolicy = () => {
  return (
    <main className="about-page">
      <section className="about-section">
        <div className="about-container">
          <h2>Privacy Policy</h2>
          <p>
            At G&amp;A, we respect your privacy and are committed to protecting
            your personal data. This policy explains what information we
            collect, how we use it, and the choices you have.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We collect information you provide directly, such as your name,
            email, phone number, shipping address and order details when you
            create an account, place an order, or contact our support team.
          </p>

          <h3>2. How We Use Your Information</h3>
          <ul className="process-list">
            <li>To process and deliver your orders</li>
            <li>To communicate order updates, offers, and service messages</li>
            <li>To improve our website, products, and customer experience</li>
            <li>To detect and prevent fraud or misuse of our services</li>
          </ul>

          <h3>3. Sharing Your Information</h3>
          <p>
            We do not sell your personal data. We may share necessary
            information with trusted service providers (like payment gateways,
            logistics partners) who help us operate our business, under strict
            privacy obligations.
          </p>

          <h3>4. Your Choices &amp; Rights</h3>
          <p>
            You can update your account details at any time. If you wish to
            access, correct, or delete your data, please contact us at{" "}
            <strong>support@gaecommerce.com</strong>.
          </p>

          <h3>5. Contact Us</h3>
          <p>
            If you have any questions about this policy, reach out at{" "}
            <strong>support@gaecommerce.com</strong>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
