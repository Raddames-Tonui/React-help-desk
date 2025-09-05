import React from "react";
import type { IconName } from "./IconsList";
import { Icons} from "./IconsList";

interface IconProps {
  iconName: IconName;
  className?: string;
  label?: string;
}

const Icon: React.FC<IconProps> = ({ iconName, className, label }) => {
  const IconComponent = Icons[iconName];
  return (
    <div className="flex items-center space-x-2">
      <IconComponent className={className} />
      {label && <span>{label}</span>}
    </div>
  );
};

export default Icon;