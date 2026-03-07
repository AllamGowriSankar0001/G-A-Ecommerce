import React from "react";
import "../index.css";

const TrustStrip = () => {
  const trustItems = [
    { 
      icon: "fa-truck", 
      title: "Free Shipping", 
      condition: "On orders over 8000₹",
      description: "Fast and reliable delivery to your doorstep"
    },
    { 
      icon: "fa-arrow-rotate-left", 
      title: "Easy Returns", 
      condition: "3-days hassle-free returns",
      description: "Not satisfied? Return it, no questions asked"
    },
    { 
      icon: "fa-lock", 
      title: "Best Quality", 
      condition: "Quality Products Guaranteed",
      description: "We use the best quality materials to make our products"
    }
  ];

  return (
    <section className="trust-strip">
      <div className="trust-strip-content">
        {trustItems.map((item, index) => (
          <div key={index} className="trust-item">
            <div className="trust-icon-wrapper">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div className="trust-text">
              <span className="trust-title">{item.title}</span>
              <span className="trust-condition">{item.condition}</span>
              <span className="trust-description">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;

