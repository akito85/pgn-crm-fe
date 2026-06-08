import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Table, Input, InputNumber, Select, Empty } from "antd";

const { Option } = Select;

// ── Shared visual constants (identical to NxTable) ────────────────────────────
const HEADER_BG   = "#2C6FAD";
const BORDER_COL  = "#C8CDD4";
const ROW_WHITE   = "#FFFFFF";
const ROW_HOVER   = "#EBF2FA";
const FONT_FAMILY = "'PlusJakartaSans', 'PublicSans', sans-serif";

// ── Shared CSS factory — called once per unique idTable via useMemo ───────────
const buildTableStyles = (idTable) => `
  #${idTable} .ant-table-content {
    position: relative;
    z-index: 1;
  }

  #${idTable} .ant-table-body {
    position: relative;
    z-index: 1;
  }

  #${idTable} .ant-table-tbody > tr {
    position: relative;
    z-index: 1;
  }

  #${idTable} .ant-table-tbody > tr:hover {
    z-index: 2;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  #${idTable} .ant-table-body {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
    padding-bottom: 0;
  }

  #${idTable} .ant-table {
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    border: none;
    border-collapse: collapse;
    border-spacing: 0;
  }

  #${idTable} .ant-table-container {
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    border: none;
  }

  #${idTable} .ant-table-container table > thead > tr:first-child > *:first-child {
    border-start-start-radius: 8px;
  }

  #${idTable} .ant-table-container table > thead > tr:first-child > *:last-child {
    border-start-end-radius: 8px;
  }

  #${idTable} .ant-table-tbody > tr:last-child > *:first-child {
    border-end-start-radius: 0;
  }

  #${idTable} .ant-table-tbody > tr:last-child > *:last-child {
    border-end-end-radius: 0;
  }

  #${idTable} .ant-table-bordered .ant-table-cell,
  #${idTable} .ant-table-bordered .ant-table-thead > tr > th,
  #${idTable} .ant-table-bordered .ant-table-tbody > tr > td,
  #${idTable} .ant-table-bordered .ant-table-container {
    border-color: ${BORDER_COL} !important;
  }

  #${idTable} .ant-table-thead > tr > th {
    padding: 4px 8px !important;
    height: 30px !important;
    border-right: 1px solid ${BORDER_COL} !important;
    border-bottom: 1px solid ${BORDER_COL} !important;
    font-family: ${FONT_FAMILY};
    background-color: ${HEADER_BG} !important;
    color: #fff !important;
  }

  #${idTable} .ant-table-thead > tr:first-child > th {
    border-top: 1px solid ${BORDER_COL} !important;
  }

  #${idTable} .ant-table-thead > tr > th:first-child {
    border-left: 1px solid ${BORDER_COL} !important;
  }

  /* Active sorter icon — keep white on blue header */
  #${idTable} .ant-table-thead .ant-table-column-sorter-up.active .anticon,
  #${idTable} .ant-table-thead .ant-table-column-sorter-down.active .anticon {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-measure-row) > td {
    padding: 4px 8px !important;
    min-height: 30px;
    font-size: 12px;
    border-right: 1px solid ${BORDER_COL} !important;
    border-bottom: 1px solid ${BORDER_COL} !important;
    font-family: ${FONT_FAMILY};
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-measure-row) > td:first-child {
    border-left: 1px solid ${BORDER_COL} !important;
  }

  /* Edit-mode row: remove cell padding so inputs sit flush */
  #${idTable} .ant-table-tbody > tr.nx-row-editing > td {
    padding: 0 8px !important;
  }

  /* ── Alternating row colors — exclude placeholder & measure rows ── */
  #${idTable} .ant-table-tbody > tr:not(.ant-table-placeholder):not(.ant-table-measure-row):nth-child(odd) > td {
    background-color: ${ROW_WHITE} !important;
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-placeholder):not(.ant-table-measure-row):nth-child(even) > td {
    background-color: ${ROW_HOVER} !important;
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-placeholder):not(.ant-table-measure-row):hover > td {
    background-color: ${ROW_HOVER} !important;
  }

  /* Editing row hover stays white so inputs don't flash */
  #${idTable} .ant-table-tbody > tr.nx-row-editing:hover > td {
    background-color: ${ROW_WHITE} !important;
  }

  /* ── Empty / placeholder row — always white ── */
  #${idTable} .ant-table-placeholder > td {
    background-color: ${ROW_WHITE} !important;
    border-left: 1px solid ${BORDER_COL} !important;
    border-right: 1px solid ${BORDER_COL} !important;
    border-bottom: 1px solid ${BORDER_COL} !important;
  }

  #${idTable} .ant-table-placeholder:hover > td {
    background-color: ${ROW_WHITE} !important;
  }

  /* ── Measure row (Ant internal) — fully hidden ── */
  #${idTable} .ant-table-measure-row > td {
    padding: 0 !important;
    height: 0 !important;
    line-height: 0;
    font-size: 0;
    overflow: hidden;
  }

  /* ── Input controls inside cells ── */
  #${idTable} .ant-select-selector {
    height: 34px !important;
    align-items: center;
  }

  #${idTable} .ant-input-number {
    height: 34px;
  }

  #${idTable} .ant-input-number-input {
    height: 32px;
  }

  #${idTable} .ant-input,
  #${idTable} .ant-input-number-input {
    font-size: 12px;
  }

  #${idTable} .ant-select-selection-item,
  #${idTable} .ant-select-selection-placeholder {
    font-size: 12px;
  }

  /* ── Icon button hover — CSS instead of inline JS handlers ── */
  #${idTable} .nx-btn-edit:hover  { background: #e3f2fd; }
  #${idTable} .nx-btn-trash:hover { background: #fff1f0; }
`;

// ── Static icon nodes — module-level constants, never re-created ──────────────
const EDIT_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.50004 5.8335H5.00004C4.07957 5.8335 3.33337 6.57969 3.33337 7.50016V15.0002C3.33337 15.9206 4.07957 16.6668 5.00004 16.6668H12.5C13.4205 16.6668 14.1667 15.9206 14.1667 15.0002V12.5002" stroke="#1976D2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 12.5H10L17.0833 5.41669C17.7737 4.72634 17.7737 3.60705 17.0833 2.91669C16.393 2.22634 15.2737 2.22634 14.5833 2.91669L7.5 10V12.5" stroke="#1976D2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3334 4.1665L15.8334 6.6665" stroke="#1976D2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TRASH_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33337 5.8335H16.6667" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33337 9.1665V14.1665" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.6667 9.1665V14.1665" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16663 5.8335L5.00004 15.8335C5.00004 16.754 5.74623 17.5002 6.66671 17.5002H13.3334C14.2538 17.5002 15 16.754 15 15.8335L15.8334 5.8335" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 5.8335V3.3335C7.5 2.87326 7.8731 2.50016 8.33333 2.50016H11.6667C12.1269 2.50016 12.5 2.87326 12.5 3.3335V5.8335" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Static style objects — module-level, zero GC pressure ────────────────────
const iconBtnStyle = {
  border: "none",
  background: "none",
  cursor: "pointer",
  padding: "2px",
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "4px",
  transition: "background 0.15s",
};

const cancelBtnStyle = {
  border: `1px solid ${BORDER_COL}`,
  background: "#fff",
  cursor: "pointer",
  padding: "2px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: "500",
  color: "#374151",
  height: "28px",
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "inherit",
};

const saveBtnStyle = {
  border: "none",
  background: "#1565C0",
  cursor: "pointer",
  padding: "2px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: "500",
  color: "#fff",
  height: "28px",
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "inherit",
};

const actionCellStyle   = { display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" };
const headerCellStyle   = { textTransform: "uppercase", fontSize: "10px", cursor: "default" };
const actionColCellStyle = { textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", fontSize: "12px", padding: "4px 8px" };

// ── Stable onHeaderCell / onCell callbacks — same reference every call ────────
const onHeaderCellDefault = () => ({ style: headerCellStyle });
const onActionHeaderCell  = () => ({ style: headerCellStyle });
const onActionCell        = () => ({ style: actionColCellStyle });

/**
 * NxTableInlineEdit
 *
 * Row-level inline edit table — same base structure and CSS as NxTable
 * for unified look-and-feel and easier maintenance.
 *
 * Column definition extras:
 *   editable      {boolean}  — enable inline editing for this column
 *   inputType     {string}   — 'text' | 'number' | 'select' (default: 'text')
 *   placeholder   {string}   — placeholder text
 *   selectOptions {Array}    — [{ value, label }] for inputType 'select'
 *   searchable    {boolean}  — enable type-to-search on a select (default: false)
 *   min           {number}   — min for inputType 'number'
 *   max           {number}   — max for inputType 'number'
 *   precision     {number}   — decimal precision for inputType 'number'
 *   maxLength     {number}   — max char length for inputType 'text'
 *
 * Props:
 *   idTable           {string}    — unique DOM id for CSS scoping (required)
 *   dataSource        {Array}     — controlled row data
 *   onDataChange      {Function}  — (newData) called on Save or Delete
 *   columns           {Array}     — column definitions
 *   rowKey            {string}    — key field name (default: 'key')
 *   loading           {boolean}
 *   showDelete        {boolean}   — show delete button (default: true)
 *   emptyText         {string}    — empty state message
 *   editMode          {string}    — 'full' | 'deleteOnly' (default: 'full')
 *   autoEditOnAppend  {boolean}   — auto-enter edit mode when a row is appended
 *                                   (default: true). Set false when rows are
 *                                   pre-filled externally (modal picker, import).
 */
const NxTableInlineEdit = ({
  idTable = "nx-table-inline-edit",
  dataSource = [],
  onDataChange,
  columns = [],
  rowKey = "key",
  loading = false,
  showDelete = true,
  emptyText = "No data. Click Create to add a new row.",
  editMode = "full",
  autoEditOnAppend = true,
}) => {
  const [editingKey, setEditingKey]       = useState(null);
  const [editingValues, setEditingValues] = useState({});
  // isNewRow doesn't drive any JSX — ref avoids an extra state-triggered render
  const isNewRowRef   = useRef(false);
  const prevLengthRef = useRef(dataSource.length);

  // ── CSS string — regenerated only when idTable changes (practically never) ─
  const tableStyles = useMemo(() => buildTableStyles(idTable), [idTable]);

  // ── Auto-enter edit mode when a new row is appended ───────────────────────
  useEffect(() => {
    const prevLength = prevLengthRef.current;
    prevLengthRef.current = dataSource.length;

    if (autoEditOnAppend && editMode !== "deleteOnly" && dataSource.length > prevLength) {
      const newRow = dataSource[dataSource.length - 1];
      if (newRow) {
        setEditingKey(newRow[rowKey]);
        setEditingValues({ ...newRow });
        isNewRowRef.current = true;
      }
    }
  }, [dataSource, rowKey, autoEditOnAppend, editMode]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEditStart = useCallback(
    (record) => {
      setEditingKey(record[rowKey]);
      setEditingValues({ ...record });
      isNewRowRef.current = false;
    },
    [rowKey]
  );

  const handleEditCancel = useCallback(() => {
    if (isNewRowRef.current) {
      onDataChange?.(dataSource.filter((row) => row[rowKey] !== editingKey));
    }
    setEditingKey(null);
    setEditingValues({});
    isNewRowRef.current = false;
  }, [dataSource, editingKey, onDataChange, rowKey]);

  const handleEditSave = useCallback(() => {
    onDataChange?.(
      dataSource.map((row) =>
        row[rowKey] === editingKey ? { ...row, ...editingValues } : row
      )
    );
    setEditingKey(null);
    setEditingValues({});
  }, [dataSource, editingKey, editingValues, onDataChange, rowKey]);

  const handleEditChange = useCallback((field, value) => {
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDelete = useCallback(
    (recordKey) => {
      onDataChange?.(dataSource.filter((row) => row[rowKey] !== recordKey));
      setEditingKey((key) => (key === recordKey ? null : key));
    },
    [dataSource, onDataChange, rowKey]
  );

  // ── Stable empty locale — only rebuilds when emptyText changes ────────────
  const tableLocale = useMemo(
    () => ({
      emptyText: (
        <div style={{ padding: "20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: "12px" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ fontFamily: FONT_FAMILY, fontSize: "12px", color: "#999" }}>
                {emptyText}
              </span>
            }
          />
        </div>
      ),
    }),
    [emptyText]
  );

  // ── rowClassName — stable, only changes when editingKey changes ───────────
  const rowClassName = useCallback(
    (record) => (record[rowKey] === editingKey ? "nx-row-editing" : ""),
    [rowKey, editingKey]
  );

  // ── Column definitions — rebuilt only when deps actually change ───────────
  // Deps: columns shape, which row is being edited, current field values,
  // editMode, showDelete, and the stable handler references.
  const tableColumns = useMemo(() => {
    // Build one onCell per column (closes over textAlign) rather than per cell.
    const makeOnCell = (textAlign) => () => ({
      style: { textAlign, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "12px" },
    });

    const processed = columns.map((col, colIndex) => {
      let textAlign = "left";
      if (col.isNumber || col.align === "right") textAlign = "right";
      else if (col.isClassification) textAlign = "center";

      return {
        ...col,
        key: col.key || col.dataIndex,
        fixed: colIndex === 0 ? "left" : col.fixed,
        onHeaderCell: onHeaderCellDefault,
        onCell: makeOnCell(textAlign),
        render: (text, record, index) => {
          const editing = record[rowKey] === editingKey;

          if (!col.editable || !editing) {
            if (col.render) return col.render(text, record, index);
            if (col.inputType === "select" && col.selectOptions?.length) {
              const match = col.selectOptions.find((opt) => opt.value === text);
              return match ? match.label : (text ?? "—");
            }
            return text ?? "—";
          }

          const value = editingValues[col.dataIndex];

          if (col.inputType === "select") {
            return (
              <div style={{ padding: "4px 0" }}>
                <Select
                  value={value != null ? value : undefined}
                  placeholder={col.placeholder || `Select ${col.title}`}
                  onChange={(v) => handleEditChange(col.dataIndex, v)}
                  style={{ width: "100%", height: "34px", fontFamily: FONT_FAMILY }}
                  showSearch={!!col.searchable}
                  filterOption={col.searchable
                    ? (input, option) =>
                        String(option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                    : undefined
                  }
                >
                  {(col.selectOptions || []).map((opt) => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </div>
            );
          }

          if (col.inputType === "number") {
            return (
              <div style={{ padding: "4px 0" }}>
                <InputNumber
                  value={value}
                  placeholder={col.placeholder}
                  min={col.min ?? 0}
                  max={col.max}
                  precision={col.precision ?? 0}
                  onChange={(v) => handleEditChange(col.dataIndex, v)}
                  style={{ width: "100%", height: "34px", fontFamily: FONT_FAMILY }}
                />
              </div>
            );
          }

          return (
            <div style={{ padding: "4px 0" }}>
              <Input
                value={value ?? ""}
                placeholder={col.placeholder || col.title}
                maxLength={col.maxLength}
                onChange={(e) => handleEditChange(col.dataIndex, e.target.value)}
                style={{ height: "34px", padding: "4px 8px", fontFamily: FONT_FAMILY }}
              />
            </div>
          );
        },
      };
    });

    const actionsColumn = {
      title: "ACTION",
      fixed: "right",
      key: "__actions__",
      width: 200,
      onHeaderCell: onActionHeaderCell,
      onCell: onActionCell,
      render: (_, record) => {
        const editing = record[rowKey] === editingKey;

        if (editing) {
          return (
            <div style={actionCellStyle}>
              {showDelete && (
                <button type="button" className="nx-btn-trash" style={iconBtnStyle}
                  onClick={() => handleDelete(record[rowKey])} title="Delete">
                  {TRASH_ICON}
                </button>
              )}
              <button type="button" style={cancelBtnStyle} onClick={handleEditCancel}>Cancel</button>
              <button type="button" style={saveBtnStyle}   onClick={handleEditSave}>Save</button>
            </div>
          );
        }

        if (editMode === "deleteOnly") {
          if (!showDelete) return null;
          return (
            <div style={actionCellStyle}>
              <button type="button" className="nx-btn-trash" style={iconBtnStyle}
                onClick={() => handleDelete(record[rowKey])} title="Delete">
                {TRASH_ICON}
              </button>
            </div>
          );
        }

        return (
          <div style={actionCellStyle}>
            <button type="button" className="nx-btn-edit" style={iconBtnStyle}
              onClick={() => handleEditStart(record)} title="Edit">
              {EDIT_ICON}
            </button>
            {showDelete && (
              <button type="button" className="nx-btn-trash" style={iconBtnStyle}
                onClick={() => handleDelete(record[rowKey])} title="Delete">
                {TRASH_ICON}
              </button>
            )}
          </div>
        );
      },
    };

    return [...processed, actionsColumn];
  }, [
    columns, rowKey, editingKey, editingValues, editMode, showDelete,
    handleEditStart, handleEditCancel, handleEditSave, handleEditChange, handleDelete,
  ]);

  // ── Footer — only rebuilds when row count or loading changes ─────────────
  const footerBar = useMemo(
    () => (
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "-1px",
          borderLeft: `1px solid ${BORDER_COL}`,
          borderRight: `1px solid ${BORDER_COL}`,
          borderBottom: `1px solid ${BORDER_COL}`,
          borderTop: `1px solid ${BORDER_COL}`,
          borderRadius: "0 0 8px 8px",
          background: "#fff",
          padding: "6px 12px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#6B7280" }}>
          Showing {dataSource.length} of {dataSource.length} entries
        </span>
        {!loading && dataSource.length > 0 && (
          <>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
            <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "500" }}>All data showed</span>
          </>
        )}
      </div>
    ),
    [dataSource.length, loading]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div id={idTable}>
      <style>{tableStyles}</style>
      <div style={{ position: "relative" }}>
        <Table
          dataSource={dataSource}
          rowKey={rowKey}
          columns={tableColumns}
          scroll={{ x: "max-content", y: 380 }}
          bordered
          pagination={false}
          size="small"
          loading={loading}
          tableLayout="fixed"
          rowClassName={rowClassName}
          locale={tableLocale}
          style={{ margin: 0 }}
        />
      </div>
      {footerBar}
    </div>
  );
};

export default NxTableInlineEdit;
