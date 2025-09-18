import React from "react";
import { Link, redirect } from "@tanstack/react-router";
import Icon from "../utils/Icon";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// 🔹 Role-based menu definitions
const menuConfig: Record<string, { icon: string; label: string; path: string }[]> = {
  admin: [
    { icon: "pie", label: "Odata Dashboard", path: "/pages/odata/" },
    { icon: "notes", label: "Subjects", path: "/pages/subjects" },
    { icon: "notepad", label: "Tasks", path: "/pages/tasks" },
    { icon: "users", label: "Users", path: "/admin/users" },
    { icon: "settings", label: "Settings", path: "/pages/settings" },
  ],
  trainee: [
    { icon: "pie", label: "Odata Dashboard", path: "/pages/odata/" },
    { icon: "notes", label: "Subjects", path: "/pages/subjects" },
    { icon: "notepad", label: "Tasks", path: "/pages/tasks" },
    { icon: "settings", label: "Settings", path: "/pages/settings" },
  ],
  vendor: [
    { icon: "pie", label: "Odata Dashboard", path: "/pages/odata/" },
    { icon: "settings", label: "Settings", path: "/pages/settings" },

  ],
  client: [
    { icon: "pie", label: "Odata Dashboard", path: "/pages/odata/" },
    { icon: "settings", label: "Settings", path: "/pages/settings" },
  ]
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role: string = user.role || "guest";

  const menuItems = menuConfig[role] || [];

  // Redirect to /auth/unauthorized
  if (!menuItems.length) {
    throw redirect({ to: "/auth/unauthorized" });
  }

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
        <Icon iconName={isOpen ? "close" : "open"} />{" "}
        <span className="sidebar-label">Close</span>
      </div>
    </aside>
  );
};

export default Sidebar;
