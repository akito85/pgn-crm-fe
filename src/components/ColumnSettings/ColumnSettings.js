// components/ColumnSettings/ColumnSettings.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { Button, Input, Checkbox, Radio, message } from "antd";
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
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const MIN_VISIBLE_COLUMNS = 5;

  const updatePanelPos = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, []);

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

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", updatePanelPos, true);
    window.addEventListener("resize", updatePanelPos);
    return () => {
      window.removeEventListener("scroll", updatePanelPos, true);
      window.removeEventListener("resize", updatePanelPos);
    };
  }, [isOpen, updatePanelPos]);

  const handleToggle = () => {
    if (!isOpen) updatePanelPos();
    setIsOpen((prev) => !prev);
  };

  const getColumnKey = useCallback((col, index) => {
    return col.key || col.dataIndex || col.title || `column-${index}`;
  }, []);

  // Filtered columns for search
  const filteredColumns = searchText
    ? columns.filter((col) =>
        col.title?.toLowerCase().includes(searchText.toLowerCase()),
      )
    : columns;

  const visibleColumnCount = columns.filter((col, index) => {
    return !hiddenColumns.includes(getColumnKey(col, index));
  }).length;

  // Check if column is visible
  const isColumnVisible = (columnKey) => {
    return !hiddenColumns.includes(columnKey);
  };

  const isActionColumn = (columnKey) =>
    typeof columnKey === "string" &&
    ["action", "actions"].includes(columnKey.toLowerCase());

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
    if (
      fixedColumns.left.includes(columnKey) ||
      staticFixedKeys.left.includes(columnKey)
    )
      return "left";
    if (
      fixedColumns.right.includes(columnKey) ||
      staticFixedKeys.right.includes(columnKey)
    )
      return "right";
    return null;
  };

  // Handle visibility checkbox change
  const handleVisibilityChange = (e, columnKey) => {
    const checked = e.target.checked;
    if (!checked && visibleColumnCount <= MIN_VISIBLE_COLUMNS) {
      message.warning(
        `Minimal ${MIN_VISIBLE_COLUMNS} kolom harus tetap aktif.`,
      );
      return;
    }

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

  const allColumnsVisible = visibleColumnCount === columns.length;
  const hasSomeVisible = visibleColumnCount > 0;

  const handleHeaderCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      onHiddenColumnsChange?.([]);
      return;
    }

    const minimumVisible = Math.min(MIN_VISIBLE_COLUMNS, columns.length);
    const keysToKeepVisible = columns
      .slice(0, minimumVisible)
      .map((col, index) => getColumnKey(col, index));

    const newHidden = columns
      .map((col, index) => getColumnKey(col, index))
      .filter((columnKey) => !keysToKeepVisible.includes(columnKey));

    onHiddenColumnsChange?.(newHidden);
  };

  // Handle fixed checkbox change
  const handleFixedChange = (e, columnKey) => {
    if (isActionColumn(columnKey)) return;

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
        onClick={handleToggle}
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

      {/* Floating Panel — rendered via portal to escape overflow:hidden ancestors */}
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={panelRef}
            style={{
              position: "absolute",
              top: panelPos.top,
              left: panelPos.left,
              zIndex: 9999,
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
              <div style={{ textAlign: "center" }}>
                <Checkbox
                  indeterminate={hasSomeVisible && !allColumnsVisible}
                  checked={allColumnsVisible}
                  onChange={handleHeaderCheckboxChange}
                />
              </div>
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
                const columnKey = getColumnKey(col, index);
                const isVisible = isColumnVisible(columnKey);
                const isFixed = isColumnFixed(columnKey);
                const isStaticallyFixedCol = isStaticallyFixed(columnKey);
                const position = getFixedPosition(columnKey);

                return (
                  <div
                    key={columnKey}
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
                        onChange={(e) => handleVisibilityChange(e, columnKey)}
                        disabled={
                          isVisible && visibleColumnCount <= MIN_VISIBLE_COLUMNS
                        }
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
                        onChange={(e) => handleFixedChange(e, columnKey)}
                        disabled={
                          !isVisible ||
                          isStaticallyFixedCol ||
                          isActionColumn(columnKey)
                        }
                      />
                    </div>

                    {/* Position Radio Buttons */}
                    <div>
                      <Radio.Group
                        value={
                          isActionColumn(columnKey)
                            ? "right"
                            : position || "left"
                        }
                        onChange={(e) =>
                          handlePositionChange(columnKey, e.target.value)
                        }
                        disabled={
                          !isFixed || !isVisible || isActionColumn(columnKey)
                        }
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
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ColumnSettings;
