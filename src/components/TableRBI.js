// TableRBI.js (with resizable columns + grouped columns support + customHeaderLeft + showExport control)
import React, { useMemo, useState, useCallback } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
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
  useInfiniteScroll = false,
  onLoadMore = () => {},
  hasMore = false,
  loadMoreThreshold = 20,
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
  showRefresh = false,
  onRefresh,
  refreshLabel,
  refreshIcon,
  enableRowClick = false,
  selectedRowKey = null,
  onRowClick = () => {},
  onSearch = () => {},
  tableSize = "default",
  summary,
  rowKey,
}) => {
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
  const lastScrollTopRef = React.useRef(0);

  const tableRef = React.useRef(null);
  const containerRef = React.useRef(null);

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
    if (columns && columns.length > 0 && columnOrder.length === 0) {
      const initialOrder = getAllColumnKeys(columns);
      setColumnOrder(initialOrder);
    }
  }, [columns, columnOrder.length, getAllColumnKeys]);

  // Apply border-radius to table
  React.useLayoutEffect(() => {
    if (!containerRef.current) return;
    const antTable = containerRef.current.querySelector(
      `#${idTable} .ant-table`,
    );
    const antTableContainer = containerRef.current.querySelector(
      `#${idTable} .ant-table-container`,
    );
    // Apply border-radius only to top corners if footer exists, otherwise all corners
    const radius = usePagination || useInfiniteScroll ? "8px 8px 0 0" : "8px";
    if (antTable)
      antTable.style.setProperty("border-radius", radius, "important");
    if (antTableContainer)
      antTableContainer.style.setProperty("border-radius", radius, "important");
  }, [idTable, usePagination, useInfiniteScroll]);

  // Infinite scroll handler
  React.useEffect(() => {
    if (!useInfiniteScroll || !hasMore) return;

    const handleScroll = (e) => {
      const target = e.target;
      if (!target) return;

      const scrollTop = target.scrollTop;

      // Prevent horizontal scroll from triggering fetch
      if (scrollTop === lastScrollTopRef.current) return;
      lastScrollTopRef.current = scrollTop;

      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const pixelThreshold = loadMoreThreshold * 40;

      if (distanceFromBottom < pixelThreshold && !isLoadingMore && !loading) {
        setIsLoadingMore(true);
        onLoadMore().finally(() => {
          setIsLoadingMore(false);
        });
      }
    };

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
    [],
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
    [draggedColumnKey],
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
          children: col.children.map((childCol) =>
            processColumn(childCol, fixedPos),
          ),
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
            padding: tableSize === "small" ? "2px 4px" : "4px 8px",
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
        onCell: (record, rowIndex) => {
          const original = col.onCell ? col.onCell(record, rowIndex) : {};
          return {
            ...original,
            style: {
              ...original.style,
              textAlign: textAlign,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "11px",
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
      tableSize,
    ],
  );

  const displayedColumns = useMemo(() => {
    const cols = (columns || []).map((c) => ({
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

    // Separate into left, normal, right while preserving the exact order
    // declared in fixedColumns.left and fixedColumns.right arrays.
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    const visibleMap = new Map(visible.map((c) => [c.key, c]));

    // Preserve left order based on fixedColumns.left
    if (Array.isArray(fixedColumns.left)) {
      fixedColumns.left.forEach((key) => {
        if (visibleMap.has(key)) {
          leftFixed.push(visibleMap.get(key));
          visibleMap.delete(key);
        }
      });
    }

    // Collect remaining visible columns into normal/right based on their fixed prop
    const autoRightFixed = [];
    for (const col of visibleMap.values()) {
      const isExplicitRightFixed =
        Array.isArray(fixedColumns.right) &&
        fixedColumns.right.includes(col.key);

      if (isExplicitRightFixed) {
        // skip here; right will be ordered explicitly below
        continue;
      }

      if (col.fixed === "right") {
        // keep right-fixed columns declared directly in column config
        autoRightFixed.push(col);
        continue;
      }

      normal.push(col);
    }

    // Preserve right order based on fixedColumns.right
    if (Array.isArray(fixedColumns.right)) {
      fixedColumns.right.forEach((key) => {
        // prefer columns that are remaining in visibleMap (not already in leftFixed)
        const col = visible.find((c) => c.key === key);
        if (col) {
          rightFixed.push(col);
        }
      });
    }

    // Append right-fixed columns defined by `col.fixed = "right"` that are not
    // listed in fixedColumns.right.
    rightFixed.push(...autoRightFixed);

    const finalCols = [
      ...leftFixed.map((c) => processColumn(c, "left")),
      ...normal.map((c) => processColumn(c, undefined)),
      ...rightFixed.map((c) => processColumn(c, "right")),
    ];

    return finalCols;
  }, [columns, optionSelectedCol, fixedColumns, columnOrder, processColumn]);

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
    [onRowClick],
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
    [onRow, enableRowClick, handleRowClick],
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
    [rowClassName, enableRowClick, clickedRowKey],
  );

  return (
    <div ref={containerRef} className={"flex flex-col w-full"}>
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

        /* Table shape & borders */
        #${idTable} .ant-table {
          border-radius: 8px 8px 0 0 !important;
          overflow: hidden !important;
          border: none !important;
          border-collapse: collapse;
          border-spacing: 0;
        }

        #${idTable} .ant-table-container {
          border-radius: 8px 8px 0 0 !important;
          overflow: hidden !important;
          border: none !important;
        }

        #${idTable} .ant-table-container table > thead > tr:first-child > *:first-child {
          border-start-start-radius: 8px !important;
          border-left: 1px solid #C8CDD4 !important;
        }

        #${idTable} .ant-table-container table > thead > tr:first-child > *:last-child {
          border-start-end-radius: 8px !important;
          border-right: 1px solid #C8CDD4 !important;
        }

        /* Header borders */
        #${idTable} .ant-table-thead > tr > th {
          position: relative;
          z-index: 4;
          background-color: #2C6FAD !important;
          color: white !important;
          border-right: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-bottom: 1px solid #C8CDD4 !important;
          border-top: 1px solid #C8CDD4 !important;
        }

        #${idTable} .ant-table-thead > tr > th .ant-table-column-sorter {
          color: white !important;
        }

        #${idTable} .ant-table-thead > tr > th .ant-table-filter-trigger {
          color: white !important;
        }

        /* Cell borders */
        #${idTable} .ant-table-tbody > tr > td {
          border-right: 1px solid #C8CDD4 !important;
          border-bottom: 1px solid #C8CDD4 !important;
        }

        #${idTable} .ant-table-tbody > tr > td:first-child {
          border-left: 1px solid #C8CDD4 !important;
        }

        #${idTable} .ant-table-tbody > tr > td:last-child {
          border-right: 1px solid #C8CDD4 !important;
        }

        #${idTable} .ant-table-thead .ant-table-cell-fix-left,
        #${idTable} .ant-table-thead .ant-table-cell-fix-right {
          z-index: 5;
          background-color: #2C6FAD !important;
          color: white !important;
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
          padding-bottom: 8px;
        }

        @supports (-moz-appearance:none) {
          #${idTable} .ant-table-body {
            padding-bottom: 12px;
          }

          #${idTable} .ant-table-content {
            padding-bottom: 4px;
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

        /* Fix div expanded row yang menutupi expand icon */
        #${idTable} .ant-table-expanded-row-fixed {
          pointer-events: none !important;
        }

        #${idTable} .ant-table-expanded-row-fixed > * {
          pointer-events: auto !important;
        }

        /* Fix expand icon z-index agar bisa diklik */
        #${idTable} .ant-table-row-expand-icon-cell {
          position: relative;
          z-index: 6;
        }

        #${idTable} .ant-table-tbody > tr > td.ant-table-row-expand-icon-cell {
          position: relative;
          z-index: 6;
        }

        #${idTable} .ant-table-tbody > tr > td.ant-table-row-expand-icon-cell button,
        #${idTable} .ant-table-tbody > tr > td.ant-table-row-expand-icon-cell .ant-table-row-expand-icon,
        #${idTable} .ant-table-tbody > tr > td.ant-table-row-expand-icon-cell > * {
          position: relative;
          z-index: 7;
          pointer-events: auto !important;
          cursor: pointer !important;
        }

        #${idTable} .ant-table-tbody > tr.ant-table-expanded-row > td {
          position: relative;
          z-index: 1;
        }
      `}
      </style>
      {useSelect ? (
        <div className={"w-full flex mb-3 justify-between items-center"}>
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

            {customHeaderLeft && customHeaderLeft}
          </div>

          {hasRightControls && (
            <div className="flex justify-end gap-2 items-center">
              {showRefresh && (
                <Button
                  icon={
                    refreshIcon || (
                      <ReloadOutlined style={{ fontSize: "14px" }} />
                    )
                  }
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
                  {refreshLabel || "Refresh"}
                </Button>
              )}

              {showAdvanceSearch && (
                <Button
                  onClick={() => setIsAdvanceOpen(true)}
                  className="flex items-center gap-2"
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
                <div style={{ width: "250px" }}>
                  <SearchBar placeholder="Search Content" onChange={onSearch} />
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

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
        size={tableSize}
        summary={summary}
        rowKey={rowKey}
      />

      {useInfiniteScroll ? (
        <div
          style={{
            position: "relative",
            zIndex: "1",
            marginTop: "-1px",
            borderTop: "1px solid #C8CDD4",
            borderLeft: "1px solid #C8CDD4",
            borderRight: "1px solid #C8CDD4",
            borderBottom: "1px solid #C8CDD4",
            borderRadius: "0 0 8px 8px",
            background: "#fff",
            padding: "6px 12px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          <span style={{ fontSize: "12px", color: "#666" }}>
            Showing {dataSource?.length || 0} rows
            {isLoadingMore && " | Loading..."}
            {!hasMore && dataSource?.length > 0 && (
              <span style={{ color: "#52c41a", fontWeight: "500" }}>
                {" "}
                | All data showed
              </span>
            )}
          </span>
        </div>
      ) : usePagination ? (
        <div
          style={{
            position: "relative",
            zIndex: "1",
            marginTop: "-1px",
            borderTop: "1px solid #C8CDD4",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "1px solid #C8CDD4",
            borderRadius: "0 0 8px 8px",
            background: "#fff",
            padding: "6px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
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
            <span style={{ fontSize: "12px", color: "#666" }}>
              Showing {current * pageSize - pageSize + 1} to{" "}
              {Math.min(current * pageSize, totalData)} entries
              <span className="mx-2">•</span>
              <span className="text-[#288C44] font-medium">
                All data showed
              </span>
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
