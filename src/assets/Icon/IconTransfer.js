const SVG = ({
  style = {},
  width = "100%",
  className = "",
  onClick = () => {},
  color = "#0075BF",
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
      d="M15 0V2.5H0V5H15V7.5L20 3.75L15 0ZM5 10L0 13.75L5 17.5V15H20V12.5H5V10Z"
      // fill="#0075BF"
      fill={color}
    />
  </svg>
);
export default SVG;
