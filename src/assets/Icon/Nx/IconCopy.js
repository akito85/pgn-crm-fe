const IconCopy = ({
  style = {},
  width = "24",
  height = "24",
  className = "",
  onClick = () => {},
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} {...otherProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8H10C8.89543 8 8 8.89543 8 10V20C8 21.1046 8.89543 22 10 22H20C21.1046 22 22 21.1046 22 20V10C22 8.89543 21.1046 8 20 8Z" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16C2.9 16 2 15.1 2 14V4C2 2.9 2.9 2 4 2H14C15.1 2 16 2.9 16 4" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default IconCopy;
