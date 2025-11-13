import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "cursor-pointer",
  onClick = () => {},
  color = "#BE3036",
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    className={className}
    onClick={onClick}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="24"
      cy="24"
      r="18"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="24"
      cy="24"
      r="18"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 24L22 29L32 19"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
