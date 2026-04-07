import React from "react";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";
import moment from "moment";

export const columnVAAccount = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    key: "no",
    title: "NO",
    width: 60,
    dataIndex: "no",
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: true,
    align: "left",
    width: 160,
    ...getColumnSearchProps(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    sorter: true,
    align: "left",
    width: 160,
    ...getColumnSearchProps(
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    sorter: true,
    align: "left",
    width: 130,
    ...getColumnSearchProps(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    align: "left",
    width: 120,
    ...getColumnSearchProps(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "vaNumber",
    title: "VA NUMBER",
    dataIndex: "vaNumber",
    sorter: true,
    align: "left",
    width: 160,
    ...getColumnSearchProps(
      "vaNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "activationDate",
    title: "ACTIVATION DATE",
    dataIndex: "activationDate",
    sorter: true,
    align: "left",
    width: 150,
    render: (val) => (val ? moment(val).format("DD MMM YYYY") : ""),
  },
  {
    key: "statusApproval",
    title: "ACTIVATION STATUS",
    dataIndex: "statusApproval",
    sorter: true,
    align: "left",
    width: 160,
    render: (val) => val ? <div style={{ whiteSpace: "nowrap" }}><StatusComponent colour={val}>{val}</StatusComponent></div> : "",
  },
];
