const NxBaseContainer = ({
  header,
  children,
  border = false,
  className="",
  rounded = true,
  padding = true,
  flexDirection = "column",
  required = false,
  headerActions = null,
}) => {
  // Determine class based on border prop
  const containerClass = border
    ? `flex flex-col gap-y-4 bg-white ${rounded ? "rounded-lg" : ""} w-full ${className}`
    : `drop-shadow-md bg-white rounded-lg w-full ${className}`;

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
        <div className={`flex justify-between items-center min-h-[50px] px-4 py-2 border-b border-[#C8CDD4] bg-gray-50 ${rounded ? "rounded-t-lg" : ""}`}>
          <div className="flex items-center gap-x-1">
            <span className="text-primary text-base font-normal uppercase leading-6">
              {header}
            </span>
            {required && <span className="text-[#ff4d4f]">*</span>}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={`flex ${flexDirection === "column" ? "flex-col" : flexDirection === "row" ? "flex-row" : ""} flex-col gap-4 ${(padding && !header) ? "p-4" : padding ? "px-4 pb-4" : ""}`}>{children}</div>
    </div>
  );
};

export default NxBaseContainer;
