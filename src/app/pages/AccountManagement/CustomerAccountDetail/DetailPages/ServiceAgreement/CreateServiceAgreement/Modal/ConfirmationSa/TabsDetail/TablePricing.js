import React, { useState } from "react";

const TablePricing = ({ dataPricing }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (name) => {
        return <span>{name?.label}</span>;
      },
    },
    {
      title: "MINMUM",
      dataIndex: "value",
    },
    {
      title: "MAXIMUM",
      dataIndex: "unit",
      render: (unit) => {
        return <span>{unit !== undefined ? unit.label : ""}</span>;
      },
    },
    {
      title: "PRICE CODE",
      dataIndex: "unit",
      render: (unit) => {
        return <span>{unit !== undefined ? unit.label : ""}</span>;
      },
    },
    {
      title: "PRICE DETAIL",
      dataIndex: "unit",
      children: [],
    },
  ];
  return (
    <div>
      {/* <TablePagination
        dataSource={
          dataTableProduct && dataTableProduct?.length === 0 ? null : dataTableProduct
        }
        columns={columns}
        pageSize={pageSize}
        current={page}
        // totalData={data?.page?.totalElements}
        // onChange={handleChange}
        // onSizeChanger={handleChangeSize}
        // onSort={onSort}
        tableScrolled={{ x: 1000 }}
      /> */}
    </div>
  );
};

export default TablePricing;
