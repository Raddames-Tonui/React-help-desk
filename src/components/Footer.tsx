import React from "react";
import Icon from "../utils/Icon";
import { useAuth } from "../context/AuthContext";

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer>
      <div className="footer-wrapper">
        <div>
          <Icon iconName="building" />
          <p>{ user?.company || "Company Name"}</p>
        </div>
        <div>
          <Icon iconName="user" />
          <p>{user?.firstname} {user?.lastname}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
