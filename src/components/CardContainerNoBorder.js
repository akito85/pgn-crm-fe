import React, { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const CardContainerNoBorder = ({ header, subHeader, children, type, element, className, noPadding, collapsible = false, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderHeaderContent = () => (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1 w-full mr-4 flex flex-col">
        <div className="text-[16px] text-primary w-full flex">{header}</div>
        {subHeader && <div className="text-primary text-sm">{subHeader}</div>}
      </div>
      {collapsible && (
        <div className="text-primary text-xl font-bold">
          {isExpanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      )}
    </div>
  );

  return (
    <div className={`drop-shadow-lg bg-white rounded-lg w-full my-4 ${className || ''}`}>
      {type === "profile" || type === "tab" ? (
        <>
          <div style={{ padding: "16px" }}>{element}</div>
        </>
      ) : type === "tabs" ? (
        <>
          <div
            className={`flex flex-col bg-[#F9F9F9] rounded-t-lg uppercase ${collapsible ? 'cursor-pointer select-none' : ''}`}
            style={{ borderBottom: "1px solid #BDBDBD", padding: "16px" }}
            onClick={toggleExpand}
          >
            {renderHeaderContent()}
          </div>
          <div style={{ padding: "12px 16px 0 16px" }}>{element}</div>
        </>
      ) : (
        <div
          className={`flex flex-col bg-[#F9F9F9] rounded-t-lg uppercase ${collapsible ? 'cursor-pointer select-none' : ''}`}
          style={{ borderBottom: "1px solid #BDBDBD", padding: "16px" }}
          onClick={toggleExpand}
        >
          {renderHeaderContent()}
        </div>
      )}
      
      {isExpanded && (
        <div style={{ padding: noPadding ? "0px" : "12px" }}>
          <div
            style={{
              border: "none",
              borderRadius: "8px",
              padding: "0px",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContainerNoBorder;
