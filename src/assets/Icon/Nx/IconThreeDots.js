const IconThreeDots = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  color,
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick} {...otherProps}>
    <circle cx="12" cy="5" r="1.25" fill={color || "currentColor"}/>
    <circle cx="12" cy="12" r="1.25" fill={color || "currentColor"}/>
    <circle cx="12" cy="19" r="1.25" fill={color || "currentColor"}/>
  </svg>
);

export default IconThreeDots;
