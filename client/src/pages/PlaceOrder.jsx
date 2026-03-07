import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { convertPrice, getCountryByName, getShippingCostINR } from "../config/currencyConfig";

const API = import.meta.env.VITE_BACKEND_URL;
const token = () => localStorage.getItem("token");

const PlaceOrder = () => {
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [userCountry, setUserCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!token()) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [cartRes, userRes] = await Promise.all([
        fetch(`${API}/cart/getcart`, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);

      if (cartRes.status === 401 || userRes.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const cartData = await cartRes.json();
      const userData = await userRes.json();

      if (!cartRes.ok) throw new Error(cartData.message || "Failed to load cart");
      if (!userRes.ok || !userData.success) throw new Error(userData.message || "Failed to load account");

      setCart(cartData.cart);
      setUser(userData.user);

      const defaultAddress =
        userData.user.addresses?.find((addr) => addr.isDefault) || userData.user.addresses?.[0];
      setUserCountry(defaultAddress?.country || "India");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!token()) navigate("/login");
    else fetchData();
  }, [navigate, fetchData]);

  const items = cart?.items ?? [];
  const primaryAddress =
    user?.addresses && user.addresses.length ? user.addresses[0] : null;

  const totalINR = items.reduce(
    (sum, item) => sum + (item.priceAtAdd ?? item.product?.price ?? 0) * (item.quantity || 1),
    0
  );
  const country = getCountryByName(userCountry);
  const shippingINR = getShippingCostINR(userCountry, totalINR);
  const grandTotalINR = totalINR + shippingINR;
  const total = convertPrice(totalINR, userCountry);
  const shipping = convertPrice(shippingINR, userCountry);
  const grandTotal = convertPrice(grandTotalINR, userCountry);

  const handlePlaceOrder = async () => {
    if (!items.length || !primaryAddress) return;
    if (!token()) {
      navigate("/login");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch(`${API}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to place order");
      } else {
        // cart was cleared on the backend; let navbar/cart update
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        navigate("/orderhistory");
      }
    } catch (err) {
      alert("Something went wrong while placing the order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <main className="shopall">
        <div className="shopall-header">
          <h1>Review & place order</h1>
          <p>Loading your order…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shopall">
        <div className="shopall-header">
          <h1>Review & place order</h1>
          <p className="loading-text">{error}</p>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={fetchData}
            style={{ marginTop: 12 }}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="shopall">
        <div className="shopall-header">
          <h1>Review & place order</h1>
          <p>Your cart is empty.</p>
          <Link
            to="/collection"
            className="add-to-cart-btn"
            style={{ display: "inline-block", marginTop: 16, textDecoration: "none" }}
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shopall">
      <div className="shopall-header">
        <h1>Review & place order</h1>
        <p>Almost there – confirm your address and items.</p>
      </div>

      <div className="checkout-page">
        <div className="checkout-main">
          <section className="checkout-card">
            <h2 className="checkout-heading">Shipping address</h2>
            {primaryAddress ? (
              <div className="checkout-address">
                <p className="checkout-address-name">
                  {primaryAddress.fullName || user?.name}
                </p>
                <p>
                  {primaryAddress.street && <>{primaryAddress.street}<br /></>}
                  {primaryAddress.city && <>{primaryAddress.city}, </>}
                  {primaryAddress.state && <>{primaryAddress.state} </>}
                  {primaryAddress.postalCode && <>{primaryAddress.postalCode}<br /></>}
                  {primaryAddress.country}
                </p>
                {primaryAddress.phone && (
                  <p className="checkout-address-phone">
                    Phone: {primaryAddress.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="checkout-empty">
                No shipping address on file. Add one in your account to place an order.
              </p>
            )}
            <Link to="/myaccount" className="checkout-link">
              Edit address in My Account
            </Link>
          </section>

          <section className="checkout-card">
            <h2 className="checkout-heading">Items in your order</h2>
            <div className="checkout-items">
              {items.map((item, idx) => {
                const p = item.product;
                const pid = p?._id || p;
                const qty = item.quantity || 1;
                const unitPrice = item.priceAtAdd ?? p?.price ?? 0;
                const lineTotal = unitPrice * qty;
                return (
                  <div key={`${pid}-${item.size}-${item.color}-${idx}`} className="checkout-item">
                    <Link to={`/product/${pid}`} className="checkout-item-image">
                      {p?.images?.[0] ? (
                        <img src={p.images[0]} alt={p?.title} />
                      ) : (
                        <div className="product-img-placeholder" />
                      )}
                    </Link>
                    <div className="checkout-item-details">
                      <Link to={`/product/${pid}`} className="checkout-item-title">
                        {p?.title ?? "Product"}
                      </Link>
                      <div className="checkout-item-meta">
                        <span>{[item.size, item.color].filter(Boolean).join(" / ") || "—"}</span>
                        <span>
                          Qty: {qty} · {country.symbol}
                          {convertPrice(unitPrice, userCountry).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="checkout-item-total">
                      {country.symbol}
                      {convertPrice(lineTotal, userCountry).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="checkout-summary cart-summary">
          <h2 className="checkout-heading">Order summary</h2>
          <div className="checkout-payment">
            <p className="checkout-payment-label">Payment method</p>
            <div className="checkout-payment-options">
              <button
                type="button"
                className={paymentMethod === "COD" ? "checkout-pay-btn active" : "checkout-pay-btn"}
                onClick={() => setPaymentMethod("COD")}
              >
                Cash on delivery
              </button>
              <button
                type="button"
                className={paymentMethod === "UPI" ? "checkout-pay-btn active" : "checkout-pay-btn"}
                onClick={() => setPaymentMethod("UPI")}
              >
                UPI
              </button>
              <button
                type="button"
                className={paymentMethod === "RAZORPAY" ? "checkout-pay-btn active" : "checkout-pay-btn"}
                onClick={() => setPaymentMethod("RAZORPAY")}
              >
                Razorpay
              </button>
            </div>
          </div>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>
              {country.symbol}
              {total.toFixed(2)}
            </span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>
              {country.symbol}
              {shipping.toFixed(2)}
            </span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>
              {country.symbol}
              {grandTotal.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            className="cart-checkout-btn checkout-place-btn"
            disabled={placing || !primaryAddress}
            onClick={handlePlaceOrder}
          >
            {placing ? "Placing order…" : "Place order"}
          </button>
          {!primaryAddress && (
            <p className="checkout-note">
              Add a shipping address in your account to place the order.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
};

export default PlaceOrder;