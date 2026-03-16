// NxTable.js (with resizable columns + grouped columns support + customHeaderLeft + showExport control)
import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Pagination, Select, Spin, Table } from "antd";
import ColumnSettings from "../ColumnSettings/ColumnSettings";
import SearchBar from "../SearchBar";
import NxAdvanceSearch from "./NxAdvanceSearch";

const { Option } = Select;

// Resizable Title Component
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  const isResizingRef = React.useRef(false);

  if (!width) {
    return <th {...restProps} />;
  }

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

            if (hasMoved) {
              isResizingRef.current = true;
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

const NxTable = ({
  idTable,
  dataSource,
  rowKey = (record) => record.id,
  dataMain, // Alias for dataSource (backward compatibility)
  columns = [],
  columnMain, // Alias for columns (backward compatibility)
  pageSize = 10, // Default pagination size
  current = 1, // Default current page
  loading,
  onChange = () => { },
  onSizeChanger = () => { },
  totalData = 0, // Default total
  onDelete,
  rowSelection,
  onRowClicked = () => { },
  tableScrolled = { y: 37.7 },
  expandable,
  className,
  useSelect = true,
  usePagination = true,
  useInfiniteScroll = false,
  onLoadMore = () => { },
  hasMore = false,
  loadMoreThreshold = 20,
  onSort = () => { },
  handleDownload = () => { },
  columnDefinitions,
  fixedColumns = { left: [], right: [] },
  setFixedColumns = () => { },
  onAdvanceSearch = () => { },
  onRow,
  rowClassName,
  customHeaderLeft,
  showExport = false,
  showAdvanceSearch = true,
  showSearchBar = true,
  showRefresh = false,
  onRefresh,
  enableRowClick = false,
  selectedRowKey = null,
  onRowClick = () => { },
  components: externalComponents,
}) => {
  // Resolve aliases for backward compatibility
  const resolvedDataSource = dataSource || dataMain || [];
  const resolvedColumns = columns.length > 0 ? columns : (columnMain || []);
  const resolvedTotalData = totalData || resolvedDataSource.length || 0;

  const resolvedDataSourceWithKeys = useMemo(() => {
    if (!Array.isArray(resolvedDataSource))
      return [];
    else
      return resolvedDataSource.map((item) => ({
        ...item,
        id: item.id || (crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2))
      }))
  }, [resolvedDataSource]);

  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [clickedRowKey, setClickedRowKey] = useState(null);

  const handleRefresh =
    onRefresh ||
    (() => {
      window.location.reload();
    });

  const [columnWidths, setColumnWidths] = useState({});
  const [draggedColumnKey, setDraggedColumnKey] = useState(null);
  const [columnOrder, setColumnOrder] = useState([]);

  const tableRef = React.useRef(null);

  // Fungsi helper untuk mengumpulkan semua keys dari kolom (termasuk children)
  const getAllColumnKeys = useCallback((cols) => {
    const keys = [];
    const traverse = (columns) => {
      columns.forEach((col) => {
        const key = col.key || col.dataIndex || col.title;
        if (key) {
          keys.push(key);
        }
        if (col.children && Array.isArray(col.children)) {
          traverse(col.children);
        }
      });
    };
    traverse(cols);
    return keys;
  }, []);

  // Initialize column order when columns change
  React.useEffect(() => {
    if (resolvedColumns && resolvedColumns.length > 0 && columnOrder.length === 0) {
      const initialOrder = getAllColumnKeys(resolvedColumns);
      setColumnOrder(initialOrder);
    }
  }, [resolvedColumns, columnOrder.length, getAllColumnKeys]);

  // Infinite scroll handler
  React.useEffect(() => {
    if (!useInfiniteScroll || !hasMore) return;

    const handleScroll = (e) => {
      const target = e.target;
      if (!target) return;

      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      // Use smaller multiplier for more responsive triggering
      const pixelThreshold = Math.max(loadMoreThreshold * 20, 50);

      // Only check isLoadingMore to prevent duplicate calls - don't wait for loading state
      if (distanceFromBottom <= pixelThreshold && !isLoadingMore) {
        setIsLoadingMore(true);
        onLoadMore().finally(() => {
          setIsLoadingMore(false);
        });
      }
    };

    const tableBody = document.querySelector(`#${idTable} .ant-table-body`);

    if (tableBody) {
      // Use passive listener for better scroll performance
      tableBody.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        tableBody.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    useInfiniteScroll,
    hasMore,
    isLoadingMore,
    loadMoreThreshold,
    onLoadMore,
    idTable,
  ]);

  // Keyboard arrow navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable;

      if (isTyping) return;

      const tableContainer = document.querySelector(`#${idTable}`);
      if (!tableContainer) return;

      const tableBody = document.querySelector(`#${idTable} .ant-table-body`);
      if (!tableBody) return;

      const scrollAmount = 100;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        tableBody.scrollTo({
          left: tableBody.scrollLeft - scrollAmount,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        tableBody.scrollTo({
          left: tableBody.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [idTable]);

  const handleResize = useCallback(
    (key) => (newWidth) => {
      setColumnWidths((prev) => ({
        ...prev,
        [key]: newWidth,
      }));
    },
    []
  );

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

  // Fungsi rekursif untuk memproses kolom dengan children
  const processColumn = useCallback(
    (col, fixedPos = null) => {
      const colKey = col.key || col.dataIndex || col.title;

      // Jika kolom punya children, proses children secara rekursif
      if (col.children && Array.isArray(col.children)) {
        return {
          ...col,
          key: colKey,
          children: col.children.map((childCol) => processColumn(childCol, fixedPos)),
        };
      }

      // Proses kolom biasa (tanpa children)
      let textAlign = "left";
      if (col.isNumber || col.align === "right") {
        textAlign = "right";
      } else if (col.isClassification) {
        textAlign = "center";
      }

      const isDraggable = !fixedPos && !col.fixed;

      const newCol = {
        ...col,
        key: colKey,
        width: columnWidths[colKey] || col.width || 150,
        align: col.align || textAlign,
        ellipsis: {
          showTitle: true,
        },
        onHeaderCell: (column) => {
          const baseStyle = {
            textTransform: "uppercase",
            fontSize: "10px",
            cursor: isDraggable ? "move" : "default",
          };

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
        onCell: (record, index) => {
          const externalOnCell = col.onCell ? col.onCell(record, index) : {};
          return {
            ...externalOnCell,
            style: {
              textAlign: textAlign,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "11px",
              ...(externalOnCell.style || {}),
            },
          };
        },
      };

      if (fixedPos) {
        newCol.fixed = fixedPos;
      } else if (!col.fixed) {
        delete newCol.fixed;
      }

      return newCol;
    },
    [
      columnWidths,
      handleResize,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleDragEnd,
      draggedColumnKey,
    ]
  );

  const displayedColumns = useMemo(() => {
    const cols = (resolvedColumns || []).map((c) => ({
      ...c,
      key: c.key || c.dataIndex || c.title,
    }));

    // Filter hidden columns (termasuk check di children)
    const filterHidden = (columns) => {
      return columns
        .map((col) => {
          const colKey = col.key || col.dataIndex || col.title;

          // Jika kolom ini hidden, skip
          if (optionSelectedCol.includes(colKey)) {
            return null;
          }

          // Jika punya children, filter children juga
          if (col.children && Array.isArray(col.children)) {
            const filteredChildren = filterHidden(col.children);
            // Jika semua children hidden, hide parent juga
            if (filteredChildren.length === 0) {
              return null;
            }
            return {
              ...col,
              children: filteredChildren,
            };
          }

          return col;
        })
        .filter(Boolean);
    };

    const visible = filterHidden(cols);

    // Apply column order (hanya untuk top-level columns)
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

    const finalCols = [
      ...leftFixed.map((c) => processColumn(c, "left")),
      ...normal.map((c) => processColumn(c, undefined)),
      ...rightFixed.map((c) => processColumn(c, "right")),
    ];

    return finalCols;
  }, [
    resolvedColumns,
    optionSelectedCol,
    fixedColumns,
    columnOrder,
    processColumn,
  ]);

  const handleAdvanceSearch = (searchData) => {
    onAdvanceSearch(searchData);
    setIsAdvanceOpen(false);
  };

  const handleClearFilter = () => {
    onAdvanceSearch(null);
  };

  const components = {
    header: {
      cell: ResizableTitle,
    },
    ...(externalComponents ? {
      body: {
        ...(externalComponents.body || {}),
      },
    } : {}),
  };

  const hasRightControls =
    showExport || showAdvanceSearch || showSearchBar || showRefresh;

  React.useEffect(() => {
    if (selectedRowKey !== null && selectedRowKey !== clickedRowKey) {
      setClickedRowKey(selectedRowKey);
    }
  }, [selectedRowKey, clickedRowKey]);

  const handleRowClick = useCallback(
    (record) => {
      const rowKey = record.key || record.recordId || record.id;
      setClickedRowKey(rowKey);
      onRowClick(record, rowKey);
    },
    [onRowClick]
  );

  const customOnRow = useCallback(
    (record, index) => {
      const baseOnRow = onRow ? onRow(record, index) : {};

      return {
        ...baseOnRow,
        onClick: (event) => {
          if (baseOnRow.onClick) {
            baseOnRow.onClick(event);
          }
          if (enableRowClick) {
            handleRowClick(record);
          }
        },
        style: {
          ...baseOnRow.style,
          cursor: enableRowClick
            ? "pointer"
            : baseOnRow.style?.cursor || "default",
          transition: "background-color 0.2s ease",
        },
      };
    },
    [onRow, enableRowClick, handleRowClick]
  );

  const customRowClassName = useCallback(
    (record, index) => {
      const rowKey = record.key || record.recordId || record.id;
      const isSelected = enableRowClick && clickedRowKey === rowKey;

      const baseClassName =
        typeof rowClassName === "function"
          ? rowClassName(record, index)
          : rowClassName || "";

      return `${baseClassName} ${isSelected ? "row-selected" : ""}`.trim();
    },
    [rowClassName, enableRowClick, clickedRowKey]
  );

  return (
    <div className={"flex flex-col w-full"}>
      <style>
        {`
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

            #${idTable} .ant-table-tbody > tr.row-selected {
              z-index: 2;
            }

            #${idTable} .ant-table-tbody .ant-table-cell-fix-left,
            #${idTable} .ant-table-tbody .ant-table-cell-fix-right {
              z-index: 3;
            }

            #${idTable} .ant-table-tbody > tr:hover .ant-table-cell-fix-left,
            #${idTable} .ant-table-tbody > tr:hover .ant-table-cell-fix-right,
            #${idTable} .ant-table-tbody > tr.row-selected .ant-table-cell-fix-left,
            #${idTable} .ant-table-tbody > tr.row-selected .ant-table-cell-fix-right {
              z-index: 3;
            }

            #${idTable} .ant-table-thead > tr > th {
              position: relative;
              z-index: 4;
            }

            #${idTable} .ant-table-thead .ant-table-cell-fix-left,
            #${idTable} .ant-table-thead .ant-table-cell-fix-right {
              z-index: 5 !important;
            }

            #${idTable} .ant-table-filter-trigger,
            #${idTable} .ant-table-filter-trigger-container,
            #${idTable} .ant-table-column-sorter {
              position: relative;
              z-index: 6;
              pointer-events: auto;
            }

            #${idTable} .ant-table-body::-webkit-scrollbar {
              width: 8px;
              height: 8px;
              z-index: 10;
            }

            #${idTable} .ant-table-body::-webkit-scrollbar-track {
              background: #f1f1f1;
              z-index: 10;
            }

            #${idTable} .ant-table-body::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 6px;
              z-index: 10;
            }

            #${idTable} .ant-table-body::-webkit-scrollbar-thumb:hover {
              background: #555;
            }

            #${idTable} .ant-table-body {
              scrollbar-width: thin;
              scrollbar-color: #888 #f1f1f1;
              padding-bottom: 0;
              ${(useInfiniteScroll || usePagination) ? "border-left: 0.5px solid #C8CDD4; border-right: 0.5px solid #C8CDD4;" : ""}
            }

            @supports (-moz-appearance:none) {
              #${idTable} .ant-table-body {
                padding-bottom: 0;
              }

              #${idTable} .ant-table-content {
                padding-bottom: 0;
              }
            }

            #${idTable} .ant-table-column-sorter,
            #${idTable} .ant-table-filter-trigger,
            #${idTable} .ant-table-column-sorter-up,
            #${idTable} .ant-table-column-sorter-down,
            #${idTable} .ant-table-filter-trigger-container {
              cursor: pointer;
            }

            #${idTable} th[draggable="true"] {
              cursor: move;
            }

            #${idTable} th[draggable="true"] .ant-table-column-sorter,
            #${idTable} th[draggable="true"] .ant-table-filter-trigger,
            #${idTable} th[draggable="true"] .ant-table-column-sorter-up,
            #${idTable} th[draggable="true"] .ant-table-column-sorter-down,
            #${idTable} th[draggable="true"] .ant-table-filter-trigger-container,
            #${idTable} th[draggable="true"] .ant-table-column-sorters {
              cursor: pointer;
            }

            #${idTable} .ant-table-column-sorter {
              margin-left: 4px;
              margin-right: 0px;
            }

            #${idTable} .ant-table-filter-trigger {
              margin-right: 6px;
            }

            #${idTable} .ant-table-column-sorters {
              padding-right: 0px;
            }

            #${idTable} .ant-table {
              border-radius: ${(useInfiniteScroll || usePagination) ? "8px 8px 0 0" : "8px"};
              overflow: hidden;
              border: 1px solid #C8CDD4;
              ${(useInfiniteScroll || usePagination) ? "border-bottom: none;" : ""}
            }

            #${idTable} .ant-table-container {
              border-radius: ${(useInfiniteScroll || usePagination) ? "8px 8px 0 0" : "8px"};
              overflow: hidden;
              border: none;
            }

            #${idTable} .ant-table-container table > thead > tr:first-child > *:first-child {
              border-start-start-radius: 8px;
            }

            #${idTable} .ant-table-container table > thead > tr:first-child > *:last-child {
              border-start-end-radius: 8px;
            }

            #${idTable} .ant-table-bordered .ant-table-cell,
            #${idTable} .ant-table-bordered .ant-table-thead > tr > th,
            #${idTable} .ant-table-bordered .ant-table-tbody > tr > td,
            #${idTable} .ant-table-bordered .ant-table-container {
              border-color: #C8CDD4 !important;
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

            #${idTable} .ant-table-tbody > tr:not(.ant-table-measure-row) > td {
              padding: 4px 8px !important;
              min-height: 30px;
              font-size: 12px;
              border: 0.5px solid #C8CDD4 !important;
            }

            #${idTable} .ant-table-measure-row > td {
              padding: 0 !important;
              height: 0 !important;
              line-height: 0;
              font-size: 0;
              overflow: hidden;
            }
          `}
      </style>
      {useSelect ? (
        <div className={"w-full flex mb-3 justify-between items-center"}>
          <div className="flex items-center gap-4">
            <ColumnSettings
              columns={columnDefinitions || resolvedColumns}
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

              {showSearchBar && (
                <div style={{ width: "200px" }}>
                  <SearchBar />
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      <div style={{ position: "relative" }}>
        <Table
          dataSource={resolvedDataSourceWithKeys}
          rowKey={rowKey}
          columns={displayedColumns}
          components={components}
          scroll={tableScrolled.y === undefined ? {...tableScrolled, y: 380} : tableScrolled}
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
          <div style={{ borderLeft: "1px solid #C8CDD4", borderRight: "1px solid #C8CDD4", borderBottom: "1px solid #C8CDD4", borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px", width: "100%" }}>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>
              Showing {resolvedDataSource?.length || 0} of {resolvedTotalData} entries
              {isLoadingMore && " · Loading..."}
            </span>
            {!hasMore && resolvedDataSource?.length > 0 && (
              <>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
                <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "500" }}>All data showed</span>
              </>
            )}
          </div>
        ) : usePagination ? (
          <div style={{ borderLeft: "1px solid #C8CDD4", borderRight: "1px solid #C8CDD4", borderBottom: "1px solid #C8CDD4", borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                {Math.min(current * pageSize, resolvedTotalData)} of {resolvedTotalData} entries
              </span>
            </div>
            <Pagination
              total={resolvedTotalData}
              current={current}
              pageSize={pageSize}
              onChange={onChange}
              showSizeChanger={false}
              showTotal={false}
              style={{ display: "flex", gap: "3px" }}
              size="small"
            />
          </div>
        ) : (
          <div style={{ borderLeft: "1px solid #C8CDD4", borderRight: "1px solid #C8CDD4", borderBottom: "1px solid #C8CDD4", borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px", width: "100%" }}>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>
              Showing {resolvedDataSource?.length || 0} of {resolvedTotalData} entries
            </span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
            <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "500" }}>All data showed</span>
          </div>
        )}

        {loading && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: (useInfiniteScroll || usePagination) ? "33px" : 0,
            background: "rgba(255, 255, 255, 0.65)",
            zIndex: 10,
            borderRadius: "0 0 8px 8px",
          }} />
        )}
      </div>

      <NxAdvanceSearch
        visible={isAdvanceOpen}
        onClose={() => setIsAdvanceOpen(false)}
        onSearch={handleAdvanceSearch}
        onClear={handleClearFilter}
        columns={columnDefinitions || resolvedColumns}
        modalWidth={600}
      />
    </div>
  );
};

export default NxTable;