import { Select, Table, Button, Dropdown, Checkbox, Radio, Divider } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { SettingOutlined, PushpinOutlined } from "@ant-design/icons";

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
  useFixColumn = true, // New prop untuk enable/disable fix column
  defaultFixedColumns = {}, // New prop untuk default fixed columns
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [totalDataFE, setTotalDataFE] = useState(0);
  const [fixedColumns, setFixedColumns] = useState(defaultFixedColumns);
  const [columnFixDropdownVisible, setColumnFixDropdownVisible] = useState(false);

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

  const handleColumnFixChange = (columnKey, checked) => {
    if (checked) {
      const columnIndex = columns.findIndex((col) => col.key === columnKey);
      const isLastColumn = columnIndex === columns.length - 1;
      const defaultPosition = isLastColumn ? "right" : "left";

      setFixedColumns((prev) => ({ ...prev, [columnKey]: defaultPosition }));
    } else {
      const newFixed = { ...fixedColumns };
      delete newFixed[columnKey];
      setFixedColumns(newFixed);
    }
  };

  const handleColumnPositionChange = (columnKey, position) => {
    setFixedColumns((prev) => ({ ...prev, [columnKey]: position }));
  };

  const canFixLeft = (columnIndex) => {
    return columnIndex !== columns.length - 1;
  };

  const canFixRight = (columnIndex) => {
    return columnIndex !== 0;
  };

  // Filter columns berdasarkan show/hide
  const filterColumns = () => {
    return columns.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  // Apply fixed position ke columns
  const processedColumns = useMemo(() => {
    const filteredCols = filterColumns();
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    filteredCols.forEach((col) => {
      const fixedPos = fixedColumns[col.key];
      const colWithFixed = { ...col, fixed: fixedPos || undefined };

      if (fixedPos === "left") {
        leftFixed.push(colWithFixed);
      } else if (fixedPos === "right") {
        rightFixed.push(colWithFixed);
      } else {
        normal.push(colWithFixed);
      }
    });

    return [...leftFixed, ...normal, ...rightFixed];
  }, [columns, fixedColumns, optionSelectedCol]);

  const onChangeFE = (_, __, ___, extra) => {
    setTotalDataFE(extra?.currentDataSource?.length || 0);
  };

  const columnFixMenu = (
    <div
      style={{
        padding: "12px",
        minWidth: "320px",
        maxHeight: "500px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#262626",
        }}
      >
        <PushpinOutlined />
        Fix Columns Position
      </div>
      <Divider style={{ margin: "8px 0" }} />

      {columns.map((col, index) => {
        const isFixed = !!fixedColumns[col.key];
        const position = fixedColumns[col.key] || "left";
        const isFirstColumn = index === 0;
        const isLastColumn = index === columns.length - 1;
        const isHidden = optionSelectedCol.includes(col.title);

        return (
          <div
            key={col.key}
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: isFixed ? "#f0f5ff" : "#fafafa",
              borderRadius: "6px",
              border: isFixed ? "1px solid #d6e4ff" : "1px solid #f0f0f0",
              transition: "all 0.3s",
              opacity: isHidden ? 0.5 : 1,
            }}
          >
            <div style={{ marginBottom: isFixed ? "8px" : "0" }}>
              <Checkbox
                checked={isFixed}
                onChange={(e) =>
                  handleColumnFixChange(col.key, e.target.checked)
                }
                style={{ fontWeight: "500" }}
                disabled={isHidden}
              >
                {col.title} {isHidden && "(Hidden)"}
              </Checkbox>
            </div>

            {isFixed && !isHidden && (
              <div
                style={{
                  marginLeft: "24px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#595959",
                      fontWeight: "500",
                    }}
                  >
                    Position:
                  </span>
                  <Radio.Group
                    value={position}
                    onChange={(e) =>
                      handleColumnPositionChange(col.key, e.target.value)
                    }
                    size="small"
                    buttonStyle="solid"
                    style={{ display: "flex", gap: "6px" }}
                  >
                    <Radio.Button value="left" disabled={!canFixLeft(index)}>
                      Left
                    </Radio.Button>
                    <Radio.Button value="right" disabled={!canFixRight(index)}>
                      Right
                    </Radio.Button>
                  </Radio.Group>
                </div>
                {(isFirstColumn || isLastColumn) && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#8c8c8c",
                      marginTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {isFirstColumn && "* First column can only be fixed left"}
                    {isLastColumn && "* Last column can only be fixed right"}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Divider style={{ margin: "12px 0" }} />

      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}
      >
        <Button
          size="small"
          onClick={() => setFixedColumns({})}
          style={{ flex: 1 }}
        >
          Clear All
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => setColumnFixDropdownVisible(false)}
          style={{ flex: 1 }}
        >
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <div className={"relative flex flex-col w-full"}>
      <div className="flex gap-2 justify-between items-center mb-4">
        {/* Show/Hide Column Select */}
        {useSelect && (type === "BE" ? totalData : totalDataFE) !== 0 && (
          <div className="w-1/4">
            <Select
              mode="multiple"
              placeholder="Show All Column"
              className={"w-full"}
              maxTagCount={"responsive"}
              onChange={handleDisplayColumn}
            >
              {columns
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
                .splice(1)}
            </Select>
          </div>
        )}

        {/* Fix Column Button */}
        {useFixColumn && (type === "BE" ? totalData : totalDataFE) !== 0 && (
          <Dropdown
            overlay={columnFixMenu}
            trigger={["click"]}
            visible={columnFixDropdownVisible}
            onVisibleChange={setColumnFixDropdownVisible}
            placement="bottomRight"
          >
            <Button icon={<SettingOutlined />}>
              Fix Columns ({Object.keys(fixedColumns).length})
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
                position: ["topRight"],
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