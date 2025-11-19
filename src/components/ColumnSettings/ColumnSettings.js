// components/ColumnSettings/ColumnSettings.js
import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Checkbox, Select } from "antd";
import { DownOutlined, UpOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const ColumnSettings = ({
  columns = [],
  hiddenColumns = [],
  onHiddenColumnsChange,
  fixedColumns = { left: [], right: [] },
  onFixedColumnsChange,
  buttonStyle = {},
  buttonText = "Column Settings",
  panelWidth = "440px", // Updated default to 440px
  panelMaxHeight = "288px", // Updated default to 288px (total height including padding)
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
      fixedColumns.right.includes(columnKey)
    );
  };

  // Get fixed position
  const getFixedPosition = (columnKey) => {
    if (fixedColumns.left.includes(columnKey)) return "left";
    if (fixedColumns.right.includes(columnKey)) return "right";
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
      // Add to left by default
      onFixedColumnsChange({
        ...fixedColumns,
        left: [...fixedColumns.left, columnKey],
      });
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

    const newFixed = {
      left: fixedColumns.left.filter((key) => key !== columnKey),
      right: fixedColumns.right.filter((key) => key !== columnKey),
    };

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
              gridTemplateColumns: "35px 1fr 55px 80px",
              gap: "6px",
              padding: "6px 4px",
              fontWeight: "600",
              fontSize: "11px",
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
              const position = getFixedPosition(col.key);

              return (
                <div
                  key={col.key || index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "35px 1fr 55px 80px",
                    gap: "6px",
                    padding: "8px 4px",
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
                      fontSize: "12px",
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
                      disabled={!isVisible}
                    />
                  </div>

                  {/* Position Select */}
                  <div>
                    <Select
                      value={position || "left"}
                      onChange={(value) => handlePositionChange(col.key, value)}
                      disabled={!isFixed || !isVisible}
                      style={{
                        width: "100%",
                        fontSize: "11px",
                      }}
                      size="small"
                    >
                      <Option value="left">Left</Option>
                      <Option value="right">Right</Option>
                    </Select>
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
