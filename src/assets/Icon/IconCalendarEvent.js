import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color = "#4B465C",
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
    {/* Calendar background */}
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      fill={color}
      opacity="0.1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Month header bar */}
    <rect
      x="3"
      y="4"
      width="18"
      height="4"
      rx="2"
      fill={color}
      opacity="0.15"
    />

    {/* Top left date tab */}
    <rect
      x="7"
      y="1.5"
      width="3"
      height="3"
      rx="0.5"
      fill={color}
    />

    {/* Top right date tab */}
    <rect
      x="14"
      y="1.5"
      width="3"
      height="3"
      rx="0.5"
      fill={color}
    />

    {/* Week divider line */}
    <path
      d="M3 9H21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Date squares - first row */}
    <rect
      x="5"
      y="10.5"
      width="2.2"
      height="2.2"
      fill={color}
      opacity="0.3"
    />
    <rect
      x="8.2"
      y="10.5"
      width="2.2"
      height="2.2"
      fill={color}
      opacity="0.3"
    />

    {/* Date squares - second row */}
    <rect
      x="5"
      y="13.5"
      width="2.2"
      height="2.2"
      fill={color}
      opacity="0.2"
    />
    <rect
      x="8.2"
      y="13.5"
      width="2.2"
      height="2.2"
      fill={color}
      opacity="0.2"
    />
    <rect
      x="11.4"
      y="13.5"
      width="2.2"
      height="2.2"
      fill={color}
      opacity="0.2"
    />

    {/* Highlight today's date */}
    <circle
      cx="16.5"
      cy="14.6"
      r="1.5"
      fill={color}
    />
  </svg>
);

export default SVG;
