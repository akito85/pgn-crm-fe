const IconViewList = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick} {...otherProps}>
    <path d="M6.75 6.75H21.75M6.75 12H21.75M6.75 17.25H21.75" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H4.5V7.5H3V6ZM3 11.25H4.5V12.75H3V11.25ZM3 16.5H4.5V18H3V16.5Z" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"/>
  </svg>
);

export default IconViewList;
