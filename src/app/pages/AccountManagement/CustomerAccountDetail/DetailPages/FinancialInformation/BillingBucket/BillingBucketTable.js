import React, { useEffect, useRef } from "react";
import TablePagination from "../../../../../../../components/TablePagination";
import { Fragment } from "react";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";

const BillingBucketTable = ({
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  searchedColumn,
  searchText,
  getColumnSearchProps = () => {},
}) => {
  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => {},
    ) => {
      return [
        {
          title: "NO",
          align: "center",
          width: 60,
          render: (text, object, index) => index + 1,
        },
        {
          title: "BILLING CODE",
          dataIndex: "billingCode",
          align: "center",
          ...getColumnSearchProps(
            "billingCode",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
        {
          title: "BILLING ITEM",
          dataIndex: "billingItem",
          align: "center",
          ...getColumnSearchProps(
            "billingItem",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
        {
          title: "PRIORITY",
          dataIndex: "priority",
          align: "center",
          ...getColumnSearchProps(
            "priority",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
          render: (text) => {
            const tempText = text === "Y" ? "YES" : "NO";
            if (searchedColumn === "custodyTransfer") {
              return (
                <Highlighter
                  highlightStyle={{
                    backgroundColor: "#ffc069",
                    padding: 0,
                  }}
                  searchWords={[searchText]}
                  autoEscape
                  textToHighlight={tempText ? tempText.toString() : ""}
                />
              );
            } else {
              return tempText;
            }
          },
        },
        {
          title: "GL ACCOUNT",
          dataIndex: "glAccount",
          align: "center",
          ...getColumnSearchProps(
            "glAccount",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
        {
          title: "TYPE",
          dataIndex: "type",
          align: "center",
          ...getColumnSearchProps(
            "type",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
      ];
    };
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase">
          BILLING BUCKET DETAIL
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record?.details}
          columns={columns()}
          tableScrolled={{
            x: 1300,
          }}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BILLING BUCKET CODE",
      dataIndex: "billingBucketCode",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("billingBucketCode"),
    },
    {
      title: "BILLING BUCKET NAME",
      width: 150,
      dataIndex: "billingBucketName",
      sorter: true,
      ...getColumnSearchProps("billingBucketName"),
    },
    {
      title: "CATEGORY",
      width: 150,
      dataIndex: "category",
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "DESCRIPTION",
      width: "25%",
      dataIndex: "description",
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
        tableScrolled={{ y: 525, x: 1300 }}
        expandable={{ expandedRowRender }}
        onSort={onSort}
        columns={columns}
      />
    </Fragment>
  );
};

export default BillingBucketTable;
