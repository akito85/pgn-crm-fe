import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color = "#0075BF",
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    className={`cursor-pointer ${className}`}
    onClick={onClick}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 9L9 15"
      stroke={color}
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 15V9H9"
      stroke={color}
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SVG;
