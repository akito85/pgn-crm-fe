const NxBaseContainer = ({
  header,
  children,
  border = false,
  className="",
  rounded = true,
  padding = true,
  flexDirection = "column",
}) => {
  // Determine class based on border prop
  const containerClass = border
    ? `flex flex-col gap-y-4 bg-white ${rounded ? "rounded-lg" : ""} w-full ${className}`
    : `drop-shadow-md bg-white rounded-lg w-full`;

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
      {header && (
        <div className="text-primary text-sm uppercase pt-4 px-4">
          {header}
        </div>
      )}
      <div className={`flex ${flexDirection === "column" ? "flex-col" : flexDirection === "row" ? "flex-row" : ""} flex-col gap-4 ${padding ? "p-4" : ""}`}>{children}</div>
    </div>
  );
};

export default NxBaseContainer;
