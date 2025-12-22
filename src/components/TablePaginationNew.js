import { Select, Table, Button, Dropdown, Checkbox, Input } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { DownOutlined } from "@ant-design/icons";

const { Option } = Select;

const TablePaginationNew = ({
  idTable,
  dataSource,
  columns,
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
  type = "BE",
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [totalDataFE, setTotalDataFE] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (type !== "BE") {
      setTotalDataFE(dataSource?.length || 0);
    }
  }, [type, dataSource]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const handleDelete = (index) => {
    onDelete(index);
  };

  // Filter columns berdasarkan show/hide
  const filterColumns = () => {
    return columns.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  // Processed columns tanpa fixed position
  const processedColumns = useMemo(() => {
    return filterColumns();
  }, [columns, optionSelectedCol]);

  const onChangeFE = (_, __, ___, extra) => {
    setTotalDataFE(extra?.currentDataSource?.length || 0);
  };

  // Filtered columns untuk search
  const filteredColumns = useMemo(() => {
    if (!searchText) return columns;
    return columns.filter((col) =>
      col.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [columns, searchText]);

  // Handler untuk checkbox change
  const onCheckboxChange = (e, title) => {
    const checked = e.target.checked;
    let newSelected;
    if (checked) {
      newSelected = optionSelectedCol.filter((col) => col !== title);
    } else {
      newSelected = [...optionSelectedCol, title];
    }
    setOptionSelectedCol(newSelected);
  };

  // Menu untuk Show/Hide Column
  const showHideMenu = (
    <div
      style={{
        padding: 10,
        width: 250,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 4,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>Visibility</div>
      <Input
        placeholder="Search column..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 8 }}
        allowClear
      />
      <div
        style={{
          maxHeight: 200,
          overflowY: "auto",
          borderTop: "1px solid #eee",
          paddingTop: 8,
        }}
      >
        {filteredColumns.map((col) => (
          <div key={col.title} style={{ marginBottom: 4 }}>
            <Checkbox
              checked={!optionSelectedCol.includes(col.title)}
              onChange={(e) => onCheckboxChange(e, col.title)}
            >
              {col.title}
            </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={"relative flex flex-col w-full"}>
      <div className="flex gap-2 justify-between items-center mb-4">
        {/* Show/Hide Column Button */}
        {useSelect && (type === "BE" ? totalData : totalDataFE) !== 0 && (
          <Dropdown
            overlay={showHideMenu}
            trigger={["click"]}
            visible={dropdownVisible}
            onVisibleChange={(flag) => setDropdownVisible(flag)}
          >
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                border: "1px solid #BDBDBD",
                height: "30px",
                color: "black",
              }}
            >
              Show / Hide Column <DownOutlined style={{ fontSize: "10px" }} />
            </Button>
          </Dropdown>
        )}
      </div>

      <Table
        dataSource={dataSource}
        columns={processedColumns}
        scroll={tableScrolled}
        bordered
        pagination={
          !usePagination
            ? false
            : {
                position: ["bottomRight"],
                current: current,
                pageSize: pageSize,
                total: type === "BE" ? totalData : undefined,
                onChange: onChange,
                className: "pr-1",
                style: { marginLeft: "auto", marginRight: 0 },
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} records`,
              }
        }
        className={`w-full ${className}`}
        loading={loading}
        tableLayout="fixed"
        expandable={expandable}
        id={idTable}
        onChange={type === "BE" ? onSort : onChangeFE}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default TablePaginationNew;
