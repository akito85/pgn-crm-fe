import React, { useState, useCallback, useEffect, useRef } from "react";
import { Table, Input, InputNumber, Select, Empty } from "antd";

const { Option } = Select;

// ── Shared visual constants (mirrors NxTable / NxTableNested) ──────────────
const HEADER_BG   = "#2C6FAD";
const BORDER_COL  = "#C8CDD4";
const ROW_WHITE   = "#FFFFFF";
const ROW_HOVER   = "#EBF2FA";
const FONT_FAMILY = "'PlusJakartaSans', 'PublicSans', sans-serif";

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.50004 5.8335H5.00004C4.07957 5.8335 3.33337 6.57969 3.33337 7.50016V15.0002C3.33337 15.9206 4.07957 16.6668 5.00004 16.6668H12.5C13.4205 16.6668 14.1667 15.9206 14.1667 15.0002V12.5002" stroke="#1976D2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 12.5H10L17.0833 5.41669C17.7737 4.72634 17.7737 3.60705 17.0833 2.91669C16.393 2.22634 15.2737 2.22634 14.5833 2.91669L7.5 10V12.5" stroke="#1976D2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3334 4.1665L15.8334 6.6665" stroke="#1976D2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33337 5.8335H16.6667" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33337 9.1665V14.1665" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.6667 9.1665V14.1665" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16663 5.8335L5.00004 15.8335C5.00004 16.754 5.74623 17.5002 6.66671 17.5002H13.3334C14.2538 17.5002 15 16.754 15 15.8335L15.8334 5.8335" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 5.8335V3.3335C7.5 2.87326 7.8731 2.50016 8.33333 2.50016H11.6667C12.1269 2.50016 12.5 2.87326 12.5 3.3335V5.8335" stroke="#E53935" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * NxTableInlineEdit
 *
 * Row-level inline edit table with the same look and feel as NxTable.
 *
 * View mode:  [Edit icon] [Delete icon] per row
 * Edit mode:  [Trash icon] [Cancel] [Save] per row
 *
 * Column definition extras:
 *   editable      {boolean}  - enable inline editing for this column
 *   inputType     {string}   - 'text' | 'number' | 'select' (default: 'text')
 *   placeholder   {string}   - placeholder text
 *   selectOptions {Array}    - [{ value, label }] for inputType 'select'
 *   min           {number}   - min value for inputType 'number'
 *   max           {number}   - max value for inputType 'number'
 *   precision     {number}   - decimal precision for inputType 'number'
 *   maxLength     {number}   - max char length for inputType 'text'
 *
 * Props:
 *   idTable           {string}   - unique DOM id for CSS scoping (required)
 *   dataSource        {Array}    - controlled row data
 *   onDataChange      {Function} - (newData) called on Save or Delete
 *   columns           {Array}    - column definitions
 *   rowKey            {string}   - key field name (default: 'key')
 *   loading           {boolean}
 *   showDelete        {boolean}  - show delete button (default: true)
 *   emptyText         {string}   - empty state message
 *   editMode          {string}   - 'full' | 'deleteOnly' (default: 'full')
 *   onAddRow          {Function} - callback to add a new row (optional)
 *   autoEditOnAppend  {boolean}  - auto-enter edit mode when a row is appended
 *                                  (default: true). Set to false when rows are
 *                                  pre-filled externally, e.g. picked from a modal.
 */
const NxTableInlineEdit = ({
  idTable = "nx-table-inline-edit",
  dataSource = [],
  onDataChange,
  columns = [],
  rowKey = "key",
  loading = false,
  showDelete = true,
  emptyText = 'No data. Click Create to add a new row.',
  editMode = 'full',
  onAddRow,
  autoEditOnAppend = true,
}) => {
  const [editingKey, setEditingKey] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [isNewRow, setIsNewRow] = useState(false);
  const prevLengthRef = useRef(dataSource.length);

  // Auto-enter edit mode when a new row is appended (e.g. via "Add" button).
  // Controlled by the autoEditOnAppend prop — set it to false when rows are
  // inserted pre-filled from an external source (modal picker, import, etc.)
  // so they land directly in view/saved mode without opening the editor.
  useEffect(() => {
    const prevLength = prevLengthRef.current;
    prevLengthRef.current = dataSource.length;

    if (autoEditOnAppend && dataSource.length > prevLength) {
      const newRow = dataSource[dataSource.length - 1];
      if (newRow) {
        setEditingKey(newRow[rowKey]);
        setEditingValues({ ...newRow });
        setIsNewRow(true);
      }
    }
  }, [dataSource, rowKey, autoEditOnAppend]);

  const isEditing = (record) => record[rowKey] === editingKey;

  const handleEditStart = useCallback(
    (record) => {
      setEditingKey(record[rowKey]);
      setEditingValues({ ...record });
      setIsNewRow(false);
    },
    [rowKey]
  );

  const handleEditCancel = useCallback(() => {
    if (isNewRow) {
      // New unsaved row — remove it entirely
      const newData = dataSource.filter((row) => row[rowKey] !== editingKey);
      onDataChange?.(newData);
    }
    setEditingKey(null);
    setEditingValues({});
    setIsNewRow(false);
  }, [isNewRow, dataSource, editingKey, onDataChange, rowKey]);

  const handleEditSave = useCallback(() => {
    const newData = dataSource.map((row) =>
      row[rowKey] === editingKey ? { ...row, ...editingValues } : row
    );
    onDataChange?.(newData);
    setEditingKey(null);
    setEditingValues({});
  }, [dataSource, editingKey, editingValues, onDataChange, rowKey]);

  const handleEditChange = useCallback((field, value) => {
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDelete = useCallback(
    (recordKey) => {
      const newData = dataSource.filter((row) => row[rowKey] !== recordKey);
      onDataChange?.(newData);
      if (editingKey === recordKey) {
        setEditingKey(null);
        setEditingValues({});
      }
    },
    [dataSource, editingKey, onDataChange, rowKey]
  );

  const renderCell = (col, text, record, index) => {
    const editing = isEditing(record);

    if (!col.editable || !editing) {
      return col.render ? col.render(text, record, index) : (text ?? "—");
    }

    const value = editingValues[col.dataIndex];

    // Wrap in a div so top/bottom padding is part of the content flow,
    // not the td box — guarantees visible vertical spacing.
    if (col.inputType === "select") {
      return (
        <div style={{ padding: "4px 0" }}>
          <Select
            value={value || undefined}
            placeholder={col.placeholder || `Select ${col.title}`}
            onChange={(v) => handleEditChange(col.dataIndex, v)}
            style={{ width: "100%", height: "34px", fontFamily: FONT_FAMILY }}
          >
            {(col.selectOptions || []).map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
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
  };

  const processedColumns = columns.map((col) => {
    let textAlign = "left";
    if (col.isNumber || col.align === "right") {
      textAlign = "right";
    } else if (col.isClassification) {
      textAlign = "center";
    }

    return {
      ...col,
      key: col.key || col.dataIndex,
      onHeaderCell: (column) => ({
        style: {
          textTransform: "uppercase",
          fontSize: "10px",
          cursor: "default",
        },
      }),
      onCell: (record, index) => {
        return {
          style: {
            textAlign: textAlign,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "12px",
          },
        };
      },
      render: (text, record, index) => renderCell(col, text, record, index),
    };
  });

  const actionsColumn = {
    title: "",
    key: "__actions__",
    width: 140,
    onHeaderCell: (column) => ({
      style: {
        textTransform: "uppercase",
        fontSize: "10px",
        cursor: "default",
      },
    }),
    onCell: (record, index) => {
      return {
        style: {
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "12px",
          padding: "4px 8px",
        },
      };
    },
    render: (_, record) => {
      const editing = isEditing(record);

      if (editing) {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
            {showDelete && (
              <button
                type="button"
                onClick={() => handleDelete(record[rowKey])}
                title="Delete"
                style={iconBtnStyle}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <TrashIcon />
              </button>
            )}
            <button type="button" onClick={handleEditCancel} style={cancelBtnStyle}>
              Cancel
            </button>
            <button type="button" onClick={handleEditSave} style={saveBtnStyle}>
              Save
            </button>
          </div>
        );
      }

      // If editMode is 'deleteOnly', only show delete button
      if (editMode === 'deleteOnly') {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
            {showDelete && (
              <button
                type="button"
                onClick={() => handleDelete(record[rowKey])}
                title="Delete"
                style={iconBtnStyle}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <TrashIcon />
              </button>
            )}
          </div>
        );
      }

      // Default behavior - show both edit and delete buttons
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => handleEditStart(record)}
            title="Edit"
            style={iconBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e3f2fd")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <EditIcon />
          </button>
          {showDelete && (
            <button
              type="button"
              onClick={() => handleDelete(record[rowKey])}
              title="Delete"
              style={iconBtnStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      );
    },
  };

  return (
    <div id={idTable}>
      <style>{`
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

        #${idTable} .ant-table-thead > tr > th:first-child {
          border-left: 1px solid ${BORDER_COL} !important;
        }

        #${idTable} .ant-table-tbody > tr.nx-row-editing > td {
          padding: 0 8px !important;
        }

        #${idTable} .ant-table-tbody > tr:nth-child(odd) > td {
          background-color: ${ROW_WHITE} !important;
        }

        #${idTable} .ant-table-tbody > tr:nth-child(even) > td {
          background-color: ${ROW_HOVER} !important;
        }

        #${idTable} .ant-table-tbody > tr:hover > td {
          background-color: ${ROW_HOVER} !important;
        }

        #${idTable} .ant-table-tbody > tr.nx-row-editing:hover > td {
          background-color: ${ROW_WHITE} !important;
        }

        /* Empty state: match the table body background so it blends in */
        #${idTable} .ant-table-placeholder > td {
          background-color: ${ROW_WHITE} !important;
          border-left: 1px solid ${BORDER_COL} !important;
          border-right: 1px solid ${BORDER_COL} !important;
          border-bottom: 1px solid ${BORDER_COL} !important;
        }

        #${idTable} .ant-table-placeholder:hover > td {
          background-color: ${ROW_WHITE} !important;
        }

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

        #${idTable} .ant-table-measure-row > td {
          padding: 0 !important;
          height: 0 !important;
          line-height: 0;
          font-size: 0;
          overflow: hidden;
        }
      `}</style>
      <Table
        dataSource={dataSource}
        rowKey={rowKey}
        columns={[...processedColumns, actionsColumn]}
        scroll={{ y: 380 }}
        bordered
        pagination={false}
        size="small"
        loading={loading}
        locale={{
          emptyText: (
            <div style={{ padding: "20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: "12px" }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ fontFamily: FONT_FAMILY, fontSize: "12px", color: "#999" }}>{emptyText}</span>}
              />
            </div>
          ),
        }}
        style={{ margin: 0 }}
        tableLayout="fixed"
        rowClassName={(record) => isEditing(record) ? "nx-row-editing" : ""}
      />
      <div style={{ position: "relative", zIndex: "1", marginTop: "-1px", borderLeft: `1px solid ${BORDER_COL}`, borderRight: `1px solid ${BORDER_COL}`, borderBottom: `1px solid ${BORDER_COL}`, borderTop: `1px solid ${BORDER_COL}`, borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px", width: "100%" }}>
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
    </div>
  );
};

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

export default NxTableInlineEdit;
