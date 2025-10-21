import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color = "#FF2E2E",
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    className={`cursor-pointer${className}`}
    onClick={onClick}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8V11.7816"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15.5388L12 15.5863"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.99995 19H19C19.6625 18.9954 20.2797 18.6629 20.6482 18.1123C21.0166 17.5616 21.0884 16.8642 20.84 16.25L13.74 4.00002C13.3877 3.36338 12.7175 2.96826 11.99 2.96826C11.2624 2.96826 10.5922 3.36338 10.24 4.00002L3.13995 16.25C2.89635 16.8498 2.95807 17.5303 3.3056 18.0764C3.65313 18.6225 4.24349 18.9667 4.88995 19"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
