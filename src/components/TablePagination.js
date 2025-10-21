import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Select, Space, Table } from "antd";
import React from "react";
import { useState } from "react";
const { Option } = Select;

const TablePagination = ({
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
    <div className={"flex flex-col w-full"}>
      {useSelect || usePagination ? (
        <div className={"w-full flex mb-5 gap-2 justify-between"}>
          {useSelect ? (
            <Select
              mode="multiple"
              placeholder="Show All Column"
              className={"w-2/6"}
              maxTagCount={3}
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
          {usePagination ? (
            <Pagination
              total={totalData}
              className={"pr-1"}
              showSizeChanger
              current={current}
              pageSize={pageSize}
              onChange={onChange}
              onShowSizeChange={onSizeChanger}
              showTotal={(total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`
              }
            />
          ) : null}
        </div>
      ) : null}
      <Table
        dataSource={dataSource}
        columns={[
          ...filterColumns(),
          // {
          //   title: "ACTION",
          //   fixed: "right",
          //   align: "center",
          //   render: (_, record) => (
          //     <Space>
          //       <Button
          //         type="link"
          //         onClick={() => handleDelete(record)}
          //         danger
          //       >
          //         Delete
          //       </Button>
          //     </Space>
          //   ),
          // },
        ]}
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
      />
    </div>
  );
};

export default TablePagination;
