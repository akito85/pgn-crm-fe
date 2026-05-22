import React from "react";

const IconInactive = ({
  style = {},
  width = "100%",
  className = "cursor-pointer",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg
    {...otherProps}
    width={width}
    style={style}
    height={width}
    className={className}
    onClick={onClick}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12h8"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default IconInactive;
