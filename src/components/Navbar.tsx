import Icon from "../utilities/Icon";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

const Navbar = () => {
  const [selectedValue, setSelectedValue] = useState("default");
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const user = router.options.context.auth.getUser();
  const role = user?.role || "client"; 

  const handleLogout = () => {
    router.options.context.auth.logout();
    router.navigate({ to: "/auth/login" });
  };

  return (
    <header>
      <div className="mic-icon">
        <Icon iconName="microphone" />
      </div>

      <div className="header-wrapper">
        <div className="logo">
          <h1>Help Desk - Sky World Limited</h1>
          <h2
            style={{
              color: role === "vendor" ? "var(--text-blue)" : "#FD7E14",
            }}
          >
            {role.toUpperCase()}
          </h2>
        </div>

        <div className="icon-search">
          <Icon iconName="add" />
          <Icon iconName="search" />
          <select
            name="search"
            id="select-institution"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="default" disabled>
              Select Institution
            </option>
            <option value="apstar">Apstar SACCO Limited</option>
            <option value="another">Another Institution</option>
          </select>

          <Icon iconName="notification" />

          <div className="avatar-dropdown">
            <div
              className="avatar-icon"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer" }}
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
