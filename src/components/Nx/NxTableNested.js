// NxTableNested.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom nested table built without Ant Design's expandable rows, so we have
// full control over layout, alignment and child-table capabilities.
//
// PARENT TABLE capabilities (identical to NxTable):
//   • Resizable columns (drag resize handle)
//   • Draggable column reorder
//   • Fixed columns (left / right) with overflow warning
//   • Column hide/show via ColumnSettings
//   • Column-preference persistence (localStorage, per userId + idTable)
//   • Fuzzy search + highlight (parent and child rows)
//   • Advanced search modal
//   • Infinite scroll (IntersectionObserver, scroll-listener phase)
//   • Pagination (with page-size selector)
//   • Auto-height (fills viewport below container top)
//   • fetchFailed empty state with Retry button
//   • onInitialLoad guarantee
//   • Row-click selection + keyboard arrow scroll
//   • Export button (showExport)
//   • Refresh button (showRefresh)
//   • customHeaderLeft slot
//   • Per-user preference persistence + clearPreferences static utility
//
// CHILD TABLE additional capabilities:
//   • Resizable columns (prop: childResizable, default true)
//   • Fixed columns left/right (prop: childFixedColumns)
//   • Column widths persisted together with parent in the same localStorage key
//   • Search filter + highlight mirrors parent behaviour
//   • Action column (actionColumn prop)
//   • Infinite scroll per child row not supported by design; the full child
//     dataset is expected to be loaded when onExpand fires.
//
// KEY DIFFERENCES vs NxTable:
//   • Uses a fully custom DOM layout (no Ant Design Table) so parent and child
//     column widths align precisely without needing nestedAlignConfig tricks.
//   • parentColumns / childColumns instead of a single columns prop.
//   • Expand/collapse driven by expandedKeys state + onExpand callback.
//   • actionColumn prop rendered as the last fixed-right column in the parent.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  Modal,
  Pagination,
  Select,
  Spin,
} from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import TextArea from "antd/lib/input/TextArea";
import PropTypes from "prop-types";
import ColumnSettings from "../ColumnSettings/ColumnSettings";

// ── Shared visual constants (mirror NxTable) ─────────────────────────────────
const HEADER_BG        = "#2C6FAD";
const BORDER_COL       = "#C8CDD4";
const ROW_WHITE        = "#FFFFFF";
const ROW_HOVER        = "#EBF2FA";
const FONT_FAMILY      = "'PlusJakartaSans', 'PublicSans', sans-serif";
const EXPAND_COL_WIDTH  = 50;  // px — width of the expand/collapse toggle cell
const DEFAULT_COL_WIDTH = 100; // px — minimum fallback; auto-measure overrides this
const MIN_COL_WIDTH     = 60;  // px — hard floor, never go below this
const COL_PAD           = 24;  // px — 8px left + 8px right padding + 8px buffer
const HEADER_FONT_SIZE  = 10;  // px — matches CSS font-size on header cells
const CELL_FONT_SIZE    = 12;  // px — matches CSS font-size on data cells

// ── Column settings prefix constants ──────────────────────────────────────────
// Namespace parent vs child column keys inside ColumnSettings so each table's
// hidden/fixed state is fully independent.  Prefixes are stripped before storing
// in actual state; they only exist in the data passed to ColumnSettings.
const PARENT_COL_PFX = "parent:";
const CHILD_COL_PFX  = "child:";

// ── Module-level style objects (stable references — never recreated per render) ──
const HEADER_CELL_STYLE = {
  background: HEADER_BG, display: "flex", alignItems: "center",
  borderBottom: `1px solid ${BORDER_COL}`, padding: "4px 8px",
  minHeight: 30, height: 30, boxSizing: "border-box", flexShrink: 0,
  overflow: "hidden",
};
const CELL_BASE_STYLE = {
  display: "flex", alignItems: "center",
  borderBottom: `1px solid ${BORDER_COL}`,
  fontSize: 12, fontFamily: FONT_FAMILY, color: "#111827",
  padding: "4px 8px", minHeight: 30, height: 30, boxSizing: "border-box",
};

// ── Canvas text-width measurement ────────────────────────────────────────────
// Measures the rendered pixel width of a string at a given font size.
// Reuses a single shared canvas context for performance.
let _measureCtx = null;
const measureTextWidth = (text, fontSize = CELL_FONT_SIZE) => {
  if (!text && text !== 0) return 0;
  try {
    if (!_measureCtx) {
      _measureCtx = document.createElement("canvas").getContext("2d");
    }
    _measureCtx.font = `${fontSize}px ${FONT_FAMILY}`;
    return _measureCtx.measureText(String(text)).width;
  } catch {
    // SSR or canvas not available — fall back to character-count estimate
    return String(text).length * (fontSize * 0.6);
  }
};

// ── Auto-measure all column widths from content ───────────────────────────────
// For EVERY column key that appears in parentColumns or childColumns:
//   width = max(header title width, max parent data width, max child data width) + COL_PAD
//
// "Shared" columns (same key in both parent and child) get the same width so
// corresponding columns visually align.  Each table also gets its own
// exclusive columns sized from its own data.
//
// dataSource must already have .children arrays populated for the child
// measurement to be meaningful; rows without children are simply skipped.
// We sample the first SAMPLE_ROWS rows per table for performance.
const SAMPLE_ROWS = 30;

const autoMeasureColumnWidths = (parentCols, childCols, dataSource, actionKey = null) => {
  const widths = {};

  const measureCol = (col, rows) => {
    const key = col.key || col.dataIndex;
    if (!key) return;

    // Skip action columns — their render returns JSX, and their width is
    // governed entirely by actionColumn.width (set by the caller).
    if (key === actionKey || col.fixed === "right") return;

    // Skip fill columns — they grow with flex:1 to absorb remaining space;
    // auto-measurement is irrelevant and would produce a misleadingly narrow value.
    if (col.fill) return;

    // If col.width is explicitly defined, use it as the starting point and cap.
    // Auto-measurement must never inflate beyond what the designer specified.
    const explicitWidth = typeof col.width === "number" ? col.width : null;

    // Measure header title (UPPERCASE, 10px font)
    const headerW = measureTextWidth(
      (col.title || "").toUpperCase(),
      HEADER_FONT_SIZE
    ) + COL_PAD;

    const current = widths[key] ?? MIN_COL_WIDTH;
    widths[key] = Math.max(current, headerW);

    // Measure data cells — sample first SAMPLE_ROWS rows for performance
    rows.slice(0, SAMPLE_ROWS).forEach((row, rowIdx) => {
      let value = row[col.dataIndex ?? key];

      // Apply render function to get the actual displayed value, but ONLY
      // use it if it returns a primitive — JSX/object renders (badges, icons,
      // dropdowns) are not measurable as text and we fall back to raw value.
      if (col.render) {
        try {
          const rendered = col.render(value, row, rowIdx);
          if (rendered !== null && rendered !== undefined && typeof rendered !== "object") {
            value = rendered;
          }
          // If render returns JSX/object, value stays as the raw data value.
          // For columns like 'status' whose render wraps a string in a badge,
          // the raw string ('ACTIVE', 'INACTIVE') is the right thing to measure.
        } catch {
          // render threw — use raw value
        }
      }

      if (value === null || value === undefined) return;
      const w = measureTextWidth(String(value), CELL_FONT_SIZE) + COL_PAD;
      widths[key] = Math.max(widths[key], w);
    });

    // If col.width is explicitly set, cap the measured width at that value.
    // This prevents auto-measurement from overriding a deliberate designer choice.
    if (explicitWidth !== null) {
      widths[key] = Math.min(widths[key], explicitWidth);
    }
  };

  // Measure parent columns against parent rows
  parentCols.forEach(col => measureCol(col, dataSource));

  // Measure child columns — sample at most PARENT_SAMPLE_FOR_CHILDREN parents
  // × CHILD_SAMPLE_PER_ROW children each to avoid a 250k-element flatMap at
  // 50k rows with 5 children each on every infinite scroll page append.
  const PARENT_SAMPLE_FOR_CHILDREN = 50;
  const CHILD_SAMPLE_PER_ROW       = 2;
  const allChildRows = dataSource
    .slice(0, PARENT_SAMPLE_FOR_CHILDREN)
    .flatMap(row =>
      Array.isArray(row.children)
        ? row.children.slice(0, CHILD_SAMPLE_PER_ROW)
        : []
    );
  childCols.forEach(col => measureCol(col, allChildRows));

  // Shared keys (same key in both parent and child) are already unified:
  // both measureCol calls accumulate into the same widths[key] slot via Math.max.
  return widths;
};

// ── Storage schema ────────────────────────────────────────────────────────────
// key:  nxnested__<userId>__<idTable>
// v1:   { version, hiddenColumns, fixedColumns, childFixedColumns,
//          parentColumnWidths, childColumnWidths, parentColumnOrder, childColumnOrder }
const PREFS_VERSION = 1;

// ── Preference helpers (identical pattern to NxTable) ─────────────────────────
const buildStorageKey = (userId, idTable) =>
  userId && idTable ? `nxnested__${userId}__${idTable}` : null;

const readPrefs = (storageKey) => {
  if (!storageKey) return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== PREFS_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

const makePrefsWriter = (storageKey) => {
  if (!storageKey) {
    const noop = () => {};
    noop.cancel = () => {};
    return noop;
  }
  let timer = null;
  const write = (prefs) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ version: PREFS_VERSION, ...prefs })
        );
      } catch {
        // Quota exceeded / private browsing — fail silently.
      }
    }, 400);
  };
  write.cancel = () => {
    if (timer) { clearTimeout(timer); timer = null; }
  };
  return write;
};

const useColumnPreferences = ({ userId, idTable, fixedColumnsProp, childFixedColumnsProp }) => {
  const storageKey = buildStorageKey(userId, idTable);

  const savedPrefsRef    = useRef(undefined);
  const savedPrefsKeyRef = useRef(null);
  if (savedPrefsRef.current === undefined || savedPrefsKeyRef.current !== storageKey) {
    savedPrefsRef.current    = readPrefs(storageKey);
    savedPrefsKeyRef.current = storageKey;
  }
  const savedPrefs = savedPrefsRef.current;

  const writerRef = useRef(null);
  if (!writerRef.current) writerRef.current = makePrefsWriter(storageKey);
  useEffect(() => {
    writerRef.current?.cancel?.();
    writerRef.current            = makePrefsWriter(storageKey);
    savedPrefsRef.current        = readPrefs(storageKey);
    savedPrefsKeyRef.current     = storageKey;
    return () => writerRef.current?.cancel?.();
  }, [storageKey]);

  const write = useCallback((patch) => { writerRef.current(patch); }, []);

  // Migrate: old schema stored a single shared `hiddenColumns`; new schema
  // stores per-table `parentHiddenColumns` / `childHiddenColumns`.
  // When reading old prefs, seed both with the old value so nothing is lost.
  const initParentHiddenColumns = savedPrefs?.parentHiddenColumns ?? savedPrefs?.hiddenColumns ?? [];
  const initChildHiddenColumns  = savedPrefs?.childHiddenColumns  ?? savedPrefs?.hiddenColumns ?? [];
  const initFixedColumns        = savedPrefs?.fixedColumns         ?? {
    left:  Array.isArray(fixedColumnsProp?.left)       ? [...fixedColumnsProp.left]       : [],
    right: Array.isArray(fixedColumnsProp?.right)      ? [...fixedColumnsProp.right]      : [],
  };
  const initChildFixedColumns   = savedPrefs?.childFixedColumns    ?? {
    left:  Array.isArray(childFixedColumnsProp?.left)  ? [...childFixedColumnsProp.left]  : [],
    right: Array.isArray(childFixedColumnsProp?.right) ? [...childFixedColumnsProp.right] : [],
  };
  const initParentColumnWidths  = savedPrefs?.parentColumnWidths   ?? {};
  const initChildColumnWidths   = savedPrefs?.childColumnWidths    ?? {};
  const initParentColumnOrder   = savedPrefs?.parentColumnOrder    ?? [];
  const initChildColumnOrder    = savedPrefs?.childColumnOrder     ?? [];

  return {
    write,
    initParentHiddenColumns,
    initChildHiddenColumns,
    initFixedColumns,
    initChildFixedColumns,
    initParentColumnWidths,
    initChildColumnWidths,
    initParentColumnOrder,
    initChildColumnOrder,
    storageKey,
  };
};

// ── ExpandIcon ────────────────────────────────────────────────────────────────
// + spins 45° → × on expand; spins back on collapse.
const ExpandIcon = React.memo(({ expanded }) => (
  <svg
    width="8" height="8" viewBox="0 0 8 8" fill="none"
    style={{
      transition:      "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform:       expanded ? "rotate(45deg)" : "rotate(0deg)",
      transformOrigin: "center",
    }}
  >
    <line x1="0.5" y1="4"   x2="7.5" y2="4"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4"   y1="0.5" x2="4"   y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));

// ── SearchBar (identical to NxTable — focus-safe) ────────────────────────────
// Owns its own local input state so the parent's re-render triggered by
// filtering never causes the input to lose focus or re-mount.
const SearchBar = React.memo(({ placeholder = "Search content here ....", onSearch }) => {
  const [localValue, setLocalValue] = React.useState("");
  const inputRef = useRef(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  // Stable debounced fn — created once, never recreated, cancelled on unmount.
  const debouncedNotify = useMemo(
    () => debounce((val) => { onSearchRef.current?.(val); }, 220),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(() => () => debouncedNotify.cancel(), [debouncedNotify]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedNotify(val);
  }, [debouncedNotify]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    debouncedNotify.cancel();
    onSearchRef.current?.("");
  }, [debouncedNotify]);

  return (
    <div style={{ position: "relative" }}>
      <SearchOutlined
        style={{
          position: "absolute", left: "8px", top: "50%",
          transform: "translateY(-50%)", fontSize: "14px",
          color: "#9CA3AF", zIndex: 30,
        }}
      />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={localValue}
        style={{
          height: "32px", paddingLeft: "28px",
          border: `1px solid ${BORDER_COL}`, borderRadius: "8px",
          fontSize: "12px", fontFamily: FONT_FAMILY,
        }}
        onChange={handleChange}
        allowClear
        onClear={handleClear}
      />
    </div>
  );
});

// ── ResizableHeader cell ──────────────────────────────────────────────────────
// Pure DIV-based resize handle — no Ant Design dependency.
const ResizableHeaderCell = React.memo(({
  width, onResize, isDraggable, onDragStart, onDragOver, onDrop, onDragEnd,
  children, style, ...rest
}) => {
  const isResizingRef = useRef(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = false;
    const startX = e.pageX;
    const startWidth = width;
    let hasMoved = false;
    let resetTimer = null;

    const cleanup = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
    };

    const handleMouseMove = (mv) => {
      hasMoved = true;
      const newWidth = startWidth + (mv.pageX - startX);
      if (newWidth >= MIN_COL_WIDTH) onResize(newWidth);
    };

    const handleMouseUp = () => {
      cleanup();
      if (hasMoved) {
        isResizingRef.current = true;
        resetTimer = setTimeout(() => { isResizingRef.current = false; resetTimer = null; }, 100);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div
      {...rest}
      draggable={isDraggable}
      onDragStart={isDraggable ? onDragStart : undefined}
      onDragOver={isDraggable ? onDragOver : undefined}
      onDrop={isDraggable ? onDrop : undefined}
      onDragEnd={isDraggable ? onDragEnd : undefined}
      style={{
        ...style,
        position: "relative",
        userSelect: "none",
        cursor: isDraggable ? "move" : "default",
      }}
    >
      {children}
      {/* Resize handle */}
      <div
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "10px", cursor: "col-resize", zIndex: 1,
        }}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onMouseDown={handleMouseDown}
        onMouseOver={(e) => { e.currentTarget.style.borderRight = "2px solid #1890ff"; }}
        onMouseOut={(e)  => { e.currentTarget.style.borderRight = "none"; }}
      />
    </div>
  );
});

// ── NxAdvanceSearch (identical to NxTable's inline version) ──────────────────
const NxAdvanceSearch = ({ visible, onClose, onSearch, onClear, columns = [], modalWidth = 600 }) => {
  const [filters, setFilters] = useState([{ id: Date.now(), column: "", operator: "Equal to", value: "", logic: "AND" }]);
  const [filterRules, setFilterRules] = useState([]);
  const [limitData, setLimitData] = useState("");

  const getColumnKey = (col, idx) => col?.key || col?.dataIndex || `${col?.title || "column"}-${idx}`;
  const operators = [
    "Equal to","Not equal to","Contains","Does not contain",
    "Greater than","Less than","Greater than or equal","Less than or equal",
    "Is empty","Is not empty",
  ];

  const addFilter = () => setFilters([...filters, { id: Date.now(), column: "", operator: "Equal to", value: "", logic: "AND" }]);
  const removeFilter = (id) => { if (filters.length > 1) setFilters(filters.filter(f => f.id !== id)); };
  const updateFilter = (id, field, value) => setFilters(filters.map(f => f.id === id ? { ...f, [field]: value } : f));
  const addFilterRule = () => setFilterRules([...filterRules, { id: Date.now(), filters: [{ id: Date.now() + 1, column: "", operator: "Equal to", value: "", logic: "AND" }], groupLogic: "OR" }]);
  const addFilterToRule = (ruleId) => setFilterRules(filterRules.map(r => r.id === ruleId ? { ...r, filters: [...r.filters, { id: Date.now(), column: "", operator: "Equal to", value: "", logic: "AND" }] } : r));
  const updateRuleFilter = (ruleId, filterId, field, value) => setFilterRules(filterRules.map(r => r.id === ruleId ? { ...r, filters: r.filters.map(f => f.id === filterId ? { ...f, [field]: value } : f) } : r));
  const removeFilterFromRule = (ruleId, filterId) => setFilterRules(prev => prev.map(r => r.id === ruleId ? { ...r, filters: r.filters.filter(f => f.id !== filterId) } : r));
  const updateRuleLogic = (ruleId, logic) => setFilterRules(filterRules.map(r => r.id === ruleId ? { ...r, groupLogic: logic } : r));
  const removeRuleGroup = (ruleId) => setFilterRules(filterRules.filter(r => r.id !== ruleId));

  const handleSearch = () => onSearch?.({ filters, filterRules, limitData });
  const handleClear = () => {
    setFilters([{ id: Date.now(), column: "", operator: "Equal to", value: "", logic: "AND" }]);
    setFilterRules([]);
    setLimitData("");
    onClear?.();
  };

  const getLogicMenu = (currentLogic, onChange) => (
    <Menu selectedKeys={[currentLogic]} onClick={({ key }) => onChange(key)} style={{ minWidth: 30 }}>
      <Menu.Item key="AND">AND</Menu.Item>
      <Menu.Item key="OR">OR</Menu.Item>
    </Menu>
  );

  const renderFilterRow = (filter, isFirst, onUpdate, onRemove) => (
    <div key={filter.id} style={{ marginBottom: 16 }}>
      {!isFirst && (
        <div style={{ marginBottom: 12 }}>
          <Dropdown overlay={getLogicMenu(filter.logic, (l) => onUpdate(filter.id, "logic", l))} trigger={["click"]}>
            <Button style={{ borderRadius: 8, minWidth: 100, height: 36 }}>{filter.logic} <DownOutlined /></Button>
          </Dropdown>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Select placeholder="Select Column" value={filter.column || undefined} onChange={(v) => onUpdate(filter.id, "column", v)} style={{ flex: 1 }} showSearch size="large">
          {columns.map((col, idx) => <Select.Option key={getColumnKey(col, idx)} value={getColumnKey(col, idx)}>{col.title || col.dataIndex || "Column"}</Select.Option>)}
        </Select>
        <Select value={filter.operator} onChange={(v) => onUpdate(filter.id, "operator", v)} style={{ width: 200 }} size="large">
          {operators.map(op => <Select.Option key={op} value={op}>{op}</Select.Option>)}
        </Select>
        {!isFirst && <Button danger onClick={() => onRemove(filter.id)} style={{ borderRadius: 8 }}>×</Button>}
      </div>
      <TextArea placeholder="Input Value or Formula" value={filter.value} onChange={(e) => onUpdate(filter.id, "value", e.target.value)} size="large" style={{ borderRadius: 8 }} />
    </div>
  );

  return (
    <Modal visible={visible} footer={null} onCancel={onClose} width={modalWidth} bodyStyle={{ padding: 0 }} closable={false}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Advanced Search</div>
        {filters.map((f, i) => renderFilterRow(f, i === 0, updateFilter, removeFilter))}
        <Button type="link" icon={<PlusOutlined />} onClick={addFilter} style={{ padding: "4px 8px", color: "#1890ff", fontSize: 13, height: "auto", border: "1px dashed #d9d9d9", borderRadius: 6, marginBottom: 16 }}>Add Linear Filter</Button>
        {filterRules.map((rule) => (
          <div key={rule.id} style={{ border: `1px solid ${BORDER_COL}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Dropdown overlay={getLogicMenu(rule.groupLogic, (l) => updateRuleLogic(rule.id, l))} trigger={["click"]}>
                <Button style={{ borderRadius: 8, minWidth: 60, height: 36 }}>{rule.groupLogic} <DownOutlined /></Button>
              </Dropdown>
              <Button danger size="small" onClick={() => removeRuleGroup(rule.id)}>Remove Group</Button>
            </div>
            {rule.filters.map((f, i) => renderFilterRow(f, i === 0, (id, field, value) => updateRuleFilter(rule.id, id, field, value), (id) => { if (rule.filters.length > 1) removeFilterFromRule(rule.id, id); }))}
            <Button type="link" icon={<PlusOutlined />} onClick={() => addFilterToRule(rule.id)} style={{ padding: "4px 8px", color: "#1890ff", fontSize: 13, height: "auto", border: "1px dashed #d9d9d9", borderRadius: 6 }}>Add Filter</Button>
          </div>
        ))}
        <Button type="text" icon={<PlusOutlined />} onClick={addFilterRule} style={{ padding: "4px 0", fontSize: 13, height: "auto", marginBottom: 16 }}>Add Filter Group</Button>
      </div>
      <div style={{ background: "#F5F5F5", padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Set Limit Data</div>
        <Input placeholder="No Limitation" value={limitData} onChange={(e) => setLimitData(e.target.value)} type="number" size="large" style={{ borderRadius: 8, marginBottom: 16 }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onClose} size="large" style={{ borderColor: "#BDBDBD", borderRadius: 8, minWidth: 100 }}>Cancel</Button>
          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={handleClear} size="large" style={{ color: "#ff4d4f", borderColor: "#ff4d4f", background: "#FFEBEE", borderRadius: 8 }}>Clear Filter</Button>
            <Button type="primary" onClick={handleSearch} size="large" style={{ borderRadius: 8 }}>Search</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ── FixedColumnWarning (identical to NxTable) ─────────────────────────────────
const FixedColumnWarning = React.memo(({ warning, onDismiss }) => {
  if (!warning) return null;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "8px",
      marginBottom: "8px", padding: "7px 12px", borderRadius: "8px",
      border: `1px solid ${warning.isOverflow ? "#fca5a5" : "#fcd34d"}`,
      background: warning.isOverflow ? "#fef2f2" : "#fffbeb",
      fontSize: "12px", lineHeight: "1.5",
      color: warning.isOverflow ? "#7f1d1d" : "#713f12",
    }}>
      <span style={{ fontSize: "15px", flexShrink: 0 }}>{warning.isOverflow ? "🔒" : "📌"}</span>
      <span style={{ flex: 1 }}>
        {warning.isOverflow ? (
          <><strong>Some columns are hidden</strong> because too many are pinned.{" "}Unpin <strong>{warning.colNames[warning.colNames.length - 1]}</strong>{warning.colNames.length > 1 ? " or other pinned columns" : ""} in <strong>Column Settings</strong> to see all columns.</>
        ) : (
          <><strong>Not much space left to scroll.</strong>{" "}Try unpinning <strong>{warning.colNames[warning.colNames.length - 1]}</strong>{warning.colNames.length > 1 ? " or other pinned columns" : ""} in <strong>Column Settings</strong> for a better view.</>
        )}
      </span>
      <button onClick={onDismiss} title="Dismiss" aria-label="Dismiss warning"
        style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", fontSize: "16px", color: warning.isOverflow ? "#ef4444" : "#d97706", lineHeight: 1, flexShrink: 0, opacity: 0.7 }}>×</button>
    </div>
  );
});

// ── Compute fixed-column overflow warning ─────────────────────────────────────
const computeFixedColumnWarning = (columns, containerWidth) => {
  if (containerWidth <= 0 || columns.length === 0) return null;
  const leftCols  = columns.filter(c => c._fixed === "left");
  const rightCols = columns.filter(c => c._fixed === "right");
  const fixedCols = [...leftCols, ...rightCols];
  if (fixedCols.length === 0) return null;
  const totalFixed = fixedCols.reduce((s, c) => s + (c.width || DEFAULT_COL_WIDTH), 0);
  const SCROLL_MIN = 80;
  const remaining  = containerWidth - totalFixed;
  if (remaining >= SCROLL_MIN) return null;
  const colNames = fixedCols.map(c => c.title || c.key || c.dataIndex || "—").filter(Boolean);
  const overflowPx = Math.max(0, totalFixed - containerWidth);
  const side = leftCols.length > 0 && rightCols.length > 0 ? "left & right" : leftCols.length > 0 ? "left" : "right";
  return { colNames, totalFixed, containerWidth: Math.round(containerWidth), overflowPx: Math.round(overflowPx), remaining: Math.round(remaining), side, isOverflow: remaining < 0 };
};

// ── fuzzyMatch helper ─────────────────────────────────────────────────────────
const fuzzyMatch = (text, query) => {
  if (!query) return true;
  const t = String(text).toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) { if (t[ti] === q[qi]) qi++; }
  return qi === q.length;
};

// ── highlightText helper ──────────────────────────────────────────────────────
const highlightText = (text, search) => {
  if (!search || text === null || text === undefined) return text;
  const str   = String(text);
  const lower = str.toLowerCase();
  const sq    = search.toLowerCase();
  const idx   = lower.indexOf(sq);
  if (idx !== -1) {
    return (<>{str.slice(0, idx)}<span style={{ backgroundColor: "#fde047", padding: "1px 2px", borderRadius: "2px", fontWeight: 600 }}>{str.slice(idx, idx + sq.length)}</span>{str.slice(idx + sq.length)}</>);
  }
  const chars = [];
  let qi = 0;
  for (let i = 0; i < str.length; i++) {
    if (qi < sq.length && str[i].toLowerCase() === sq[qi]) { chars.push(<span key={i} style={{ color: "#1976D2", fontWeight: 700, textDecoration: "underline" }}>{str[i]}</span>); qi++; }
    else chars.push(str[i]);
  }
  return <>{chars}</>;
};

// ── ChildTable ────────────────────────────────────────────────────────────────
// Full-featured child table: resizable + draggable headers, fixed columns,
// search highlight.
//
// processedColumns already carries all _onResize / _onDrag* callbacks built by
// buildDisplayColumns in the parent — ChildTable just has to wire them up to
// ResizableHeaderCell exactly as the parent header row does.
const ChildTable = React.memo(({
  rows = [],
  processedColumns = [],  // sorted: left-fixed | normal | right-fixed, with _on* callbacks
  isLoading = false,
  searchValue = "",
}) => {
  // ── Filter rows matching search ──────────────────────────────────────────
  const filteredRows = useMemo(() => {
    if (!searchValue) return rows;
    const sq = searchValue.toLowerCase();
    return rows.filter(row =>
      processedColumns.some(col => {
        const val = String(row[col.dataIndex ?? col.key] ?? "").toLowerCase();
        return val.includes(sq) || fuzzyMatch(val, sq);
      })
    );
  }, [rows, processedColumns, searchValue]);

  if (isLoading) {
    return (
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 8, color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        <span className="nx-child-spinner" />
        Loading...
      </div>
    );
  }
  if (filteredRows.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        No data
      </div>
    );
  }

  // ── Helper: render one header cell via ResizableHeaderCell ────────────────
  // Bug 1 & 5 fix: child headers MUST go through ResizableHeaderCell so the
  // resize handle and drag events are actually wired up.  Previously ChildTable
  // rendered plain <div>s and the _on* callbacks were silently ignored.
  // isLastBorder: whether to omit the right border (last column in the visual row).
  // All columns use explicit col.width — no flex:1 anywhere.
  const renderHeaderCell = (col, isLastBorder, extraStyle = {}) => (
    <ResizableHeaderCell
      key={col.key || col.dataIndex}
      width={col.width}
      onResize={col._onResize}
      isDraggable={col._isDraggable}
      onDragStart={col._onDragStart}
      onDragOver={col._onDragOver}
      onDrop={col._onDrop}
      onDragEnd={col._onDragEnd}
      style={{
        ...HEADER_CELL_STYLE,
        width:      col.width,
        flex:       "none",
        minWidth:   col.width,
        justifyContent: "center",
        borderRight: isLastBorder ? "none" : `1px solid rgba(255,255,255,0.2)`,
        opacity:    col._isDragging ? 0.5 : 1,
        ...extraStyle,
      }}
    >
      <span style={{
        color: "#fff", fontSize: 10, fontWeight: 600, fontFamily: FONT_FAMILY,
        letterSpacing: "0.05em", textTransform: "uppercase",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {col.title}
      </span>
    </ResizableHeaderCell>
  );

  // ── Data cell style ────────────────────────────────────────────────────────
  // All cells use explicit widths — no flex:1. The isLastBorder param controls
  // only the right border (omitted on the last column to avoid double border).
  const dataCellStyle = (col, rowIdx, isLastBorder) => ({
    display:        "flex",
    alignItems:     "center",
    justifyContent: col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start",
    height:         30,
    minHeight:      30,
    padding:        "4px 8px",
    boxSizing:      "border-box",
    overflow:       "hidden",
    textOverflow:   "ellipsis",
    whiteSpace:     "nowrap",
    fontSize:       12,
    fontFamily:     FONT_FAMILY,
    flexShrink:     0,
    flex:           "none",
    width:          col.width,
    minWidth:       col.width,
    background:     rowIdx % 2 === 0 ? ROW_WHITE : ROW_HOVER,
    color:          "#111827",
    borderBottom:   `1px solid ${BORDER_COL}`,
    borderRight:    isLastBorder ? "none" : `1px solid ${BORDER_COL}`,
  });

  const lastIdx = processedColumns.length - 1;

  // ── Flat layout (no fixed columns) — column-per-flex-div for perf ─────────
  const leftFixed  = processedColumns.filter(c => c._fixed === "left");
  const rightFixed = processedColumns.filter(c => c._fixed === "right");
  const normal     = processedColumns.filter(c => !c._fixed);
  const hasFixed   = leftFixed.length > 0 || rightFixed.length > 0;

  if (!hasFixed) {
    return (
      <div className="nx-child-scroll" style={{ overflowX: "auto", width: "100%" }}>
        {/* Header row — ResizableHeaderCell for resize + drag */}
        <div style={{ display: "flex", minWidth: "max-content" }}>
          {processedColumns.map((col, colIdx) =>
            renderHeaderCell(col, colIdx === lastIdx)
          )}
        </div>
        {/* Data rows — column-per-flex-div layout for perf.
             All columns use explicit widths — same rule as parent. */}
        <div style={{ display: "flex", minWidth: "max-content" }}>
          {processedColumns.map((col, colIdx) => {
            const isLastBorder = colIdx === lastIdx;
            return (
              <div
                key={col.key || col.dataIndex || colIdx}
                style={{
                  width:         col.width,
                  minWidth:      col.width,
                  flexShrink:    0,
                  flex:          "none",
                  borderRight:   isLastBorder ? "none" : `1px solid ${BORDER_COL}`,
                  display:       "flex",
                  flexDirection: "column",
                }}
              >
                {filteredRows.map((row, rowIdx) => {
                  const rawValue = row[col.dataIndex ?? col.key];
                  const cellValue = col.render ? col.render(rawValue, row, rowIdx) : (rawValue ?? "—");
                  return (
                    <div key={row.id ?? row.key ?? rowIdx} style={dataCellStyle(col, rowIdx, false)}>
                      {highlightText(cellValue, searchValue)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Fixed-column layout — row-per-row so sticky works correctly ───────────
  // Compute cumulative sticky offsets. Without these, fixed columns are only
  // visually reordered to the edges but scroll away on horizontal scroll.
  const leftStickyOffset = {};
  let leftAcc = 0;
  leftFixed.forEach(col => { leftStickyOffset[col.key] = leftAcc; leftAcc += col.width; });

  const rightStickyOffset = {};
  let rightAcc = 0;
  [...rightFixed].reverse().forEach(col => { rightStickyOffset[col.key] = rightAcc; rightAcc += col.width; });

  const getStickyStyle = (col, isHeader = false) => {
    const z = isHeader ? 4 : 1;
    if (col._fixed === "left")  return { position: "sticky", left:  leftStickyOffset[col.key]  ?? 0, zIndex: z };
    if (col._fixed === "right") return { position: "sticky", right: rightStickyOffset[col.key] ?? 0, zIndex: z };
    return {};
  };

  const orderedCols = [...leftFixed, ...normal, ...rightFixed];
  const lastOrderedIdx = orderedCols.length - 1;
  return (
    <div className="nx-child-scroll" style={{ overflowX: "auto", width: "100%", position: "relative" }}>
      {/* Header row */}
      <div style={{ display: "flex", position: "sticky", top: 0, zIndex: 2 }}>
        {orderedCols.map((col, colIdx) => {
          const isLastBorder = colIdx === lastOrderedIdx;
          const sticky = getStickyStyle(col, true);
          if (!sticky.position) return renderHeaderCell(col, isLastBorder);
          // ResizableHeaderCell hardcodes position:"relative" after spreading style,
          // which overwrites position:"sticky". Apply sticky on an outer wrapper instead.
          return (
            <div key={col.key || col.dataIndex} style={{ ...sticky, flexShrink: 0, width: col.width, minWidth: col.width }}>
              {renderHeaderCell(col, isLastBorder)}
            </div>
          );
        })}
      </div>
      {/* Data rows */}
      {filteredRows.map((row, rowIdx) => (
        <div key={row.id ?? row.key ?? rowIdx} style={{ display: "flex" }}>
          {orderedCols.map((col, colIdx) => {
            const isLastBorder = colIdx === lastOrderedIdx;
            const rawValue = row[col.dataIndex ?? col.key];
            const cellValue = col.render ? col.render(rawValue, row, rowIdx) : (rawValue ?? "—");
            return (
              <div key={col.key || col.dataIndex} style={{ ...dataCellStyle(col, rowIdx, isLastBorder), ...getStickyStyle(col) }}>
                {highlightText(cellValue, searchValue)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

// ── ParentRow ─────────────────────────────────────────────────────────────────
// Layout contract
// ──────────────────────────────────────────────────────────────────────────────
// The parent data cells live inside a div with overflowX:"hidden" that is
// controlled externally: NxTableNested keeps a scrollSyncRef (a Set of DOM
// nodes) and a shared onScroll handler.  Every time any node in that set
// scrolls, all others are updated to the same scrollLeft.  The header scroll
// div and every parent-row scroll div are registered into this set so they all
// move together.
//
// The child table sits OUTSIDE the scrollable parent-row band — it is always
// width:100% of the body container and has its own independent overflowX:auto
// via nx-child-scroll.  This means expanding a row can NEVER affect the
// horizontal scroll position of the parent columns.
// ──────────────────────────────────────────────────────────────────────────────
const ParentRow = React.memo(({
  rowIdx,
  record,
  processedParentColumns,
  processedChildColumns,
  isExpanded,
  onToggleExpand,
  onExpand,
  isChildLoading,
  searchValue,
  enableRowClick,
  isRowSelected,
  onRowClick,
  // Scroll-sync: called with the row's scroll-band DOM node on mount/unmount
  onRegisterScroll,
  // Scroll-sync: shared onScroll handler from NxTableNested
  onSyncScroll,
}) => {
  const isEven = rowIdx % 2 !== 0;
  const bg = isEven ? ROW_HOVER : ROW_WHITE;
  const selectedBg = "#d1e6f9";
  const resolvedBg = isRowSelected ? selectedBg : bg;

  const rowKey = record.id ?? record.key;

  const handleToggle = useCallback(() => {
    if (!isExpanded) onExpand?.(rowKey);
    onToggleExpand?.(rowKey);
  }, [isExpanded, rowKey, onExpand, onToggleExpand]);

  const handleRowClick = useCallback(() => {
    if (enableRowClick) onRowClick?.(record);
  }, [enableRowClick, onRowClick, record]);

  const actionCol = useMemo(
    () => processedParentColumns.find(c => c.key === "__action__") ?? null,
    [processedParentColumns]
  );
  const hasActionCol = actionCol !== null;

  // Register / unregister this row's scroll band with the sync set.
  // We capture the node in a local ref so that the unmount call (node=null)
  // can still pass the real DOM node to the remove handler.
  const scrollNodeRef = useRef(null);
  const rowScrollRef = useCallback((node) => {
    if (node) {
      scrollNodeRef.current = node;
      onRegisterScroll?.(node, "add");
    } else if (scrollNodeRef.current) {
      onRegisterScroll?.(scrollNodeRef.current, "remove");
      scrollNodeRef.current = null;
    }
  }, [onRegisterScroll]);

  return (
    <>
      {/* ── Parent row scroll band ─────────────────────────────────────────
           overflowX:hidden — scrollLeft is driven externally by onSyncScroll.
           The band scrolls in lock-step with the header via the shared sync set.
           width:100% + minWidth:max-content: fills the container when columns
           are narrow; grows and scrolls when they exceed it. */}
      <div
        ref={rowScrollRef}
        onScroll={onSyncScroll}
        style={{ overflowX: "hidden", width: "100%" }}
      >
        <div
          style={{ display: "flex", alignItems: "stretch", width: "100%", minWidth: "max-content", background: resolvedBg, cursor: enableRowClick ? "pointer" : "default", transition: "background-color 0.15s ease" }}
          onClick={handleRowClick}
        >
          {/* Toggle cell */}
          <div
            role="button" tabIndex={0}
            aria-expanded={isExpanded}
            aria-label={`Toggle details for row ${record.id}`}
            style={{
              width: EXPAND_COL_WIDTH, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRight: `1px solid ${BORDER_COL}`,
              borderBottom: `1px solid ${BORDER_COL}`,
              minHeight: 30, height: 30, cursor: "pointer", boxSizing: "border-box",
            }}
            onClick={(e) => { e.stopPropagation(); handleToggle(); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggle(); } }}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#1976D2", pointerEvents: "none" }}>
              <ExpandIcon expanded={isExpanded} />
            </span>
          </div>

          {/* Data cells. Fill columns (col._fill) use flex:1 to absorb remaining
               container width; all other columns use explicit pixel widths. */}
          {processedParentColumns.map((col, colIdx) => {
            const fieldKey = col.key || col.dataIndex;
            if (fieldKey === "__action__") return null;

            let value = record[fieldKey];
            if (col.render) value = col.render(value, record, rowIdx);
            const highlighted = highlightText(value, searchValue);

            const nextCol = processedParentColumns[colIdx + 1];
            const isLastDataCol = !nextCol || nextCol.key === "__action__";

            return (
              <div
                key={fieldKey || colIdx}
                style={{
                  ...CELL_BASE_STYLE,
                  ...(col._fill
                    ? { flex: 1, minWidth: col.width, flexShrink: 1 }
                    : { flex: "none", width: col.width, minWidth: col.width, flexShrink: 0 }),
                  justifyContent: col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start",
                  borderRight: (isLastDataCol && !hasActionCol) ? "none" : `1px solid ${BORDER_COL}`,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  background: resolvedBg,
                }}
              >
                {highlighted ?? "—"}
              </div>
            );
          })}

          {/* Action column */}
          {actionCol && (
            <div style={{
              ...CELL_BASE_STYLE,
              width:      actionCol.width || 120,
              flexShrink: 0,
              justifyContent: "center",
              background: resolvedBg,
            }}>
              {actionCol.render?.(null, record) ?? "—"}
            </div>
          )}
        </div>
      </div>

      {/* ── Child table ─────────────────────────────────────────────────────
           Lives OUTSIDE the parent scroll band — always width:100% of the
           body container.  ChildTable has its own nx-child-scroll (overflowX:auto)
           so child columns scroll independently and never affect the parent. */}
      {isExpanded && (
        <div style={{ display: "flex", alignItems: "stretch", width: "100%", animation: "nxSlideDown 0.2s ease-out" }}>
          {/* Blank spacer aligned under the toggle cell */}
          <div style={{
            width: EXPAND_COL_WIDTH, flexShrink: 0,
            borderRight: `1px solid ${BORDER_COL}`,
            borderBottom: `1px solid ${BORDER_COL}`,
            background: bg, boxSizing: "border-box",
          }} />
          {/* Child table — flex:1 + minWidth:0 fills remaining width */}
          <div style={{ flex: 1, borderBottom: `1px solid ${BORDER_COL}`, minWidth: 0 }}>
            <ChildTable
              rows={record.children || []}
              processedColumns={processedChildColumns}
              isLoading={isChildLoading}
              searchValue={searchValue}
            />
          </div>
        </div>
      )}
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ── NxTableNested (main component) ───────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const NxTableNested = ({
  idTable,
  userId,
  persistPreferences = true,
  // ── Data ──────────────────────────────────────────────────────────────────
  dataSource = [],
  parentColumns = [],
  childColumns  = [],
  loading       = false,
  totalData,            // optional: server-reported total for entry count
  // ── Expand ────────────────────────────────────────────────────────────────
  onExpand = () => {},
  loadingKeys = new Set(),  // Set<rowId> — rows whose children are currently loading
  // ── Action column (last parent column, never hidden) ──────────────────────
  actionColumn = null,  // { title, width, render: (_, record) => ReactNode }
  // ── Column settings ───────────────────────────────────────────────────────
  useSelect          = true,
  columnDefinitions,            // override columns shown in ColumnSettings
  fixedColumns       = { left: [], right: [] },
  childFixedColumns  = { left: [], right: [] },
  // ── Search / filter ───────────────────────────────────────────────────────
  showSearchBar      = true,
  showAdvanceSearch  = true,
  onAdvanceSearch    = () => {},
  // ── Controls ──────────────────────────────────────────────────────────────
  showExport         = false,
  handleDownload     = () => {},
  showRefresh        = false,
  onRefresh,
  customHeaderLeft,
  // ── Scroll / height ───────────────────────────────────────────────────────
  tableScrolled      = { y: 380 },
  autoHeight         = true,
  // ── Infinite scroll ───────────────────────────────────────────────────────
  useInfiniteScroll  = false,
  onLoadMore         = () => {},
  hasMore            = false,
  // ── Pagination ────────────────────────────────────────────────────────────
  usePagination      = false,
  pageSize           = 10,
  current            = 1,
  onChange           = () => {},
  onSizeChanger      = () => {},
  // ── Child resize ─────────────────────────────────────────────────────────
  childResizable     = true,
  // ── Row click ────────────────────────────────────────────────────────────
  enableRowClick     = false,
  selectedRowKey     = null,
  onRowClick         = () => {},
  // ── Error / empty state ───────────────────────────────────────────────────
  fetchFailed        = false,
  onInitialLoad,
  onClearPreferences,
  // ── Deprecated (accepted for compat, no-op) ───────────────────────────────
  setFixedColumns,
  columnWidths: externalColumnWidths,  // old prop name — use internalColumnWidths instead
}) => {

  // ── Dev-only deprecation warnings ──────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    if (setFixedColumns !== undefined) {
      // eslint-disable-next-line no-console
      console.warn("[NxTableNested] `setFixedColumns` is ignored — NxTableNested manages fixed-column state internally. You can remove this prop.");
    }
    if (externalColumnWidths !== undefined) {
      // eslint-disable-next-line no-console
      console.warn("[NxTableNested] `columnWidths` prop is soft-deprecated. It is still honoured as the default seed for child column widths, but localStorage prefs take priority when present. Prefer passing default widths via the childColumns definitions (col.width) instead.");
    }
    if (!idTable) {
      // eslint-disable-next-line no-console
      console.warn("[NxTableNested] The `idTable` prop is required for correct behaviour.");
    }
  }

  const safeId = idTable || "nx-table-nested-fallback";

  // ── Preference persistence ─────────────────────────────────────────────────
  const {
    write: writePrefs,
    initParentHiddenColumns,
    initChildHiddenColumns,
    initFixedColumns,
    initChildFixedColumns,
    initParentColumnWidths,
    initChildColumnWidths,
    initParentColumnOrder,
    initChildColumnOrder,
    storageKey: prefsStorageKey,
  } = useColumnPreferences({
    userId:              persistPreferences ? userId : null,
    idTable:             persistPreferences ? idTable : null,
    fixedColumnsProp:    fixedColumns,
    childFixedColumnsProp: childFixedColumns,
  });

  // ── State ──────────────────────────────────────────────────────────────────
  const [expandedKeys,         setExpandedKeys]         = useState(new Set());
  // Per-table hidden column state — separate so parent and child columns can be
  // hidden/shown independently in Column Settings.
  const [parentHiddenCols,     setParentHiddenCols]     = useState(() => initParentHiddenColumns);
  const [childHiddenCols,      setChildHiddenCols]      = useState(() => initChildHiddenColumns);
  const [isAdvanceOpen,        setIsAdvanceOpen]        = useState(false);
  const [isLoadingMore,        setIsLoadingMore]        = useState(false);
  const [searchValue,          setSearchValue]          = useState("");
  const [clickedRowKey,        setClickedRowKey]        = useState(null);

  // Parent column state
  const [internalFixedColumns, setInternalFixedColumns] = useState(() => initFixedColumns);
  const [parentColumnWidths,   setParentColumnWidths]   = useState(() => initParentColumnWidths);
  const [parentColumnOrder,    setParentColumnOrder]    = useState(() => {
    // Seed from persisted prefs if available; otherwise derive directly from
    // parentColumns (minus any action key) so the first render already has the
    // correct order and the post-mount sync effect finds the sig unchanged →
    // no extra setState → no double-render → no action column delay.
    if (initParentColumnOrder.length > 0) return initParentColumnOrder;
    const ak = actionColumn?.key || actionColumn?.dataIndex || null;
    return parentColumns
      .filter(c => !ak || (c.key || c.dataIndex) !== ak)
      .map(c => c.key || c.dataIndex || c.title)
      .filter(Boolean);
  });
  const [draggedParentKey,     setDraggedParentKey]     = useState(null);

  // Child column state
  const [internalChildFixed,   setInternalChildFixed]   = useState(() => initChildFixedColumns);
  const [childColumnWidths,    setChildColumnWidths]    = useState(() => {
    // externalColumnWidths (the deprecated `columnWidths` prop) is accepted as a
    // seed for child column widths so existing callers keep working without changes.
    // Persisted prefs always win — they are merged on top so a user's manual resize
    // is not overwritten by the prop on re-mount.
    if (externalColumnWidths && Object.keys(externalColumnWidths).length > 0) {
      return { ...externalColumnWidths, ...initChildColumnWidths };
    }
    return initChildColumnWidths;
  });
  const [childColumnOrder,     setChildColumnOrder]     = useState(() => {
    // Seed from persisted prefs if available; otherwise derive directly from
    // childColumns so the first render already has the correct order and the
    // post-mount sync effect finds the signature unchanged → no extra setState.
    if (initChildColumnOrder.length > 0) return initChildColumnOrder;
    return childColumns.map(c => c.key || c.dataIndex || c.title).filter(Boolean);
  });
  const [draggedChildKey,      setDraggedChildKey]      = useState(null);

  // ── Auto-measured column widths ────────────────────────────────────────────
  // Measures text content of ALL columns (header + data) via canvas, taking the
  // MAX across parent rows, child rows, and the header title for each key.
  // Shared keys (same key in both parentColumns and childColumns) get the same
  // width in both tables, so corresponding columns visually align.
  //
  // These are the DEFAULT widths used when:
  //  (a) no persisted resize exists in localStorage, AND
  //  (b) no explicit col.width is set in the column definition
  //
  // User resizes (parentColumnWidths / childColumnWidths state) always override.
  // ── Filter action column from parentColumns for rendering ─────────────────
  // The action column is rendered exclusively via the __action__ append in
  // processedParentColumns. If parentColumns already includes it (e.g. the
  // caller's column factory includes the action definition), strip it here so
  // it doesn't appear twice — once from buildDisplayColumns and once appended.
  const actionKey = actionColumn?.key || actionColumn?.dataIndex || null;
  const filteredParentColumns = useMemo(() => {
    if (!actionKey) return parentColumns;
    return parentColumns.filter(c => (c.key || c.dataIndex) !== actionKey);
  }, [parentColumns, actionKey]);

  // Refs for one-time column-width measurement.
  // Re-measures only when column definitions change, not on every dataSource append.
  const hasMeasuredRef    = useRef(false);
  const measuredWidthsRef = useRef(null);
  const measuredColSigRef = useRef(null);

  const autoMeasuredWidths = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return {};
    // Column signature — triggers a re-measure only when columns actually change.
    const colSig = `${filteredParentColumns.map(c => c.key || c.dataIndex).join(",")}|${childColumns.map(c => c.key || c.dataIndex).join(",")}|${actionKey ?? ""}`;
    // Return cached result when columns haven't changed — prevents re-running
    // autoMeasureColumnWidths on every infinite scroll page append.
    if (hasMeasuredRef.current && measuredColSigRef.current === colSig) {
      return measuredWidthsRef.current;
    }
    // Wait for enough data before first measurement so narrow initial pages
    // don't produce column widths that are too narrow for later data.
    if (dataSource.length < 50) return measuredWidthsRef.current ?? {};
    const result = autoMeasureColumnWidths(filteredParentColumns, childColumns, dataSource, actionKey);
    hasMeasuredRef.current    = true;
    measuredColSigRef.current = colSig;
    measuredWidthsRef.current = result;
    return result;
  }, [filteredParentColumns, childColumns, dataSource, actionKey]);

  const draggedParentKeyRef = useRef(draggedParentKey);
  const draggedChildKeyRef  = useRef(draggedChildKey);
  useEffect(() => { draggedParentKeyRef.current = draggedParentKey; }, [draggedParentKey]);
  useEffect(() => { draggedChildKeyRef.current  = draggedChildKey;  }, [draggedChildKey]);

  // ── Sync external fixedColumns prop → internal state ──────────────────────
  const prevFixedPropRef = useRef(JSON.stringify(fixedColumns));
  useEffect(() => {
    const next = JSON.stringify(fixedColumns);
    if (next !== prevFixedPropRef.current) {
      prevFixedPropRef.current = next;
      setInternalFixedColumns({
        left:  Array.isArray(fixedColumns?.left)  ? [...fixedColumns.left]  : [],
        right: Array.isArray(fixedColumns?.right) ? [...fixedColumns.right] : [],
      });
    }
  }, [fixedColumns]);

  const prevChildFixedPropRef = useRef(JSON.stringify(childFixedColumns));
  useEffect(() => {
    const next = JSON.stringify(childFixedColumns);
    if (next !== prevChildFixedPropRef.current) {
      prevChildFixedPropRef.current = next;
      setInternalChildFixed({
        left:  Array.isArray(childFixedColumns?.left)  ? [...childFixedColumns.left]  : [],
        right: Array.isArray(childFixedColumns?.right) ? [...childFixedColumns.right] : [],
      });
    }
  }, [childFixedColumns]);

  // Safe normalised fixed-column objects
  const safeFixed = useMemo(() => ({
    left:  Array.isArray(internalFixedColumns?.left)  ? internalFixedColumns.left  : [],
    right: Array.isArray(internalFixedColumns?.right) ? internalFixedColumns.right : [],
  }), [internalFixedColumns]);

  const safeChildFixed = useMemo(() => ({
    left:  Array.isArray(internalChildFixed?.left)  ? internalChildFixed.left  : [],
    right: Array.isArray(internalChildFixed?.right) ? internalChildFixed.right : [],
  }), [internalChildFixed]);

  // ── Build columns list for ColumnSettings ─────────────────────────────────
  // When no columnDefinitions override is provided we build a combined list with
  // PREFIXED keys (PARENT_COL_PFX / CHILD_COL_PFX).  Prefixed keys give each
  // table's columns a distinct identity inside ColumnSettings so that hiding or
  // fixing a column in one table never affects the other — even for shared keys.
  //
  // For callers who pass columnDefinitions we fall back to combined behaviour:
  // keys are normalised but not prefixed, and a shared key routes to both tables.
  const columnsForSettings = useMemo(() => {
    if (columnDefinitions) {
      return columnDefinitions.map(c => ({ ...c, key: c.key || c.dataIndex || c.title }));
    }
    const pCols = filteredParentColumns.map(c => ({
      ...c, key: PARENT_COL_PFX + (c.key || c.dataIndex || c.title),
    }));
    const cCols = childColumns.map(c => ({
      ...c, key: CHILD_COL_PFX + (c.key || c.dataIndex || c.title),
    }));
    return [...pCols, ...cCols];
  }, [columnDefinitions, filteredParentColumns, childColumns]);

  // Hidden state for ColumnSettings — prefixed so each table is independent.
  const hiddenForSettings = useMemo(() => {
    if (columnDefinitions) {
      return [...new Set([...parentHiddenCols, ...childHiddenCols])];
    }
    return [
      ...parentHiddenCols.map(k => PARENT_COL_PFX + k),
      ...childHiddenCols.map(k  => CHILD_COL_PFX  + k),
    ];
  }, [columnDefinitions, parentHiddenCols, childHiddenCols]);

  // Fixed state for ColumnSettings — prefixed so each table is independent.
  const fixedForSettings = useMemo(() => {
    if (columnDefinitions) {
      return {
        left:  [...new Set([...safeFixed.left,  ...safeChildFixed.left])],
        right: [...new Set([...safeFixed.right, ...safeChildFixed.right])],
      };
    }
    return {
      left: [
        ...safeFixed.left.map(k      => PARENT_COL_PFX + k),
        ...safeChildFixed.left.map(k => CHILD_COL_PFX  + k),
      ],
      right: [
        ...safeFixed.right.map(k      => PARENT_COL_PFX + k),
        ...safeChildFixed.right.map(k => CHILD_COL_PFX  + k),
      ],
    };
  }, [columnDefinitions, safeFixed, safeChildFixed]);

  // Parses prefixed hidden keys from ColumnSettings and routes to correct state.
  const handleHiddenColumnsChange = useCallback((newPrefixed) => {
    if (columnDefinitions) {
      const parentKeySet = new Set(
        filteredParentColumns.map(c => c.key || c.dataIndex || c.title).filter(Boolean)
      );
      const childKeySet = new Set(
        childColumns.map(c => c.key || c.dataIndex || c.title).filter(Boolean)
      );
      setParentHiddenCols(newPrefixed.filter(k => parentKeySet.has(k)));
      setChildHiddenCols(newPrefixed.filter(k => childKeySet.has(k)));
      return;
    }
    const pNew = [];
    const cNew = [];
    newPrefixed.forEach(pk => {
      if      (pk.startsWith(PARENT_COL_PFX)) pNew.push(pk.slice(PARENT_COL_PFX.length));
      else if (pk.startsWith(CHILD_COL_PFX))  cNew.push(pk.slice(CHILD_COL_PFX.length));
    });
    setParentHiddenCols(pNew);
    setChildHiddenCols(cNew);
  }, [columnDefinitions, filteredParentColumns, childColumns]);

  // Parses prefixed fixed keys from ColumnSettings and routes to correct state.
  const handleFixedColumnsChange = useCallback((next) => {
    const parentNext = { left: [], right: [] };
    const childNext  = { left: [], right: [] };
    if (columnDefinitions) {
      const parentKeySet = new Set(
        filteredParentColumns.map(c => c.key || c.dataIndex || c.title).filter(Boolean)
      );
      const childKeySet = new Set(
        childColumns.map(c => c.key || c.dataIndex || c.title).filter(Boolean)
      );
      ["left", "right"].forEach(side => {
        (next[side] || []).forEach(key => {
          if (parentKeySet.has(key)) parentNext[side].push(key);
          if (childKeySet.has(key))  childNext[side].push(key);
        });
      });
    } else {
      ["left", "right"].forEach(side => {
        (next[side] || []).forEach(pk => {
          if      (pk.startsWith(PARENT_COL_PFX)) parentNext[side].push(pk.slice(PARENT_COL_PFX.length));
          else if (pk.startsWith(CHILD_COL_PFX))  childNext[side].push(pk.slice(CHILD_COL_PFX.length));
        });
      });
    }
    setInternalFixedColumns(parentNext);
    setInternalChildFixed(childNext);
  }, [columnDefinitions, filteredParentColumns, childColumns]);

  // ── Persist preferences on every relevant state change ────────────────────
  useEffect(() => {
    writePrefs({
      parentHiddenColumns: parentHiddenCols,
      childHiddenColumns:  childHiddenCols,
      fixedColumns:        internalFixedColumns,
      childFixedColumns:   internalChildFixed,
      parentColumnWidths,
      childColumnWidths,
      parentColumnOrder,
      childColumnOrder,
    });
  }, [parentHiddenCols, childHiddenCols, internalFixedColumns, internalChildFixed, parentColumnWidths, childColumnWidths, parentColumnOrder, childColumnOrder, writePrefs]);

  // ── Sync column order when column definitions change ──────────────────────
  const getAllKeys = useCallback((cols) => cols.map(c => c.key || c.dataIndex || c.title).filter(Boolean), []);

  // Initialize refs with the actual initial signature so the sync effects are
  // no-ops on mount. An empty string would always differ from the real sig on
  // the first run, triggering a redundant setState that causes a double-render
  // and delays the action column (Issue 1 fix).
  const prevParentKeysRef = useRef(
    filteredParentColumns.map(c => c.key || c.dataIndex || c.title).filter(Boolean).join(",")
  );
  useEffect(() => {
    if (!filteredParentColumns || filteredParentColumns.length === 0) return;
    const keys = getAllKeys(filteredParentColumns);
    const sig = keys.join(",");
    if (sig !== prevParentKeysRef.current) {
      prevParentKeysRef.current = sig;
      setParentColumnOrder(keys);
      const keySet = new Set(keys);
      setParentHiddenCols(prev => prev.filter(k => keySet.has(k)));
    }
  }, [filteredParentColumns, getAllKeys]);

  const prevChildKeysRef = useRef(
    childColumns.map(c => c.key || c.dataIndex || c.title).filter(Boolean).join(",")
  );
  useEffect(() => {
    if (!childColumns || childColumns.length === 0) return;
    const keys = getAllKeys(childColumns);
    const sig = keys.join(",");
    if (sig !== prevChildKeysRef.current) {
      prevChildKeysRef.current = sig;
      setChildColumnOrder(keys);
      const childKeySet = new Set(keys);
      setChildHiddenCols(prev => prev.filter(k => childKeySet.has(k)));
    }
  }, [childColumns, getAllKeys]);

  // ── Resize handlers ────────────────────────────────────────────────────────
  const parentResizeMapRef = useRef({});
  const parentHandleResize = useCallback((key) => {
    if (!parentResizeMapRef.current[key]) {
      parentResizeMapRef.current[key] = (w) => setParentColumnWidths(prev => ({ ...prev, [key]: w }));
    }
    return parentResizeMapRef.current[key];
  }, []);

  const childResizeMapRef = useRef({});
  const childHandleResize = useCallback((key) => {
    if (!childResizeMapRef.current[key]) {
      childResizeMapRef.current[key] = (w) => setChildColumnWidths(prev => ({ ...prev, [key]: w }));
    }
    return childResizeMapRef.current[key];
  }, []);

  // ── Drag handlers (parent) ────────────────────────────────────────────────
  const handleParentDragStart = useCallback((e, key) => {
    setDraggedParentKey(key);
    draggedParentKeyRef.current = key; // update ref immediately — state is async
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", key);
  }, []);
  const handleParentDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);
  const handleParentDrop = useCallback((e, targetKey) => {
    e.preventDefault(); e.stopPropagation();
    // Bug 3 fix: read from ref, not closure state — state is stale at drop time
    const dragged = draggedParentKeyRef.current;
    if (dragged && dragged !== targetKey) {
      setParentColumnOrder(prev => {
        const next = [...prev];
        const from = next.indexOf(dragged);
        const to   = next.indexOf(targetKey);
        if (from !== -1 && to !== -1) { next.splice(from, 1); next.splice(to, 0, dragged); }
        return next;
      });
    }
    setDraggedParentKey(null);
    draggedParentKeyRef.current = null;
  }, []); // no deps — everything read via refs
  const handleParentDragEnd = useCallback(() => setDraggedParentKey(null), []);

  // ── Drag handlers (child) ────────────────────────────────────────────────
  const handleChildDragStart = useCallback((e, key) => {
    setDraggedChildKey(key);
    draggedChildKeyRef.current = key; // update ref immediately — state is async
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", key);
  }, []);
  const handleChildDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);
  const handleChildDrop = useCallback((e, targetKey) => {
    e.preventDefault(); e.stopPropagation();
    // Bug 3 fix: read from ref, not closure state
    const dragged = draggedChildKeyRef.current;
    if (dragged && dragged !== targetKey) {
      setChildColumnOrder(prev => {
        const next = [...prev];
        const from = next.indexOf(dragged);
        const to   = next.indexOf(targetKey);
        if (from !== -1 && to !== -1) { next.splice(from, 1); next.splice(to, 0, dragged); }
        return next;
      });
    }
    setDraggedChildKey(null);
    draggedChildKeyRef.current = null;
  }, []); // no deps — everything read via refs
  const handleChildDragEnd = useCallback(() => setDraggedChildKey(null), []);

  // ── processColumns helper — builds display column array ──────────────────
  // Handles: hidden, order, fixed, widths, resize/drag handlers.
  // Returns array of column objects with extra meta: _fixed, _isLast.
  const buildDisplayColumns = useCallback((
    rawCols, hiddenCols, order, safeFixedCols, widths,
    resizeFn, isDraggable,
    dragStart, dragOver, drop, dragEnd,
    draggedKeyRef,
    alwaysVisibleKeys = new Set()
  ) => {
    const cols = rawCols
      .filter(Boolean)
      .map(c => ({ ...c, key: c.key || c.dataIndex || c.title }));

    // Filter hidden
    const visible = cols.filter(c => {
      if (alwaysVisibleKeys.has(c.key)) return true;
      return !hiddenCols.includes(c.key);
    });

    // Guard: never hide all
    const safe = visible.length === 0 && cols.length > 0 ? [cols[0]] : visible;

    // Apply order
    const ordered = order.length > 0
      ? [...safe].sort((a, b) => {
          const ia = order.indexOf(a.key);
          const ib = order.indexOf(b.key);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        })
      : [...safe];

    // Partition into fixed / normal
    const leftFixed  = [];
    const rightFixed = [];
    const normal     = [];

    ordered.forEach(col => {
      const isLeft  = safeFixedCols.left.includes(col.key)  || col.fixed === "left"  || col.fixed === true;
      const isRight = safeFixedCols.right.includes(col.key) || col.fixed === "right";
      if (isLeft) leftFixed.push(col);
      else if (isRight) rightFixed.push(col);
      else normal.push(col);
    });

    // Guard: always at least one non-fixed col
    if (normal.length === 0 && (leftFixed.length > 0 || rightFixed.length > 0)) {
      if (leftFixed.length > 0) normal.push(leftFixed.pop());
      else normal.push(rightFixed.shift());
    }

    const all = [
      ...leftFixed.map(c => ({ ...c, _fixed: "left"  })),
      ...normal.map(c    => ({ ...c, _fixed: null     })),
      ...rightFixed.map(c => ({ ...c, _fixed: "right" })),
    ];

    // Attach widths and handlers.
    // NOTE: _isLast is intentionally removed. Previously the last data column
    // received flex:1 to fill remaining space — but this made its width
    // unpredictable (it stretched to fill whatever was left, which could be
    // hundreds of pixels for a "status" column). All columns now use explicit
    // widths. The table scrolls horizontally when the total width exceeds the
    // container.  Auto-measurement (autoMeasureColumnWidths) provides
    // content-appropriate widths so no column is ever wider than its content.
    return all.map((col) => {
      const key = col.key;
      // Fill columns ignore auto-measured widths (shared-key child measurements
      // would otherwise pollute the fill column's minWidth). Use only the
      // explicit col.width as the minimum — the column grows via flex:1 anyway.
      const width = col.fill
        ? Math.max(MIN_COL_WIDTH, col.width || DEFAULT_COL_WIDTH)
        : Math.max(MIN_COL_WIDTH, widths[key] || col.width || DEFAULT_COL_WIDTH);
      const canDrag = isDraggable && !col._fixed; // _fixed is "left"|"right"|null — truthy check is correct
      const isDragging = draggedKeyRef.current === key;
      return {
        ...col,
        width,
        // _fill: true → this column grows with flex:1 to absorb remaining container
        // width. The `width` value serves as its minimum width only.
        _fill: col.fill === true,
        _onResize: resizeFn(key),
        _isDraggable: canDrag,
        _isDragging: isDragging,
        _onDragStart: canDrag ? (e) => dragStart(e, key) : undefined,
        _onDragOver:  canDrag ? dragOver : undefined,
        _onDrop:      canDrag ? (e) => drop(e, key) : undefined,
        _onDragEnd:   canDrag ? dragEnd : undefined,
      };
    });
  }, []);

  // ── Build processed parent columns ────────────────────────────────────────
  const processedParentColumns = useMemo(() => {
    // filteredParentColumns has the action column key stripped so it doesn't
    // render twice (buildDisplayColumns + __action__ append below).
    // Width priority: user resize > col.width definition > auto-measured > DEFAULT
    const parentWidthsMerged = { ...autoMeasuredWidths, ...parentColumnWidths };
    const baseCols = buildDisplayColumns(
      filteredParentColumns,
      parentHiddenCols,
      parentColumnOrder,
      safeFixed,
      parentWidthsMerged,
      parentHandleResize,
      true, // draggable
      handleParentDragStart,
      handleParentDragOver,
      handleParentDrop,
      handleParentDragEnd,
      draggedParentKeyRef,
    );

    // Append action column as a fixed-right non-hideable column.
    // All columns (including action) use explicit widths — no flex:1 anywhere.
    if (actionColumn) {
      const actionWidth = actionColumn.width || 120;
      return [...baseCols, {
        key:          "__action__",
        title:        actionColumn.title || "ACTIONS",
        width:        actionWidth,
        render:       actionColumn.render,
        _fixed:       "right",
        _isDraggable: false,
        _onResize:    () => {},
        _isDragging:  false,
      }];
    }
    return baseCols;
  }, [filteredParentColumns, parentHiddenCols, parentColumnOrder, safeFixed, parentColumnWidths,
      parentHandleResize, handleParentDragStart, handleParentDragOver, handleParentDrop,
      handleParentDragEnd, buildDisplayColumns, autoMeasuredWidths, actionColumn]);

  // ── Build processed child columns ─────────────────────────────────────────
  const processedChildColumns = useMemo(() => {
    // Same merged priority as parent: auto-measured base, user resize on top.
    const childWidthsMerged = { ...autoMeasuredWidths, ...childColumnWidths };
    return buildDisplayColumns(
      childColumns,
      childHiddenCols,
      childColumnOrder,
      safeChildFixed,
      childWidthsMerged,
      childHandleResize,
      childResizable,
      handleChildDragStart,
      handleChildDragOver,
      handleChildDrop,
      handleChildDragEnd,
      draggedChildKeyRef,
    );
  }, [childColumns, childHiddenCols, childColumnOrder, safeChildFixed, childColumnWidths,
      childHandleResize, childResizable, handleChildDragStart, handleChildDragOver,
      handleChildDrop, handleChildDragEnd, buildDisplayColumns, autoMeasuredWidths]);

  // ── Container width measurement (for fixed-column warning) ─────────────────
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(entries => {
      const e = entries[0];
      if (e) setContainerWidth(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Fixed-column overflow warning ──────────────────────────────────────────
  const fixedColumnWarning = useMemo(() => {
    return computeFixedColumnWarning(processedParentColumns, containerWidth);
  }, [processedParentColumns, containerWidth]);

  const [warningDismissed, setWarningDismissed] = useState(false);
  const prevWarningKeyRef = useRef("");
  useEffect(() => {
    const key = fixedColumnWarning
      ? fixedColumnWarning.colNames.join(",") + fixedColumnWarning.totalFixed
      : "";
    if (key !== prevWarningKeyRef.current) {
      prevWarningKeyRef.current = key;
      setWarningDismissed(false);
    }
  }, [fixedColumnWarning]);

  // ── Auto-height ────────────────────────────────────────────────────────────
  const tableScrollYProp = tableScrolled?.y ?? 380;
  const [dynamicScrollY, setDynamicScrollY] = useState(tableScrollYProp);
  useEffect(() => {
    if (!autoHeight) { setDynamicScrollY(tableScrollYProp); return; }
    const FOOTER_H  = (useInfiniteScroll || usePagination) ? 33 : 0;
    const TOOLBAR_H = useSelect ? 48 : 0;
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;
      const viewportH     = window.innerHeight;
      const BOTTOM_MARGIN = Math.round(viewportH * 0.10);
      const rect          = el.getBoundingClientRect();
      const available     = viewportH - rect.top - FOOTER_H - TOOLBAR_H - BOTTOM_MARGIN;
      setDynamicScrollY(Math.max(tableScrollYProp, Math.floor(available)));
    };
    compute();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(compute);
      if (containerRef.current) ro.observe(containerRef.current);
      // ResizeObserver already fires on viewport changes — no window listener needed
      return () => ro.disconnect();
    }
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, [autoHeight, tableScrollYProp, useInfiniteScroll, usePagination, useSelect]); // eslint-disable-line react-hooks/exhaustive-deps
  const tableScrollY = dynamicScrollY;

  // ── onInitialLoad guarantee ────────────────────────────────────────────────
  const hasTriggeredInitialLoad = useRef(false);
  useEffect(() => {
    if (hasTriggeredInitialLoad.current) return;
    if (loading) return; // data still in-flight — wait for it to settle
    if (!fetchFailed && dataSource.length === 0 && typeof onInitialLoad === "function") {
      hasTriggeredInitialLoad.current = true;
      onInitialLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, dataSource.length]);

  // ── Row-click controlled state ────────────────────────────────────────────
  useEffect(() => {
    if (selectedRowKey !== null && selectedRowKey !== clickedRowKey) setClickedRowKey(selectedRowKey);
  }, [selectedRowKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRowClick = useCallback((record) => {
    const key = record.id || record.key;
    setClickedRowKey(key);
    onRowClick(record, key);
  }, [onRowClick]);

  // ── Combined: filteredDataSource + childMatchIds in one traversal ──────────
  // Hoisting sq outside the filter eliminates ~500k redundant toLowerCase calls
  // per keystroke at 50k rows × 10 columns.  A single pass halves traversal
  // cost compared to the previous two separate filter / forEach loops.
  const { filteredDataSource, childMatchIds } = useMemo(() => {
    if (!searchValue) return { filteredDataSource: dataSource, childMatchIds: new Set() };
    const sq  = searchValue.toLowerCase();
    const ids = new Set();
    const filtered = dataSource.filter(row => {
      const parentMatch = parentColumns.some(col => {
        const val = String(row[col.dataIndex || col.key] ?? "").toLowerCase();
        return val.includes(sq) || fuzzyMatch(val, sq);
      });
      if (parentMatch) return true;
      if (row.children && Array.isArray(row.children)) {
        const childMatch = row.children.some(child =>
          childColumns.some(col => {
            const val = String(child[col.dataIndex || col.key] ?? "").toLowerCase();
            return val.includes(sq) || fuzzyMatch(val, sq);
          })
        );
        if (childMatch) { ids.add(row.id); return true; }
      }
      return false;
    });
    return { filteredDataSource: filtered, childMatchIds: ids };
  }, [dataSource, parentColumns, childColumns, searchValue]);

  // O(1) row lookup — eliminates O(n) dataSource.find inside the auto-expand loop.
  const rowById = useMemo(
    () => new Map(dataSource.map(r => [r.id, r])),
    [dataSource]
  );

  const autoExpandedRef = useRef(new Set());
  const prevSearchRef   = useRef("");
  useEffect(() => {
    const searchCleared = !searchValue && prevSearchRef.current;
    prevSearchRef.current = searchValue;
    if (searchCleared) {
      const toCollapse = autoExpandedRef.current;
      autoExpandedRef.current = new Set();
      if (toCollapse.size > 0) {
        setExpandedKeys(prev => { const next = new Set(prev); toCollapse.forEach(id => next.delete(id)); return next; });
      }
      return;
    }
    if (!searchValue) return;
    const toAutoExpand = [];
    setExpandedKeys(prev => {
      const next = new Set(prev);
      let changed = false;
      dataSource.forEach(row => {
        if (childMatchIds.has(row.id) && !next.has(row.id)) {
          next.add(row.id);
          toAutoExpand.push(row.id);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    toAutoExpand.forEach(id => autoExpandedRef.current.add(id));
    // Trigger fetch for rows whose children haven't loaded yet.
    // Cap to MAX_AUTO_EXPAND_FETCHES simultaneous requests to avoid flooding the API
    // when many rows match (e.g. 1,000 matches would fire 1,000 simultaneous API calls).
    const MAX_AUTO_EXPAND_FETCHES = 5;
    let fetchCount = 0;
    childMatchIds.forEach(id => {
      if (fetchCount >= MAX_AUTO_EXPAND_FETCHES) return;
      const row = rowById.get(id); // O(1) Map lookup instead of O(n) dataSource.find
      if (row && (!row.children || row.children.length === 0) && !loadingKeys.has(id)) {
        onExpand(id);
        fetchCount++;
      }
    });
  }, [childMatchIds, searchValue, dataSource, rowById, onExpand, loadingKeys]);

  // ── Expand / collapse handlers ─────────────────────────────────────────────
  const handleToggleExpand = useCallback((rowId) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) { next.delete(rowId); autoExpandedRef.current.delete(rowId); }
      else next.add(rowId);
      return next;
    });
  }, []);

  const handleExpand = useCallback((rowId) => { onExpand(rowId); }, [onExpand]);

  // ── Infinite scroll ────────────────────────────────────────────────────────
  const scrollContainerRef  = useRef(null);
  const sentinelRef         = useRef(null);
  const isLoadingMoreRef    = useRef(false);
  const hasMoreRef          = useRef(hasMore);
  const onLoadMoreRef       = useRef(onLoadMore);
  const isMountedRef        = useRef(true);
  useEffect(() => { hasMoreRef.current    = hasMore;    }, [hasMore]);
  useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);
  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

  // ── Horizontal scroll sync (header ↔ parent rows) ─────────────────────────
  // The header and every parent data-row band each have overflowX:"hidden".
  // When ANY one scrolls, we propagate the same scrollLeft to all others so
  // they move in perfect lock-step.  Child tables are NOT in this set — they
  // have their own independent overflowX:auto (nx-child-scroll).
  const scrollSyncNodesRef = useRef(new Set());
  const isSyncingRef       = useRef(false); // re-entrancy guard

  const headerScrollRef = useCallback((node) => {
    if (node) scrollSyncNodesRef.current.add(node);
    // Header never unmounts during the table's lifetime, so no removal needed.
  }, []);

  const handleRegisterRowScroll = useCallback((node, action) => {
    if (!node) return;
    if (action === "add")    scrollSyncNodesRef.current.add(node);
    if (action === "remove") scrollSyncNodesRef.current.delete(node); // node is always real (captured via scrollNodeRef in ParentRow)
  }, []);

  const handleSyncScroll = useCallback((e) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    const { scrollLeft } = e.currentTarget;
    scrollSyncNodesRef.current.forEach(node => {
      if (node !== e.currentTarget && node.scrollLeft !== scrollLeft) {
        node.scrollLeft = scrollLeft;
      }
    });
    isSyncingRef.current = false;
  }, []);

  useEffect(() => {
    if (!useInfiniteScroll) return;
    const scrollRoot = scrollContainerRef.current;
    if (!scrollRoot) return;

    const THRESHOLD = 80;
    const onScroll = () => {
      if (!hasMoreRef.current || isLoadingMoreRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = scrollRoot;
      if (scrollTop + clientHeight >= scrollHeight - THRESHOLD) {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
        Promise.resolve(onLoadMoreRef.current())
          .catch(() => {})
          .finally(() => { isLoadingMoreRef.current = false; if (isMountedRef.current) setIsLoadingMore(false); });
      }
    };
    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollRoot.removeEventListener("scroll", onScroll);
  }, [useInfiniteScroll]);

  // ── Misc handlers ──────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    if (onRefresh) onRefresh(); else window.location.reload();
  }, [onRefresh]);

  const handleAdvanceSearch = useCallback((data) => { onAdvanceSearch(data); setIsAdvanceOpen(false); }, [onAdvanceSearch]);
  const handleClearFilter   = useCallback(() => { onAdvanceSearch(null); }, [onAdvanceSearch]);
  const handleSearchChange  = useCallback((val) => { setSearchValue(val); }, []);

  const handleClearPreferences = useCallback(() => {
    setParentHiddenCols([]);
    setChildHiddenCols([]);
    setParentColumnWidths({});
    setChildColumnWidths({});
    setParentColumnOrder([]);
    setChildColumnOrder([]);
    setInternalFixedColumns({
      left:  Array.isArray(fixedColumns?.left)  ? [...fixedColumns.left]  : [],
      right: Array.isArray(fixedColumns?.right) ? [...fixedColumns.right] : [],
    });
    setInternalChildFixed({
      left:  Array.isArray(childFixedColumns?.left)  ? [...childFixedColumns.left]  : [],
      right: Array.isArray(childFixedColumns?.right) ? [...childFixedColumns.right] : [],
    });
    if (prefsStorageKey) {
      try { localStorage.removeItem(prefsStorageKey); } catch { /* private / quota */ }
    }
    onClearPreferences?.();
  }, [fixedColumns, childFixedColumns, prefsStorageKey, onClearPreferences]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const resolvedTotalData = (totalData != null) ? totalData : dataSource.length;
  const hasRightControls  = showExport || showAdvanceSearch || showSearchBar || showRefresh;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <style>{`
        @keyframes nxSlideDown {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 2000px; }
        }
        @keyframes nxSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .nx-child-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid #e0e7ef; border-top-color: #1976D2;
          border-radius: 50%; animation: nxSpin 0.65s linear infinite; flex-shrink: 0;
        }
        .nx-child-scroll::-webkit-scrollbar        { height: 6px; }
        .nx-child-scroll::-webkit-scrollbar-track  { background: #f1f1f1; }
        .nx-child-scroll::-webkit-scrollbar-thumb  { background: #888; border-radius: 3px; }
        .nx-child-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
        .nx-child-scroll { scrollbar-width: thin; scrollbar-color: #888 #f1f1f1; }
        #${safeId} .nx-nested-body::-webkit-scrollbar        { width: 8px; }
        #${safeId} .nx-nested-body::-webkit-scrollbar-track  { background: #f1f1f1; }
        #${safeId} .nx-nested-body::-webkit-scrollbar-thumb  { background: #888; border-radius: 6px; }
        #${safeId} .nx-nested-body::-webkit-scrollbar-thumb:hover { background: #555; }
        #${safeId} .nx-nested-body { scrollbar-width: thin; scrollbar-color: #888 #f1f1f1; }
      `}</style>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      {useSelect && (
        <div style={{ width: "100%", display: "flex", marginBottom: 12, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ColumnSettings
              columns={columnsForSettings}
              hiddenColumns={hiddenForSettings}
              onHiddenColumnsChange={handleHiddenColumnsChange}
              fixedColumns={fixedForSettings}
              onFixedColumnsChange={handleFixedColumnsChange}
              buttonText="Column Settings"
              buttonStyle={{ height: "32px", fontSize: "12px" }}
            />
            {customHeaderLeft && customHeaderLeft}
          </div>

          {hasRightControls && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              {showExport && (
                <Button
                  icon={<DownloadOutlined style={{ fontSize: "14px" }} />}
                  onClick={handleDownload}
                  style={{ border: "1px solid #BDBDBD", color: "black", borderRadius: "8px", height: "32px", fontSize: "12px" }}
                >
                  Export
                </Button>
              )}
              {showRefresh && (
                <Button
                  icon={<ReloadOutlined style={{ fontSize: "14px" }} />}
                  onClick={handleRefresh}
                  loading={loading}
                  style={{ border: "1px solid #BDBDBD", color: "black", borderRadius: "8px", height: "32px", fontSize: "12px" }}
                >
                  Refresh
                </Button>
              )}
              {showAdvanceSearch && (
                <Button
                  onClick={() => setIsAdvanceOpen(true)}
                  style={{ border: "1px solid #BDBDBD", color: "black", borderRadius: "8px", height: "32px", fontSize: "12px" }}
                >
                  <FilterOutlined style={{ fontSize: "14px" }} />
                  Advanced Search
                </Button>
              )}
              {showSearchBar && (
                <div style={{ width: "200px" }}>
                  <SearchBar placeholder="Search content here ..." onSearch={handleSearchChange} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Fixed-column overflow warning ─────────────────────────────────── */}
      {fixedColumnWarning && !warningDismissed && (
        <FixedColumnWarning warning={fixedColumnWarning} onDismiss={() => setWarningDismissed(true)} />
      )}

      {/* ── Table shell ───────────────────────────────────────────────────── */}
      <div
        id={safeId}
        style={{
          borderRadius: "8px 8px 0 0",
          border: `1px solid ${BORDER_COL}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          fontFamily: FONT_FAMILY,
          width: "100%",
        }}
      >
        {/* ── Parent header row ──────────────────────────────────────────────
             The header band is the ONLY true overflowX:auto scroller.
             When the user scrolls it, handleSyncScroll propagates the same
             scrollLeft to every parent row's band (which are overflowX:hidden,
             driven entirely by the sync).  This keeps header and rows aligned
             without them sharing a common scroll container — so the child tables,
             which live OUTSIDE each row's scroll band at full width, can never
             affect the parent's horizontal scroll.
        ────────────────────────────────────────────────────────────────────── */}
        <div
          ref={headerScrollRef}
          onScroll={handleSyncScroll}
          style={{ overflowX: "auto", width: "100%" }}
        >
          <div style={{ display: "flex", alignItems: "stretch", width: "100%", minWidth: "max-content", background: HEADER_BG }}>
            {/* Toggle header (blank) */}
            <div style={{ ...HEADER_CELL_STYLE, width: EXPAND_COL_WIDTH, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.2)" }} />

            {/* Parent data column headers — all explicit widths, no flex:1 */}
            {processedParentColumns.map((col) => {
              const key = col.key || col.dataIndex;
              if (key === "__action__") return null;
              return (
                <ResizableHeaderCell
                  key={key}
                  width={col.width}
                  onResize={col._onResize}
                  isDraggable={col._isDraggable}
                  onDragStart={col._onDragStart}
                  onDragOver={col._onDragOver}
                  onDrop={col._onDrop}
                  onDragEnd={col._onDragEnd}
                  style={{
                    ...HEADER_CELL_STYLE,
                    ...(col._fill
                      ? { flex: 1, minWidth: col.width }
                      : { flex: "none", width: col.width, minWidth: col.width }),
                    justifyContent: "center",
                    borderRight: "1px solid rgba(255,255,255,0.2)",
                    opacity: col._isDragging ? 0.5 : 1,
                  }}
                >
                  <span style={{
                    color: "#fff", fontSize: 10, fontWeight: 600, fontFamily: FONT_FAMILY,
                    letterSpacing: "0.05em", textTransform: "uppercase",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {col.title}
                  </span>
                </ResizableHeaderCell>
              );
            })}

            {/* Action column header */}
            {actionColumn && (
              <div style={{
                ...HEADER_CELL_STYLE,
                width: actionColumn.width || 120,
                flexShrink: 0,
                justifyContent: "center",
                borderRight: "none",
              }}>
                <span style={{
                  color: "#fff", fontSize: 10, fontWeight: 600, fontFamily: FONT_FAMILY,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                }}>
                  {actionColumn.title || "ACTIONS"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Data rows — vertically scrollable.
             Each ParentRow renders its own overflowX:hidden band (for parent cells)
             + a full-width child table outside that band.
             The vertical scroll container only controls overflowY — it never
             causes horizontal scrolling of its own. */}
        <div
          ref={scrollContainerRef}
          className="nx-nested-body"
          style={{
            position: "relative",
            maxHeight: `${tableScrollY}px`,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {loading && dataSource.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
              <Spin />
            </div>
          ) : fetchFailed ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>⚠️</div>
              <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "12px" }}>Failed to load data</div>
              {onRefresh && (
                <Button size="small" icon={<ReloadOutlined />} onClick={handleRefresh} style={{ borderRadius: "6px", fontSize: "12px" }}>
                  Retry
                </Button>
              )}
            </div>
          ) : filteredDataSource.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
              No data
            </div>
          ) : (
            filteredDataSource.map((row, i) => (
              <ParentRow
                key={row.id ?? i}
                rowIdx={i}
                record={row}
                processedParentColumns={processedParentColumns}
                processedChildColumns={processedChildColumns}
                isExpanded={expandedKeys.has(row.id)}
                onToggleExpand={handleToggleExpand}
                onExpand={handleExpand}
                isChildLoading={loadingKeys.has(row.id)}
                searchValue={searchValue}
                enableRowClick={enableRowClick}
                isRowSelected={enableRowClick && clickedRowKey === (row.id || row.key)}
                onRowClick={handleRowClick}
                onRegisterScroll={handleRegisterRowScroll}
                onSyncScroll={handleSyncScroll}
              />
            ))
          )}

          {/* Loading-more indicator */}
          {isLoadingMore && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 0", color: "#6B7280", fontSize: 12, fontFamily: FONT_FAMILY }}>
              <span className="nx-child-spinner" />
              Loading more...
            </div>
          )}

          {/* Sentinel for legacy IntersectionObserver (kept for modal compat) */}
          {useInfiniteScroll && hasMore && (
            <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
          )}
        </div>
      </div>

      {/* ── Footer (mirrors NxTable footer pattern) ───────────────────────── */}
      {useInfiniteScroll ? (
        <div style={{ position: "relative", zIndex: 1, marginTop: "-1px", borderTop: `1px solid ${BORDER_COL}`, borderLeft: `1px solid ${BORDER_COL}`, borderRight: `1px solid ${BORDER_COL}`, borderBottom: `1px solid ${BORDER_COL}`, borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, width: "100%" }}>
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Showing {filteredDataSource.length} of {Math.max(resolvedTotalData, filteredDataSource.length)} entries
            {isLoadingMore && hasMore && " · Loading..."}
          </span>
          {!hasMore && filteredDataSource.length > 0 && (
            <><span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} /><span style={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>All data loaded</span></>
          )}
        </div>
      ) : usePagination ? (
        <div style={{ position: "relative", zIndex: 1, marginTop: "-2px", borderTop: `1px solid ${BORDER_COL}`, borderLeft: `1px solid ${BORDER_COL}`, borderRight: `1px solid ${BORDER_COL}`, borderBottom: `1px solid ${BORDER_COL}`, borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Select value={pageSize} onChange={(v) => onSizeChanger(current, v)} style={{ fontSize: "12px", width: 60 }} size="small">
              {[10, 20, 50, 100].map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
            <span style={{ fontSize: 12 }}>
              {resolvedTotalData === 0 ? "Showing 0 entries" : `Showing ${(current - 1) * pageSize + 1} to ${Math.min(current * pageSize, resolvedTotalData)} of ${resolvedTotalData} entries`}
            </span>
          </div>
          <Pagination total={resolvedTotalData} current={current} pageSize={pageSize} onChange={onChange} showSizeChanger={false} size="small" />
        </div>
      ) : (
        <div style={{ position: "relative", zIndex: 1, marginTop: "-1px", borderTop: `1px solid ${BORDER_COL}`, borderLeft: `1px solid ${BORDER_COL}`, borderRight: `1px solid ${BORDER_COL}`, borderBottom: `1px solid ${BORDER_COL}`, borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, width: "100%" }}>
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Showing {filteredDataSource.length} of {resolvedTotalData} entries
          </span>
          {!loading && filteredDataSource.length > 0 && (
            <><span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} /><span style={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>All data showed</span></>
          )}
        </div>
      )}

      {/* ── Advanced search modal ─────────────────────────────────────────── */}
      <NxAdvanceSearch
        visible={isAdvanceOpen}
        onClose={() => setIsAdvanceOpen(false)}
        onSearch={handleAdvanceSearch}
        onClear={handleClearFilter}
        columns={columnDefinitions || [...parentColumns, ...childColumns]}
        modalWidth={600}
      />
    </div>
  );
};

// ── Static utility — clear saved preferences ───────────────────────────────
// Same signature as NxTable.clearPreferences.
//
//   NxTableNested.clearPreferences({ userId: 'u1' });
//   NxTableNested.clearPreferences({ userId: 'u1', idTable: 'myTable' });
//
NxTableNested.clearPreferences = ({ userId, idTable: tableId } = {}) => {
  if (!userId) return;
  try {
    if (tableId) {
      const key = buildStorageKey(userId, tableId);
      if (key) localStorage.removeItem(key);
    } else {
      const prefix = `nxnested__${userId}__`;
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) toRemove.push(k);
      }
      toRemove.forEach(k => localStorage.removeItem(k));
    }
  } catch {
    // Private browsing or quota error — fail silently.
  }
};

// ── PropTypes ─────────────────────────────────────────────────────────────────
const columnShape = PropTypes.arrayOf(PropTypes.shape({
  key:       PropTypes.string,
  dataIndex: PropTypes.string,
  title:     PropTypes.string.isRequired,
  render:    PropTypes.func,
  width:     PropTypes.number,
  align:     PropTypes.oneOf(["left", "center", "right"]),
  fixed:     PropTypes.oneOf(["left", "right", true, false]),
}));

NxTableNested.propTypes = {
  idTable:            PropTypes.string,
  userId:             PropTypes.string,
  persistPreferences: PropTypes.bool,
  dataSource:         PropTypes.arrayOf(PropTypes.shape({
    id:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.array,
  })).isRequired,
  parentColumns:      columnShape.isRequired,
  childColumns:       columnShape.isRequired,
  loading:            PropTypes.bool,
  totalData:          PropTypes.number,
  onExpand:           PropTypes.func,
  loadingKeys:        PropTypes.instanceOf(Set),
  actionColumn:       PropTypes.shape({
    title:  PropTypes.string,
    width:  PropTypes.number,
    render: PropTypes.func,
  }),
  useSelect:          PropTypes.bool,
  columnDefinitions:  PropTypes.array,
  fixedColumns:       PropTypes.shape({ left: PropTypes.array, right: PropTypes.array }),
  childFixedColumns:  PropTypes.shape({ left: PropTypes.array, right: PropTypes.array }),
  showSearchBar:      PropTypes.bool,
  showAdvanceSearch:  PropTypes.bool,
  onAdvanceSearch:    PropTypes.func,
  showExport:         PropTypes.bool,
  handleDownload:     PropTypes.func,
  showRefresh:        PropTypes.bool,
  onRefresh:          PropTypes.func,
  customHeaderLeft:   PropTypes.node,
  tableScrolled:      PropTypes.shape({ y: PropTypes.number }),
  autoHeight:         PropTypes.bool,
  useInfiniteScroll:  PropTypes.bool,
  onLoadMore:         PropTypes.func,
  hasMore:            PropTypes.bool,
  usePagination:      PropTypes.bool,
  pageSize:           PropTypes.number,
  current:            PropTypes.number,
  onChange:           PropTypes.func,
  onSizeChanger:      PropTypes.func,
  childResizable:     PropTypes.bool,
  enableRowClick:     PropTypes.bool,
  selectedRowKey:     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onRowClick:         PropTypes.func,
  fetchFailed:        PropTypes.bool,
  onInitialLoad:      PropTypes.func,
  onClearPreferences: PropTypes.func,
};

export default NxTableNested;
