const IconEditNx = ({
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
      d="M7.5 6.25H5C4.31 6.25 3.75 6.81 3.75 7.5V15C3.75 15.69 4.31 16.25 5 16.25H12.5C13.19 16.25 13.75 15.69 13.75 15V12.5"
      stroke={color || "#1976D2"}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.125 12.5H10.625L17.5 5.625C18.19 4.94 18.19 3.81 17.5 3.125C16.81 2.44 15.69 2.44 15 3.125L8.125 10V12.5Z"
      stroke={color || "#1976D2"}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.75 4.375L15.625 6.25"
      stroke={color || "#1976D2"}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default IconEditNx;
