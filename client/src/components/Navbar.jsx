import React, { useEffect, useState } from "react";
import "../index.css";
import { NavLink, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [usertoken, setUsertoken] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const fetchCartCount = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      return;
    }
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/cart/getcart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = data?.cart?.items ?? [];
        const count = items.reduce((n, i) => n + (i.quantity || 1), 0);
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUsertoken(!!token);
    if (token) fetchCartCount();
    else setCartCount(0);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => fetchCartCount();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsertoken(false);
  }
  return (
    <div className="navbar">
      <NavLink to="/" className="navbar-logo">
        <img src="logo.png" alt="" />
      </NavLink>

      <ul className="navbar-links">
        <NavLink to="/collection">
          <li>Shop All</li>
        </NavLink>
        <NavLink to="/collection?category=Men">
          <li>Men</li>
        </NavLink>
        <NavLink to="/collection?category=Women">
          <li>Women</li>
        </NavLink>
        <NavLink to="/collection?category=Accessories">
          <li>Accessories</li>
        </NavLink>
        <NavLink to="/collection?category=Shoes">
          <li>Shoes</li>
        </NavLink>
      </ul>

      <div className="navbar-right">
        <div className="profile-container">
          <i
            className="fa-solid fa-user nav-icon"
            title="Account"
            aria-haspopup="true"
            aria-expanded="false"
          ></i>
          <div className="profile-dropdown">
            <div className="profile-header">
              <div className="profile-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="profile-header-text">
                <span className="profile-name">Your account</span>
                <span className="profile-email">
                  Manage orders & personal info
                </span>
              </div>
            </div>
            <div className="profile-divider" />
            <div className="profile-menu">
              {
                usertoken ? (
                  <>
                    <Link to="/orderhistory" className="profile-menu-item">
                      <i className="fa-solid fa-box"></i>
                      <span>My Orders</span>
                    </Link>
                    <Link to="/myaccount" className="profile-menu-item">
                      <i className="fa-solid fa-user"></i>
                      <span>My Account</span>
                    </Link>
                    <Link to="/login" className="profile-menu-item" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i>
                      <span>Logout</span>
                    </Link>
                  </>
                ) :
                  (
                    <>
                      <Link to="/login" className="profile-menu-item">
                        <i className="fa-solid fa-user"></i>
                        <span>Login</span>
                      </Link>
                      <Link to="/signup" className="profile-menu-item">
                        <i className="fa-solid fa-user-plus"></i>
                        <span>Signup</span>
                      </Link>
                    </>
                  )

              }


            </div>
          </div>
        </div>

        {
          usertoken ? (


            <Link to="/cart" className="cart-container" title="Cart">
              <i className="fa-solid fa-cart-shopping nav-icon"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? "99+" : cartCount}</span>}
            </Link>
          ) :
            (
              null
            )
        }

        <i
          className="fa-solid fa-ellipsis-vertical nav-icon menu-icon" onClick={() => setVisible(true)}
          title="Menu"
        ></i>

        {visible && (
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <NavLink to="/" className="navbar-logo" onClick={() => setVisible(false)}>
                <img src="logo.png" alt="" />
              </NavLink>
              <span className="close-menu" onClick={() => setVisible(false)}>
                ✕
              </span>
            </div>

            <div className="mobile-menu-content">
              <div className="mobile-menu-section">
                <div className="mobile-menu-section-label">Shop</div>
                <NavLink to="/collection" onClick={() => setVisible(false)} className="mobile-menu-link">
                  <span>Shop All</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
                <NavLink to="/collection?category=Men" onClick={() => setVisible(false)} className="mobile-menu-link">
                  <span>Men</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
                <NavLink to="/collection?category=Women" onClick={() => setVisible(false)} className="mobile-menu-link">
                  <span>Women</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
                <NavLink to="/collection?category=Accessories" onClick={() => setVisible(false)} className="mobile-menu-link">
                  <span>Accessories</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
                <NavLink to="/collection?category=Shoes" onClick={() => setVisible(false)} className="mobile-menu-link">
                  <span>Shoes</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
              </div>

              <div className="mobile-menu-divider"></div>

              <div className="mobile-menu-section">
                <div className="mobile-menu-section-label">Account</div>
                {
                  usertoken ? (
                    <>
                      <Link to="/orderhistory" onClick={() => setVisible(false)} className="mobile-menu-link">
                        <span>My Orders</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </Link>
                      <Link to="/myaccount" onClick={() => setVisible(false)} className="mobile-menu-link">
                        <span>My Account</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </Link>
                      <Link
                        to="/login"
                        className="mobile-menu-link"
                        onClick={() => {
                          handleLogout();
                          setVisible(false);
                        }}
                        style={{color:"red"}}

                      >
                        <span>Logout</span>
                        <i className="fa-solid fa-right-from-bracket" style={{color:"red"}}></i>
                      </Link>
                    </>
                  ) :
                    (
                      <>
                        <Link to="/login" onClick={() => setVisible(false)} className="mobile-menu-link">
                          <span>Login</span>
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                        <Link to="/signup" onClick={() => setVisible(false)} className="mobile-menu-link">
                          <span>Signup</span>
                          <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                      </>
                    )
                }
              </div>

              <div className="mobile-menu-divider"></div>

              <div className="mobile-menu-section">
                <div className="mobile-menu-section-label">Help</div>
                <NavLink
                  to="/contact"
                  onClick={() => setVisible(false)}
                  className="mobile-menu-link"
                >
                  <span>Contact Us</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
                <NavLink
                  to="/returns"
                  onClick={() => setVisible(false)}
                  className="mobile-menu-link"
                >
                  <span>Returns & FAQ</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
              </div>

              <div className="mobile-menu-divider"></div>

              <div className="mobile-menu-section">
                <NavLink to="/about" onClick={() => setVisible(false)} className="mobile-menu-link">
                  <span>Our Story</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
