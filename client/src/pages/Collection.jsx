import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { convertPrice, getCountryByName } from "../config/currencyConfig";



const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortoption, setSortoption] = useState("relevance")
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState(null)
  const [userCountry, setUserCountry] = useState("India");
  const filter = searchParams.get("filter");
  const category = searchParams.get("category");
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  
  useEffect(() => {
    setCategories(category);

  }, [category]);

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
    const fetchallproducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/products/allproducts`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        const allproducts = (data.products)
        setProducts(allproducts);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchallproducts();
  }, []);
  let result = [...products];

  if (category) {
    result = result.filter(
      (product) =>
        product.category.toLowerCase() === category.toLowerCase()
    );
  }

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter((product) => {
      const title = (product?.title ?? "").toLowerCase();
      const cat = (product?.category ?? "").toLowerCase();
      const sub1 = (product?.subcategory ?? "").toLowerCase();
      const sub2 = (product?.subCategory ?? "").toLowerCase();
      const type1 = (product?.productType ?? "").toLowerCase();
      const type2 = (product?.producttype ?? "").toLowerCase();

      return (
        title.includes(query) ||
        cat.includes(query) ||
        sub1.includes(query) ||
        sub2.includes(query) ||
        type1.includes(query) ||
        type2.includes(query)
      );
    });
  }

  switch (sortoption) {
    case "lowtohigh":
      result.sort((a, b) => a.price - b.price);
      break;
    case "hightolow":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      break;
  }

  const sortedproducts = result;
  const handleSortChange = (e) => {
    setSortoption(e.target.value);
  };
  return (
    <div className='shopall'>
      <div className="shopall-header">
        {
          categories == "Men" ? <>
            <h1>Men's Wear</h1>
            <p style={{ fontSize: "0.8rem" }}>Apparel, footwear & accessories for men</p> </>
            : categories == "Women" ? <>
              <h1>Women's Wear</h1>
              <p style={{ fontSize: "0.8rem" }}>Apparel, footwear & accessories for women</p></>
              : categories == "Accessories" ? <>
                <h1>Accessories</h1>
                <p style={{ fontSize: "0.8rem" }}>Watches, bags, belts & more</p></>
                : categories == "Shoes" ? <>
                  <h1>Shoes</h1>
                  <p style={{ fontSize: "0.8rem" }}>Casual, formal & sports footwear for every occasion</p>
                </> : <>
                  <h1>Shop All</h1> <p style={{ fontSize: "0.8rem" }}>Browse our complete collection

                  </p></>
        }



      </div>
      <div className="filter-section">
        <div className='search'>
          <i className="fa-solid fa-magnifying-glass search-icon" title="Search"></i>

          <input
            type="text"
            placeholder="Search by title, category, subcategory, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='selection'>
          <i className="fa-solid fa-sliders"></i>
          <select name="relevant" id="relevant" value={sortoption} onChange={handleSortChange}>
            <option value="relevance">Relevance</option>
            <option value="lowtohigh">Price: Low To High</option>
            <option value="hightolow">Price: High To Low</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      <div className="collection">
        <section id="best" className="popular-section">

          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="product-card loading">
                  <div className="product-card-info" />
                  <div className="image">
                    <div className="product-img-loading" aria-hidden />
                  </div>
                  <h3 className="product-title loading" />
                  <div className="category-price">
                    <span className="loading" />
                    <span className="price loading" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedproducts.length === 0 ? (
            <p className="loading-text">No products found.</p>
          ) : (
            <div className="product-grid">
              {sortedproducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="product-card-link"
                >
                  <div className="product-card">
                    <div className="product-card-info">
                    </div>

                    <div className="image">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="product-img"
                        />
                      ) : (
                        <div className="product-img product-img-placeholder" aria-hidden />
                      )}
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
      </div>

    </div>
  )
}

export default Collection
