import React from "react";
import { hasValue, renderColumn, separatorNumber } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";

// Helper function untuk render number dengan decimal
const renderNumber = (value, decimal = 3) => {
  if (value === null || value === undefined) return "-";
  return separatorNumber(value, decimal);
};

export const columnsAdjustment = (
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
    title: "Rating Adjustment Type",
    dataIndex: "ratingAdjustmentType",
    key: "ratingAdjustmentType",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "ratingAdjustmentType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
  },
  {
    title: "Adjustment Item",
    dataIndex: "adjustmentItem",
    key: "adjustmentItem",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "adjustmentItem",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
  },
  {
    title: "CR/DR",
    dataIndex: "crDr",
    key: "crDr",
    width: 100,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "crDr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
  },
  {
    title: "UOM",
    dataIndex: "uom",
    key: "uom",
    width: 100,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
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
];