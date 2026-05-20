import React from "react";
import {
  CheckCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const StatCard = ({
  title,
  value,
  percentage,
  isPositive,
  type = "success",
}) => {
  const isSuccess = type === "success";

  const iconColor = isSuccess ? "#388E3C" : "#D32F2F";
  const titleColor = isSuccess ? "#388E3C" : "#D32F2F";
  const Icon = isSuccess ? CheckCircleOutlined : WarningOutlined;
  const ArrowIcon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;
  const arrowColor = isPositive ? "#388E3C" : "#D32F2F";
  const arrowBgColor = isPositive ? "#E8F5E9" : "#FFEBEE";

  return (
    <div
      className="bg-white border rounded-lg p-3"
      style={{ border: "1px solid #BDBDBD" }}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-1.5 mb-2">
        <Icon style={{ fontSize: "16px", color: iconColor }} />
        <span style={{ fontSize: "11px", color: titleColor, fontWeight: 600 }}>
          {title}
        </span>
      </div>

      {/* Value */}
      <div className="flex w-full justify-between items-start">
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#262626",
            lineHeight: 1,
          }}
        >
          {value?.toLocaleString() || "0"}
        </div>

        {/* Percentage */}
        <div
          className="flex items-center gap-1"
          style={{
            color: arrowColor,
            backgroundColor: arrowBgColor,
            fontSize: 11,
            fontWeight: 600,
            width: "fit-content",
            padding: "2px 6px",
            borderRadius: 10,
            height: 20,
          }}
        >
          <ArrowIcon style={{ fontSize: 10 }} />
          <span>{percentage || 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
