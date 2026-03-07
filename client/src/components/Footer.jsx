import "../index.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <NavLink to="/" className="navbar-logo">
            <img src="logo-white.png" alt="" />
          </NavLink>
          <p className="footer-text">
            Discover curated fashion, footwear and accessories with fast,
            reliable delivery from trusted sellers.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>
              <NavLink to="/collection">Shop All</NavLink>
            </li>
            <li>
              <NavLink to="/collection?category=Women">Women's Clothing</NavLink>
            </li>
            <li>
              <NavLink to="/collection?category=Men">Men's Clothing</NavLink>
            </li>
            
            <li>
              <NavLink to="/collection?category=Accessories">
                Accessories
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <NavLink to="/about">About Us</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/returns">Returns &amp; FAQ</NavLink>
            </li>
            <li>
              <NavLink to="/privacy">Privacy Policy</NavLink>
            </li>
            <li>
              <NavLink to="/terms">Terms &amp; Conditions</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>Email: support@gaecommerce.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Mon – Sat, 10:00 AM – 7:00 PM</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} G&A. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
