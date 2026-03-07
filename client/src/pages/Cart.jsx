import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { convertPrice, getCountryByName, getShippingCostINR } from "../config/currencyConfig";

const API = import.meta.env.VITE_BACKEND_URL;
const token = () => localStorage.getItem("token");

const cartApi = async (path, opts = {}) => {
  const res = await fetch(`${API}/cart/${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

const Page = ({ children }) => (
  <main className="shopall">
    <div className="shopall-header">
      <h1>Your Cart</h1>
      {children}
    </div>
  </main>
);

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [userCountry, setUserCountry] = useState("India");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        const defaultAddress = data.user.addresses?.find((addr) => addr.isDefault) || data.user.addresses?.[0];
        setUserCountry(defaultAddress?.country || "India");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUserCountry("India");
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!token()) return navigate("/login");
    setLoading(true);
    setError("");
    try {
      const { ok, status, data } = await cartApi("getcart");
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (!ok) throw new Error(data.message || "Failed to load cart");
      setCart(data.cart);
      await fetchUserProfile();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [navigate, fetchUserProfile]);

  useEffect(() => {
    if (!token()) navigate("/login");
    else refresh();
  }, [navigate, refresh]);

  const apply = (data) => {
    setCart(data.cart);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const action = async (path, opts) => {
    const { ok, data } = await cartApi(path, opts);
    if (ok) apply(data);
    else alert(data.message || "Something went wrong");
  };

  const onQty = (productId, size, color, qty) => {
    if (qty < 1) onRemove(productId, size, color);
    else action("updatequantity", { method: "PUT", body: JSON.stringify({ productId, quantity: qty, size, color }) });
  };

  const onRemove = (productId, size, color) => {
    const qs = new URLSearchParams();
    if (size) qs.set("size", size);
    if (color) qs.set("color", color);
    action(`removefromcart/${productId}${qs.toString() ? `?${qs}` : ""}`, { method: "DELETE" });
  };

  if (loading) return <Page><p>Loading...</p></Page>;
  if (error) return <Page><p className="loading-text">{error}</p><button type="button" className="add-to-cart-btn" onClick={refresh} style={{ marginTop: 12 }}>Try again</button></Page>;

  const items = cart?.items ?? [];
  const totalINR = items.reduce((s, i) => s + (i.priceAtAdd ?? i.product?.price ?? 0) * (i.quantity || 1), 0);
  
  // Get country info and calculate costs
  const country = getCountryByName(userCountry);
  const shippingINR = getShippingCostINR(userCountry, totalINR);
  const grandTotalINR = totalINR + shippingINR;
  
  // Convert all prices to target currency
  const total = convertPrice(totalINR, userCountry);
  const shipping = convertPrice(shippingINR, userCountry);
  const grandTotal = convertPrice(grandTotalINR, userCountry);

  if (!items.length) return <Page><p>Your cart is empty.</p><Link to="/collection" className="add-to-cart-btn" style={{ display: "inline-block", marginTop: 16, textDecoration: "none" }}>Continue shopping</Link></Page>;

  return (
    <main className="shopall">
      <div className="shopall-header">
        <h1>Your Cart</h1>
        <p>{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
      </div>
      <div className="cart-page">
        <div className="cart-items">
          {items.map((item, idx) => {
            const p = item.product;
            const pid = p?._id || p;
            const qty = item.quantity || 1;
            const price = item.priceAtAdd ?? p?.price ?? 0;
            return (
              <div key={`${pid}-${item.size}-${item.color}-${idx}`} className="cart-item-row">
                <Link to={`/product/${pid}`} className="cart-item-image">
                  {p?.images?.[0] ? <img src={p.images[0]} alt={p?.title} /> : <div className="product-img-placeholder" />}
                </Link>
                <div className="cart-item-details">
                  <Link to={`/product/${pid}`} className="cart-item-title">{p?.title ?? "Product"}</Link>
                  <div className="cart-item-meta">
                    <span className="cart-item-variant">{[item.size, item.color].filter(Boolean).join(" / ") || "—"}</span>
                    <span className="cart-item-price">{country.symbol}{(convertPrice(price, userCountry)).toFixed(2)}</span>
                  </div>
                </div>
                <div className="cart-item-qty">
                  <button type="button" className="qty-btn" onClick={() => onQty(pid, item.size, item.color, qty - 1)} aria-label="Decrease">−</button>
                  <span className="qty-value">{qty}</span>
                  <button type="button" className="qty-btn" onClick={() => onQty(pid, item.size, item.color, qty + 1)} aria-label="Increase">+</button>
                </div>
                <div className="cart-item-total">
                  <span className="item-total-price">{country.symbol}{(convertPrice(price * qty, userCountry)).toFixed(2)}</span>
                </div>
                <button type="button" className="cart-item-remove" onClick={() => onRemove(pid, item.size, item.color)} title="Remove" aria-label="Remove">
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            );
          })}
        </div>
        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="cart-summary-row"><span>Subtotal</span><span>{country.symbol}{total.toFixed(2)}</span></div>
          <div className="cart-summary-row"><span>Shipping</span><span>{country.symbol}{shipping.toFixed(2)}</span></div>
          <div className="cart-summary-row total"><span>Total</span><span>{country.symbol}{grandTotal.toFixed(2)}</span></div>
          <Link to="/placeorder" className="cart-checkout-btn">Proceed to checkout</Link>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
