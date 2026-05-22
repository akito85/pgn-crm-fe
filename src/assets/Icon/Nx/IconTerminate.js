const IconTerminate = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} onClick={onClick} {...otherProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 8L16 16M16 8L8 16" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default IconTerminate;
