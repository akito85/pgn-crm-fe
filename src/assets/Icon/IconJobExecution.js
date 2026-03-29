import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  ...otherProps
}) => (
  <svg
    {...otherProps}
    width={width}
    style={style}
    height={width}
    className={`cursor-pointer ${className}`}
    onClick={onClick}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Play button circle */}
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Play triangle */}
    <path
      d="M10 9.5L15 12L10 14.5V9.5Z"
      fill="#4B465C"
    />
  </svg>
);

export default SVG;
