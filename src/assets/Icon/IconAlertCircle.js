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
    className={`cursor-pointer${className}`}
    onClick={onClick}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      r="9"
      transform="matrix(1 0 0 -1 12 12)"
      stroke="#4B465C"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16V12"
      stroke="#4B465C"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9999 8H12.0099"
      stroke="#4B465C"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
