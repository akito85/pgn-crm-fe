import React, { useState } from "react";

const ComparisonCard = ({ title, leftColumn, rightColumn, onSeeDetails }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg overflow-hidden"
      style={{ border: "1px solid #BDBDBD" }}
    >
      {/* Header */}
      <div className="bg-white px-3 py-1.5 flex items-center justify-between" style={{ borderBottom: "1px solid #BDBDBD" }}>
        <h3 className="text-[#0175BF] font-semibold text-xs uppercase m-0">
          {title}
        </h3>
        {onSeeDetails && (
          <button
            onClick={onSeeDetails}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: hovered ? "#0175bf" : "#595959",
              background: "white",
              border: `1px solid ${hovered ? "#0175bf" : "#BDBDBD"}`,
              borderRadius: 6,
              padding: "2px 10px",
              cursor: "pointer",
              lineHeight: 1.8,
              whiteSpace: "nowrap",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            See Details
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 bg-[#F5F5F5]">
        {/* Left Column */}
        <div style={{ borderRight: "1px solid #BDBDBD" }}>
          <div className="px-3 pt-2.5 pb-2">
            <h4 className="font-semibold text-sm mb-0">{leftColumn.title}</h4>
          </div>
          <div className="px-3 py-2" style={{ borderTop: "1px solid #BDBDBD", borderBottom: "1px solid #BDBDBD" }}>
            <div className="text-[10px] text-gray-500 mb-0.5">Count</div>
            <div className="text-lg font-bold">
              {leftColumn.count?.toLocaleString() || "0"}
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-[10px] text-gray-500 mb-0.5">Value Usage</div>
            <div className="text-lg font-bold">
              {leftColumn.valueUsage?.toLocaleString() || "0"}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="px-3 pt-2.5 pb-2">
            <h4 className="font-semibold text-sm mb-0">{rightColumn.title}</h4>
          </div>
          <div className="px-3 py-2" style={{ borderTop: "1px solid #BDBDBD", borderBottom: "1px solid #BDBDBD" }}>
            <div className="text-[10px] text-gray-500 mb-0.5">Count</div>
            <div className="text-lg font-bold">
              {rightColumn.count?.toLocaleString() || "0"}
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-[10px] text-gray-500 mb-0.5">Value Usage</div>
            <div className="text-lg font-bold">
              {rightColumn.valueUsage?.toLocaleString() || "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
