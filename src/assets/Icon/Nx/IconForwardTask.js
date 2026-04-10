const IconForwardTask = ({
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
      d="M2.5 2.5L17.5 10L2.5 17.5V11.875L13.75 10L2.5 8.125V2.5Z"
      stroke={color || "#1976D2"}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default IconForwardTask;
