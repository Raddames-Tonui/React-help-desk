import React from "react";
import Icon from "@/utils/Icon";
import { useAuth } from "@/context/hooks";

const Footer: React.FC = () => {
  const { user } = useAuth();

  // console.log(user);

  return (
    <footer>
      <div className="footer-wrapper">
        <div>
          <Icon iconName="building" />
          <p>{user?.company || "Company Name"}</p>
        </div>
        <div>
          <Icon iconName="user" />
          <p>
            {user?.name || (user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : "Guest User")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
