import React from "react";

const HEADER_BG = "#2C6FAD";
const BORDER_COL = "#C8CDD4";
const ROW_WHITE = "#FFFFFF";
const ROW_HOVER = "#EBF2FA";

/**
 * Custom nested table component for job group child rows
 * Uses div-based layout instead of Ant Design Table
 *
 * Props:
 *  - columns: array of { title, dataIndex, key, width?, render? }
 *  - dataSource: array of row data
 *  - isEven: whether parent row is even (for alternating colors)
 *  - parentExpandWidth: width of parent's expand cell (default 32px)
 */
const NxNestedTable = ({ columns, dataSource, isEven = false, parentExpandWidth = 32 }) => {
  if (!dataSource || dataSource.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
        No data
      </div>
    );
  }

  const bg = isEven ? ROW_HOVER : ROW_WHITE;

  // Prepend blank column for parent's expand cell
  const displayColumns = [
    {
      key: "__blank__",
      title: "",
      width: parentExpandWidth,
      render: () => "",
    },
    ...columns,
  ];

  // Render header
  const renderHeader = () => (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      {displayColumns.map((col, idx) => (
        <div
          key={col.key || col.dataIndex || idx}
          style={{
            flex: col.width ? `0 0 ${col.width}px` : 1,
            width: col.width,
            flexShrink: 0,
            background: col.key === "__blank__" ? BORDER_COL : HEADER_BG,
            minHeight: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: col.align === "center" ? "center" : "flex-start",
            borderRight: `1px solid ${col.key === "__blank__" ? BORDER_COL : "rgba(255,255,255,0.2)"}`,
            borderBottom: `1px solid ${BORDER_COL}`,
            padding: "4px 8px",
          }}
        >
          {col.key !== "__blank__" && (
            <span
              style={{
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "'PlusJakartaSans', 'PublicSans', sans-serif",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {col.title}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  // Render rows
  const renderRows = () => (
    <>
      {dataSource.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: "flex", alignItems: "stretch" }}>
          {displayColumns.map((col, colIdx) => {
            const value = col.key === "__blank__"
              ? ""
              : col.render
              ? col.render(row[col.dataIndex], row, rowIdx)
              : row[col.dataIndex];

            return (
              <div
                key={col.key || col.dataIndex || colIdx}
                style={{
                  flex: col.width ? `0 0 ${col.width}px` : 1,
                  width: col.width,
                  flexShrink: 0,
                  minHeight: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: col.align === "center" ? "center" : "flex-start",
                  borderRight: `1px solid ${BORDER_COL}`,
                  borderBottom: `1px solid ${BORDER_COL}`,
                  padding: "4px 8px",
                  background: col.key === "__blank__" ? ROW_WHITE : (rowIdx % 2 === 0 ? ROW_WHITE : ROW_HOVER),
                  fontSize: 12,
                  fontFamily: "'PlusJakartaSans', 'PublicSans', sans-serif",
                  color: "#111827",
                }}
              >
                {value}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {renderHeader()}
      {renderRows()}
    </div>
  );
};

export default NxNestedTable;
