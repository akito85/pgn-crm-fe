const IconGenerateLink = ({
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
      d="M8.5 11.5C9.16667 12.1667 10.0833 12.5 11 12.5C11.9167 12.5 12.8333 12.1667 13.5 11.5L15.5 9.5C16.8333 8.16667 16.8333 6 15.5 4.66667C14.1667 3.33333 12 3.33333 10.6667 4.66667L9.58333 5.75"
      stroke={color}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 8.5C10.8333 7.83333 9.91667 7.5 9 7.5C8.08333 7.5 7.16667 7.83333 6.5 8.5L4.5 10.5C3.16667 11.8333 3.16667 14 4.5 15.3333C5.83333 16.6667 8 16.6667 9.33333 15.3333L10.4167 14.25"
      stroke={color}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default IconGenerateLink;
