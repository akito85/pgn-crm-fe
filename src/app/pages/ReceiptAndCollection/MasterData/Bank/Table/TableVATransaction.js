import React from "react";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";

export const columnVATransaction = (
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
    title: "ACCOUNT NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    align: "left",
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
    title: "ACCOUNT NAME",
    dataIndex: "customerName",
    sorter: true,
    align: "left",
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
    key: "transactionNumber",
    title: "TRANSACTION NUMBER",
    dataIndex: "transactionNumber",
    sorter: true,
    align: "left",
    ...getColumnSearchProps(
      "transactionNumber",
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
    ...getColumnSearchProps(
      "vaNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
];
