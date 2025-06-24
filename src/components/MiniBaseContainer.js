import React from "react";

const MiniBaseContainer = ({ header, children, type, element }) => {
  return (
    <div className="drop-shadow-lg bg-white rounded-lg w-full p-[20px]">
      {type === "profile" ? (
        <>
          <div className="p-4">{element}</div>
        </>
      ) : (
        <>
          <div className="p-1">
            <div className="text-primary text-xs font-bold uppercase">
              {header}
            </div>
          </div>
        </>
      )}
      {type === "tabs" && <div className="p-4">{element}</div>}
      <div className="p-1">{children}</div>
    </div>
  );
};

export default MiniBaseContainer;
