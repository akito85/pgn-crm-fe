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
    <path
      d="M19 8.71001L13.667 4.56201C12.7042 3.81299 11.3558 3.81299 10.393 4.56201L5.05903 8.71001C4.40943 9.21518 4.02964 9.99211 4.03003 10.815V18.015C4.03003 19.1196 4.92546 20.015 6.03003 20.015H18.03C19.1346 20.015 20.03 19.1196 20.03 18.015V10.815C20.03 9.99201 19.65 9.21501 19 8.71001"
      stroke="#4B465C"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 14.9999C13.79 16.3329 10.208 16.3329 8 14.9999"
      stroke="#4B465C"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
