import React from "react";

const BaseContainer = ({
  header,
  subHeader,
  children,
  type,
  element,
  border = false,
}) => {
  // Determine class based on border prop
  const containerClass = border
    ? "bg-white rounded-lg w-full px-[10px] pt-[10px] pb-[0px]"
    : "drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]";

  // Use inline style for border to ensure visibility
  const containerStyle = border ? { border: "1px solid #BDBDBD" } : {};

  return (
    <div className={containerClass} style={containerStyle}>
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-0">{element}</div>
        </>
      ) : (
        <>
          <div className="p-0">
            <div className="text-primary text-xs font-bold uppercase">
              {header}
            </div>
            <div className="text-primary text-xs font-bold mt-3">
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

export default BaseContainer;
