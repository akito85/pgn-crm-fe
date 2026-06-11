import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color = "#0063A2",
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
      d="M7 12.5L12 17.5L22 7.5"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.61872 11.8813C2.27701 11.5396 1.72299 11.5396 1.38128 11.8813C1.03957 12.223 1.03957 12.777 1.38128 13.1187L2.61872 11.8813ZM6.38128 18.1187C6.72299 18.4604 7.27701 18.4604 7.61872 18.1187C7.96043 17.777 7.96043 17.223 7.61872 16.8813L6.38128 18.1187ZM11.3813 11.8813C11.0396 12.223 11.0396 12.777 11.3813 13.1187C11.723 13.4604 12.277 13.4604 12.6187 13.1187L11.3813 11.8813ZM17.6187 8.11872C17.9604 7.77701 17.9604 7.22299 17.6187 6.88128C17.277 6.53957 16.723 6.53957 16.3813 6.88128L17.6187 8.11872ZM1.38128 13.1187L6.38128 18.1187L7.61872 16.8813L2.61872 11.8813L1.38128 13.1187ZM12.6187 13.1187L17.6187 8.11872L16.3813 6.88128L11.3813 11.8813L12.6187 13.1187Z"
      fill={color}
    />
  </svg>
);
export default SVG;
