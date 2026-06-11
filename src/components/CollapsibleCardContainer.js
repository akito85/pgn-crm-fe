import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

const CollapsibleCardContainer = ({
  header,
  subHeader,
  children,
  type,
  element,
  className = "",
  defaultOpen = true,
  onToggle,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (onToggle) onToggle(next);
  };

  return (
    <div className={`drop-shadow-lg bg-white rounded-lg w-full my-2 ${className}`}>
      {type === "profile" || type === "tab" ? (
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          style={{ padding: "16px" }}
          onClick={handleToggle}
        >
          <div>{element}</div>
          <DownOutlined
            style={{
              fontSize: 11,
              color: "#6B7280",
              transition: "transform 0.2s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-between bg-[#F9F9F9] rounded-t-lg cursor-pointer select-none uppercase"
          style={{ borderBottom: open ? "1px solid #BDBDBD" : "none", padding: "16px" }}
          onClick={handleToggle}
        >
          <div>
            <div className="text-[16px] text-primary">{header}</div>
            {subHeader && (
              <div className="text-primary text-sm mt-1">{subHeader}</div>
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
      )}

      {type === "tabs" && open && (
        <div style={{ padding: "12px 16px 0 16px" }}>{element}</div>
      )}

      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "2000px" : "0px",
          transition: "max-height 0.3s ease",
        }}
      >
        <div className={type !== "tabs" ? "p-3" : "p-0"}>
          <div
            style={{
              border: type !== "tabs" ? "1px solid #C8CDD4" : "",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCardContainer;