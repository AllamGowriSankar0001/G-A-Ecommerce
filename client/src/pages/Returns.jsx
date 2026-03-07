import "../index.css";
import { useState } from "react";

const faqs = [
  {
    question: "When will my order ship?",
    answer:
      "Orders are usually processed and shipped within 1–3 business days. During sale periods or product launches this can extend slightly, but we’ll always keep you updated by email. You’ll receive a tracking link as soon as your order is on the way.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. Available shipping options, estimated delivery times and charges are shown at checkout once you enter your address. Please note that any customs duties or import taxes are the responsibility of the recipient.",
  },
  {
    question: "Do you accept returns or exchanges?",
    answer:
      "We offer a 30‑day return window from the date of delivery for unused items with original tags and packaging intact. To start a return, go to your Order History and select the order you’d like to return, then follow the guided steps. Some items (such as final‑sale or hygiene‑sensitive products) may not be eligible for return and will be clearly marked on the product page.",
  },
  {
    question: "Where’s my refund?",
    answer:
      "Once we receive and inspect your returned items, refunds are processed within 5–7 business days to your original payment method. Your bank or payment provider may take a little longer to post the funds to your account. If it has been more than 10 business days, please contact our support team with your order ID so we can investigate.",
  },
  {
    question: "Do you wholesale?",
    answer:
      "Yes, we’re happy to discuss wholesale and bulk ordering. For wholesale enquiries, please reach out to us via the contact page with your store or business details, the products you’re interested in and your estimated order volume, and our team will respond with pricing and timelines.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "If you need to update your shipping address, change items or cancel your order, please contact us as soon as possible. We can usually make changes before the order has been packed or shipped. Once an order is dispatched, changes are no longer possible, but you may still be able to return eligible items after delivery.",
  },
  {
    question: "My item arrived damaged. What should I do?",
    answer:
      "We’re sorry if anything arrives damaged or faulty. Please take clear photos of the product and packaging and contact us within 48 hours of delivery. Our team will help arrange a replacement or refund in line with our returns policy and may request that the item be collected for inspection.",
  },
  {
    question: "Privacy policy",
    answer:
      "We only use your data to process orders, support your experience on the site, and comply with legal obligations. We never sell your information to third parties. You can read the full policy and manage your preferences at any time on our Privacy Policy page.",
  },
  {
    question: "Terms of use",
    answer:
      "By using this site you agree to our terms regarding orders, pricing, promotions, intellectual property and limitations of liability. Please refer to the Terms & Conditions page for full details before placing an order.",
  },
];

const Returns = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="about-page">
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="faq-title">Shop FAQs</h2>
          <p className="faq-subtitle">
            Find answers to our most frequently asked questions below. If you
            can&apos;t find what you&apos;re looking for, please contact us and
            we&apos;ll get in touch within 24 hours.
          </p>

          <div className="faq-list">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.question}
                  className={`faq-item ${isOpen ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggle(index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Returns;

