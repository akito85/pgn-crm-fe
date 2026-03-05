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
      d="M5.49999 5H18.5C18.7918 5.10236 19.0199 5.33401 19.1177 5.62742C19.2155 5.92084 19.1721 6.243 19 6.5L14 12V19L9.99999 16V12L4.99999 6.5C4.82792 6.243 4.78445 5.92084 4.88225 5.62742C4.98006 5.33401 5.20813 5.10236 5.49999 5"
      stroke="#4B465C"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
