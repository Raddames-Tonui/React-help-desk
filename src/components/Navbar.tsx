import { useState } from "react";
import { useAuth } from "@/hooks/hooks.tsx";
import Icon from "@/utils/Icon";

interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
    const [selectedValue, setSelectedValue] = useState("default");
    const [showDropdown, setShowDropdown] = useState(false);

    const { user, logout } = useAuth();
    const role = user?.role || "";

    const handleLogout = () => logout();

    const iconClass = `navbar-icon ${isSidebarOpen ? "open" : "collapsed"}`;

    // Determine color based on role
    const roleColor = (() => {
        switch (role) {
            case "vendor":
                return "var(--text-blue)";
            case "admin":
                return "#FD7E14";
            case "trainee":
                return "#28A745";
            default:
                return "black";
        }
    })();

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
                    <h1 className="responsive-hide">{user?.company || "Company Name"}</h1>
                    <h2 style={{ color: roleColor }} className="responsive-hide">
                        {role.toUpperCase()}
                    </h2>
                </div>

                <div className="icon-search">
                    <div className={iconClass}>
                        <Icon iconName="add" />
                    </div>
                    <div className={iconClass}>
                        <Icon iconName="search" />
                    </div>

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

                    <div className={iconClass}>
                        <Icon iconName="notification" />
                    </div>

                    <div className="avatar-dropdown">
                        <div
                            className={iconClass + " avatar-icon"}
                            onClick={() => setShowDropdown((prev) => !prev)}
                        >
                            <Icon iconName="avatar" />
                        </div>

                        {showDropdown && user && (
                            <div className="dropdown-menu">
                                <p className="dropdown-user"><strong>{user?.name}</strong></p>
                                <p>Email: {user?.email}</p>
                                <p>Role: {user?.role}</p>
                                <p>Status: {user?.status}</p>

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
