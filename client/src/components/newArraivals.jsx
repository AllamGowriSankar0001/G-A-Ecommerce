import React, { useEffect, useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { convertPrice, getCountryByName } from "../config/currencyConfig";


const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCountry, setUserCountry] = useState("India");

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${backendUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          const defaultAddress = data.user.addresses?.find((addr) => addr.isDefault) || data.user.addresses?.[0];
          setUserCountry(defaultAddress?.country || "India");
        }
      } catch (err) {
        console.error("Error fetching user country:", err);
        setUserCountry("India");
      }
    };
    fetchUserCountry();
  }, []);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(`${backendUrl}/products/allproducts`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        const sorted = (data.products || [])
          .filter((p) => p.isActive)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setProducts(sorted);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section id="new-arrivals" className="newarrivals-section">
      <h2 className="section-title">New Arrivals</h2>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="product-card loading">
              <div className="product-card-info"></div>
              <div className="image">
                <div className="product-img-loading" aria-hidden />
              </div>
              <h3 className="product-title loading"></h3>
              <div className="category-price">
                <span></span>
                <span className="price loading"></span>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="loading-text">No new arrivals available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="product-card-link"
            >
            <div key={product._id} className="product-card" style={{ height: "240px" ,paddingBottom: "0px"}}>
              <div className="product-card-info">
               </div>

              <div className="image" style={{ height: "160px" }}>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="product-img"
                  style={{ height: "160px" }}
                />
              </div>

              <h3 className="product-title">{product.title}</h3>

              <div className="category-price">
                <span>
                  {product.category} / {product.subCategory || "-"}
                </span>
                <span className="price">{getCountryByName(userCountry).symbol}{convertPrice(product.price, userCountry).toFixed(2)}</span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
