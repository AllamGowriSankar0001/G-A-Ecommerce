import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { convertPrice, getCountryByName } from "../config/currencyConfig";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [subCategoryProducts, setSubCategoryProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userCountry, setUserCountry] = useState("India");
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const showToast = (message, type = "info") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "info" });
    }, 4000);
  };

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
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
  }, [backendUrl]);

  async function fetchProduct() {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/products/getproduct/${id}`
      );
      const data = await response.json();
      setProduct(data.product);
      console.log("Fetched Product:", data.product);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelatedProducts(nextProduct) {
    if (!nextProduct) return;

    const category = nextProduct.category;
    const subCategory = nextProduct.subCategory;
    const currentId = nextProduct._id;

    setRelatedLoading(true);
    setRelatedError("");

    try {
      if (subCategory) {
        const subRes = await fetch(
          `${backendUrl}/products/getproductbysubcategory/${encodeURIComponent(
            subCategory
          )}`
        );
        const subData = await subRes.json();

        const subItems =
          subData.productsBySubCategory ||
          subData.productsBysubCategory ||
          [];

        setSubCategoryProducts(
          subItems
            .filter((p) => p._id !== currentId)
            .slice(0, 7)
        );
      } else {
        setSubCategoryProducts([]);
      }

      if (category) {
        const catRes = await fetch(
          `${backendUrl}/products/getproductsbycategory/${encodeURIComponent(
            category
          )}`
        );
        const catData = await catRes.json();

        const catItems = catData.productsByCategory || [];

        setCategoryProducts(
          catItems
            .filter((p) => p._id !== currentId).reverse()
            .slice(0, 7)
        );
      } else {
        setCategoryProducts([]);
      }
    } catch (err) {
      setRelatedError("Failed to fetch related products");
      setSubCategoryProducts([]);
      setCategoryProducts([]);
    } finally {
      setRelatedLoading(false);
    }
  }
  async function addToCart() {
    if (!selectedSize) {
      showToast("Please select a size before adding to cart.", "warning");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please log in to add items to your cart.", "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/cart/addtocart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          size: selectedSize,
          color: "Default",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast("Product added to cart successfully!", "success");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else if (response.status === 401) {
        const msg =
          data.message === "User not found"
            ? "Your session has expired or your account was not found. Please log in again."
            : data.message === "Invalid token"
              ? "Your session has expired. Please log in again."
              : data.message === "No token provided"
                ? "Please log in to add items to your cart."
                : data.message || "Please log in to add items to your cart.";
        showToast(msg, "error");
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 1500);
      } else {
        showToast(data.message || "Failed to add product to cart.", "error");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("Something went wrong. Please try again.", "error");
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product?._id) {
      fetchRelatedProducts(product);
      setQuantity(1);
      setSelectedSize("");
    }
  }, [product?._id]);
  if (loading) return <p>Loading...</p>;

  return (
    <>
      {toast.visible && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      <div className="product-container">
        <div className="images-container">
          <div className="images">
            {product?.images?.map((img, key) => (
              <img
                src={img}
                key={key}
                alt={product.title}
                className={image === img ? "active-thumb" : ""}
                onClick={() => setImage(img)}
              />
            ))}
          </div>

          <div className="imagee">
            <img src={image} alt={product.title} />
          </div>
        </div>

        <div className="product-content">
          <div className="category-product">
            <span>{product.subCategory.replace("-", " ").toUpperCase()}</span>
            <span>/</span>
            <span>{product.productType.toUpperCase()}</span>
          </div>

          <h1 className="title-product">{product.title}</h1>

          <div className="rating-product">
            <span>{product.averageRating.toFixed(1)}</span>
            <i className="fa-solid fa-star"></i>
            <span className="stock">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="price-product">
            <h2>{getCountryByName(userCountry).symbol} {convertPrice(product.price, userCountry).toFixed(2)}/-</h2>
          </div>

          <div className="description-product">
            <p>{product.description}</p>
          </div>

          <div className="sizes-products">
            <h4>Select Size</h4>
            <div className="sizes-list">
              {product?.sizes?.map((size, index) => (
                <button
                  key={index}
                  className={selectedSize === size ? "active-size" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="quantity" style={{ margin: "20px 0px" }}>
            <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}><i className="fa-solid fa-minus"></i></button>
            <span style={{ padding: "0px 20px", width: "50px" }}>{quantity}</span>
            <button onClick={() => setQuantity(prev => prev + 1)}> <i className="fa-solid fa-plus"></i> </button>
          </div>
          <button className="add-to-cart-btn" onClick={addToCart} disabled={product.stock === 0}>
            <pre style={{ fontSize: "0.8rem", fontFamily: "Poppins" }}>Add To Cart  <i className="fa-solid fa-cart-shopping"></i>   -   {getCountryByName(userCountry).symbol}{convertPrice(product.price * quantity, userCountry).toFixed(2)}</pre>
          </button>
        </div>
      </div>

      <div className="related-products">
        <div
          style={{ width: "100%", padding: "20px 65px" }}
          className="related-products-container"
        >
          <h2 style={{ marginBottom: "10px" }}>
            More in{" "}
            {(product?.subCategory || "")
              .replace("-", " ")
              .toUpperCase()}
          </h2>

          {relatedLoading ? (
            <p>Loading...</p>
          ) : relatedError ? (
            <p className="loading-text">{relatedError}</p>
          ) : subCategoryProducts.length === 0 ? (
            <p className="loading-text">No products found.</p>
          ) : (
            <div className="product-grid1">
              {subCategoryProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="product-card-link"
                >
                  <div className="product-card">
                    <div className="product-card-info"></div>
                    <div className="image">
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        className="product-img"
                      />
                    </div>
                    <h3 className="product-title">{p.title}</h3>
                    <div className="category-price">
                      <span>
                        {p.category} / {p.subCategory || "-"}
                      </span>
                      <span className="price">{getCountryByName(userCountry).symbol}{convertPrice(p.price, userCountry).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          style={{ width: "100%", padding: "20px 65px" }}
          className="related-products-container"
        >
          <h2 style={{ marginBottom: "10px" }}>
            More in {(product?.category || "").toUpperCase()}
          </h2>

          {relatedLoading ? (
            <p>Loading...</p>
          ) : relatedError ? (
            <p className="loading-text">{relatedError}</p>
          ) : categoryProducts.length === 0 ? (
            <p className="loading-text">No products found.</p>
          ) : (
            <div className="product-grid1">
              {categoryProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="product-card-link"
                >
                  <div className="product-card">
                    <div className="product-card-info"></div>
                    <div className="image">
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        className="product-img"
                      />
                    </div>
                    <h3 className="product-title">{p.title}</h3>
                    <div className="category-price">
                      <span>
                        {p.category} / {p.subCategory || "-"}
                      </span>
                      <span className="price">{getCountryByName(userCountry).symbol}{convertPrice(p.price, userCountry).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;