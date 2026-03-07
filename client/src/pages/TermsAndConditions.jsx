import "../index.css";

const TermsAndConditions = () => {
  return (
    <main className="about-page">
      <section className="about-section">
        <div className="about-container">
          <h2>Terms &amp; Conditions</h2>
          <p>
            By using the G&amp;A website and placing an order, you agree to the
            following terms and conditions. Please read them carefully.
          </p>

          <h3>1. Orders &amp; Payments</h3>
          <ul className="process-list">
            <li>All prices are shown in INR and include applicable taxes.</li>
            <li>
              Orders are confirmed only after successful payment authorization.
            </li>
            <li>
              We reserve the right to cancel or refuse any order in case of
              suspected fraud or incorrect pricing.
            </li>
          </ul>

          <h3>2. Shipping &amp; Delivery</h3>
          <p>
            Delivery timelines shown at checkout are estimates. Actual delivery
            may vary due to courier availability, location, and external
            factors.
          </p>

          <h3>3. Returns &amp; Refunds</h3>
          <p>
            Eligible items can be returned within the specified return window
            if they are unused, unwashed, and in original packaging. Refunds
            are issued to the original payment method after quality checks.
          </p>

          <h3>4. Use of Website</h3>
          <p>
            You agree not to misuse the website, attempt unauthorized access,
            or engage in any activity that disrupts our services or security.
          </p>

          <h3>5. Changes to Terms</h3>
          <p>
            We may update these terms from time to time. Continued use of the
            site after updates means you accept the revised terms.
          </p>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditions;
