import React from "react";

const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color = "#D90000",
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
      d="M12.0372 20.9621C7.08721 20.9621 3.07471 16.9496 3.07471 11.9996C3.07471 7.04961 7.08721 3.03711 12.0372 3.03711C16.9872 3.03711 20.9997 7.01211 20.9997 11.9621C20.9997 16.9121 16.9872 20.9621 12.0372 20.9621ZM12.0372 3.97461C7.64971 3.97461 4.04971 7.57461 4.04971 11.9621C4.04971 16.3496 7.64971 19.9496 12.0372 19.9496C16.4247 19.9496 20.0247 16.3496 20.0247 11.9621C20.0247 7.57461 16.4247 3.97461 12.0372 3.97461Z"
      fill={color}
      stroke={color}
    />
    <path
      d="M7.23706 11.4375H16.7996V12.4875H7.23706V11.4375Z"
      fill={color}
      stroke={color}
    />
  </svg>
);

export default SVG;
