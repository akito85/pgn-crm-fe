// TableRBI.js (with resizable columns)
import React, { useMemo, useState, useCallback } from "react";
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Pagination, Select, Table } from "antd";
import ColumnSettings from "./ColumnSettings/ColumnSettings";
import SearchBar from "./SearchBar";
import AdvanceSearch from "./AdvanceSearch";

const { Option } = Select;

// Resizable Title Component
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <th {...restProps} style={{ ...restProps.style, position: "relative" }}>
      {restProps.children}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "10px",
          cursor: "col-resize",
          userSelect: "none",
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.pageX;
          const startWidth = width;

          const handleMouseMove = (e) => {
            const newWidth = startWidth + (e.pageX - startX);
            if (newWidth > 50) {
              onResize(newWidth);
            }
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "default";
            document.body.style.userSelect = "auto";
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderRight = "2px solid #1890ff";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderRight = "none";
        }}
      />
    </th>
  );
};

const TableRBI = ({
  idTable,
  dataSource,
  columns = [],
  pageSize,
  current,
  loading,
  onChange = () => {},
  onSizeChanger = () => {},
  totalData,
  onDelete,
  rowSelection,
  onRowClicked = () => {},
  tableScrolled,
  expandable,
  className,
  useSelect = true,
  usePagination = true,
  onSort = () => {},
  handleDownload = () => {},
  columnDefinitions,
  fixedColumns = { left: [], right: [] },
  setFixedColumns = () => {},
  onAdvanceSearch = () => {},
  onRow,
  rowClassName,
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);

  // State untuk menyimpan width setiap column
  const [columnWidths, setColumnWidths] = useState({});

  // Handler untuk resize column
  const handleResize = useCallback(
    (key) => (newWidth) => {
      setColumnWidths((prev) => ({
        ...prev,
        [key]: newWidth,
      }));
    },
    []
  );

  // Build visible + fixed-applied columns with resizable feature
  const displayedColumns = useMemo(() => {
    const cols = (columns || []).map((c) => ({
      ...c,
      key: c.key || c.dataIndex || c.title,
    }));

    // Filter out hidden columns
    const visible = cols.filter((col) => !optionSelectedCol.includes(col.key));

    // Separate into left, normal, right
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    visible.forEach((col) => {
      if (
        Array.isArray(fixedColumns.left) &&
        fixedColumns.left.includes(col.key)
      ) {
        leftFixed.push(col);
      } else if (
        Array.isArray(fixedColumns.right) &&
        fixedColumns.right.includes(col.key)
      ) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    // Apply fixed property and resizable width
    const applyColumnProps = (col, fixedPos) => {
      const colKey = col.key || col.dataIndex || col.title;
      const newCol = {
        ...col,
        width: columnWidths[colKey] || col.width || 150,
        align: "center",
        ellipsis: {
          showTitle: true,
        },
        onHeaderCell: (column) => ({
          width: columnWidths[colKey] || col.width || 150,
          onResize: handleResize(colKey),
        }),
        onCell: () => ({
          style: {
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }),
      };
      if (fixedPos) newCol.fixed = fixedPos;
      else delete newCol.fixed;
      return newCol;
    };

    const finalCols = [
      ...leftFixed.map((c) => applyColumnProps(c, "left")),
      ...normal.map((c) => applyColumnProps(c, undefined)),
      ...rightFixed.map((c) => applyColumnProps(c, "right")),
    ];

    return finalCols;
  }, [columns, optionSelectedCol, fixedColumns, columnWidths, handleResize]);

  const handleAdvanceSearch = (searchData) => {
    onAdvanceSearch(searchData);
    setIsAdvanceOpen(false);
  };

  const handleClearFilter = () => {
    onAdvanceSearch(null);
  };

  // Components untuk Ant Design Table
  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  return (
    <div className={"flex flex-col w-full"}>
      {useSelect ? (
        <div className={"w-full flex mb-5 justify-between items-center"}>
          <ColumnSettings
            columns={columnDefinitions || columns}
            hiddenColumns={optionSelectedCol}
            onHiddenColumnsChange={setOptionSelectedCol}
            fixedColumns={fixedColumns}
            onFixedColumnsChange={setFixedColumns}
            buttonText="Column Settings"
            buttonStyle={{ height: "40px" }}
          />

          <div className="w-full flex justify-end gap-2">
            <Button
              icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
              onClick={handleDownload}
              style={{
                border: "1px solid #BDBDBD",
                color: "black",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              Export
            </Button>

            <Button
              onClick={() => setIsAdvanceOpen(true)}
              style={{
                border: "1px solid #BDBDBD",
                color: "black",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              <FilterOutlined style={{ fontSize: "20px" }} />
              Advance Search
            </Button>

            <SearchBar />
          </div>
        </div>
      ) : null}

      {/* Table with Resizable Columns */}
      <Table
        dataSource={dataSource}
        columns={displayedColumns}
        components={components}
        scroll={tableScrolled}
        bordered
        pagination={false}
        className={`w-full ${className}`}
        loading={loading}
        tableLayout="fixed"
        expandable={expandable}
        id={idTable}
        onChange={onSort}
        rowSelection={rowSelection}
        onRow={onRow}
        rowClassName={rowClassName} 
      />

      {usePagination ? (
        <div className={"w-full flex justify-between mt-5 items-center"}>
          <div className="flex items-center gap-3">
            <Select
              value={pageSize}
              onChange={(value) => onSizeChanger(current, value)}
              className="w-20"
              size="small"
            >
              {[10, 20, 50, 100].map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
            <span>
              Showing {(current - 1) * pageSize + 1} to{" "}
              {Math.min(current * pageSize, totalData)} of {totalData} entries
            </span>
          </div>
          <Pagination
            total={totalData}
            current={current}
            pageSize={pageSize}
            onChange={onChange}
            showSizeChanger={false}
            showTotal={false}
            style={{ display: "flex", gap: "3px" }}
            size="small"
          />
        </div>
      ) : null}

      <AdvanceSearch
        visible={isAdvanceOpen}
        onClose={() => setIsAdvanceOpen(false)}
        onSearch={handleAdvanceSearch}
        onClear={handleClearFilter}
        columns={columnDefinitions || columns}
        modalWidth={600}
      />
    </div>
  );
};

export default TableRBI;