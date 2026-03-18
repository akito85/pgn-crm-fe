import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Spin, Modal, Select, Input, Button, Dropdown, Menu, Divider, Input as AntInput } from "antd";
import { 
  PlusOutlined, 
  DownOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined 
} from "@ant-design/icons";
import { debounce } from 'lodash';
import TextArea from "antd/lib/input/TextArea";
import PropTypes from 'prop-types';
import ColumnSettings from "../ColumnSettings/ColumnSettings";

// ── Icons ──────────────────────────────────────────────────────────────────

// + spins 45° → × on expand; spins back on collapse
const ExpandIcon = ({ expanded }) => (
  <svg
    width="8" height="8" viewBox="0 0 8 8" fill="none"
    style={{
      transition:      "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform:       expanded ? "rotate(45deg)" : "rotate(0deg)",
      transformOrigin: "center",
    }}
  >
    <line x1="0.5" y1="4" x2="7.5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4"   y1="0.5" x2="4" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Advance Search Component ───────────────────────────────────────────────
const NxAdvanceSearch = ({
  visible,
  onClose,
  onSearch,
  onClear,
  columns = [],
  modalWidth = 1100,
}) => {
  const [filters, setFilters] = useState([
    {
      id: Date.now(),
      column: "",
      operator: "Equal to",
      value: "",
      logic: "AND",
    },
  ]);
  const [filterRules, setFilterRules] = useState([]);
  const [limitData, setLimitData] = useState("");

  const getColumnKey = (col, index) =>
    col?.key || col?.dataIndex || `${col?.title || "column"}-${index}`;

  // Available operators
  const operators = [
    "Equal to",
    "Not equal to",
    "Contains",
    "Does not contain",
    "Greater than",
    "Less than",
    "Greater than or equal",
    "Less than or equal",
    "Is empty",
    "Is not empty",
  ];

  // Add new filter to main group
  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      column: "",
      operator: "Equal to",
      value: "",
      logic: "AND",
    };
    setFilters([...filters, newFilter]);
  };

  // Remove filter from main group
  const removeFilter = (id) => {
    if (filters.length > 1) {
      setFilters(filters.filter((f) => f.id !== id));
    }
  };

  // Update filter in main group
  const updateFilter = (id, field, value) => {
    setFilters(
      filters.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  // Add filter rule group
  const addFilterRule = () => {
    setFilterRules([
      ...filterRules,
      {
        id: Date.now(),
        filters: [
          {
            id: Date.now() + 1,
            column: "",
            operator: "Equal to",
            value: "",
            logic: "AND",
          },
        ],
        groupLogic: "OR",
      },
    ]);
  };

  // Add filter within a rule group
  const addFilterToRule = (ruleId) => {
    setFilterRules(
      filterRules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              filters: [
                ...rule.filters,
                {
                  id: Date.now(),
                  column: "",
                  operator: "Equal to",
                  value: "",
                  logic: "AND",
                },
              ],
            }
          : rule
      )
    );
  };

  // Update filter in rule group
  const updateRuleFilter = (ruleId, filterId, field, value) => {
    setFilterRules(
      filterRules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              filters: rule.filters.map((f) =>
                f.id === filterId ? { ...f, [field]: value } : f
              ),
            }
          : rule
      )
    );
  };

  // Update rule group logic
  const updateRuleLogic = (ruleId, logic) => {
    setFilterRules(
      filterRules.map((rule) =>
        rule.id === ruleId ? { ...rule, groupLogic: logic } : rule
      )
    );
  };

  // Remove rule group
  const removeRuleGroup = (ruleId) => {
    setFilterRules(filterRules.filter((rule) => rule.id !== ruleId));
  };

  // Handle search
  const handleSearch = () => {
    const searchData = {
      filters: filters,
      filterRules: filterRules,
      limitData: limitData,
    };
    onSearch?.(searchData);
  };

  // Handle clear
  const handleClear = () => {
    setFilters([
      {
        id: Date.now(),
        column: "",
        operator: "Equal to",
        value: "",
        logic: "AND",
      },
    ]);
    setFilterRules([]);
    setLimitData("");
    onClear?.();
  };

  // Logic dropdown menu
  const getLogicMenu = (currentLogic, onChange) => (
    <Menu
      selectedKeys={[currentLogic]}
      onClick={({ key }) => onChange(key)}
      style={{ minWidth: 30 }}
    >
      <Menu.Item key="AND">AND</Menu.Item>
      <Menu.Item key="OR">OR</Menu.Item>
    </Menu>
  );

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onClose}
      width={modalWidth}
      bodyStyle={{ padding: "0px" }}
      closable={false}
    >
      <div className="space-y-6">
        {/* Main Filter Group */}
        <div className="flex p-5 gap-[50px]">
          <div className="text-base font-normal text-gray-800">Where</div>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 mb-4">
              {/* First Filter Row */}
              <div className="flex-1 flex gap-3">
                <Select
                  placeholder="Select Column"
                  value={filters[0]?.column || undefined}
                  onChange={(value) =>
                    updateFilter(filters[0].id, "column", value)
                  }
                  className="flex-1"
                  showSearch
                  size="large"
                  style={{
                    borderRadius: 8,
                  }}
                >
                  {columns.map((col, index) => {
                    const columnKey = getColumnKey(col, index);
                    return (
                    <Select.Option key={columnKey} value={columnKey}>
                      {col.title || col.dataIndex || "Column"}
                    </Select.Option>
                    );
                  })}
                </Select>

                <Select
                  value={filters[0]?.operator}
                  onChange={(value) =>
                    updateFilter(filters[0].id, "operator", value)
                  }
                  style={{ width: 200 }}
                  size="large"
                >
                  {operators.map((op) => (
                    <Select.Option key={op} value={op}>
                      {op}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* First Filter Value Input */}
            <div className="mb-4">
              <TextArea
                placeholder="Input Value or Formula"
                value={filters[0]?.value}
                onChange={(e) =>
                  updateFilter(filters[0].id, "value", e.target.value)
                }
                size="large"
                style={{ borderRadius: 8 }}
              />
            </div>
            {/* Additional Filters in Main Group */}
            {filters.slice(1).map((filter, index) => (
              <div key={filter.id} className="mb-4">
                <div className="mb-3">
                  <Dropdown
                    menu={getLogicMenu(filter.logic, (logic) =>
                      updateFilter(filter.id, "logic", logic)
                    )}
                    trigger={["click"]}
                  >
                    <Button
                      style={{
                        borderRadius: 8,
                        minWidth: 100,
                        height: 36,
                      }}
                    >
                      {filter.logic} <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>

                <div className="flex gap-3 mb-3">
                  <Select
                    placeholder="Select Column"
                    value={filter.column || undefined}
                    onChange={(value) =>
                      updateFilter(filter.id, "column", value)
                    }
                    className="flex-1"
                    showSearch
                    size="large"
                  >
                    {columns.map((col, index) => {
                      const columnKey = getColumnKey(col, index);
                      return (
                      <Select.Option key={columnKey} value={columnKey}>
                        {col.title || col.dataIndex || "Column"}
                      </Select.Option>
                      );
                    })}
                  </Select>

                  <Select
                    value={filter.operator}
                    onChange={(value) =>
                      updateFilter(filter.id, "operator", value)
                    }
                    style={{ width: 200 }}
                    size="large"
                  >
                    {operators.map((op) => (
                      <Select.Option key={op} value={op}>
                        {op}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <TextArea
                  placeholder="Input Value or Formula"
                  value={filter.value}
                  onChange={(e) =>
                    updateFilter(filter.id, "value", e.target.value)
                  }
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </div>
            ))}

            {/* Add Linear Filter Button */}
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={addFilter}
              style={{
                padding: "4px 8px",
                color: "#1890ff",
                fontSize: 15,
                height: "auto",
                border: "1px dashed #d9d9d9",
                borderRadius: 6,
              }}
            >
              Add Linear Filter
            </Button>
          </div>
        </div>

        <Divider />
        {/* Filter Rule Groups */}
        {filterRules.map((rule, ruleIndex) => (
          <div key={rule.id} className="flex flex-col gap-5 px-5 border-t ">
            <div className="flex gap-5">
              <div className="mb-4">
                <Dropdown
                  menu={getLogicMenu(rule.groupLogic, (logic) =>
                    updateRuleLogic(rule.id, logic)
                  )}
                  trigger={["click"]}
                >
                  <Button
                    style={{
                      borderRadius: 8,
                      minWidth: 50,
                      height: 36,
                    }}
                  >
                    {rule.groupLogic} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>

              <div className="flex flex-col w-full">
                {rule.filters.map((filter, filterIndex) => (
                  <div key={filter.id} className="mb-4 ">
                    {filterIndex > 0 && (
                      <div className="mb-3">
                        <Dropdown
                          menu={getLogicMenu(filter.logic, (logic) =>
                            updateRuleFilter(rule.id, filter.id, "logic", logic)
                          )}
                          trigger={["click"]}
                        >
                          <Button
                            style={{
                              borderRadius: 8,
                              minWidth: 100,
                              height: 36,
                            }}
                          >
                            {filter.logic} <DownOutlined />
                          </Button>
                        </Dropdown>
                      </div>
                    )}

                    <div className="flex gap-3 mb-3 ">
                      <Select
                        placeholder="Select Column"
                        value={filter.column || undefined}
                        onChange={(value) =>
                          updateRuleFilter(rule.id, filter.id, "column", value)
                        }
                        className="flex-1"
                        showSearch
                        size="large"
                      >
                        {columns.map((col, index) => {
                          const columnKey = getColumnKey(col, index);
                          return (
                          <Select.Option key={columnKey} value={columnKey}>
                            {col.title || col.dataIndex || "Column"}
                          </Select.Option>
                          );
                        })}
                      </Select>

                      <Select
                        value={filter.operator}
                        onChange={(value) =>
                          updateRuleFilter(
                            rule.id,
                            filter.id,
                            "operator",
                            value
                          )
                        }
                        style={{ width: 200 }}
                        size="large"
                      >
                        {operators.map((op) => (
                          <Select.Option key={op} value={op}>
                            {op}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>

                    <TextArea
                      placeholder="Input Value or Formula"
                      value={filter.value}
                      onChange={(e) =>
                        updateRuleFilter(
                          rule.id,
                          filter.id,
                          "value",
                          e.target.value
                        )
                      }
                      size="large"
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                ))}
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => addFilterToRule(rule.id)}
                  style={{
                    padding: "4px 8px",
                    color: "#1890ff",
                    fontSize: 15,
                    height: "auto",
                    border: "1px dashed #d9d9d9",
                    borderRadius: 6,
                  }}
                >
                  Add Linear Filter
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Divider />
        {/* Add Filter Rules Button */}
        <div className="border-t px-5">
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={addFilterRule}
            style={{
              padding: "4px 0",
              fontSize: 15,
              height: "auto",
            }}
          >
            Add Filter Rules
          </Button>
        </div>

        {/* Set Limit Data */}
        <div className="border border-[#0000] pt-6 bg-[#F5F5F5] px-5">
          <div className="text-base font-normal text-gray-800 mb-3">
            Set Limit Data
          </div>
          <Input
            placeholder="No Limitation"
            value={limitData}
            onChange={(e) => setLimitData(e.target.value)}
            type="number"
            size="large"
            style={{ borderRadius: 8 }}
          />
          {/* Footer Actions */}
          <div className="flex justify-between bg-[#F5F5F5] border-t py-[20px]">
            <Button
              onClick={onClose}
              size="large"
              style={{
                borderColor: "#BDBDBD",
                borderRadius: 8,
                backgroundColor: "white",
                minWidth: 100,
                height: 42,
                fontSize: 15,
                color: "black",
              }}
            >
              Cancel
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={handleClear}
                size="large"
                style={{
                  color: "#ff4d4f",
                  borderColor: "#ff4d4f",
                  backgroundColor: "#FFEBEE",
                  borderRadius: 8,
                  width: "fit-content",
                  height: 42,
                  fontSize: 15,
                }}
              >
                Clear Filter
              </Button>
              <Button
                type="primary"
                onClick={handleSearch}
                size="large"
                style={{
                  borderRadius: 8,
                  width: "fit-content",
                  height: 42,
                  fontSize: 15,
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ── SearchBar Component ────────────────────────────────────────────────────
// KEY ARCHITECTURE: This component owns its own local input state.
// It only propagates the committed value upward via a debounced callback,
// so the parent's re-render (which triggers filtering) never causes the
// input to lose focus or re-mount.
const SearchBar = React.memo(({ placeholder = "Search content here ....", onSearch }) => {
  const [localValue, setLocalValue] = useState('');
  const inputRef = useRef(null);

  // Stable debounced notifier — recreated only when onSearch identity changes
  const debouncedNotify = useCallback(
    debounce((val) => { onSearch?.(val); }, 220),
    [onSearch]
  );

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setLocalValue(val);        // local state → no parent re-render, no focus loss
    debouncedNotify(val);      // deferred → triggers parent filter after typing pauses
  }, [debouncedNotify]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onSearch?.('');
  }, [onSearch]);

  return (
    <div className="relative">
      <SearchOutlined
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 z-30"
        style={{ fontSize: "14px" }}
      />
      <AntInput
        ref={inputRef}
        placeholder={placeholder}
        className="h-[32px]"
        value={localValue}
        style={{
          paddingLeft: "35px",
          border: "1px solid #BDBDBD",
          borderRadius: "8px",
          fontSize: "12px",
        }}
        onChange={handleChange}
        allowClear
        onClear={handleClear}
      />
    </div>
  );
});

// ── Constants ──────────────────────────────────────────────────────────────
const HEADER_BG        = "#2C6FAD";
const BORDER_COL       = "#C8CDD4";
const ROW_WHITE        = "#FFFFFF";
const ROW_HOVER        = "#EBF2FA";
const FONT_FAMILY      = "'PlusJakartaSans', 'PublicSans', sans-serif";
const EXPAND_COL_WIDTH = 50;
const DEFAULT_COL_WIDTH = 120;

// ── Helper Functions ───────────────────────────────────────────────────────

// Wrap column render functions to handle intelligent NO column
const wrapColumnRender = (column, index) => {
  const { key, dataIndex, render } = column;
  const fieldKey = key || dataIndex;

  if (fieldKey === "no") {
    return {
      ...column,
      render: (value, record, rowIndex) => {
        // If data has NO field, use it; otherwise auto-number
        if (value !== undefined && value !== null) {
          return value;
        }
        return rowIndex + 1;
      },
    };
  }

  // For non-NO columns, preserve the render function if it exists
  if (render) {
    return column;
  }

  // For plain dataIndex/key columns without custom render, return as-is
  return column;
};

// Measure text width using canvas context
const measureTextWidth = (text, fontSize = 12) => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
    return ctx.measureText(String(text || "")).width;
  } catch {
    return 0;
  }
};

// Calculate max width for first 3 columns across parent and child rows
const calculateFirst3ColumnWidths = (parentColumns, childColumns, dataSource) => {
  const first3Parent = parentColumns.slice(0, 3);
  const first3Child = childColumns.slice(0, 3);
  const numCols = Math.min(3, first3Parent.length);

  const widths = {};
  const PAD = 32; // 8px padding each side + 16px buffer
  const MIN_WIDTH = 60;

  // Measure each of the first 3 columns
  for (let i = 0; i < numCols; i++) {
    const parentCol = first3Parent[i];
    const childCol = first3Child[i];
    const fieldKey = parentCol?.key || parentCol?.dataIndex;

    let maxWidth = MIN_WIDTH;

    // Measure parent rows (sample first 10 for performance)
    dataSource.slice(0, 10).forEach((row, rowIdx) => {
      let value = row[fieldKey];
      if (parentCol?.render) {
        value = parentCol.render(value, row, rowIdx);
      }
      const w = measureTextWidth(value);
      maxWidth = Math.max(maxWidth, w);

      // Measure child rows if already loaded
      if (row.children && Array.isArray(row.children)) {
        row.children.slice(0, 10).forEach((child, childIdx) => {
          let childValue = child[fieldKey];
          if (childCol?.render) {
            childValue = childCol.render(childValue, child, childIdx);
          }
          const childW = measureTextWidth(childValue);
          maxWidth = Math.max(maxWidth, childW);
        });
      }
    });

    widths[fieldKey] = Math.ceil(maxWidth + PAD);
  }

  return widths;
};

// ── ChildTable Component ───────────────────────────────────────────────────

const ChildTable = ({ children: rows, columns = [], isLoading = false, searchValue = "", highlightText = (text) => text }) => {
  // Filter rows based on search value — exact or fuzzy
  const processedRows = useMemo(() => {
    if (!searchValue) return rows;
    const sq = searchValue.toLowerCase();
    return rows.filter(row => {
      return columns.some(col => {
        const val = String(row[col.dataIndex || col.key] || "").toLowerCase();
        if (val.includes(sq)) return true;
        // fuzzy inline
        let qi = 0;
        for (let i = 0; i < val.length && qi < sq.length; i++) {
          if (val[i] === sq[qi]) qi++;
        }
        return qi === sq.length;
      });
    });
  }, [rows, columns, searchValue]);

  if (isLoading) {
    return (
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 8, color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        <span className="nx-child-spinner" />
        Loading...
      </div>
    );
  }

  if (!processedRows || processedRows.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        No data
      </div>
    );
  }

  const displayColumns = columns.length > 0
    ? columns.map((col) => {
        const key = col.key || col.dataIndex || col.title;
        const wrappedCol = wrapColumnRender(col);
        return { ...wrappedCol, key, width: col.width ?? DEFAULT_COL_WIDTH };
      })
    : [];

  const lastIdx = displayColumns.length - 1;

  return (
    <div className="nx-child-scroll" style={{ overflowX: "auto", width: "100%" }}>
      <div style={{ display: "flex", minWidth: "max-content" }}>
        {displayColumns.map((col, colIdx) => (
          <div
            key={col.key || colIdx}
            style={{
              width:      colIdx === lastIdx ? undefined : col.width,
              minWidth:   colIdx === lastIdx ? undefined : col.width,
              flexShrink: colIdx === lastIdx ? 1 : 0,
              flex:       colIdx === lastIdx ? 1 : "none",
              borderRight: colIdx < lastIdx ? `1px solid ${BORDER_COL}` : "none",
              display:       "flex",
              flexDirection: "column",
            }}
          >
            {/* header */}
            <div
              style={{
                background:     HEADER_BG,
                height:         30,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                borderBottom:   `1px solid ${BORDER_COL}`,
                padding:        "4px 8px",
                overflow:       "hidden",
              }}
            >
              <span
                style={{
                  color:          "#fff",
                  fontSize:       10,
                  fontWeight:     600,
                  fontFamily:     FONT_FAMILY,
                  letterSpacing:  "0.05em",
                  textTransform:  "uppercase",
                  overflow:       "hidden",
                  textOverflow:   "ellipsis",
                  whiteSpace:     "nowrap",
                }}
              >
                {col.title}
              </span>
            </div>
            {/* rows */}
            {processedRows.map((row, rowIdx) => {
              let cellValue = "—";
              if (col.render) {
                cellValue = col.render(row[col.dataIndex ?? col.key], row, rowIdx);
              } else if (col.dataIndex) {
                cellValue = row[col.dataIndex] ?? "—";
              } else {
                cellValue = row[col.key] ?? "—";
              }

              // Highlight the cell value if it matches the search term
              const highlightedValue = highlightText(cellValue, searchValue);

              const isNoColumn = (col.key || col.dataIndex) === "no";
              return (
                <div
                  key={rowIdx}
                  style={{
                    height:         30,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: isNoColumn || col.align === "center" ? "center" : "flex-start",
                    borderBottom:   `1px solid ${BORDER_COL}`,
                    padding:        "4px 8px",
                    background:     rowIdx % 2 === 0 ? ROW_WHITE : ROW_HOVER,
                    fontSize:       12,
                    fontFamily:     FONT_FAMILY,
                    color:          "#111827",
                    overflow:       "hidden",
                    textOverflow:   "ellipsis",
                    whiteSpace:     "nowrap",
                  }}
                >
                  {highlightedValue}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ParentRow Component ────────────────────────────────────────────────────

// Security Note: The render functions in parentColumns and childColumns must return
// React elements or strings. Never pass raw HTML strings. If you need to render HTML,
// use dangerouslySetInnerHTML only with sanitized content.
const ParentRow = React.memo(({
  no,
  record,
  parentColumns,
  childColumns,
  isEven,
  isExpanded,
  onToggleExpand,
  onExpand,
  actionColumn,
  first3Widths,
  columnWidths = {},
  isChildLoading = false,
  searchValue = "",
  highlightText = (text) => text
}) => {
  const bg = isEven ? ROW_HOVER : ROW_WHITE;

  const handleToggle = () => {
    if (!isExpanded && (!record.children || record.children.length === 0)) {
      onExpand?.(record.id);
    }
    onToggleExpand?.(record.id);
  };

  const cellBase = {
    display:    "flex",
    alignItems: "center",
    borderBottom: `1px solid ${BORDER_COL}`,
    fontSize:   12,
    fontFamily: FONT_FAMILY,
    color:      "#111827",
    padding:    "4px 8px",
    minHeight:  30,
    height:     30,
    boxSizing:  "border-box",
  };

  return (
    <>
      {/* Parent row */}
      <div style={{ display: "flex", alignItems: "stretch", background: bg }}>
        {/* Toggle cell */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={`Toggle details for ${record.name || 'row'}`}
          style={{
            width:          EXPAND_COL_WIDTH,
            flexShrink:     0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            borderRight:    `1px solid ${BORDER_COL}`,
            borderBottom:   `1px solid ${BORDER_COL}`,
            minHeight:      30,
            height:         30,
            cursor:         "pointer",
            boxSizing:      "border-box",
          }}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <span
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "#1976D2",
              pointerEvents:  "none",
            }}
          >
            <ExpandIcon expanded={isExpanded} />
          </span>
        </div>

        {/* Data cells */}
        {parentColumns.map((col, colIdx) => {
          const fieldKey = col.key || col.dataIndex;
          let value = record[fieldKey];

          if (col.render) {
            value = col.render(value, record, no - 1);
          }

          const highlightedValue = highlightText(value, searchValue);

          const width = columnWidths[fieldKey] || first3Widths[fieldKey] || col.width || DEFAULT_COL_WIDTH;
          const isLastDataCol = colIdx === parentColumns.length - 1;
          const showActionBorder = actionColumn && isLastDataCol;
          const isNoColumn = fieldKey === "no";

          return (
            <div
              key={fieldKey || colIdx}
              style={{
                ...cellBase,
                width: isLastDataCol ? undefined : width,
                minWidth: isLastDataCol ? undefined : width,
                flexShrink: isLastDataCol ? 1 : 0,
                justifyContent: isNoColumn || col.align === "center" ? "center" : "flex-start",
                borderRight: showActionBorder ? `1px solid ${BORDER_COL}` : (colIdx < parentColumns.length - 1 ? `1px solid ${BORDER_COL}` : "none"),
                flex: isLastDataCol ? 1 : "0 0 auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {highlightedValue || "—"}
            </div>
          );
        })}

        {/* ACTIONS */}
        {actionColumn && (
          <div style={{ ...cellBase, width: actionColumn.width || 120, flexShrink: 0, justifyContent: "center", background: bg }}>
            {actionColumn.render ? actionColumn.render(null, record) : "—"}
          </div>
        )}
      </div>

      {/* Child table — shown when expanded */}
      {isExpanded && (
        <div style={{ display: "flex", alignItems: "stretch", animation: "slideDown 0.2s ease-out" }}>
          {/* Blank spacer under toggle */}
          <div
            style={{
              width:        EXPAND_COL_WIDTH,
              flexShrink:   0,
              borderRight:  `1px solid ${BORDER_COL}`,
              borderBottom: `1px solid ${BORDER_COL}`,
              background:   bg,
              boxSizing:    "border-box",
            }}
          />
          {/* Child table */}
          <div style={{ flex: 1, borderBottom: `1px solid ${BORDER_COL}`, minWidth: 0 }}>
            <ChildTable
              children={record.children || []}
              columns={childColumns.map((col) => {
                const fieldKey = col.key || col.dataIndex;
                const wrappedCol = wrapColumnRender(col);
                const width = columnWidths[fieldKey] || first3Widths[fieldKey] || col.width || DEFAULT_COL_WIDTH;
                return { ...wrappedCol, width };
              })}
              isLoading={isChildLoading}
              searchValue={searchValue}
              highlightText={highlightText}
            />
          </div>
        </div>
      )}
    </>
  );
});

// ── Main NxTableNested Component ───────────────────────────────────────────

const NxTableNested = ({
  parentColumns    = [],
  childColumns     = [],
  dataSource       = [],
  loading          = false,
  onExpand         = () => {},
  actionColumn     = null,
  loadingKeys      = new Set(),
  columnWidths     = {}, // Optional: { fieldKey: width, ... }
  useSelect = true,
  showAdvanceSearch = true,
  showSearchBar = true,
  showRefresh = false,
  onRefresh,
  columnDefinitions,
  fixedColumns = { left: [], right: [] },
  setFixedColumns = () => { },
  onAdvanceSearch = () => { },
  useInfiniteScroll = false,
  onLoadMore = () => { },
  hasMore = false,
  customHeaderLeft,
}) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // ── Fuzzy match helpers ────────────────────────────────────────────────
  // Returns true when every character of `query` appears in `text` in order.
  const fuzzyMatch = useCallback((text, query) => {
    if (!query) return true;
    const t = String(text).toLowerCase();
    const q = query.toLowerCase();
    let qi = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) qi++;
    }
    return qi === q.length;
  }, []);

  // Highlight function: exact substring match gets yellow, fuzzy characters get underline.
  const highlightText = useCallback((text, search) => {
    if (!search || text === null || text === undefined) return text;
    const str = String(text);
    const lower = str.toLowerCase();
    const sq = search.toLowerCase();

    // Prefer exact substring highlighting
    const idx = lower.indexOf(sq);
    if (idx !== -1) {
      return (
        <>
          {str.slice(0, idx)}
          <span style={{ backgroundColor: '#fde047', padding: '1px 2px', borderRadius: '2px', fontWeight: 600 }}>
            {str.slice(idx, idx + sq.length)}
          </span>
          {str.slice(idx + sq.length)}
        </>
      );
    }

    // Fuzzy: highlight individual matched characters
    const chars = [];
    let qi = 0;
    for (let i = 0; i < str.length; i++) {
      if (qi < sq.length && str[i].toLowerCase() === sq[qi]) {
        chars.push(
          <span key={i} style={{ color: '#1976D2', fontWeight: 700, textDecoration: 'underline' }}>
            {str[i]}
          </span>
        );
        qi++;
      } else {
        chars.push(str[i]);
      }
    }
    return <>{chars}</>;
  }, []);

  // Calculate first 3 column widths with initial default values to prevent layout shift
  const first3Widths = useMemo(() => {
    // If we're loading, provide default widths to prevent layout shift
    if (loading) {
      const defaultWidths = {};
      const numCols = Math.min(3, parentColumns.length);
      for (let i = 0; i < numCols; i++) {
        const col = parentColumns[i];
        const fieldKey = col?.key || col?.dataIndex;
        if (fieldKey) {
          defaultWidths[fieldKey] = col?.width || DEFAULT_COL_WIDTH;
        }
      }
      return defaultWidths;
    }
    return calculateFirst3ColumnWidths(parentColumns, childColumns, dataSource);
  }, [parentColumns, childColumns, dataSource, loading]);

  // Filter data based on search value — supports exact substring AND fuzzy match
  const filteredDataSource = useMemo(() => {
    if (!searchValue) return dataSource;
    
    return dataSource.filter(row => {
      // Check parent row — exact substring first, then fuzzy
      const parentMatch = parentColumns.some(col => {
        const value = row[col.dataIndex || col.key];
        const str = String(value || "").toLowerCase();
        const sq = searchValue.toLowerCase();
        return str.includes(sq) || fuzzyMatch(str, sq);
      });
      
      if (parentMatch) return true;
      
      // Check child rows if they exist
      if (row.children && Array.isArray(row.children)) {
        return row.children.some(child => {
          return childColumns.some(col => {
            const value = child[col.dataIndex || col.key];
            const str = String(value || "").toLowerCase();
            const sq = searchValue.toLowerCase();
            return str.includes(sq) || fuzzyMatch(str, sq);
          });
        });
      }
      
      return false;
    });
  }, [dataSource, parentColumns, childColumns, searchValue, fuzzyMatch]);

  const handleToggleExpand = useCallback((rowId) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
        // User explicitly closed this row — remove from auto-tracked set so
        // clearing search won't try to collapse it again.
        autoExpandedRef.current.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  const handleExpand = useCallback((rowId) => {
    onExpand(rowId);
  }, [onExpand]);

  // ── Search-driven expand / collapse (runs once in parent, not per-row) ────
  // Compute which row IDs have a child match. Pure derivation — no side effects.
  const childMatchIds = useMemo(() => {
    if (!searchValue) return new Set();
    const sq = searchValue.toLowerCase();
    const ids = new Set();
    dataSource.forEach(row => {
      if (!row.children || row.children.length === 0) return;
      const matches = row.children.some(child =>
        childColumns.some(col => {
          const val = String(child[col.dataIndex || col.key] || "").toLowerCase();
          if (val.includes(sq)) return true;
          let qi = 0;
          for (let i = 0; i < val.length && qi < sq.length; i++) {
            if (val[i] === sq[qi]) qi++;
          }
          return qi === sq.length;
        })
      );
      if (matches) ids.add(row.id);
    });
    return ids;
  }, [searchValue, dataSource, childColumns]);

  // Track which rows were expanded by the search auto-expand, so we never
  // collapse rows the user manually opened.
  const autoExpandedRef = useRef(new Set());

  // Single effect that expands/collapses based on childMatchIds.
  // Replaces the N per-row useEffects that each called setExpandedKeys individually.
  const prevSearchRef = useRef("");
  useEffect(() => {
    const searchCleared = !searchValue && prevSearchRef.current;
    prevSearchRef.current = searchValue;

    if (searchCleared) {
      // Search was cleared — collapse only rows that were auto-opened, not
      // rows the user manually toggled open.
      const toCollapse = autoExpandedRef.current;
      autoExpandedRef.current = new Set();
      if (toCollapse.size > 0) {
        setExpandedKeys(prev => {
          const next = new Set(prev);
          toCollapse.forEach(id => next.delete(id));
          return next;
        });
      }
      return;
    }
    if (!searchValue) return;

    setExpandedKeys(prev => {
      const next = new Set(prev);
      let changed = false;
      dataSource.forEach(row => {
        if (childMatchIds.has(row.id)) {
          // Child data is loaded and matches — expand if not already open
          if (!next.has(row.id)) {
            next.add(row.id);
            autoExpandedRef.current.add(row.id);
            changed = true;
          }
        }
        // Rows NOT in childMatchIds are left alone — the user may have manually
        // opened them, or their children simply haven't loaded yet. We never
        // force-collapse based on search state.
      });
      return changed ? next : prev;
    });

    // For rows whose children haven't been fetched yet, trigger the fetch.
    // They won't be in childMatchIds (no children to match against) but we
    // still need to load them so the user can see results after expanding.
    dataSource.forEach(row => {
      if (!row.children || row.children.length === 0) {
        // Speculatively fetch — the parent's onExpand handler should be
        // idempotent (ignore if already loading or loaded).
        onExpand(row.id);
      }
    });
  }, [childMatchIds, searchValue, dataSource, onExpand]);

  const handleRefresh =
    onRefresh ||
    (() => {
      window.location.reload();
    });

  const handleAdvanceSearch = (searchData) => {
    onAdvanceSearch(searchData);
    setIsAdvanceOpen(false);
  };

  const handleClearFilter = () => {
    onAdvanceSearch(null);
  };

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────
  // A sentinel <div> sits at the bottom of the scroll container. When it
  // enters the viewport the observer fires onLoadMore — no scroll math,
  // no global querySelector, no re-registration on every state change.
  const sentinelRef = useRef(null);
  const isLoadingMoreRef = useRef(false); // ref mirror so the observer closure is never stale

  useEffect(() => {
    if (!useInfiniteScroll || !hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMoreRef.current) {
          isLoadingMoreRef.current = true;
          setIsLoadingMore(true);
          Promise.resolve(onLoadMore())
            .catch(() => {}) // swallow — caller owns error UI
            .finally(() => {
              isLoadingMoreRef.current = false;
              setIsLoadingMore(false);
            });
        }
      },
      {
        // root: null → viewport; rootMargin pre-fires ~80px before sentinel is visible
        root: null,
        rootMargin: "0px 0px 80px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [useInfiniteScroll, hasMore, onLoadMore]);

  // Filter columns based on hidden columns
  const visibleParentColumns = useMemo(() => {
    return parentColumns.filter(col => {
      const colKey = col.key || col.dataIndex;
      return !optionSelectedCol.includes(colKey);
    });
  }, [parentColumns, optionSelectedCol]);

  const visibleChildColumns = useMemo(() => {
    return childColumns.filter(col => {
      const colKey = col.key || col.dataIndex;
      return !optionSelectedCol.includes(colKey);
    });
  }, [childColumns, optionSelectedCol]);

  const hasRightControls =
    showAdvanceSearch || showSearchBar || showRefresh;

  const headerSpanBase = {
    color:         "#fff",
    fontSize:      10,
    fontWeight:    600,
    fontFamily:    FONT_FAMILY,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const headerCellBase = {
    background:   HEADER_BG,
    display:      "flex",
    alignItems:   "center",
    borderBottom: `1px solid ${BORDER_COL}`,
    padding:      "4px 8px",
    minHeight:    30,
    height:       30,
    boxSizing:    "border-box",
    flexShrink:   0,
  };

  // Stable callback: passed down to SearchBar so it never changes identity
  // between renders. SearchBar owns the input DOM state; this only updates
  // the filter value after the debounce fires.
  const handleSearchChange = useCallback((val) => {
    setSearchValue(val);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {useSelect && (
        <div className={"w-full flex mb-3 justify-between items-center"}>
          <div className="flex items-center gap-4">
            <ColumnSettings
              columns={columnDefinitions || [...parentColumns, ...childColumns]}
              hiddenColumns={optionSelectedCol}
              onHiddenColumnsChange={setOptionSelectedCol}
              fixedColumns={fixedColumns}
              onFixedColumnsChange={setFixedColumns}
              buttonText="Column Settings"
              buttonStyle={{ height: "32px", fontSize: "12px" }}
            />
            {customHeaderLeft && customHeaderLeft}
          </div>

          {hasRightControls && (
            <div className="flex justify-end gap-2">
              {showRefresh && (
                <Button
                  icon={<ReloadOutlined style={{ fontSize: "14px" }} />}
                  onClick={handleRefresh}
                  loading={loading}
                  style={{
                    border: "1px solid #BDBDBD",
                    color: "black",
                    borderRadius: "8px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  Refresh
                </Button>
              )}

              {showAdvanceSearch && (
                <Button
                  onClick={() => setIsAdvanceOpen(true)}
                  style={{
                    border: "1px solid #BDBDBD",
                    color: "black",
                    borderRadius: "8px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  <FilterOutlined style={{ fontSize: "14px" }} />
                  Advanced Search
                </Button>
              )}

              {showSearchBar && (
                <div style={{ width: "200px" }}>
                  {/* SearchBar owns its own DOM input state — no focus loss on parent re-render */}
                  <SearchBar
                    placeholder="Search content here ..."
                    onSearch={handleSearchChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div
        style={{
          borderRadius: 8,
          border:       `1px solid ${BORDER_COL}`,
          overflow:     "hidden",
          display:      "flex",
          flexDirection: "column",
          background:   "#fff",
          fontFamily:   FONT_FAMILY,
          width:        "100%",
        }}
      >
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; max-height: 0; }
            to   { opacity: 1; max-height: 2000px; }
          }

          @keyframes nxSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          .nx-child-spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid #e0e7ef;
            border-top-color: #1976D2;
            border-radius: 50%;
            animation: nxSpin 0.65s linear infinite;
            flex-shrink: 0;
          }

          .nx-child-scroll::-webkit-scrollbar        { height: 6px; }
          .nx-child-scroll::-webkit-scrollbar-track  { background: #f1f1f1; }
          .nx-child-scroll::-webkit-scrollbar-thumb  { background: #888; border-radius: 3px; }
          .nx-child-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
          .nx-child-scroll { scrollbar-width: thin; scrollbar-color: #888 #f1f1f1; }
          
          .nx-table-nested-body::-webkit-scrollbar        { width: 8px; }
          .nx-table-nested-body::-webkit-scrollbar-track  { background: #f1f1f1; }
          .nx-table-nested-body::-webkit-scrollbar-thumb  { background: #888; border-radius: 6px; }
          .nx-table-nested-body::-webkit-scrollbar-thumb:hover { background: #555; }
          .nx-table-nested-body { scrollbar-width: thin; scrollbar-color: #888 #f1f1f1; }
        `}</style>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
          {/* Toggle header (blank) */}
          <div style={{ ...headerCellBase, width: EXPAND_COL_WIDTH, borderRight: `1px solid rgba(255,255,255,0.2)` }} />

          {/* Parent column headers */}
          {visibleParentColumns.map((col, colIdx) => {
            const fieldKey = col.key || col.dataIndex;
            const width = columnWidths[fieldKey] || first3Widths[fieldKey] || col.width || DEFAULT_COL_WIDTH;
            const isLastCol = colIdx === visibleParentColumns.length - 1;

            return (
              <div
                key={fieldKey || colIdx}
                style={{
                  ...headerCellBase,
                  width: isLastCol ? undefined : width,
                  flex: isLastCol ? 1 : "none",
                  minWidth: isLastCol ? undefined : width,
                  justifyContent: "center",
                  borderRight: isLastCol ? (actionColumn ? `1px solid rgba(255,255,255,0.2)` : "none") : `1px solid rgba(255,255,255,0.2)`,
                }}
              >
                <span style={headerSpanBase}>{col.title}</span>
              </div>
            );
          })}

          {/* ACTIONS header */}
          {actionColumn && (
            <div style={{ ...headerCellBase, width: actionColumn.width || 120, justifyContent: "center" }}>
              <span style={headerSpanBase}>{actionColumn.title || "ACTIONS"}</span>
            </div>
          )}
        </div>

        {/* Data rows */}
        <div 
          className="nx-table-nested-body"
          style={{ 
            position: "relative", 
            maxHeight: useInfiniteScroll ? "400px" : "none",
            overflowY: useInfiniteScroll ? "auto" : "visible"
          }}
        >
          {loading ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
              <Spin />
            </div>
          ) : filteredDataSource.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
              No data
            </div>
          ) : (
            filteredDataSource.map((row, i) => (
              <ParentRow
                key={row.id}
                no={i + 1}
                record={row}
                parentColumns={visibleParentColumns}
                childColumns={visibleChildColumns}
                isEven={i % 2 !== 0}
                isExpanded={expandedKeys.has(row.id)}
                onToggleExpand={handleToggleExpand}
                onExpand={handleExpand}
                actionColumn={actionColumn}
                first3Widths={first3Widths}
                columnWidths={columnWidths}
                isChildLoading={loadingKeys.has(row.id)}
                searchValue={searchValue}
                highlightText={highlightText}
              />
            ))
          )}

          {isLoadingMore && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 0",
              color: "#6B7280",
              fontSize: 12,
              fontFamily: FONT_FAMILY,
            }}>
              <span className="nx-child-spinner" />
              Loading more...
            </div>
          )}

          {/* Sentinel: observed by IntersectionObserver to trigger next page load */}
          {useInfiniteScroll && hasMore && (
            <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding:        "6px 12px",
            background:     "#fff",
            display:        "flex",
            justifyContent: "flex-end",
            alignItems:     "center",
            gap:            8,
            borderTop:      `1px solid ${BORDER_COL}`,
            fontFamily:     FONT_FAMILY,
            position:       "relative",
            zIndex:         "1",
            marginTop:      "-1px",
          }}
        >
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Showing {filteredDataSource.length} of {dataSource.length} entries
          </span>
          {!hasMore && filteredDataSource.length > 0 && (
            <>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>All data loaded</span>
            </>
          )}
        </div>
      </div>

      <NxAdvanceSearch
        visible={isAdvanceOpen}
        onClose={() => setIsAdvanceOpen(false)}
        onSearch={handleAdvanceSearch}
        onClear={handleClearFilter}
        columns={[...parentColumns, ...childColumns]}
        modalWidth={600}
      />
    </div>
  );
};

NxTableNested.propTypes = {
  parentColumns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    dataIndex: PropTypes.string,
    title: PropTypes.string.isRequired,
    render: PropTypes.func,
    width: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center']),
  })).isRequired,
  childColumns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    dataIndex: PropTypes.string,
    title: PropTypes.string.isRequired,
    render: PropTypes.func,
    width: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center']),
  })).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.array,
  })).isRequired,
  loading: PropTypes.bool,
  onExpand: PropTypes.func,
  actionColumn: PropTypes.shape({
    title: PropTypes.string,
    width: PropTypes.number,
    render: PropTypes.func,
  }),
  loadingKeys: PropTypes.instanceOf(Set),
  columnWidths: PropTypes.objectOf(PropTypes.number),
  useSelect: PropTypes.bool,
  showAdvanceSearch: PropTypes.bool,
  showSearchBar: PropTypes.bool,
  showRefresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  columnDefinitions: PropTypes.array,
  fixedColumns: PropTypes.shape({
    left: PropTypes.array,
    right: PropTypes.array,
  }),
  setFixedColumns: PropTypes.func,
  onAdvanceSearch: PropTypes.func,
  useInfiniteScroll: PropTypes.bool,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  customHeaderLeft: PropTypes.node,
};

NxTableNested.defaultProps = {
  loading: false,
  onExpand: () => {},
  actionColumn: null,
  loadingKeys: new Set(),
  columnWidths: {},
  useSelect: true,
  showAdvanceSearch: true,
  showSearchBar: true,
  showRefresh: false,
  onRefresh: undefined,
  columnDefinitions: undefined,
  fixedColumns: { left: [], right: [] },
  setFixedColumns: () => {},
  onAdvanceSearch: () => {},
  useInfiniteScroll: false,
  onLoadMore: () => {},
  hasMore: false,
  customHeaderLeft: null,
};

export default NxTableNested;
