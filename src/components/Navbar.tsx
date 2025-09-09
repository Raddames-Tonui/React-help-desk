import { useLocation } from "react-router-dom";
import Icon from "../utilities/Icon";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isVendor = path.startsWith("/vendor");

  return (
    <header>
      <div className="mic-icon">
        <Icon iconName="microphone" />
      </div>

      <div className="header-wrapper">
        <div className="logo">
          <h1>Help Desk - Sky World Limited</h1>
          <h2 style={{
            color: isVendor ? "var(--text-blue)" : "#FD7E14"
          }}>{isVendor ? "VENDOR" : "CLIENT"}</h2>
        </div>
        <div className="icon-search">
          <Icon iconName="add" />
          <Icon iconName="search" />
          <select name="search" id="select-institution">
            <option value="" disabled selected>
              Select Institution
            </option>
            <option value="apstar">Apstar SACCO Limited</option>
            <option value="another">Another Institution</option>
          </select>

          <Icon iconName="notification" />
          <Icon iconName="avatar" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
