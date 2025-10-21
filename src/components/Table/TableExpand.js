import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
import React from "react";
import TablePagination from "../TablePagination";
const TableExpand = ({ dataMain, dataExpand, columnMain, columnExpand }) => {
  const expandedRowRender = () => {
    const columns = columnExpand;
    return (
      <Table columns={columns} dataSource={dataExpand} pagination={false} />
    );
  };
  const columns = columnMain;
  return (
    <>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={dataMain}
        pagination={false}
      />
    </>
  );
};
export default TableExpand;
