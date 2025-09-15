import Icon from "../utilities/Icon";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar?: () => void; 
}


const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
  const [selectedValue, setSelectedValue] = useState("default");
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const user = router.options.context.auth.getUser();
  const role = user?.role || "client";

  const handleLogout = () => {
    router.options.context.auth.logout();
    router.navigate({ to: "/auth/login" });
  };

  const iconClass = `navbar-icon ${isSidebarOpen ? "open" : "collapsed"}`;

  return (
    <header>
      <div
        className="mic-icon"
        style={{
          width: isSidebarOpen ? "240px" : "48px",
          transition: "width 0.3s ease",
        }}
      >
        <Icon iconName="microphone" />
      </div>

      <div className="header-wrapper">
        <div className="logo">
          <h1 className="responsive-hide">Help Desk - Sky World Limited</h1>
          <h2
            style={{
              color: role === "vendor" ? "var(--text-blue)" : "#FD7E14",
            }}
            className="responsive-hide"
          >
            {role.toUpperCase()}
          </h2>
        </div>

        <div className="icon-search">
          <div className={iconClass}><Icon iconName="add" /></div>
          <div className={iconClass}><Icon iconName="search" /></div>
          <select
            name="search"
            id="select-institution"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="responsive-hide"
          >
            <option value="default" disabled>
              Select Institution
            </option>
            <option value="apstar">Apstar SACCO Limited</option>
            <option value="another">Another Institution</option>
          </select>

          <div className={iconClass}><Icon iconName="notification" /></div>

          <div className="avatar-dropdown">
            <div
              className={iconClass + " avatar-icon"}
              onClick={() => setShowDropdown(prev => !prev)}
            >
              <Icon iconName="avatar" />
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <p className="dropdown-user">{user?.username || user?.email}</p>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
