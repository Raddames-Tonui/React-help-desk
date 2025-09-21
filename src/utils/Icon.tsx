import React, {type CSSProperties } from "react";
import type { IconName } from "./IconsList";
import { Icons } from "./IconsList";

interface IconProps {
  iconName: IconName;
  className?: string;
  label?: string;
  style?: CSSProperties; 
}

const Icon: React.FC<IconProps> = ({ iconName, className, label, style }) => {
  const IconComponent = Icons[iconName];
  return (
    <div className="flex items-center space-x-2">
      {/* pass style to the actual SVG component */}
      <IconComponent className={className} style={style} />
      {label && <span>{label}</span>}
    </div>
  );
};

export default Icon;
