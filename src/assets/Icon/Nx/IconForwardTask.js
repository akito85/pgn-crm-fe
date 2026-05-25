const IconForwardTask = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick} {...otherProps}>
    <path d="M3 3L21 12L3 21V14.25L16.5 12L3 9.75V3Z" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default IconForwardTask;
