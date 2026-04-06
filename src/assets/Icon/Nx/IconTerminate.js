const IconTerminate = ({
  style = {},
  width = "20",
  height = "20",
  className = "",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg
    className={`cursor-pointer ${className}`}
    style={style}
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    {...otherProps}
  >
    <circle
      cx="10"
      cy="10"
      r="7.5"
      stroke={color || "#BE3036"}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5"
      stroke={color || "#BE3036"}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default IconTerminate;
