import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  // colorTheme
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
      d="M18.9998 18.9996H7.99978L3.99978 14.9996C3.61205 14.6096 3.61205 13.9797 3.99978 13.5896L13.9998 3.58962C14.3898 3.2019 15.0197 3.2019 15.4098 3.58962L20.4098 8.58962C20.7975 8.97966 20.7975 9.60958 20.4098 9.99962L11.4098 18.9996"
      stroke="white"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.9998 18.9996H7.99978L3.99978 14.9996C3.61205 14.6096 3.61205 13.9797 3.99978 13.5896L13.9998 3.58962C14.3898 3.2019 15.0197 3.2019 15.4098 3.58962L20.4098 8.58962C20.7975 8.97966 20.7975 9.60958 20.4098 9.99962L11.4098 18.9996"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.9992 12.3L11.6992 6"
      stroke="white"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.9992 12.3L11.6992 6"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
