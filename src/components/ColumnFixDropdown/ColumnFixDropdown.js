// components/ColumnFixDropdown/ColumnFixDropdown.js
import { useState } from "react";
import { Button, Dropdown, Checkbox, Radio, Divider } from "antd";
import { PushpinOutlined, SettingOutlined } from "@ant-design/icons";

/**
 * ColumnFixDropdown - Reusable component for fixing table columns
 *
 * @param {Array} columns - Array of column definitions with { key, title }
 * @param {Object} fixedColumns - Object with columnKey: position mapping
 * @param {Function} onFixedColumnsChange - Callback when fixed columns change
 * @param {String} buttonText - Custom button text (optional)
 * @param {Object} buttonStyle - Custom button style (optional)
 * @param {Boolean} showCount - Show count of fixed columns in button (default: true)
 * @param {String} placement - Dropdown placement (default: "bottomRight")
 */
const ColumnFixDropdown = ({
  columns = [],
  fixedColumns = {},
  onFixedColumnsChange = () => {},
  buttonText = "Fix Columns",
  buttonStyle = {},
  showCount = true,
  placement = "bottomRight",
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleColumnFixChange = (columnKey, checked) => {
    if (checked) {
      const columnIndex = columns.findIndex((col) => col.key === columnKey);
      const isLastColumn = columnIndex === columns.length - 1;
      const defaultPosition = isLastColumn ? "right" : "left";

      onFixedColumnsChange({
        ...fixedColumns,
        [columnKey]: defaultPosition,
      });
    } else {
      const newFixed = { ...fixedColumns };
      delete newFixed[columnKey];
      onFixedColumnsChange(newFixed);
    }
  };

  const handleColumnPositionChange = (columnKey, position) => {
    onFixedColumnsChange({
      ...fixedColumns,
      [columnKey]: position,
    });
  };

  const handleClearAll = () => {
    onFixedColumnsChange({});
  };

  const canFixLeft = (columnIndex) => columnIndex !== columns.length - 1;
  const canFixRight = (columnIndex) => columnIndex !== 0;

  const columnFixMenu = (
    <div
      style={{
        padding: "12px",
        marginTop: "20px",
        minWidth: "120px",
        maxHeight: "100px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          marginBottom: "12px",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#262626",
        }}
      >
        <PushpinOutlined />
        Fix Columns Position
      </div>
      <Divider style={{ margin: "8px 0" }} />

      {columns.map((col, index) => {
        const isFixed = !!fixedColumns[col.key];
        const position = fixedColumns[col.key] || "left";
        const isFirstColumn = index === 0;
        const isLastColumn = index === columns.length - 1;

        return (
          <div
            key={col.key}
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: isFixed ? "#f0f5ff" : "#fafafa",
              borderRadius: "6px",
              border: isFixed ? "1px solid #d6e4ff" : "1px solid #f0f0f0",
              transition: "all 0.3s",
            }}
          >
            <div style={{ marginBottom: isFixed ? "8px" : "0" }}>
              <Checkbox
                checked={isFixed}
                onChange={(e) =>
                  handleColumnFixChange(col.key, e.target.checked)
                }
                style={{ fontWeight: "500" }}
              >
                {col.title}
              </Checkbox>
            </div>

            {isFixed && (
              <div style={{ marginLeft: "24px", marginTop: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#595959",
                      fontWeight: "500",
                    }}
                  >
                    Position:
                  </span>
                  <Radio.Group
                    value={position}
                    onChange={(e) =>
                      handleColumnPositionChange(col.key, e.target.value)
                    }
                    size="small"
                    buttonStyle="solid"
                    style={{ display: "flex", gap: "6px" }}
                  >
                    <Radio.Button value="left" disabled={!canFixLeft(index)}>
                      Left
                    </Radio.Button>
                    <Radio.Button value="right" disabled={!canFixRight(index)}>
                      Right
                    </Radio.Button>
                  </Radio.Group>
                </div>
                {(isFirstColumn || isLastColumn) && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#8c8c8c",
                      marginTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {isFirstColumn && "* First column can only be fixed left"}
                    {isLastColumn && "* Last column can only be fixed right"}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Divider style={{ margin: "12px 0" }} />

      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}
      >
        <Button size="small" onClick={handleClearAll} style={{ flex: 1 }}>
          Clear All
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => setDropdownVisible(false)}
          style={{ flex: 1 }}
        >
          Done
        </Button>
      </div>
    </div>
  );

  const displayText = showCount
    ? `${buttonText} (${Object.keys(fixedColumns).length})`
    : buttonText;

  return (
    <Dropdown
      overlay={columnFixMenu}
      trigger={["click"]}
      open={dropdownVisible} // ✅ ganti visible → open (versi AntD v5)
      onOpenChange={setDropdownVisible}
      placement={placement} // ✅ posisi dropdown dinamis
    >
      <Button
        icon={<SettingOutlined />}
        style={{ width: "100%", ...buttonStyle }}
      >
        {displayText}
      </Button>
    </Dropdown>
  );
};

export default ColumnFixDropdown;
