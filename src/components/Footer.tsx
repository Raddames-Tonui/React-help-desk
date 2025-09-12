import React from "react";
import Icon from "../utilities/Icon";
import { useRouter } from "@tanstack/react-router";

const Footer: React.FC = () => {
  const router = useRouter();
  const user = router.options.context.auth.getUser();

  return (
    <footer>
      <div className="footer-wrapper">
        <div>
          <Icon iconName="building" />
          <p>Sky World Limited</p>
        </div>
        <div>
          <Icon iconName="user" />
          <p>{user?.firstName} {user?.lastName}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
