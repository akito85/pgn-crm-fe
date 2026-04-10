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
    <path d="M11.0833 1.75H2.91667C2.27233 1.75 1.75 2.27233 1.75 2.91667V11.0833C1.75 11.7277 2.27233 12.25 2.91667 12.25H11.0833C11.7277 12.25 12.25 11.7277 12.25 11.0833V2.91667C12.25 2.27233 11.7277 1.75 11.0833 1.75Z" stroke={color || "currentColor"} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.25 7.00065L6.41667 8.16732L8.75 5.83398" stroke={color || "currentColor"} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

export default SVG;
