import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import "../css/layout.css"


function Layout() {
  return (
    <div className="body-wrapper">
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
