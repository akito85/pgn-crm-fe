import React from "react";
import { hasValue, renderColumn, renderDateColumn, separatorNumber } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";

// Helper function untuk render number dengan decimal
const renderNumber = (value, decimal = 3) => {
  if (value === null || value === undefined) return "-";
  return separatorNumber(value, decimal);
};

// Helper function untuk render date
const renderDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID");
};

export const columnsCalculationDetail = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    width: 60,
    align: "center",
    render: (text, record, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "Time Unit",
    dataIndex: "timeUnit",
    key: "timeUnit",
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "timeUnit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
  },
  {
    title: "Transaction Date",
    dataIndex: "transactionDate",
    key: "transactionDate",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "transactionDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => renderDate(text),
  },
  {
    title: "Usage",
    dataIndex: "usage",
    key: "usage",
    width: 120,
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "usage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Range Min",
    dataIndex: "rangeMin",
    key: "rangeMin",
    width: 120,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Range Max",
    dataIndex: "rangeMax",
    key: "rangeMax",
    width: 120,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
];