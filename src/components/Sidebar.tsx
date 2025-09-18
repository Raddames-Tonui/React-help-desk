import React from "react";
import { Link } from "@tanstack/react-router";
import Icon from "../utils/Icon";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Role based menu
const menuConfig: Record<string, { icon: string, label: string, path: string }[]> = {
  admin: [
    {icon: "pie", label: "Odata Dashboard", path: "/"}
  ]
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = user.role || "guest";

  const menuItems = [
    { icon: "pie", label: "Odata Dashboard", path: "/pages/odata/" },
    {
      icon: "razor",
      label: role === "client" ? "Create Ticket" : "Existing Tickets",
      path: role === "client" ? "/pages/client" : "/pages/vendor",
    },
    { icon: "notepad", label: "Dummy Tickets", path: "/pages/vendor/dummy" },
    { icon: "notes", label: "Tasks" },
    { icon: "users", label: "Users" },
    { icon: "settings", label: "Settings" },
  ];

  return (
    <aside className="sidebar" style={{ width: isOpen ? "240px" : "48px" }}>
      <div className="aside-icons">
        {menuItems.map((item) => (
          <Link
            key={item.icon}
            to={item.path}
            className="sidebar-item"
            title={!isOpen ? item.label : ""}
          >
            <Icon iconName={item.icon} />
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="close-icon" onClick={toggleSidebar}>
        <Icon iconName={isOpen ? "close" : "open"} /> <span className="sidebar-label">Close</span>
      </div>
    </aside>
  );
};

export default Sidebar;
