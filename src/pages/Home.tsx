import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <section className="tickets-page">
      <h1>Welcome Home</h1>
      <nav>
        <Link to="/vendor">Go to Vendor</Link>
        <br />
        <Link to="/client">Go to Client</Link>
      </nav>
    </section>
  );
};

export default Home;
