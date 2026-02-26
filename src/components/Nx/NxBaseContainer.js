const NxBaseContainer = ({
  header,
  subHeader,
  children,
  type,
  element,
  border = false,
  className="",
  rounded = true,
  padding = true
}) => {
  // Determine class based on border prop
  const containerClass = border
    ? `flex flex-col gap-y-4 bg-white ${rounded ? "rounded-lg" : ""} w-full ${padding ? "p-4" : ""} ${className}`
    : `drop-shadow-md bg-white rounded-lg w-full ${padding ? "p-4" : ""}`;

  // Use inline style for border to ensure visibility
  const containerStyle = border ? {
    "borderTop": border.top === false ? "0" : "1px",
    "borderRight": border.right === false ? "0" : "1px",
    "borderBottom": border.bottom === false ? "0" : "1px",
    "borderLeft": border.left === false ? "0" : "1px",
    "borderStyle": "solid",
    "borderColor": "#C8CDD4",
  } : {};

  return (
    <div className={containerClass} style={containerStyle}>
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-0">{element}</div>
        </>
      ) : (header || subHeader) && (
        <>
          <div className="p-0">
            <div className="text-primary text-sm uppercase">
              {header}
            </div>
            <div className="text-primary text-xs font-bold">
              {subHeader}
            </div>
          </div>
        </>
      )}
      {type === "tabs" && <div className="p-0">{element}</div>}
      <div className="p-0">{children}</div>
    </div>
  );
};

export default NxBaseContainer;
