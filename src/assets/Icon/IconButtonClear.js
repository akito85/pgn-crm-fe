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
      d="M19 18.9996H8.00002L4.00002 14.9996C3.6123 14.6096 3.6123 13.9797 4.00002 13.5896L14 3.58962C14.3901 3.2019 15.02 3.2019 15.41 3.58962L20.41 8.58962C20.7977 8.97966 20.7977 9.60958 20.41 9.99962L11.41 18.9996"
      stroke="white"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 18.9996H8.00002L4.00002 14.9996C3.6123 14.6096 3.6123 13.9797 4.00002 13.5896L14 3.58962C14.3901 3.2019 15.02 3.2019 15.41 3.58962L20.41 8.58962C20.7977 8.97966 20.7977 9.60958 20.41 9.99962L11.41 18.9996"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 12.3L11.7 6"
      stroke="white"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 12.3L11.7 6"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
