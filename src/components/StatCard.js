import React from "react";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const StatCard = ({
  title,
  value,
  percentage,
  isPositive,
  icon,
}) => {
  const ArrowIcon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;
  const arrowColor = isPositive ? "#388E3C" : "#D32F2F";
  const arrowBgColor = isPositive ? "#E8F5E9" : "#FFEBEE";

  return (
    <div
      className="bg-white rounded-lg p-4"
      style={{ border: "1px solid #E0E0E0", minWidth: 160 }}
    >
      {/* Title row + icon */}
      <div className="flex justify-between items-start mb-3">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#424242", letterSpacing: 0.3 }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              backgroundColor: "#E8F4FD",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {React.cloneElement(icon, { style: { fontSize: 16, color: "#1E88E5" } })}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: 32, fontWeight: 700, color: "#212121", lineHeight: 1, marginBottom: 12 }}>
        {(value ?? 0).toLocaleString()}
      </div>

      {/* Percentage + vs Last Month */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1"
          style={{
            color: arrowColor,
            backgroundColor: arrowBgColor,
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: 10,
          }}
        >
          <ArrowIcon style={{ fontSize: 10 }} />
          <span>{percentage ?? 0}%</span>
        </div>
        <span style={{ fontSize: 12, color: "#9E9E9E" }}>vs Last Month</span>
      </div>
    </div>
  );
};

export default StatCard;
