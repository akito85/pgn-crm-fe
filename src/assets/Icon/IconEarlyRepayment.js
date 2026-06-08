import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color = "#000",
  ...otherProps
}) => (
  <svg
    {...otherProps}
    width={width}
    style={style}
    height={width}
    className={`cursor-pointer ${className}`}
    onClick={onClick}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6666 2.91663H2.33329C1.68896 2.91663 1.16663 3.43896 1.16663 4.08329V9.91663C1.16663 10.561 1.68896 11.0833 2.33329 11.0833H11.6666C12.311 11.0833 12.8333 10.561 12.8333 9.91663V4.08329C12.8333 3.43896 12.311 2.91663 11.6666 2.91663Z"
      stroke={color}
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.16663 5.83325H12.8333"
      stroke={color}
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
