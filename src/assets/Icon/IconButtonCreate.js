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
      d="M12 5V19"
      stroke="#1890ff"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5V19"
      stroke="#1890ff"
      strokeOpacity="0.2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12H19"
      stroke="#1890ff"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12H19"
      stroke="#1890ff"
      strokeOpacity="0.2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
