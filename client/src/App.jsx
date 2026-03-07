import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Orders";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Returns from "./pages/Returns";
import MyAccount from "./pages/MyAccount";
import Navbar from "./components/Navbar";
import "./index.css";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

const App = () => {
  return (
    <div className="MainDiv">
      <ScrollToTop />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/orderhistory" element={<Order />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;