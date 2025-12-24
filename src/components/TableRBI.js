// TableRBI.js (with resizable columns + customHeaderLeft + showExport control)
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
  const isResizingRef = React.useRef(false);

  if (!width) {
    return <th {...restProps} />;
  }

  // Block click event if we were just resizing
  const handleClick = (e) => {
    if (isResizingRef.current) {
      e.stopPropagation();
      e.preventDefault();
      isResizingRef.current = false;
    } else if (restProps.onClick) {
      restProps.onClick(e);
    }
  };

  return (
    <th
      {...restProps}
      onClick={handleClick}
      style={{ ...restProps.style, position: "relative" }}
      draggable={restProps.draggable}
      onDragStart={restProps.onDragStart}
      onDragOver={restProps.onDragOver}
      onDrop={restProps.onDrop}
      onDragEnd={restProps.onDragEnd}
    >
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
        onClick={(e) => {
          // Prevent sort when clicking on resize handle
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          isResizingRef.current = false;
          const startX = e.pageX;
          const startWidth = width;
          let hasMoved = false;

          const handleMouseMove = (e) => {
            hasMoved = true;
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

            // Set flag if we actually resized (moved the mouse)
            if (hasMoved) {
              isResizingRef.current = true;
              // Reset flag after a short delay
              setTimeout(() => {
                isResizingRef.current = false;
              }, 100);
            }
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
  useInfiniteScroll = false, // PROPS BARU untuk infinite scroll
  onLoadMore = () => {}, // PROPS BARU callback untuk load more
  hasMore = false, // PROPS BARU indicator apakah masih ada data
  loadMoreThreshold = 20, // PROPS BARU jumlah row dari bawah untuk trigger load more
  onSort = () => {},
  handleDownload = () => {},
  columnDefinitions,
  fixedColumns = { left: [], right: [] },
  setFixedColumns = () => {},
  onAdvanceSearch = () => {},
  onRow,
  rowClassName,
  customHeaderLeft,
  showExport = false, 
  showAdvanceSearch = true, 
  showSearchBar = true, 
  enableRowClick = false, 
  selectedRowKey = null, 
  onRowClick = () => {}, 
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [clickedRowKey, setClickedRowKey] = useState(null);

  // State untuk menyimpan width setiap column
  const [columnWidths, setColumnWidths] = useState({});

  // State untuk drag and drop column reordering
  const [draggedColumnKey, setDraggedColumnKey] = useState(null);
  const [columnOrder, setColumnOrder] = useState([]);

  // Ref untuk table scroll container
  const tableRef = React.useRef(null);

  // Initialize column order when columns change
  React.useEffect(() => {
    if (columns && columns.length > 0 && columnOrder.length === 0) {
      const initialOrder = columns.map((c) => c.key || c.dataIndex || c.title);
      setColumnOrder(initialOrder);
    }
  }, [columns, columnOrder.length]);

  // Infinite scroll handler
  React.useEffect(() => {
    if (!useInfiniteScroll || !hasMore) return;

    const handleScroll = (e) => {
      const target = e.target;
      if (!target) return;

      // Check if we're scrolling in the table body
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Calculate how many pixels from bottom
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // Trigger load more when we're close to bottom
      // Estimate: each row is about 40px, so threshold * 40
      const pixelThreshold = loadMoreThreshold * 40;

      if (distanceFromBottom < pixelThreshold && !isLoadingMore && !loading) {
        setIsLoadingMore(true);
        onLoadMore().finally(() => {
          setIsLoadingMore(false);
        });
      }
    };

    // Find the ant-table-body element
    const tableBody = document.querySelector(`#${idTable} .ant-table-body`);

    if (tableBody) {
      tableBody.addEventListener("scroll", handleScroll);
      return () => {
        tableBody.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    useInfiniteScroll,
    hasMore,
    isLoadingMore,
    loading,
    loadMoreThreshold,
    onLoadMore,
    idTable,
  ]);

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

  // Drag and Drop handlers
  const handleDragStart = useCallback((e, columnKey) => {
    setDraggedColumnKey(columnKey);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    return false;
  }, []);

  const handleDrop = useCallback(
    (e, targetColumnKey) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedColumnKey && draggedColumnKey !== targetColumnKey) {
        setColumnOrder((prevOrder) => {
          const newOrder = [...prevOrder];
          const draggedIndex = newOrder.indexOf(draggedColumnKey);
          const targetIndex = newOrder.indexOf(targetColumnKey);

          if (draggedIndex !== -1 && targetIndex !== -1) {
            // Remove dragged item and insert at target position
            newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, draggedColumnKey);
          }

          return newOrder;
        });
      }

      setDraggedColumnKey(null);
      return false;
    },
    [draggedColumnKey]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedColumnKey(null);
  }, []);

  // Build visible + fixed-applied columns with resizable feature
  const displayedColumns = useMemo(() => {
    const cols = (columns || []).map((c) => ({
      ...c,
      key: c.key || c.dataIndex || c.title,
    }));

    // Filter out hidden columns
    const visible = cols.filter((col) => !optionSelectedCol.includes(col.key));

    // Apply column order if available
    if (columnOrder.length > 0) {
      visible.sort((a, b) => {
        const indexA = columnOrder.indexOf(a.key);
        const indexB = columnOrder.indexOf(b.key);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    // Separate into left, normal, right
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    visible.forEach((col) => {
      // Check if column is fixed from ColumnSettings state OR from column's own fixed property
      const isLeftFixed =
        (Array.isArray(fixedColumns.left) &&
          fixedColumns.left.includes(col.key)) ||
        col.fixed === "left";
      const isRightFixed =
        (Array.isArray(fixedColumns.right) &&
          fixedColumns.right.includes(col.key)) ||
        col.fixed === "right";

      if (isLeftFixed) {
        leftFixed.push(col);
      } else if (isRightFixed) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    // Apply fixed property and resizable width
    const applyColumnProps = (col, fixedPos) => {
      const colKey = col.key || col.dataIndex || col.title;

      // Determine text alignment based on column properties
      let textAlign = "left"; // default: rata kiri
      if (col.isNumber || col.align === "right") {
        textAlign = "right"; // jika isNumber: rata kanan
      } else if (col.isClassification) {
        textAlign = "center"; // jika isClassification: rata tengah
      }

      // Determine if drag and drop should be enabled
      // Not for fixed columns (either by fixedPos parameter or by col.fixed property)
      const isDraggable = !fixedPos && !col.fixed;

      const newCol = {
        ...col,
        width: columnWidths[colKey] || col.width || 150,
        align: textAlign,
        ellipsis: {
          showTitle: true,
        },
        onHeaderCell: (column) => {
          const baseStyle = {
            textTransform: "uppercase",
            fontSize: "10px",
            cursor: isDraggable ? "move" : "default",
          };

          // Only add drag-related styles if column is being dragged
          if (isDraggable && draggedColumnKey === colKey) {
            baseStyle.opacity = 0.5;
            baseStyle.backgroundColor = "#f0f0f0";
          }

          return {
            width: columnWidths[colKey] || col.width || 150,
            onResize: handleResize(colKey),
            style: baseStyle,
            draggable: isDraggable,
            onDragStart: isDraggable
              ? (e) => handleDragStart(e, colKey)
              : undefined,
            onDragOver: isDraggable ? handleDragOver : undefined,
            onDrop: isDraggable ? (e) => handleDrop(e, colKey) : undefined,
            onDragEnd: isDraggable ? handleDragEnd : undefined,
          };
        },
        onCell: () => ({
          style: {
            textAlign: textAlign,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "11px",
          },
        }),
      };
      if (fixedPos) {
        newCol.fixed = fixedPos;
      } else if (!col.fixed) {
        delete newCol.fixed;
      }
      return newCol;
    };

    const finalCols = [
      ...leftFixed.map((c) => applyColumnProps(c, "left")),
      ...normal.map((c) => applyColumnProps(c, undefined)),
      ...rightFixed.map((c) => applyColumnProps(c, "right")),
    ];

    return finalCols;
  }, [
    columns,
    optionSelectedCol,
    fixedColumns,
    columnWidths,
    handleResize,
    columnOrder,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedColumnKey,
  ]);

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

  // Check if any right side controls should be shown
  const hasRightControls = showExport || showAdvanceSearch || showSearchBar;

  // Sync internal state with external selectedRowKey
  React.useEffect(() => {
    if (selectedRowKey !== null && selectedRowKey !== clickedRowKey) {
      setClickedRowKey(selectedRowKey);
    }
  }, [selectedRowKey, clickedRowKey]);

  // Handle row click
  const handleRowClick = useCallback((record) => {
    const rowKey = record.key || record.recordId || record.id;
    setClickedRowKey(rowKey);
    onRowClick(record, rowKey);
  }, [onRowClick]);

  // Custom onRow handler with hover and click effects
  const customOnRow = useCallback((record, index) => {
    const baseOnRow = onRow ? onRow(record, index) : {};

    return {
      ...baseOnRow,
      onClick: (event) => {
        // Call original onClick if exists
        if (baseOnRow.onClick) {
          baseOnRow.onClick(event);
        }
        // Handle row click for highlighting
        if (enableRowClick) {
          handleRowClick(record);
        }
      },
      style: {
        ...baseOnRow.style,
        cursor: enableRowClick ? 'pointer' : (baseOnRow.style?.cursor || 'default'),
        transition: 'background-color 0.2s ease',
      },
    };
  }, [onRow, enableRowClick, handleRowClick]);

  // Custom rowClassName handler
  const customRowClassName = useCallback((record, index) => {
    const rowKey = record.key || record.recordId || record.id;
    const isSelected = enableRowClick && clickedRowKey === rowKey;

    const baseClassName = typeof rowClassName === 'function'
      ? rowClassName(record, index)
      : (rowClassName || '');

    return `${baseClassName} ${isSelected ? 'row-selected' : ''}`.trim();
  }, [rowClassName, enableRowClick, clickedRowKey]);

  return (
    <div className={"flex flex-col w-full"}>
      {useSelect ? (
        <div className={"w-full flex mb-3 justify-between items-center"}>
          {/* BAGIAN KIRI: Column Settings + Custom Header Left */}
          <div className="flex items-center gap-4">
            <ColumnSettings
              columns={columnDefinitions || columns}
              hiddenColumns={optionSelectedCol}
              onHiddenColumnsChange={setOptionSelectedCol}
              fixedColumns={fixedColumns}
              onFixedColumnsChange={setFixedColumns}
              buttonText="Column Settings"
              buttonStyle={{ height: "32px", fontSize: "12px" }}
            />

            {/* Custom Header Left - untuk Approval Hierarchy dropdown */}
            {customHeaderLeft && customHeaderLeft}
          </div>

          {/* BAGIAN KANAN: Export, Advance Search, Search Bar */}
          {hasRightControls && (
            <div className="flex justify-end gap-2">
              {showExport && (
                <Button
                  icon={<DownloadOutlined style={{ fontSize: "14px" }} />}
                  onClick={handleDownload}
                  style={{
                    border: "1px solid #BDBDBD",
                    color: "black",
                    borderRadius: "8px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  Export
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

              {showSearchBar && <SearchBar />}
            </div>
          )}
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
        onRow={customOnRow}
        rowClassName={customRowClassName}
      />

      {useInfiniteScroll ? (
        <div className={"w-full flex justify-end mt-3 items-center"}>
          <span style={{ fontSize: "12px", color: "#666" }}>
            Showing {dataSource?.length || 0} rows
            {isLoadingMore && " | Loading..."}
            {!hasMore && dataSource?.length > 0 && (
              <span style={{ color: "#52c41a", fontWeight: "500" }}>
                {" "}| All data showed
              </span>
            )}
          </span>
        </div>
      ) : usePagination ? (
        <div className={"w-full flex justify-between mt-3 items-center"}>
          <div className="flex items-center gap-3">
            <Select
              value={pageSize}
              onChange={(value) => onSizeChanger(current, value)}
              className="w-15"
              style={{ fontSize: "12px" }}
              size="small"
            >
              {[10, 20, 50, 100].map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
            <span style={{ fontSize: "12px" }}>
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
