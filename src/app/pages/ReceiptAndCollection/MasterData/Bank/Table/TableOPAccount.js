import React from "react";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";
import moment from "moment";

// Kolom khusus untuk tabel Online Payment (OP) Account.
// Dibuat terpisah dari TableVAAccount agar perubahan field OP tidak mempengaruhi VA dan sebaliknya.
export const columnOPAccount = (
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
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    align: "left",
    width: 160,
    ...getColumnSearchProps(
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    sorter: true,
    align: "left",
    width: 160,
    ...getColumnSearchProps(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerCenter",
    title: "COST CENTER",
    dataIndex: "customerCenter",
    sorter: true,
    align: "left",
    width: 130,
    ...getColumnSearchProps(
      "customerCenter",
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
    render: (val) =>
      val ? (
        <div style={{ whiteSpace: "nowrap" }}>
          <StatusComponent colour={val}>{val}</StatusComponent>
        </div>
      ) : "",
  },
];

// Kolom untuk OP Transaction — field transaksi OP berbeda dari OP Account
export const columnOPTransaction = (
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
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    align: "left",
    width: 160,
    ...getColumnSearchProps(
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    sorter: true,
    align: "left",
    width: 160,
    ...getColumnSearchProps(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    dataIndex: "transactionDate",
    sorter: true,
    align: "left",
    width: 150,
    render: (val) => (val ? moment(val).format("DD MMM YYYY") : ""),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    align: "right",
    width: 140,
    ...getColumnSearchProps(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    align: "left",
    width: 130,
    render: (val) =>
      val ? (
        <div style={{ whiteSpace: "nowrap" }}>
          <StatusComponent colour={val}>{val}</StatusComponent>
        </div>
      ) : "",
  },
];
