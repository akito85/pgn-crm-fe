const SVG = ({
  style = {},
  width = "100%",
  className = "",
  color,
  ...otherProps
}) => (
  <svg
    {...otherProps}
    width={width}
    height={width}
    style={style}
    className={className}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.3333 2H3.16667C2.52233 2 2 2.52233 2 3.16667V11.3333C2 11.9777 2.52233 12.5 3.16667 12.5H11.3333C11.9777 12.5 12.5 11.9777 12.5 11.3333V3.16667C12.5 2.52233 11.9777 2 11.3333 2Z" stroke={color || "currentColor"} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 5.5L5.5 9M5.5 5.5L9 9" stroke={color || "currentColor"} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

export default SVG;
