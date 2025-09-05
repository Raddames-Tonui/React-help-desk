import { Outlet, Link } from "react-router-dom";
import LeftBar from "../utilities/Icon";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <div>
      <header>
        {/* <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/vendor">About</Link> |{" "}
          <Link to="/Client">Dashboard</Link>
        </nav> */}
        <Navbar/>
      </header>

      <LeftBar iconName="avatar" iconLabel="Profile"/>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
