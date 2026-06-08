const IconPower = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick} {...otherProps}>
    <path d="M18.36 6.64a9 9 0 1 1-12.72 0" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 2V12" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default IconPower;
