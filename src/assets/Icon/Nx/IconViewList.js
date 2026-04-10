const ViewListIcon = ({
  style = {},
  width = "20",
  height = "20",
  className = "",
  onClick = () => {},
  ...otherProps
}) => (
  <svg className={`cursor-pointer ${className}`} style={style} width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.625 5.625H18.125M5.625 10H18.125M5.625 14.375H18.125" stroke="#1976D2" strokeWidth="1.875" strokeLinejoin="round"/>
    <path d="M2.5 5H3.75V6.25H2.5V5ZM2.5 9.375H3.75V10.625H2.5V9.375ZM2.5 13.75H3.75V15H2.5V13.75Z" stroke="#1976D2" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="round"/>
  </svg>
);

export default ViewListIcon
