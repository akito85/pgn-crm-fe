import React, { useEffect, useRef } from "react";
import TablePagination from "../../../../../../../components/TablePagination";
import { Fragment } from "react";
import Highlighter from "react-highlight-words";
import { Checkbox, Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";

const TaxImplicationTable = ({
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  searchText,
  searchedColumn,
  onSort = {},
  getColumnSearchProps = () => {},
  handleDetail,
}) => {
  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "TAX IMPLICATION NAME",
      dataIndex: "taxImplicationName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("taxImplicationName"),
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("serviceType"),
    },
    {
      title: "IMPLICATION TYPE",
      dataIndex: "type",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("type"),
    },
    {
      title: "GUNGGUNG",
      dataIndex: "gunggung",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("gunggung"),
    },
    {
      title: "VAT INVOICE ISSUANCE",
      dataIndex: "vatInv",
      width: 175,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("vatInv"),
    },
    {
      title: "TRANSACTION CODE",
      dataIndex: "transCodeName",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("transCodeName"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("description"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "description") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "ACTION",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleDetail(r);
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
        tableScrolled={{ y: 525, x: 2200 }}
        onSort={onSort}
        columns={columns}
      />
    </Fragment>
  );
};

export default TaxImplicationTable;
