import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/categories";
import Bestseller from "../components/BestSeller";
import NewArrivals from "../components/newArraivals";
import TrustStrip from "../components/TrustStrip";

const Home = () => {
  return (
    <main className="stacked-home">
      <section className="stacked-section stacked-hero">
        <Hero />
      </section>

      {/* <section className="stacked-section stacked-categories">
      </section> */}

      <section className="stacked-section stacked-bestseller">
        <Categories />
        <Bestseller />
        <NewArrivals />
      <TrustStrip />
      </section>
{/* 
      <section className="stacked-section stacked-newarrivals">
      </section> */}
{/* 
      <section className="stacked-section stacked-trust">
      </section> */}
    </main>
  );
};

export default Home;