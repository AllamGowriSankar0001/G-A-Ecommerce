import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { convertPrice, getCountryByName } from "../config/currencyConfig";

const API = import.meta.env.VITE_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userCountry, setUserCountry] = useState("India");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const navigate = useNavigate();

  const fetchCountry = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        const addr =
          data.user.addresses?.find((a) => a.isDefault) ||
          data.user.addresses?.[0];
        setUserCountry(addr?.country || "India");
      }
    } catch {
      setUserCountry("India");
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load orders");
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    else {
      fetchOrders();
      fetchCountry();
    }
  }, [navigate, fetchOrders, fetchCountry]);

  const country = getCountryByName(userCountry);

  const formatStatus = (status) => {
    switch (status) {
      case "PLACED":
        return "Placed";
      case "SHIPPED":
        return "Shipped";
      case "OUT_FOR_DELIVERY":
        return "Out for delivery";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status || "Placed";
    }
  };

  const formatPayment = (method) => {
    if (!method) return "";
    return method.charAt(0) + method.slice(1).toLowerCase();
  };

  const statusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "order-status-placed";
      case "SHIPPED":
        return "order-status-shipped";
      case "OUT_FOR_DELIVERY":
        return "order-status-out";
      case "DELIVERED":
        return "order-status-delivered";
      case "CANCELLED":
        return "order-status-cancelled";
      default:
        return "";
    }
  };

  const getTimelineStepClass = (status, step) => {
    const statusOrder = { "PLACED": 0, "SHIPPED": 1, "OUT_FOR_DELIVERY": 2, "DELIVERED": 3 };
    const currentStep = statusOrder[status] ?? -1;
    return currentStep >= step ? "active" : "";
  };

  const getTimelineProgressClass = (status, step) => {
    const statusOrder = { "PLACED": 0, "SHIPPED": 1, "OUT_FOR_DELIVERY": 2, "DELIVERED": 3 };
    const currentStep = statusOrder[status] ?? -1;
    return currentStep > step ? "active" : "";
  };

  const toggleTimelineVisibility = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <main className="shopall">
        <div className="shopall-header">
          <h1>My orders</h1>
          <p>Loading your orders…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shopall">
        <div className="shopall-header">
          <h1>My orders</h1>
          <p className="loading-text">{error}</p>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={fetchOrders}
            style={{ marginTop: 12 }}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!orders.length) {
    return (
      <main className="shopall">
        <div className="shopall-header">
          <h1>My orders</h1>
          <p>You have not placed any orders yet.</p>
          <Link
            to="/collection"
            className="add-to-cart-btn"
            style={{ display: "inline-block", marginTop: 16, textDecoration: "none" }}
          >
            Start shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shopall">
      <div className="shopall-header">
        <h1>My orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>
      <div className="orders-page">
        {orders.map((order) => {
          const placed = new Date(order.createdAt);
          const total = convertPrice(order.totalAmount, userCountry);
          return (
            <article key={order._id} className="order-card">
              <header className="order-card-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8)}</p>
                  <p className="order-meta">
                    Placed on {placed.toLocaleDateString()} ·{" "}
                    {placed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className={`order-status-pill ${statusClass(order.status)}`}>
                  {formatStatus(order.status)}{order.paymentMethod ? ` · ${formatPayment(order.paymentMethod)}` : ""}
                </div>
              </header>
              <div className="order-items">
                {order.items.map((item, idx) => {
                  const p = item.product || {};
                  const qty = item.quantity || 1;
                  const lineTotal = convertPrice(
                    (item.priceAtOrder || 0) * qty,
                    userCountry
                  );
                  return (
                    <div key={`${order._id}-${idx}`} className="order-item">
                      <div className="order-item-image">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title || "Product"} />
                        ) : (
                          <div className="order-item-image-placeholder" />
                        )}
                      </div>
                      <div className="order-item-main">
                        <p className="order-item-title">
                          {p.title || "Product"}
                        </p>
                        <p className="order-item-meta">
                          {[item.size, item.color].filter(Boolean).join(" / ") || "—"} · Qty:{" "}
                          {qty}
                        </p>
                      </div>
                      <div className="order-item-total">
                        {country.symbol}
                        {lineTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <footer className="order-card-footer">
                <div>
                  <span>Total</span>
                  <span>
                    {country.symbol}
                    {total.toFixed(2)}
                  </span>
                </div>
                <button 
                  className="show-delivery-btn" 
                  onClick={() => toggleTimelineVisibility(order._id)}
                >
                  <i className="fa-solid fa-truck"></i>
                  {expandedOrders.has(order._id) ? "Hide" : "Show"} Delivery Status
                </button>
              </footer>
              {expandedOrders.has(order._id) && <div className="order-timeline">
                <div className={`timeline-step ${getTimelineStepClass(order.status, 0)}`}>
                  <div className="timeline-dot"></div>
                  <p className="timeline-label">Order Confirmed</p>
                </div>
                <div className="timeline-connector">
                  <div className={`connector-line ${getTimelineProgressClass(order.status, 0)}`}></div>
                </div>
                <div className={`timeline-step ${getTimelineStepClass(order.status, 1)}`}>
                  <div className="timeline-dot"></div>
                  <p className="timeline-label">Order Shipped</p>
                </div>
                <div className="timeline-connector">
                  <div className={`connector-line ${getTimelineProgressClass(order.status, 1)}`}></div>
                </div>
                <div className={`timeline-step ${getTimelineStepClass(order.status, 2)}`}>
                  <div className="timeline-dot"></div>
                  <p className="timeline-label">Out for Delivery</p>
                </div>
                <div className="timeline-connector">
                  <div className={`connector-line ${getTimelineProgressClass(order.status, 2)}`}></div>
                </div>
                <div className={`timeline-step ${getTimelineStepClass(order.status, 3)}`}>
                  <div className="timeline-dot"></div>
                  <p className="timeline-label">Order Delivered</p>
                </div>
              </div>}
              
             
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default Orders;