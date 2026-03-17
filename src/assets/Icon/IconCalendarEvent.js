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
    {/* Calendar border */}
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Top left tab */}
    <path
      d="M7 2V6"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Top right tab */}
    <path
      d="M17 2V6"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Horizontal line under header */}
    <path
      d="M3 9H21"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Date dot */}
    <circle
      cx="7"
      cy="14"
      r="1"
      fill="#4B465C"
    />

    {/* Date dot */}
    <circle
      cx="12"
      cy="14"
      r="1"
      fill="#4B465C"
    />

    {/* Date dot */}
    <circle
      cx="17"
      cy="14"
      r="1"
      fill="#4B465C"
    />

    {/* Date dot */}
    <circle
      cx="7"
      cy="18"
      r="1"
      fill="#4B465C"
    />

    {/* Date dot */}
    <circle
      cx="12"
      cy="18"
      r="1"
      fill="#4B465C"
    />
  </svg>
);

export default SVG;
