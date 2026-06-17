const NxBaseContainer = ({
  header,
  children,
  border = false,
  className = "",
  rounded = true,
  padding = true,
  flexDirection = "column",
  required = false,
  headerActions = null,
  headerBackgroundColor = "#F9FAFB",
  headerBackgroundVisible = false,
  minHeight = null,
  actions = [],
  // Optional extra classes for the body wrapper (e.g. "pt-3" to add space after
  // the header). Defaults to "" so existing callers are unaffected.
  bodyClassName = "",
}) => {
  const toolbarActions = actions.filter((a) => a.type !== "table");

  const containerClass = border
    ? `flex flex-col gap-y-4 bg-white ${rounded ? "rounded-lg" : ""} w-full ${className}`
    : `drop-shadow-md bg-white rounded-lg w-full ${className}`;

  const containerStyle = {
    ...(border ? {
      borderTop: border.top === false ? "0" : "1px",
      borderRight: border.right === false ? "0" : "1px",
      borderBottom: border.bottom === false ? "0" : "1px",
      borderLeft: border.left === false ? "0" : "1px",
      borderStyle: "solid",
      borderColor: "#C8CDD4",
    } : {}),
    ...(minHeight ? { minHeight } : {}),
  };

  return (
    <div className={containerClass} style={containerStyle}>
      {header && (
        <div
          className={`flex justify-between items-center min-h-[50px] px-4 pt-4 border-b border-[#C8CDD4] ${rounded ? "rounded-t-lg" : ""}`}
          style={headerBackgroundVisible ? { backgroundColor: headerBackgroundColor } : {}}
        >
          <div className="flex items-center gap-x-1">
            <span className="text-primary text-base font-normal uppercase leading-6">
              {header}
            </span>
            {required && <span className="text-[#ff4d4f]">*</span>}
          </div>

          {/* Far right: actions array + legacy headerActions */}
          {(toolbarActions.length > 0 || headerActions) && (
            <div className="flex items-center gap-2">
              {toolbarActions.map((item, index) => (
                <div key={index}>{item.render}</div>
              ))}
              {headerActions && <div>{headerActions}</div>}
            </div>
          )}
        </div>
      )}
      <div
        className={`flex ${flexDirection === "column" ? "flex-col" : flexDirection === "row" ? "flex-row" : ""} flex-col gap-4 ${(padding && !header) ? "p-4" : padding ? "px-4 pb-4" : ""} ${bodyClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default NxBaseContainer;
