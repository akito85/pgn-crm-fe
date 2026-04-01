import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

const CollapsibleContainer = ({
  header,
  subHeader,
  children,
  border = false,
  className = "",
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const containerClass = border
    ? `bg-white rounded-lg w-full px-[10px] pt-[10px] pb-[0px] ${className}`
    : "drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]";

  const containerStyle = border ? { border: "1px solid #C8CDD4" } : {};

  return (
    <div className={containerClass} style={containerStyle}>
      <div
        className="flex items-center justify-between cursor-pointer select-none pb-[6px]"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <div className="text-primary text-xs uppercase">{header}</div>
          {subHeader && (
            <div className="text-primary text-xs font-bold mt-1">
              {subHeader}
            </div>
          )}
        </div>
        <DownOutlined
          style={{
            fontSize: 11,
            color: "#6B7280",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "2000px" : "0px",
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleContainer;
