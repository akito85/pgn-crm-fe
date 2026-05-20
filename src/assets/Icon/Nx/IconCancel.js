const IconCancel = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} {...otherProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default IconCancel;
