import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color,
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
    <circle
      cx="17"
      cy="17"
      r="4"
      stroke={color || "currentColor"}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 13V17H21"
      stroke={color || "currentColor"}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 3V7C12 7.55228 12.4477 8 13 8H17"
      stroke={color || "currentColor"}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 21.875C11.9832 21.875 12.375 21.4832 12.375 21C12.375 20.5168 11.9832 20.125 11.5 20.125V21.875ZM12 3L12.6187 2.38128C12.4546 2.21719 12.2321 2.125 12 2.125V3ZM17 8H17.875C17.875 7.76794 17.7828 7.54538 17.6187 7.38128L17 8ZM16.125 10C16.125 10.4832 16.5168 10.875 17 10.875C17.4832 10.875 17.875 10.4832 17.875 10H16.125ZM17.875 13C17.875 12.5168 17.4832 12.125 17 12.125C16.5168 12.125 16.125 12.5168 16.125 13H17.875ZM16.125 17C16.125 17.4832 16.5168 17.875 17 17.875C17.4832 17.875 17.875 17.4832 17.875 17H16.125ZM11.5 20.125H5V21.875H11.5V20.125ZM5 20.125C4.37868 20.125 3.875 19.6213 3.875 19H2.125C2.125 20.5878 3.41218 21.875 5 21.875V20.125ZM3.875 19V5H2.125V19H3.875ZM3.875 5C3.875 4.37868 4.37868 3.875 5 3.875V2.125C3.41218 2.125 2.125 3.41218 2.125 5H3.875ZM5 3.875H12V2.125H5V3.875ZM11.3813 3.61872L16.3813 8.61872L17.6187 7.38128L12.6187 2.38128L11.3813 3.61872ZM16.125 8V10H17.875V8H16.125ZM16.125 13V17H17.875V13H16.125Z"
      fill={color || "currentColor"}
    />
  </svg>
);

export default SVG;
