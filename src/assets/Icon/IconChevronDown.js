import React from "react";

const SVG = ({
  width = "100%",
  color,
  ...otherProps
}) => (
  <svg
    width={width}
    height={width}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...otherProps}
  >
    <path d="M18 9L12 15L6 9" stroke={color || "currentColor"} stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

export default SVG;
