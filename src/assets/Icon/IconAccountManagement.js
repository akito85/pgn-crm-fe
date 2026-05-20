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
      d="M8.84 10.84C10.5079 10.84 11.86 9.48795 11.86 7.82005C11.86 6.15215 10.5079 4.80005 8.84 4.80005C7.1721 4.80005 5.82001 6.15215 5.82001 7.82005C5.82001 9.48795 7.1721 10.84 8.84 10.84Z"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.75 19.2001V17.4801C2.75 15.4801 4.37 13.8601 6.37 13.8601H11.79C13.79 13.8601 15.41 15.4801 15.41 17.4801V19.2001"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.38 11.7001C17.6171 11.7001 18.62 10.6972 18.62 9.46009C18.62 8.22297 17.6171 7.22009 16.38 7.22009C15.1429 7.22009 14.14 8.22297 14.14 9.46009C14.14 10.6972 15.1429 11.7001 16.38 11.7001Z"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.02 13.9401H18.56C20.04 13.9401 21.24 15.1401 21.24 16.6201V17.9001"
      stroke="#4B465C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SVG;
