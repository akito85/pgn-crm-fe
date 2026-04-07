const IconPower = ({
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
    <path
      d="M15.3 5.53a7.5 7.5 0 1 1-10.6 0"
      stroke={color}
      strokeWidth="1.875"
      strokeLinecap="round"
    />
    <path
      d="M10 1.67V10"
      stroke={color}
      strokeWidth="1.875"
      strokeLinecap="round"
    />
  </svg>
);

export default IconPower;
