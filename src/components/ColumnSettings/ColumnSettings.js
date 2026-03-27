// components/ColumnSettings/ColumnSettings.js
import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Checkbox, Radio } from "antd";
import { DownOutlined, UpOutlined, SearchOutlined } from "@ant-design/icons";

const ColumnSettings = ({
  columns = [],
  hiddenColumns = [],
  onHiddenColumnsChange,
  fixedColumns = { left: [], right: [] },
  onFixedColumnsChange,
  staticFixedKeys = { left: [], right: [] },
  buttonStyle = {},
  buttonText = "Column Settings",
  panelWidth = "480px",
  panelMaxHeight = "288px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filtered columns for search
  const filteredColumns = searchText
    ? columns.filter((col) =>
        col.title?.toLowerCase().includes(searchText.toLowerCase())
      )
    : columns;

  // Check if column is visible
  const isColumnVisible = (columnKey) => {
    return !hiddenColumns.includes(columnKey);
  };

  // Check if column is fixed
  const isColumnFixed = (columnKey) => {
    return (
      fixedColumns.left.includes(columnKey) ||
      fixedColumns.right.includes(columnKey) ||
      staticFixedKeys.left.includes(columnKey) ||
      staticFixedKeys.right.includes(columnKey)
    );
  };

  // Check if column is statically fixed (from column definitions)
  const isStaticallyFixed = (columnKey) => {
    return (
      staticFixedKeys.left.includes(columnKey) ||
      staticFixedKeys.right.includes(columnKey)
    );
  };

  // Get fixed position
  const getFixedPosition = (columnKey) => {
    if (fixedColumns.left.includes(columnKey) || staticFixedKeys.left.includes(columnKey)) return "left";
    if (fixedColumns.right.includes(columnKey) || staticFixedKeys.right.includes(columnKey)) return "right";
    return null;
  };

  // Handle visibility checkbox change
  const handleVisibilityChange = (e, columnKey) => {
    const checked = e.target.checked;
    let newHidden;
    if (checked) {
      // Show column - remove from hidden
      newHidden = hiddenColumns.filter((key) => key !== columnKey);
    } else {
      // Hide column - add to hidden
      newHidden = [...hiddenColumns, columnKey];
    }
    onHiddenColumnsChange?.(newHidden);
  };

  // Handle fixed checkbox change
  const handleFixedChange = (e, columnKey) => {
    const checked = e.target.checked;
    if (!onFixedColumnsChange) return;

    if (checked) {
      // Determine default position based on column index
      const columnIndex = columns.findIndex((col) => col.key === columnKey);
      const isLastColumn = columnIndex === columns.length - 1;
      const defaultPosition = isLastColumn ? "right" : "left";

      // Add to the appropriate position
      const newFixed = {
        left: fixedColumns.left.filter((key) => key !== columnKey),
        right: fixedColumns.right.filter((key) => key !== columnKey),
      };

      if (defaultPosition === "left") {
        newFixed.left = [...newFixed.left, columnKey];
      } else {
        newFixed.right = [...newFixed.right, columnKey];
      }

      onFixedColumnsChange(newFixed);
    } else {
      // Remove from both left and right
      onFixedColumnsChange({
        left: fixedColumns.left.filter((key) => key !== columnKey),
        right: fixedColumns.right.filter((key) => key !== columnKey),
      });
    }
  };

  // Handle position change
  const handlePositionChange = (columnKey, position) => {
    if (!onFixedColumnsChange) return;

    // Remove from both positions first
    const newFixed = {
      left: fixedColumns.left.filter((key) => key !== columnKey),
      right: fixedColumns.right.filter((key) => key !== columnKey),
    };

    // Add to the selected position
    if (position === "left") {
      newFixed.left = [...newFixed.left, columnKey];
    } else if (position === "right") {
      newFixed.right = [...newFixed.right, columnKey];
    }

    onFixedColumnsChange(newFixed);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Button */}
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid #BDBDBD",
          height: "40px",
          color: "black",
          borderRadius: 6,
          fontSize: "14px",
          fontWeight: "500",
          ...buttonStyle,
        }}
      >
        {buttonText}{" "}
        {isOpen ? (
          <UpOutlined style={{ fontSize: "12px" }} />
        ) : (
          <DownOutlined style={{ fontSize: "12px" }} />
        )}
      </Button>

      {/* Floating Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            top: "48px",
            left: 0,
            zIndex: 1000,
            padding: "12px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            width: panelWidth,
            maxWidth: "90vw",
            height: panelMaxHeight,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Input */}
          <div style={{ marginBottom: 10 }}>
            <Input
              placeholder="Search Column Name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={
                <SearchOutlined
                  style={{ color: "#bfbfbf", fontSize: "12px" }}
                />
              }
              style={{
                borderRadius: 4,
                height: 32,
                fontSize: "12px",
              }}
              allowClear
            />
          </div>

          {/* Column List Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "35px 1fr 55px 110px",
              gap: "6px",
              padding: "6px 4px",
              fontWeight: "600",
              fontSize: "10px",
              color: "#666",
              borderBottom: "1px solid #eee",
              marginBottom: 6,
            }}
          >
            <div style={{ textAlign: "center" }}>✓</div>
            <div>COLUMN NAME</div>
            <div style={{ textAlign: "center" }}>FIXED</div>
            <div style={{ textAlign: "center" }}>POSITION</div>
          </div>

          {/* Column List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {filteredColumns.map((col, index) => {
              const isVisible = isColumnVisible(col.key);
              const isFixed = isColumnFixed(col.key);
              const isStaticallyFixedCol = isStaticallyFixed(col.key);
              const position = getFixedPosition(col.key);

              return (
                <div
                  key={col.key || index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "35px 1fr 55px 110px",
                    gap: "3px",
                    padding: "0px 2px",
                    alignItems: "center",
                    borderBottom: "1px solid #f5f5f5",
                    backgroundColor: isVisible ? "white" : "#fafafa",
                  }}
                >
                  {/* Visibility Checkbox */}
                  <div style={{ textAlign: "center" }}>
                    <Checkbox
                      checked={isVisible}
                      onChange={(e) => handleVisibilityChange(e, col.key)}
                    />
                  </div>

                  {/* Column Name */}
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "500",
                      color: isVisible ? "#000" : "#999",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={col.title}
                  >
                    {col.title}
                  </div>

                  {/* Fixed Checkbox */}
                  <div style={{ textAlign: "center" }}>
                    <Checkbox
                      checked={isFixed}
                      onChange={(e) => handleFixedChange(e, col.key)}
                      disabled={!isVisible || isStaticallyFixedCol}
                    />
                  </div>

                  {/* Position Radio Buttons */}
                  <div>
                    <Radio.Group
                      value={position || "left"}
                      onChange={(e) =>
                        handlePositionChange(col.key, e.target.value)
                      }
                      disabled={!isFixed || !isVisible}
                      size="small"
                      buttonStyle="solid"
                      style={{ display: "flex", gap: "4px" }}
                    >
                      <Radio.Button
                        value="left"
                        style={{
                          fontSize: "10px",
                          flex: 1,
                          textAlign: "center",
                          padding: "0 6px",
                        }}
                      >
                        Left
                      </Radio.Button>
                      <Radio.Button
                        value="right"
                        style={{
                          fontSize: "10px",
                          flex: 1,
                          textAlign: "center",
                          padding: "0 6px",
                        }}
                      >
                        Right
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSettings;
