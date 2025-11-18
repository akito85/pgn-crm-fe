import { Table, Pagination, Select, Input, Space, Button } from 'antd';
import { SearchOutlined, FilterOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import Highlighter from 'react-highlight-words';

const { Option } = Select;

const NxTable = ({
  dataMain,
  dataExpand,
  columnMain,
  columnExpand,
  childTitle,
  // Pagination props
  pageSize = 10,
  current = 1,
  totalData,
  usePagination = true,
  onChange = () => {},
  onSizeChanger = () => {},
  // Column visibility props
  useSelect = true,
  // Table props
  loading = false,
  onSort = () => {},
  rowSelection,
  onRowClicked = () => {},
  onRowClickedAsync = null, // ← NEW: Async row click handler
  preventRowClickOn = ['button', 'a', 'svg', 'path', '.ant-btn', '.action-button'], // ← NEW: Prevent click on these elements
  tableScrolled,
  className = '',
  idTable,
  // Expand specific props
  defaultExpandedRowKeys = [],
  onExpand = () => {},
  expandedRowKeys,
  expandRowByClick = false,
  // Search/Filter props
  useSearch = false,
  searchPlaceholder = 'Search...',
  onSearch = () => {},
  searchDebounceDelay = 500, // Delay in ms for debounced search
  searchLoading: externalSearchLoading = false, // External loading state
  // Performance props
  virtual = false, // ← NEW: Enable virtualization for large datasets
  virtualHeight = 600, // ← NEW: Virtual scroll container height
  // Styling props
  tablePadding = 'medium', // 'small' | 'medium' | 'large' | custom string (e.g., '12px')
  fontSize = 'medium', // 'small' | 'medium' | 'large' | custom string (e.g., '14px')
  expandPadding = '20px',
  expandGap = '14px',
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [internalSearchLoading, setInternalSearchLoading] = useState(false);

  // Column search state (internal)
  const [searchTextColumn, setSearchTextColumn] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [loadingRows, setLoadingRows] = useState(new Set()); // ← NEW: Track loading state per row

  // NEW: Smart row click handler that prevents clicks on action buttons
  const handleRowClick = async (record, rowIndex, event) => {
    // Check if click originated from a prevented element
    const target = event.target;
    const shouldPrevent = preventRowClickOn.some((selector) => {
      if (selector.startsWith('.')) {
        // Class selector
        return target.closest(selector) !== null;
      } else {
        // Tag name
        return target.tagName.toLowerCase() === selector.toLowerCase() ||
               target.closest(selector) !== null;
      }
    });

    if (shouldPrevent) {
      // Click was on a button/action - don't trigger row click
      return;
    }

    // Handle async row click
    if (onRowClickedAsync) {
      const rowKey = record.key || record.id;
      setLoadingRows(prev => new Set(prev).add(rowKey));

      try {
        await onRowClickedAsync(record, rowIndex, event);
      } catch (error) {
        console.error('Row click async error:', error);
      } finally {
        setLoadingRows(prev => {
          const newSet = new Set(prev);
          newSet.delete(rowKey);
          return newSet;
        });
      }
    } else {
      // Fallback to sync handler
      onRowClicked(record, rowIndex, event);
    }
  };

  // Debounced search implementation
  useEffect(() => {
    if (!useSearch) return;

    const handler = setTimeout(async () => {
      setInternalSearchLoading(true);
      try {
        const result = onSearch(searchText);
        // Check if onSearch returns a Promise (async function)
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setInternalSearchLoading(false);
      }
    }, searchDebounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText, searchDebounceDelay, onSearch, useSearch]);

  // Internal column search handler
  const handleColumnSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextColumn(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Internal column search reset
  const handleColumnReset = (clearFilters) => {
    clearFilters();
    setSearchTextColumn('');
  };

  // Internal getColumnSearchProps implementation
  const getColumnSearchPropsInternal = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleColumnSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
            borderRadius: '6px',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleColumnSearch(selectedKeys, confirm, dataIndex)}
            // icon={<FilterOutlined />}
            size="small"
            style={{
              width: 90,
            }}
            className="text-center justify-center items-center"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleColumnReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
            className="text-center justify-center items-center"
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchTextColumn]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // Utility to get padding value
  const getPaddingValue = (padding) => {
    const paddingMap = {
      small: '8px 12px',
      medium: '12px 16px',
      large: '16px 24px',
    };
    return paddingMap[padding] || padding;
  };

  // Utility to get font size value
  const getFontSizeValue = (size) => {
    const sizeMap = {
      small: '12px',
      medium: '14px',
      large: '16px',
    };
    return sizeMap[size] || size;
  };

  const tablePaddingValue = getPaddingValue(tablePadding);
  const fontSizeValue = getFontSizeValue(fontSize);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // Don't call onSearch here - the useEffect hook will handle it with debounce
  };

  const filterColumns = () => {
    return columnMain
      .filter((col) => {
        return !optionSelectedCol.includes(col.title);
      })
      .map((col) => {
        // Apply internal search props if column has filter: true
        if (col.filter) {
          const { filter, render, ...restCol } = col;
          const searchProps = getColumnSearchPropsInternal(col.dataIndex || col.key);

          // Preserve custom render if it exists, otherwise use search render
          return {
            ...restCol,
            ...searchProps,
            render: render || searchProps.render,
          };
        }
        return col;
      });
  };

  const filterExpandColumns = () => {
    if (!columnExpand) return [];

    return columnExpand.map((col) => {
      // Apply internal search props if column has filter: true
      if (col.filter) {
        const { filter, render, ...restCol } = col;
        const searchProps = getColumnSearchPropsInternal(col.dataIndex || col.key);

        // Preserve custom render if it exists, otherwise use search render
        return {
          ...restCol,
          ...searchProps,
          render: render || searchProps.render,
        };
      }
      return col;
    });
  };

  // Render the expanded row content
  const expandedRowRender = (record) => {
    // Filter expand data for this specific row
    const expandData = Array.isArray(dataExpand)
      ? dataExpand.filter((item) => item.parentKey === record.key)
      : dataExpand[record.key] || [];

    return (
      <div
        className="nx-expand-content"
        style={{
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <div
          className="nx-expand-inner"
          style={{
            padding: expandPadding,
            display: 'flex',
            flexDirection: 'column',
            gap: expandGap,
          }}
        >
          {/* Header for expanded section */}
          <div className="nx-expand-title self-stretch justify-start text-sky-600 text-sm font-bold">
            {childTitle}
          </div>

          {/* Nested table */}
          <div
            className="nx-expand-table"
            style={{
              backgroundColor: 'white',
              display: 'inline-flex',
              borderLeft: '0.5px solid #d4d4d8',
              borderRight: '0.5px solid #d4d4d8',
              borderBottom: '0.5px solid #d4d4d8',
            }}
          >
            <Table
              columns={filterExpandColumns()}
              dataSource={expandData}
              pagination={false}
              size="small"
              style={{ width: '100%', fontSize: fontSizeValue }}
              showHeader={true}
            />
          </div>
        </div>
      </div>
    );
  };

  // Custom expand icon with animation
  const expandIcon = ({ expanded, onExpand, record }) => (
    <div
      onClick={(e) => onExpand(record, e)}
      className="nx-expand-icon"
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: expanded ? 'rotate(0deg)' : 'rotate(0deg)',
      }}
    >
      {expanded ? (
        // Collapse icon (minus in square with cross)
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          className="nx-icon-svg"
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <rect x="3" y="3" width="18" height="18" stroke="black" strokeWidth="1.5" />
          <line x1="7" y1="12" x2="17" y2="12" stroke="black" strokeWidth="1.5" />
          <line x1="12" y1="7" x2="12" y2="17" stroke="black" strokeWidth="1.5" />
        </svg>
      ) : (
        // Expand icon (plus in square)
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          className="nx-icon-svg"
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <rect x="3" y="3" width="18" height="18" stroke="black" strokeWidth="1.5" />
          <line x1="7" y1="12" x2="17" y2="12" stroke="black" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-full nx-table-container">
      {/* Top Controls: Column Selector, Search, Pagination */}
      {(useSelect || useSearch || usePagination) && (
        <div className="nx-controls-wrapper w-full flex mb-5 gap-2 justify-between items-center flex-wrap">
          {/* Left side: Column selector and Search */}
          <div className="nx-controls-left flex gap-2 flex-1 min-w-0">
            {useSelect && (
              <Select
                mode="multiple"
                placeholder="Show All Column"
                className="nx-column-select w-full max-w-xs"
                maxTagCount={3}
                onChange={handleDisplayColumn}
                value={optionSelectedCol}
              >
                {columnMain
                  .map((col) => (
                    <Option
                      key={col.title}
                      value={col.title}
                      disabled={
                        optionSelectedCol.length > 3
                          ? optionSelectedCol.includes(col.title)
                            ? false
                            : true
                          : false
                      }
                    >
                      {col.title}
                    </Option>
                  ))
                  .slice(1)}
              </Select>
            )}

            {useSearch && (
              <Input
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined />}
                suffix={
                  (internalSearchLoading || externalSearchLoading) && (
                    <LoadingOutlined style={{ color: '#1890ff' }} />
                  )
                }
                className="nx-search-input w-full max-w-sm"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
                style={{
                  borderRadius: '6px',
                }}
              />
            )}
          </div>

          {/* Right side: Pagination */}
          {usePagination && (
            <Pagination
              total={totalData}
              className="nx-pagination pr-1"
              showSizeChanger
              current={current}
              pageSize={pageSize}
              onChange={onChange}
              onShowSizeChange={onSizeChanger}
              showTotal={(total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`
              }
            />
          )}
        </div>
      )}

      {/* Main Table with Expandable Rows */}
      <div
        style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        className={`table-expand-wrapper nx-main-table ${className}`}
      >
        <Table
          dataSource={dataMain}
          columns={filterColumns()}
          expandable={{
            expandedRowRender,
            expandIcon,
            defaultExpandedRowKeys,
            expandedRowKeys,
            onExpand: (expanded, record) => {
              onExpand(expanded, record);
            },
            expandRowByClick,
          }}
          pagination={false}
          // bordered
          loading={loading}
          tableLayout="fixed"
          id={idTable}
          onChange={(pagination, filters, sorter, extra) => {
            onChange(pagination, filters, sorter, extra);
            onSort(pagination, filters, sorter, extra);
          }}
          rowSelection={rowSelection}
          scroll={tableScrolled || { x: 'max-content' }}
          onRow={(record, rowIndex) => {
            const rowKey = record.key || record.id;
            const isLoading = loadingRows.has(rowKey);

            return {
              onClick: (event) => {
                handleRowClick(record, rowIndex, event);
              },
              style: {
                cursor: isLoading ? 'wait' : (onRowClicked || onRowClickedAsync ? 'pointer' : 'default'),
                opacity: isLoading ? 0.6 : 1,
              },
            };
          }}
          style={{ width: '100%', fontSize: fontSizeValue }}
        />
      </div>
    </div>
  );
};

export default NxTable;
