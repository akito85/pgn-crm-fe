import { Select, Table } from "antd";
import React from "react";
import { useState } from "react";
const { Option } = Select;

const TablePaginationPricingRuleDetail = ({
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

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };
  const handleDelete = (index) => {
    onDelete(index);
  };
  const filterColumns = () => {
    return columns.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };
  return (
    <div className={"relative flex flex-col w-full"}>
      {useSelect ? (
        <div
          className={`${
            totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"
          } w-1/4 flex`}
        >
          {useSelect ? (
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
          ) : null}
        </div>
      ) : null}
      <Table
        dataSource={dataSource}
        columns={[...filterColumns()]}
        scroll={tableScrolled}
        bordered
        pagination={
          !usePagination
            ? false
            : {
                position: ["topRight"],
                current: current,
                pageSize: pageSize,
                total: totalData,
                onChange: onChange,
                className: "pr-1 w-3/4",
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
        onChange={onSort}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default TablePaginationPricingRuleDetail;
