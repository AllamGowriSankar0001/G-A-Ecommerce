import React, { useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  const tabs = ["All", "Men", "Women", "Accessories"];

  const categories = {
    All: [
      {
        name: "Top Wear",
        searchcategory: "Top",
        image: "t-shirt.jpg",
        subcategories: ["T-Shirts", "Shirts", "Jackets", "Sweaters / Hoodies"],
      },
      {
        name: "Bottom Wear",
        searchcategory: "Bottom",
        image: "jeans.jpg",
        subcategories: ["Jeans", "Trousers / Chinos", "Shorts"],
      },
      {
        name: "Footwear",
        searchcategory: "men-footwear",
        image: "shoes.jpg",
        subcategories: ["Shoes", "Sneakers / Casual", "Formal"],
      },
      {
        name: "Ethnic Wear",
        searchcategory: "Ethnic",
        image: "lehanga.jpg",
        subcategories: ["Lehangas", "Sarees", "Kurtis / Tunics"],
      },
      {
        name: "Western Wear",
        searchcategory: "Western",
        image: "dress.jpg",
        subcategories: ["Tops / Blouses", "Dresses", "Jeans / Pants"],
      },
      {
        name: "Women's Footwear",
        searchcategory: "women-footwear",
        image: "women-shoes.jpg",
        subcategories: ["Shoes", "Heels / Flats"],
      },
      {
        name: "Watches",
        searchcategory: "watches",
        image: "watch.jpg",
        subcategories: ["Analog Watches", "Digital Watches", "Smart Watches"],
      },
      {
        name: "Sunglasses",
        searchcategory: "sunglasses",
        image: "sunglasses.jpg",
        subcategories: ["Aviator", "Wayfarer", "Round", "Sport Sunglasses"],
      },
      {
        name: "Bags",
        searchcategory: "bags",
        image: "bag.jpg",
        subcategories: ["Handbags", "Backpacks", "Clutches", "Travel Bags"],
      },
      {
        name: "Belts",
        searchcategory: "belts",
        image: "belts.jpg",
        subcategories: ["Leather Belts", "Casual Belts"],
      },
      {
        name: "Hats",
        searchcategory: "hats",
        image: "hats.jpg",
        subcategories: ["Caps", "Beanies"],
      },
    ],
  };

  const handleCategoryClick = (name) => {
    navigate(`/collection?search=${encodeURIComponent(name)}`);
  };

  return (
    <section id="categories" className="categories-section">
      <h2 className="section-title">Shop by Category</h2>

      <div className="category-content">
        <div key={activeTab} className="category-card-container">
          {categories[activeTab] && categories[activeTab].length > 0 ? (
            categories[activeTab].map((item, index) => (
              <div
                key={item.name}
                className={`category-item item${index + 1}`}
                onClick={() => handleCategoryClick(item.searchcategory)}
                style={{ cursor: "pointer" }}
              >
                <div className="category-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="category-overlay"></div>
                  <p className="category-label">{item.name}</p>
                </div>

                {item.subcategories?.length > 0 && (
                  <div className="category-subcategories">
                    <span className="category-subcategory-text">
                      {item.subcategories.join(" • ")}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="category-empty-state">
              <p className="category-empty-text">
                No categories available at the moment.
              </p>
              <a href="/shop" className="category-empty-cta">
                Browse All Products
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;