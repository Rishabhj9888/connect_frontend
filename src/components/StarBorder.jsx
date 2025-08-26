import React from 'react';
import "./StarBorder.css";

const StarBorder = ({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "2.5s", // ✅ CHANGED from "6s" to "2.5s" for a faster animation
  thickness = 1,
  children,
  ...rest
}) => {
  return (
    <Component 
      className={`star-border-container ${className}`} 
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder;