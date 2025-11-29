import { Table, Pagination, Select, Input, Space, Button, Form, Popconfirm } from 'antd';
import { SearchOutlined, FilterOutlined, LoadingOutlined, SaveOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import Highlighter from 'react-highlight-words';

const { Option } = Select;

// Editable Cell Component for inline editing
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  // Safety check for editing prop
  if (!editing) {
    // Render the actual value from record when not editing
    const cellValue = record && dataIndex ? record[dataIndex] : null;
    return (
      <td {...restProps}>
        {cellValue !== null && cellValue !== undefined && cellValue !== ''
          ? cellValue
          : children}
      </td>
    );
  }

  const inputNode = inputType === 'select' ? (
    <Select style={{ width: '100%' }} placeholder={`Select ${title}`}>
      <Option value="Phone">Phone</Option>
      <Option value="Email">Email</Option>
      <Option value="Mobile Phone">Mobile Phone</Option>
      <Option value="Whatsapp">Whatsapp</Option>
    </Select>
  ) : (
    <Input placeholder={`Enter ${title}`} />
  );

  return (
    <td {...restProps}>
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[
          {
            required: false, // Changed to false to prevent blocking
            message: `Please input ${title}!`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    </td>
  );
};

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
  onRowClickedAsync = null,
  preventRowClickOn = [
    'button',
    'a',
    'svg',
    'path',
    '.ant-btn',
    '.ant-btn-link',
    '.ant-btn-icon-only',
    '.action-button',
    '.ant-dropdown-trigger',
    '.anticon',
    '.ant-popconfirm',
    '.ant-popover',
    'input',
    'select',
    '.ant-select',
    '.ant-input',
    '.ant-checkbox',
    '.ant-radio',
    '.ant-switch',
  ],
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
  searchDebounceDelay = 500,
  searchLoading: externalSearchLoading = false,
  // Performance props
  virtual = false,
  virtualHeight = 600,
  // Styling props
  tablePadding = 'small',
  fontSize = 'small',
  expandPadding = '24px',
  expandGap = '14px',
  // Inline editing props
  useInlineEdit = false,
  onSaveRow = () => {},
  onCancelEdit = () => {},
  onEditRow = () => {},
  onDeleteRow = () => {},
  editingKey = '',
  setEditingKey = () => {},
  formInstance,
  // Action button configuration
  showEditAction = true,
  showDeleteAction = true,
  editIcon = <EditOutlined />,
  deleteIcon = <DeleteOutlined />,
  deleteConfirmTitle = 'Are you sure you want to delete this row?',
  deleteConfirmOkText = 'Yes',
  deleteConfirmCancelText = 'No',
  // ============================================
  // NEW: Checkbox selection props
  // ============================================
  useCheckbox = false,                    // Enable/disable checkbox selection
  onSelectionChange = () => {},           // Callback when selection changes: (selectedRowKeys, selectedRows) => void
  selectedRowKeys: controlledSelectedKeys, // Controlled selected row keys (optional)
  rowKey = 'key',                         // Key field to identify rows (default: 'key', can be 'id' or any field)
  checkboxColumnTitle = '',               // Title for checkbox column
  checkboxColumnWidth = 50,               // Width of checkbox column
  checkboxFixed = false,                  // Fix checkbox column to left
  getCheckboxProps = () => ({}),          // Function to set checkbox props per row (disabled, etc.)
  preserveSelectedRowKeys = false,        // Preserve selection when data changes
  hideSelectAll = false,                  // Hide "select all" checkbox in header
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [internalSearchLoading, setInternalSearchLoading] = useState(false);
  const [searchTextColumn, setSearchTextColumn] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [loadingRows, setLoadingRows] = useState(new Set());
  
  // ============================================
  // NEW: Internal state for checkbox selection
  // ============================================
  const [internalSelectedKeys, setInternalSelectedKeys] = useState([]);
  
  // Use controlled keys if provided, otherwise use internal state
  const selectedKeys = controlledSelectedKeys !== undefined 
    ? controlledSelectedKeys 
    : internalSelectedKeys;

  // Smart row click handler that prevents clicks on action buttons
  const handleRowClick = async (record, rowIndex, event) => {
    const target = event.target;

    // Check if click originated from a prevented element or any of its children
    const shouldPrevent = preventRowClickOn.some((selector) => {
      if (selector.startsWith('.')) {
        // For class selectors, use closest to check if target or any parent has this class
        return target.closest(selector) !== null;
      } else {
        // For tag selectors, check the tag itself or if it's inside the tag
        return target.tagName.toLowerCase() === selector.toLowerCase() ||
               target.closest(selector) !== null;
      }
    });

    if (shouldPrevent) {
      // Prevent row click when clicking on action buttons/interactive elements
      event.stopPropagation();
      return;
    }

    if (onRowClickedAsync) {
      const rowKeyValue = record[rowKey] || record.key || record.id;
      setLoadingRows(prev => new Set(prev).add(rowKeyValue));

      try {
        await onRowClickedAsync(record, rowIndex, event);
      } catch (error) {
        console.error('Row click async error:', error);
      } finally {
        setLoadingRows(prev => {
          const newSet = new Set(prev);
          newSet.delete(rowKeyValue);
          return newSet;
        });
      }
    } else {
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

  // Column search handler
  const handleColumnSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextColumn(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleColumnReset = (clearFilters) => {
    clearFilters();
    setSearchTextColumn('');
  };

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

  // Utility functions for styling
  const getPaddingValue = (padding) => {
    const paddingMap = {
      small: '8px 12px',
      medium: '12px 16px',
      large: '16px 24px',
    };
    return paddingMap[padding] || padding;
  };

  const getFontSizeValue = (size) => {
    const sizeMap = {
      small: '12px',
      medium: '14px',
      large: '16px',
    };
    return sizeMap[size] || size;
  };

  // Calculate padding values
  const tablePaddingValue = getPaddingValue(tablePadding);
  const fontSizeValue = getFontSizeValue(fontSize);

  // Shared header background color for consistency
  const headerBackgroundColor = '#0075BF'; // Blue color for headers

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // Note: Actual search is triggered by debounced useEffect
  };

  // Check if a row is being edited
  const isEditing = (record) => record.key === editingKey;

  // Handle save action
  const save = async (key) => {
    try {
      console.log('NxTable save: Validating fields...');
      const row = await formInstance.validateFields();
      console.log('NxTable save: Fields validated successfully:', row);
      await onSaveRow(key, row);
    } catch (errInfo) {
      console.log('NxTable save: Validate Failed:', errInfo);
    }
  };

  // Handle cancel action
  const cancel = () => {
    onCancelEdit();
  };

  // Handle edit action
  const edit = (record) => {
    console.log('NxTable edit: Starting edit for record:', record);
    setEditingKey(record.key);
    onEditRow(record);
  };

  // Handle delete action
  const handleDelete = (record) => {
    console.log('NxTable delete: Deleting record:', record);
    onDeleteRow(record);
  };

  // ============================================
  // NEW: Helper to get row key value
  // ============================================
  const getRowKeyValue = (record) => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || record.key || record.id;
  };

  // ============================================
  // NEW: Checkbox selection handler
  // ============================================
  const handleCheckboxSelectionChange = (newSelectedRowKeys, selectedRows) => {
    // Update internal state if not controlled
    if (controlledSelectedKeys === undefined) {
      setInternalSelectedKeys(newSelectedRowKeys);
    }
    
    // Get full row data for all selected rows
    const fullSelectedRows = dataMain?.filter(record => 
      newSelectedRowKeys.includes(getRowKeyValue(record))
    ) || [];
    
    // Call the callback with selected keys and full row data
    onSelectionChange(newSelectedRowKeys, fullSelectedRows);
  };

  // ============================================
  // NEW: Build rowSelection config for checkbox
  // ============================================
  const buildCheckboxRowSelection = () => {
    if (!useCheckbox) return rowSelection; // Use original rowSelection if checkbox not enabled
    
    return {
      type: 'checkbox',
      selectedRowKeys: selectedKeys,
      onChange: handleCheckboxSelectionChange,
      columnTitle: hideSelectAll ? '' : checkboxColumnTitle,
      columnWidth: checkboxColumnWidth,
      fixed: checkboxFixed ? 'left' : undefined,
      getCheckboxProps: (record) => ({
        ...getCheckboxProps(record),
        // Add data attributes for easy identification
        'data-row-key': getRowKeyValue(record),
      }),
      preserveSelectedRowKeys,
      // Provide selections for bulk actions (select all, select none, etc.)
      selections: hideSelectAll ? false : [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
      ],
      // Override with any custom rowSelection props if provided
      ...rowSelection,
    };
  };

  // Filter and enhance columns with search capabilities
  const filterColumns = () => {
    const filteredColumns = columnMain
      .filter((col) => {
        return !optionSelectedCol.includes(col.title);
      })
      .map((col) => {
        if (col.filter) {
          const { filter, render, ...restCol } = col;
          const searchProps = getColumnSearchPropsInternal(col.dataIndex || col.key);

          return {
            ...restCol,
            ...searchProps,
            render: render || searchProps.render,
            editable: col.editable,
          };
        }
        return {
          ...col,
          editable: col.editable,
        };
      });

    // Add actions column if inline editing is enabled
    if (useInlineEdit) {
      const hasActionsColumn = filteredColumns.some(col => col.key === 'actions' || col.dataIndex === 'actions');

      if (!hasActionsColumn) {
        filteredColumns.push({
          title: 'ACTIONS',
          key: 'actions',
          width: 150,
          onCell: () => ({
            onClick: (e) => {
              // Prevent row click when clicking on action buttons
              e.stopPropagation();
            },
          }),
          render: (_, record) => {
            const editable = isEditing(record);

            if (editable) {
              // Show Save/Cancel when editing
              return (
                <Space size="small">
                  <Button
                    type="link"
                    icon={<SaveOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      save(record.key);
                    }}
                    style={{ color: '#52c41a' }}
                  >
                    Save
                  </Button>
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      cancel();
                    }}
                    danger
                  >
                    Cancel
                  </Button>
                </Space>
              );
            } else {
              // Show Edit/Delete when not editing
              return (
                <Space size="small">
                  {showEditAction && (
                    <Button
                      type="link"
                      icon={editIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        edit(record);
                      }}
                      style={{ color: '#1890ff' }}
                    >
                      Edit
                    </Button>
                  )}
                  {showDeleteAction && (
                    <Popconfirm
                      title={deleteConfirmTitle}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDelete(record);
                      }}
                      onCancel={(e) => {
                        e?.stopPropagation();
                      }}
                      okText={deleteConfirmOkText}
                      cancelText={deleteConfirmCancelText}
                    >
                      <Button
                        type="link"
                        icon={deleteIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        danger
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              );
            }
          },
        });
      }
    }

    return filteredColumns;
  };

  const filterExpandColumns = () => {
    if (!columnExpand) return [];

    return columnExpand.map((col) => {
      if (col.filter) {
        const { filter, render, ...restCol } = col;
        const searchProps = getColumnSearchPropsInternal(col.dataIndex || col.key);

        return {
          ...restCol,
          ...searchProps,
          render: render || searchProps.render,
        };
      }
      return col;
    });
  };

  // Custom row className for striped pattern
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'nx-row-even' : 'nx-row-odd';
  };

  /**
   * Shared table cell components for consistency between main and expanded tables
   *
   * This object provides custom rendering for table cells and headers:
   * - body.cell: Applies consistent padding (top/bottom/left/right) and borders to all body cells
   * - header.cell: Applies consistent padding, background color, and borders to all header cells
   *
   * Benefits:
   * 1. Single source of truth for cell styling
   * 2. Ensures main table and expanded table look identical
   * 3. Respects tablePaddingValue prop (small/medium/large)
   */
  const mergedColumns = filterColumns().map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType || 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const tableComponents = useInlineEdit ? {
    body: {
      cell: EditableCell,
    },
    header: {
      cell: (props) => (
        <th
          {...props}
          style={{
            ...props.style,
            padding: tablePaddingValue,
            borderBottom: '0.5px solid #d4d4d8',
            backgroundColor: headerBackgroundColor,
            fontWeight: 'bold',
            color: '#ffffff',
            textTransform: 'uppercase',
          }}
        />
      ),
    },
  } : {
    body: {
      cell: (props) => (
        <td
          {...props}
          style={{
            ...props.style,
            padding: tablePaddingValue,
            borderBottom: '0.5px solid #d4d4d8',
          }}
        />
      ),
    },
    header: {
      cell: (props) => (
        <th
          {...props}
          style={{
            ...props.style,
            padding: tablePaddingValue,
            borderBottom: '0.5px solid #d4d4d8',
            backgroundColor: headerBackgroundColor,
            fontWeight: 'bold',
            color: '#ffffff',
            textTransform: 'uppercase',
          }}
        />
      ),
    },
  };

  // ============================================
  // FIXED: Check if expandable feature should be enabled
  // Only enable expandable when both dataExpand AND columnExpand are provided
  // ============================================
  const hasExpandableData = dataExpand != null && columnExpand != null && 
    Array.isArray(columnExpand) && columnExpand.length > 0;

  // Render the expanded row content
  const expandedRowRender = (record) => {
    // Get expand data for this record
    const expandData = dataExpand
      ? Array.isArray(dataExpand)
        ? dataExpand.filter((item) => item.parentKey === record.key)
        : dataExpand[record.key] || []
      : [];

    // Show empty state when there's no data
    if (!expandData || expandData.length === 0) {
      return (
        <div
          className="nx-expand-empty"
          style={{
            backgroundColor: 'white',
            padding: expandPadding,
            textAlign: 'center',
            color: '#999',
            fontStyle: 'italic',
          }}
        >
          No data available
        </div>
      );
    }

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
          {childTitle && (
            <div className="nx-expand-title self-stretch justify-start text-sky-600 text-sm font-bold">
              {childTitle}
            </div>
          )}

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
              // Apply striped pattern to expanded table
              rowClassName={(record, index) => index % 2 === 0 ? 'nx-expand-row-even' : 'nx-expand-row-odd'}
              // Use shared table components for consistency
              components={tableComponents}
            />
          </div>
        </div>
      </div>
    );
  };

  // Custom expand icon
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
        <path d="M15.667 11.9902H8.33301" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.6857 2H7.31429C4.04762 2 2 4.31208 2 7.58516V16.4148C2 19.6879 4.0381 22 7.31429 22H16.6857C19.9619 22 22 19.6879 22 16.4148V7.58516C22 4.31208 19.9619 2 16.6857 2Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
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
        <path d="M12 8.32715V15.6541" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.667 11.9902H8.33301" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.6857 2H7.31429C4.04762 2 2 4.31208 2 7.58516V16.4148C2 19.6879 4.0381 22 7.31429 22H16.6857C19.9619 22 22 19.6879 22 16.4148V7.58516C22 4.31208 19.9619 2 16.6857 2Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
    </div>
  );

  // ============================================
  // FIXED: Build expandable config only when data is available
  // ============================================
  const buildExpandableConfig = () => {
    if (!hasExpandableData) {
      return undefined; // No expandable feature
    }

    return {
      expandedRowRender,
      expandIcon,
      defaultExpandedRowKeys,
      expandedRowKeys,
      onExpand: (expanded, record) => {
        onExpand(expanded, record);
      },
      expandRowByClick,
      rowExpandable: (record) => {
        // Check if this record has expandable data
        const expandData = dataExpand
          ? Array.isArray(dataExpand)
            ? dataExpand.filter((item) => item.parentKey === record.key)
            : dataExpand[record.key] || []
          : [];
        return expandData && expandData.length > 0;
      },
    };
  };

  // ============================================
  // Determine which rowSelection to use
  // ============================================
  const effectiveRowSelection = useCheckbox ? buildCheckboxRowSelection() : rowSelection;

  return (
    <div className="flex flex-col w-full nx-table-container">
      {/* Styling for table striping and hover effects */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Main table striped rows - Light blue (#E6F1F9) and white */
        .nx-table-container .ant-table-tbody > tr.nx-row-odd {
          background-color: #E6F1F9;
        }
        .nx-table-container .ant-table-tbody > tr.nx-row-even {
          background-color: #ffffff;
        }

        /* Apply background to cells for proper display */
        .nx-table-container .ant-table-tbody > tr.nx-row-odd > td {
          background-color: #E6F1F9;
        }
        .nx-table-container .ant-table-tbody > tr.nx-row-even > td {
          background-color: #ffffff;
        }

        /* Expanded table striped rows - Light blue (#E6F1F9) and white */
        .nx-table-container .ant-table-tbody > tr.nx-expand-row-odd > td {
          background-color: #E6F1F9;
        }
        .nx-table-container .ant-table-tbody > tr.nx-expand-row-even > td {
          background-color: #ffffff;
        }

        /* Use default Ant Design hover effect - light gray */
        .nx-table-container .ant-table-tbody > tr:hover > td {
          background-color: #fafafa !important;
        }

        /* Force padding to be applied according to tablePaddingValue */
        .nx-table-container .ant-table-thead > tr > th {
          padding: ${tablePaddingValue} !important;
        }
        .nx-table-container .ant-table-tbody > tr > td {
          padding: ${tablePaddingValue} !important;
        }

        /* Ensure expanded row content has no extra padding/margin */
        .nx-table-container .ant-table-tbody > tr.ant-table-expanded-row > td {
          padding: 0 !important;
        }

        /* Prevent extra spacing in collapsed state */
        .nx-table-container .ant-table-tbody > tr.ant-table-expanded-row.ant-table-expanded-row-level-1 {
          background-color: transparent;
        }

        /* Hide expand icon column if no expandable rows */
        .nx-table-container .ant-table-row-expand-icon-cell {
          width: 50px;
        }

        /* Force font size to be applied */
        .nx-table-container .ant-table {
          font-size: ${fontSizeValue} !important;
        }
        .nx-table-container .ant-table-thead > tr > th {
          font-size: ${fontSizeValue} !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
        }
        .nx-table-container .ant-table-tbody > tr > td {
          font-size: ${fontSizeValue} !important;
        }

        /* Hide Ant Design measure row (used for column width calculation) */
        .nx-table-container .ant-table-measure-row {
          display: none !important;
        }

        /* Keep the placeholder when table is actually empty, but hide empty expanded rows */
        .nx-table-container .ant-table-tbody > tr.ant-table-expanded-row:not(.ant-table-expanded-row-level-1) {
          display: none;
        }

        /* Ensure expand icon cell doesn't create visual empty column */
        .nx-table-container .ant-table-row-expand-icon-cell {
          padding: 0 8px !important;
        }

        /* Hide rows that have all empty cells (but keep the No Data placeholder) */
        .nx-table-container .ant-table-tbody > tr:not(.ant-table-placeholder):not(.ant-table-expanded-row):empty {
          display: none !important;
        }

        /* Ensure expanded row that has no content doesn't show */
        .nx-table-container .ant-table-expanded-row > td > .ant-table-wrapper:empty {
          display: none;
        }

        /* Ensure action buttons and interactive elements have pointer cursor */
        .nx-table-container .ant-table-tbody button,
        .nx-table-container .ant-table-tbody a,
        .nx-table-container .ant-table-tbody .ant-btn,
        .nx-table-container .ant-table-tbody .anticon,
        .nx-table-container .ant-table-tbody .action-button {
          cursor: pointer !important;
        }

        /* Checkbox selection styling */
        .nx-table-container .ant-table-selection-column {
          padding: 8px !important;
        }
        .nx-table-container .ant-checkbox-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nx-table-container .ant-table-selection {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nx-table-container .ant-table-selection .ant-table-selection-extra {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 8px 4px 18px;
        }
      `}} />

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
        {useInlineEdit && formInstance ? (
          <Form form={formInstance} component={false}>
            <Table
              dataSource={dataMain}
              columns={mergedColumns}
              expandable={buildExpandableConfig()}
              pagination={false}
              loading={loading}
              tableLayout="fixed"
              id={idTable}
              rowKey={rowKey}
              onChange={(pagination, filters, sorter, extra) => {
                onChange(pagination, filters, sorter, extra);
                onSort(pagination, filters, sorter, extra);
              }}
              rowSelection={effectiveRowSelection}
              scroll={tableScrolled || { x: 'max-content' }}
              rowClassName={getRowClassName}
              onRow={(record, rowIndex) => {
                const rowKeyValue = getRowKeyValue(record);
                const isLoading = loadingRows.has(rowKeyValue);

                return {
                  onClick: (event) => {
                    handleRowClick(record, rowIndex, event);
                  },
                  style: {
                    cursor: isLoading ? 'wait' : (onRowClicked || onRowClickedAsync ? 'pointer' : 'default'),
                    opacity: isLoading ? 0.6 : 1,
                  },
                  'data-row-key': rowKeyValue,
                  'data-row-index': rowIndex,
                };
              }}
              style={{ width: '100%', fontSize: fontSizeValue }}
              components={tableComponents}
            />
          </Form>
        ) : (
          <Table
            dataSource={dataMain}
            columns={filterColumns()}
            expandable={buildExpandableConfig()}
            pagination={false}
            loading={loading}
            tableLayout="fixed"
            id={idTable}
            rowKey={rowKey}
            onChange={(pagination, filters, sorter, extra) => {
              onChange(pagination, filters, sorter, extra);
              onSort(pagination, filters, sorter, extra);
            }}
            rowSelection={effectiveRowSelection}
            scroll={tableScrolled || { x: 'max-content' }}
            // Apply striped row classes
            rowClassName={getRowClassName}
            onRow={(record, rowIndex) => {
              const rowKeyValue = getRowKeyValue(record);
              const isLoading = loadingRows.has(rowKeyValue);

              return {
                onClick: (event) => {
                  handleRowClick(record, rowIndex, event);
                },
                style: {
                  cursor: isLoading ? 'wait' : (onRowClicked || onRowClickedAsync ? 'pointer' : 'default'),
                  opacity: isLoading ? 0.6 : 1,
                },
                'data-row-key': rowKeyValue,
                'data-row-index': rowIndex,
              };
            }}
            style={{ width: '100%', fontSize: fontSizeValue }}
            // Use shared table components for consistency with expanded table
            components={tableComponents}
          />
        )}
      </div>
    </div>
  );
};

export default NxTable;
