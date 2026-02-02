import { Table } from 'antd';
import { useState } from 'react';

/**
 * NxTableBase - A simplified, reliable table component built on Ant Design
 *
 * Features:
 * - Multiple fixed columns support (left/right)
 * - Bordered table with configurable padding
 * - Built-in checkbox selection via column definition
 * - Automatic width calculation for proper fixed column positioning
 *
 * Key differences from NxTable:
 * - No custom component overrides (uses Ant Design defaults)
 * - Simpler implementation focusing on core functionality
 * - Better fixed column handling out of the box
 */
const NxTableBase = ({
  // Data props
  dataSource,
  columns,
  rowKey = 'key',

  // Pagination props
  pagination = false,

  // Table props
  loading = false,
  bordered = true,
  tableLayout = 'fixed',
  scroll,

  // Selection props
  useCheckbox = false,
  selectedRowKeys: controlledSelectedKeys,
  onSelectionChange = () => {},
  checkboxFixed = 'left',
  checkboxColumnWidth = 50,
  preserveSelectedRowKeys = false,
  getCheckboxProps = () => ({}),

  // Styling props
  padding = '6px 8px',
  headerBackgroundColor = '#0075BF',
  headerTextColor = '#ffffff',
  stripedRows = true,
  rowOddColor = '#E6F1F9',
  rowEvenColor = '#ffffff',
  hoverColor = '#fafafa',

  // Event handlers
  onChange = () => {},
  onRow = () => {},

  // Other Ant Design Table props
  ...restTableProps
}) => {
  // Explicitly exclude expandable to prevent empty row issues
  // NxTableBase does not support expandable rows - use TablePagination or NxTable instead
  const { expandable: _excluded, ...safeTableProps } = restTableProps;

  // Warn if expandable prop was passed
  if (_excluded !== undefined) {
    console.warn(
      '[NxTableBase] expandable prop is not supported in NxTableBase. ' +
      'This component was designed without expandable rows to avoid empty row issues. ' +
      'Please use TablePagination or NxTable if you need expandable functionality.'
    );
  }

  // Internal state for checkbox selection
  const [internalSelectedKeys, setInternalSelectedKeys] = useState([]);

  // Use controlled keys if provided, otherwise use internal state
  const selectedKeys = controlledSelectedKeys !== undefined
    ? controlledSelectedKeys
    : internalSelectedKeys;

  // Helper to get row key value
  const getRowKeyValue = (record) => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || record.key || record.id;
  };

  // Process columns to ensure proper widths for fixed columns
  const processedColumns = columns.map(col => {
    // For fixed columns without width, warn and set default
    if (col.fixed && !col.width) {
      console.warn(
        `[NxTableBase] Column "${col.title || col.dataIndex || col.key}" ` +
        `has fixed="${col.fixed}" but no width specified. ` +
        `Fixed columns MUST have explicit widths for proper positioning.`
      );
      return { ...col, width: 150 };
    }
    return col;
  });

  // Calculate total width for scroll.x
  // This is CRITICAL for multiple fixed columns to position correctly
  const calculateTotalWidth = () => {
    if (scroll?.x) return scroll.x; // Use provided scroll.x if exists

    let total = 0;

    // Add checkbox column width if enabled
    if (useCheckbox) {
      total += checkboxColumnWidth;
    }

    // Add all column widths
    processedColumns.forEach(col => {
      total += col.width || 150; // Default 150px if no width
    });

    // Add small buffer for borders (2px per column)
    total += processedColumns.length * 2;

    return total;
  };

  // Checkbox selection configuration
  const rowSelection = useCheckbox ? {
    type: 'checkbox',
    selectedRowKeys: selectedKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      if (controlledSelectedKeys === undefined) {
        setInternalSelectedKeys(newSelectedRowKeys);
      }
      onSelectionChange(newSelectedRowKeys, selectedRows);
    },
    fixed: checkboxFixed,
    columnWidth: checkboxColumnWidth,
    preserveSelectedRowKeys,
    getCheckboxProps: (record) => ({
      ...getCheckboxProps(record),
      'data-row-key': getRowKeyValue(record),
    }),
  } : undefined;

  // Effective scroll configuration
  // When tableLayout='fixed', use numeric scroll.x for proper fixed column positioning
  const effectiveScroll = scroll || (
    tableLayout === 'fixed'
      ? { x: calculateTotalWidth(), y: scroll?.y }
      : { x: 'max-content', y: scroll?.y }
  );

  // Row className for striped pattern
  const getRowClassName = (record, index) => {
    if (!stripedRows) return '';
    return index % 2 === 0 ? 'nx-table-base-row-even' : 'nx-table-base-row-odd';
  };

  return (
    <>
      {/* Scoped styles for this table */}
      <style>{`
        /* Custom padding for all cells */
        .nx-table-base-container .ant-table-thead > tr > th,
        .nx-table-base-container .ant-table-tbody > tr > td {
          padding: ${padding} !important;
        }

        /* Header styling */
        .nx-table-base-container .ant-table-thead > tr > th {
          background-color: ${headerBackgroundColor} !important;
          color: ${headerTextColor} !important;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 0.5px solid #d4d4d8;
        }

        /* Body cell styling */
        .nx-table-base-container .ant-table-tbody > tr > td {
          border-bottom: 0.5px solid #d4d4d8;
        }

        /* Striped rows */
        .nx-table-base-container .ant-table-tbody > tr.nx-table-base-row-odd > td {
          background-color: ${rowOddColor};
        }
        .nx-table-base-container .ant-table-tbody > tr.nx-table-base-row-even > td {
          background-color: ${rowEvenColor};
        }

        /* Hover effect */
        .nx-table-base-container .ant-table-tbody > tr:hover > td {
          background-color: ${hoverColor} !important;
        }

        /* Fixed column specific styling */
        .nx-table-base-container .ant-table-cell-fix-left,
        .nx-table-base-container .ant-table-cell-fix-right {
          position: sticky !important;
          z-index: 2;
          background: inherit;
        }

        .nx-table-base-container .ant-table-thead .ant-table-cell-fix-left,
        .nx-table-base-container .ant-table-thead .ant-table-cell-fix-right {
          z-index: 3;
        }

        /* Maintain stripe colors for fixed columns */
        .nx-table-base-container .ant-table-tbody > tr.nx-table-base-row-odd > td.ant-table-cell-fix-left,
        .nx-table-base-container .ant-table-tbody > tr.nx-table-base-row-odd > td.ant-table-cell-fix-right {
          background-color: ${rowOddColor};
        }

        .nx-table-base-container .ant-table-tbody > tr.nx-table-base-row-even > td.ant-table-cell-fix-left,
        .nx-table-base-container .ant-table-tbody > tr.nx-table-base-row-even > td.ant-table-cell-fix-right {
          background-color: ${rowEvenColor};
        }

        /* Ensure fixed columns maintain background color on hover */
        .nx-table-base-container .ant-table-tbody > tr:hover > td.ant-table-cell-fix-left,
        .nx-table-base-container .ant-table-tbody > tr:hover > td.ant-table-cell-fix-right {
          background-color: ${hoverColor} !important;
        }

        /* Fixed column shadows for visual separation */
        .nx-table-base-container .ant-table-cell-fix-left-last::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: -1px;
          width: 30px;
          transform: translateX(100%);
          transition: box-shadow 0.3s;
          content: '';
          pointer-events: none;
        }

        .nx-table-base-container .ant-table-ping-left .ant-table-cell-fix-left-last::after {
          box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.15);
        }

        .nx-table-base-container .ant-table-cell-fix-right-first::after {
          position: absolute;
          top: 0;
          bottom: -1px;
          left: 0;
          width: 30px;
          transform: translateX(-100%);
          transition: box-shadow 0.3s;
          content: '';
          pointer-events: none;
        }

        .nx-table-base-container .ant-table-ping-right .ant-table-cell-fix-right-first::after {
          box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
        }

        /* Checkbox column styling */
        .nx-table-base-container .ant-table-selection-column {
          text-align: center !important;
          vertical-align: middle !important;
        }

        .nx-table-base-container .ant-table-selection-column .ant-checkbox-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* Hide Ant Design measure row to prevent empty first row */
        .nx-table-base-container .ant-table-measure-row {
          display: none !important;
        }
      `}</style>

      <div className="nx-table-base-container">
        <Table
          dataSource={dataSource}
          columns={processedColumns}
          rowKey={rowKey}
          pagination={pagination}
          loading={loading}
          bordered={bordered}
          tableLayout={tableLayout}
          scroll={effectiveScroll}
          rowSelection={rowSelection}
          onChange={onChange}
          onRow={onRow}
          rowClassName={getRowClassName}
          {...safeTableProps}
        />
      </div>
    </>
  );
};

export default NxTableBase;
