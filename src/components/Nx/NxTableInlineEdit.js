import React, { useState, useCallback } from "react";
import { Table, Input, InputNumber, Select } from "antd";

const { Option } = Select;

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
 *   idTable       {string}   - unique DOM id for CSS scoping (required)
 *   dataSource    {Array}    - controlled row data
 *   onDataChange  {Function} - (newData) called on Save or Delete
 *   columns       {Array}    - column definitions
 *   rowKey        {string}   - key field name (default: 'key')
 *   loading       {boolean}
 *   showDelete    {boolean}  - show delete button (default: true)
 *   emptyText     {string}   - empty state message
 */
const NxTableInlineEdit = ({
  idTable = "nx-table-inline-edit",
  dataSource = [],
  onDataChange,
  columns = [],
  rowKey = "key",
  loading = false,
  showDelete = true,
  emptyText = 'No data. Click "Add" to create a new row.',
}) => {
  const [editingKey, setEditingKey] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const isEditing = (record) => record[rowKey] === editingKey;

  const handleEditStart = useCallback(
    (record) => {
      setEditingKey(record[rowKey]);
      setEditingValues({ ...record });
    },
    [rowKey]
  );

  const handleEditCancel = useCallback(() => {
    setEditingKey(null);
    setEditingValues({});
  }, []);

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

  const renderCell = (col, text, record) => {
    const editing = isEditing(record);

    if (!col.editable || !editing) {
      return col.render ? col.render(text, record) : (text ?? "—");
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
            style={{ width: "100%", height: "34px" }}
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
            style={{ width: "100%", height: "34px" }}
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
          style={{ height: "34px", padding: "4px 8px" }}
        />
      </div>
    );
  };

  const processedColumns = columns.map((col) => ({
    ...col,
    key: col.key || col.dataIndex,
    onHeaderCell: () => ({
      style: { textTransform: "uppercase", fontSize: "10px" },
    }),
    onCell: () => ({
      style: { fontSize: "12px" },
    }),
    render: (text, record) => renderCell(col, text, record),
  }));

  const actionsColumn = {
    title: "",
    key: "__actions__",
    width: 140,
    onHeaderCell: () => ({
      style: { textTransform: "uppercase", fontSize: "10px" },
    }),
    onCell: () => ({
      style: { padding: "4px 8px" },
    }),
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
          border-radius: 8px;
          overflow: hidden;
        }

        #${idTable} .ant-table-container {
          border-radius: 8px;
          overflow: hidden;
          border: none;
        }

        #${idTable} .ant-table-container table > thead > tr:first-child > *:first-child {
          border-start-start-radius: 8px;
        }

        #${idTable} .ant-table-container table > thead > tr:first-child > *:last-child {
          border-start-end-radius: 8px;
        }

        #${idTable} .ant-table-thead {
          border-left: 0.5px solid #C8CDD4;
          border-right: 0.5px solid #C8CDD4;
        }

        #${idTable} .ant-table-thead > tr > th {
          padding: 4px 8px !important;
          height: 30px !important;
          border: 0.5px solid #C8CDD4 !important;
        }

        #${idTable} .ant-table-tbody > tr > td {
          padding: 6px 8px !important;
          font-size: 12px;
          border: 0.5px solid #C8CDD4 !important;
        }

        #${idTable} .ant-table-tbody > tr.nx-row-editing > td {
          padding: 0 8px !important;
        }

        #${idTable} .ant-table-tbody > tr:last-child > td:first-child {
          border-end-start-radius: 8px;
        }

        #${idTable} .ant-table-tbody > tr:last-child > td:last-child {
          border-end-end-radius: 8px;
        }

        #${idTable} .ant-table-tbody > tr:hover > td {
          background-color: #f5f8ff !important;
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
      `}</style>
      <Table
        dataSource={dataSource}
        columns={[...processedColumns, actionsColumn]}
        rowKey={rowKey}
        pagination={false}
        size="small"
        loading={loading}
        locale={{ emptyText }}
        style={{ margin: 0 }}
        rowClassName={(record) => isEditing(record) ? "nx-row-editing" : ""}
      />
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
  border: "1px solid #C8CDD4",
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
