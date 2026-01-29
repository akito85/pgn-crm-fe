const NxBaseContainer = ({
  header,
  subHeader,
  children,
  type,
  element,
  border = false,
  className="",
}) => {
  // Determine class based on border prop
  const containerClass = border
    ? `bg-white rounded-lg w-full p-4 ${className}`
    : "drop-shadow-md bg-white rounded-lg w-full p-4";

  // Use inline style for border to ensure visibility
  const containerStyle = border ? { border: "1px solid #C8CDD4" } : {};

  return (
    <div className={containerClass} style={containerStyle}>
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-0">{element}</div>
        </>
      ) : (header || subHeader) && (
        <>
          <div className="p-0">
            <div className="text-primary text-xs font-bold uppercase">
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
