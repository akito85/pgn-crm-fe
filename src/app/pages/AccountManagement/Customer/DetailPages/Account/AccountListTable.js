import React, { useEffect, useRef } from "react";
import {
  Tooltip,
} from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import StatusComponent from "../../../../../../components/StatusComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { toTitleCase } from "../../../../../../utils";

const AccountListTable = ({
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
}) => {
  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("accountName"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
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
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "ACCOUNT REGISTRATION NUMBER",
      dataIndex: "registrationNumber",
      width: 350,
      sorter: true,
      align: "right",
      ...getColumnSearchProps("registrationNumber"),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("sor"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "sor" ? (
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
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("costCenter"),
    },
    {
      title: "METER READING CODES",
      dataIndex: "meterReadingCode",
      width: 300,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("meterReadingCode"),
    },
    {
      title: "SEGMENT",
      dataIndex: "accountSegment",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("accountSegment"),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("accountGroupType"),
    },
    {
      title: "CATEGORY",
      dataIndex: "accountCategory",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("accountCategory"),
    },
    {
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("classificationType"),
    },
    {
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("accountType"),
    },
    {
      title: "INDUSTRIAL SECTOR",
      dataIndex: "industrialSector",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("industrialSector"),
    },
    {
      title: "BUDGET YEAR",
      dataIndex: "budgetYear",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchProps("budgetYear"),
    },
    {
      title: "TERITORY",
      dataIndex: "teritory",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("teritory"),
    },
    {
      title: "ACCOUNT GROUP",
      dataIndex: "accountGroup",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("accountGroup"),
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("priority"),
    },
    {
      title: "CORPORATE",
      dataIndex: "isCorporate",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("isCorporate"),
    },
    {
      title: "RATING & BILLING EXCEPTION",
      dataIndex: "isException",
      width: 350,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("isException"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "accountDescription",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("acountDescription"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "accountDescription" ? (
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
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      width: 300,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("customerManagement"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "customerMangement" ? (
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
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "STATUS",
      width: 150,
      fixed: "right",
      dataIndex: "accountStatus",
      sorter: true,
      ...getColumnSearchProps("accountStatus"),
      render: (index) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{toTitleCase(index)}</StatusComponent>
        </div>
      ),
    },
    {
      title: "ACTIONS",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Link
              to={
                r.accountGroup == "Standard"
                  ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                  : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
              }
              state={{
                idAccount: r.accountId,
                idCustomer: r.customerId,
              }}
            >
              <Tooltip title="Detail">
                <div className="pt-1">
                  <SVGIcon name="IconDetail" color={"#0075bf"} width={24} />
                </div>
              </Tooltip>
            </Link>
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
        tableScrolled={{ y: 525, x: 2000 }}
        onSort={onSort}
        columns={columns}
      />
    </Fragment>
  );
};

export default AccountListTable;
