import React from "react";
import { Link } from "react-router-dom";
import "../css/index.css"

const Home: React.FC = () => {
  return (
    <section className="home-page">
      <h1>REACT + TYPESCYPT</h1>
      <nav>
        <ul>
          <li><Link to="/vendor">Go to Vendor</Link></li>
          <li><Link to="/client">Go to Client</Link></li>
          <li><Link to="/odata">ODATA Table</Link></li>
        </ul>
      </nav>
    </section>
  );
};

export default Home;
