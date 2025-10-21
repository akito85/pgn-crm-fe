import React, { useEffect, useRef } from "react";
import { Tooltip } from "antd";
import TablePagination from "../../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment } from "react";

const TaxRelationTable = ({
  data = [],
  handleChooseAccount = () => {},
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  getColumnSearchProps = () => {},
}) => {
  const columns = [
    {
      title: "NO",
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 150,
      sorter: true,
      align: "left",
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 150,
      sorter: true,
      align: "right",
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "ACTIONS",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Choose">
              <div className="pt-1">
                <SVGIcon
                  name="IconActionCreate"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleChooseAccount({
                      data: r,
                      isOpen: false,
                    });
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onSort={onSort}
        columns={columns}
      />
    </Fragment>
  );
};

export default TaxRelationTable;
