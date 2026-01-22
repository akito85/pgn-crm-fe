import React from "react";
import { hasValue, renderColumn, renderDateColumn, separatorNumber } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";

// Helper function untuk render number dengan decimal
const renderNumber = (value, decimal = 3) => {
  if (value === null || value === undefined || value === "") return "-";
  return separatorNumber(value, decimal);
};

export const columnsCalculationDetail = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search = {}
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
    title: "Rating Code",
    dataIndex: "ratingCode",
    key: "ratingCode",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "ratingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "ratingCode",
        hasValue(search["ratingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "Account Number",
    dataIndex: "accountNumber",
    key: "accountNumber",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "accountNumber",
        hasValue(search["accountNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "Time Unit",
    dataIndex: "timeUnit",
    key: "timeUnit",
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "timeUnit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "timeUnit",
        hasValue(search["timeUnit"]),
        searchText,
        text || "-",
        false,
        "input",
        search
      ),
  },
  {
    title: "Transaction Date",
    dataIndex: "transactionDate",
    key: "transactionDate",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "transactionDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "transactionDate",
        hasValue(search["transactionDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "Usage",
    dataIndex: "usage",
    key: "usage",
    width: 150,
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "usage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) => {
      if (hasValue(search["usage"])) {
        return renderColumn(
          "usage",
          true,
          searchText,
          renderNumber(text, 3),
          false,
          "input",
          search
        );
      }
      return renderNumber(text, 3);
    },
  },
  {
    title: "Min Usage",
    dataIndex: "minUsage",
    key: "minUsage",
    width: 150,
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "minUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) => {
      if (hasValue(search["minUsage"])) {
        return renderColumn(
          "minUsage",
          true,
          searchText,
          renderNumber(text, 3),
          false,
          "input",
          search
        );
      }
      return renderNumber(text, 3);
    },
  },
  {
    title: "Max Usage",
    dataIndex: "maxUsage",
    key: "maxUsage",
    width: 150,
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "maxUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) => {
      if (hasValue(search["maxUsage"])) {
        return renderColumn(
          "maxUsage",
          true,
          searchText,
          renderNumber(text, 3),
          false,
          "input",
          search
        );
      }
      return renderNumber(text, 3);
    },
  },
  {
    title: "SA Type",
    dataIndex: "saType",
    key: "saType",
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "saType",
        hasValue(search["saType"]),
        searchText,
        text || "-",
        false,
        "input",
        search
      ),
  },
  {
    title: "Calculated Usage UOM",
    dataIndex: "calculatedUsageUom",
    key: "calculatedUsageUom",
    width: 180,
    sorter: true,
    render: (text) => text || "-",
  },
  {
    title: "Calculated Usage Min",
    dataIndex: "calculatedUsageMin",
    key: "calculatedUsageMin",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Calculated Usage Normal",
    dataIndex: "calculatedUsageNormal",
    key: "calculatedUsageNormal",
    width: 200,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Calculated Usage OUP",
    dataIndex: "calculatedUsageOup",
    key: "calculatedUsageOup",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Converted Calculated UOM",
    dataIndex: "convertedCalculatedUom",
    key: "convertedCalculatedUom",
    width: 200,
    sorter: true,
    render: (text) => text || "-",
  },
  {
    title: "Converted Calculated Min",
    dataIndex: "convertedCalculatedMin",
    key: "convertedCalculatedMin",
    width: 200,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Converted Calculated Normal",
    dataIndex: "convertedCalculatedNormal",
    key: "convertedCalculatedNormal",
    width: 220,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Converted Calculated OUP",
    dataIndex: "convertedCalculatedOup",
    key: "convertedCalculatedOup",
    width: 200,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Price Code",
    dataIndex: "priceCode",
    key: "priceCode",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priceCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "priceCode",
        hasValue(search["priceCode"]),
        searchText,
        text || "-",
        false,
        "input",
        search
      ),
  },
  {
    title: "Price Min",
    dataIndex: "priceMin",
    key: "priceMin",
    width: 150,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Price Normal",
    dataIndex: "priceNormal",
    key: "priceNormal",
    width: 150,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Price OUP",
    dataIndex: "priceOup",
    key: "priceOup",
    width: 150,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "Amount Partition Currency",
    dataIndex: "amountPartitionCurrency",
    key: "amountPartitionCurrency",
    width: 200,
    sorter: true,
    render: (text) => text || "-",
  },
  {
    title: "Amount Partition Min",
    dataIndex: "amountPartitionMin",
    key: "amountPartitionMin",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 2),
  },
  {
    title: "Amount Partition Normal",
    dataIndex: "amountPartitionNormal",
    key: "amountPartitionNormal",
    width: 200,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 2),
  },
  {
    title: "Amount Partition OUP",
    dataIndex: "amountPartitionOup",
    key: "amountPartitionOup",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 2),
  },
  {
    title: "Amount Partition",
    dataIndex: "amountPartition",
    key: "amountPartition",
    width: 160,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 2),
  },
  {
    title: "Amount Partition Total",
    dataIndex: "amountPartitionTotal",
    key: "amountPartitionTotal",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 2),
  },
];