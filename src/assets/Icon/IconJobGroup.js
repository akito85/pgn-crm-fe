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
    {/* Folder */}
    <path
      d="M3 5C3 3.89543 3.89543 3 5 3H11L13 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Files inside - Line 1 */}
    <circle
      cx="9"
      cy="12"
      r="1.2"
      fill="#4B465C"
    />

    {/* Files inside - Line 2 */}
    <circle
      cx="15"
      cy="12"
      r="1.2"
      fill="#4B465C"
    />

    {/* Files inside - Line 3 */}
    <circle
      cx="12"
      cy="16"
      r="1.2"
      fill="#4B465C"
    />
  </svg>
);

export default SVG;
