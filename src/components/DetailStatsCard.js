import React from "react";
import {
  UserOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const DetailStatsCard = ({
  title,
  totalValue,
  percentage,
  isPositive,
  details,
  type = "default",
}) => {
  const Icon =
    type === "error" || type === "warning" ? WarningOutlined : UserOutlined;
  const ArrowIcon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;
  const arrowColor = isPositive ? "#388E3C" : "#D32F2F";
  const arrowBgColor = isPositive ? "#E8F5E9" : "#FFEBEE";

  return (
    <div
      className="bg-white rounded-lg overflow-hidden"
      style={{ border: "1px solid #BDBDBD" }}
    >
      {/* Header with Icon and Title */}
      <div
        className="flex items-center gap-1.5 px-3 pt-2 pb-1.5"
        style={{ borderBottom: "1px solid #BDBDBD" }}
      >
        <Icon style={{ fontSize: 14, color: "#BF360D" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#BF360D" }}>
          {title}
        </span>
      </div>

      {/* Total Value */}
      <div className="flex w-full justify-between px-3 py-2">
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#262626",
            lineHeight: 1,
          }}
        >
          {totalValue?.toLocaleString() || "0"}
        </div>

        {/* Percentage */}
        <div
          className={`${
            percentage !== undefined ? "flex" : "hidden"
          } items-center gap-1`}
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

      {/* Details Grid */}
      {details && details.length > 0 && (
        <div
          className="grid grid-cols-2 bg-[#F5F5F5]"
          style={{ borderTop: "1px solid #BDBDBD" }}
        >
          {details.map((detail, index) => {
            const isLeftColumn = index % 2 === 0;
            const isNotLastRow = index < details.length - 2;

            return (
              <div
                key={index}
                className="px-3 py-2"
                style={{
                  // borderRight: isLeftColumn ? "1px solid #BDBDBD" : "none",
                  borderBottom: isNotLastRow ? "1px solid #BDBDBD" : "none",
                }}
              >
                <div className="text-[10px] text-gray-500 mb-0.5">{detail.label}</div>
                <div className="text-lg font-bold">
                  {detail.value?.toLocaleString() || "0"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetailStatsCard;
