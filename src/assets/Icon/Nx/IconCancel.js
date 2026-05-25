const IconCancel = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} onClick={onClick} {...otherProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default IconCancel;
