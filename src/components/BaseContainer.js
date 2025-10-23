import React from "react";

const BaseContainer = ({ header,subHeader, children, type, element }) => {
  return (
    <div className="drop-shadow-lg bg-white rounded-lg w-full mt-[30px] p-[20px]">
      {type === "profile" || type === 'tab' ? (
        <>
          <div className="p-4">{element}</div>
        </>
      ) : (
        <>
          <div className="p-4">
            <div className="text-primary text-xs font-bold uppercase">
              {header}
            </div>
            <div className="text-primary text-xs font-bold mt-3">
              {subHeader}
            </div>
          </div>
        </>
      )}
      {type === "tabs" && <div className="p-4">{element}</div>}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default BaseContainer;
