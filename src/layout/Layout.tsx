import { Outlet, Link } from "react-router-dom";
import LeftBar from "../utilities/Icon";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import "../css/layout.css"

function Layout() {
  return (
    <div className="body-wrapper">
        {/* <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/vendor">About</Link> |{" "}
          <Link to="/Client">Dashboard</Link>
        </nav> */}
      <Navbar />
      <Sidebar/>


      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}

export default Layout;
