import React, { useState } from "react";
import BaseContainer from "../../../../../../../../../components/BaseContainer";
import TablePagination from "../../../../../../../../../components/TablePagination";

const TableAttachment = ({ data }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("name"),
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("value"),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("unit"),
    },
  ];
  return (
    <div className={"w-full"}>
      <TablePagination
        pageSize={pageSize}
        current={page}
        dataSource={data}
        tableScrolled={{ y: 525, x: 800 }}
        columns={columns}
        totalData={data?.length}
      />
    </div>
  );
};
export default TableAttachment;
