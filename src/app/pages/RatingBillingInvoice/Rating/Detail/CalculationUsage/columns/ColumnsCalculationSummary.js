import React from "react";
import { Spin } from "antd";
import TableRBI from "../../../../../../../components/TableRBI";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../../utils";
import {
  numberFormatting,
  currencyFormatting,
  usageFormatting,
} from "../../../../../../../utils/formatCurrency";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";

export const columnsCalculationSummary = (
  search = {},
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 48,
    render: (text, object, index) => index + 1,
  },
  {
    title: "TRANSACTION DATE",
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
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "transactionDate",
        hasValue(search["transactionDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "USAGE",
    dataIndex: "usage",
    key: "usage",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "usage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "usage",
        hasValue(search["usage"]),
        searchText,
        text,
        false,
        "input",
        search,
        "usage",
      ),
  },
  {
    title: "SA TYPE",
    dataIndex: "saType",
    key: "saType",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "saType",
        hasValue(search["saType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "AMOUNT",
    dataIndex: "priceAmount",
    key: "priceAmount",
    width: 150,
    align: "right",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priceAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "priceAmount",
        hasValue(search["priceAmount"]),
        searchText,
        text,
        false,
        "input",
        search,
        "currency-idr",
      ),
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "priceTotalAmount",
    key: "priceTotalAmount",
    width: 180,
    align: "right",
    sorter: true,
    isNumber: true,
    render: (text) => currencyFormatting(text, "idr"),
  },
];

// data expand column
export const getExpandedColumns = () => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 48,
    render: (text, object, index) => index + 1,
  },
  {
    title: "UOM",
    dataIndex: "uom",
    key: "uom",
    width: 100,
    align: "center",
    render: (text) => text || "",
  },
  {
    title: "CALCULATED USAGE PARTITION",
    children: [
      {
        title: "MIN",
        dataIndex: "usagePartitionMin",
        key: "usagePartitionMin",
        width: 150,
        align: "right",
        render: (text) => usageFormatting(text),
      },
      {
        title: "NORMAL",
        dataIndex: "usagePartitionNormal",
        key: "usagePartitionNormal",
        width: 150,
        align: "right",
        render: (text) => usageFormatting(text),
      },
      {
        title: "OUP",
        dataIndex: "usagePartitionOup",
        key: "usagePartitionOup",
        width: 150,
        align: "right",
        render: (text) => usageFormatting(text),
      },
    ],
  },
  {
    title: "Range Min",
    dataIndex: "rangeMin",
    key: "rangeMin",
    width: 100,
    align: "center",
    render: (text) => {
      if (text === null || text === undefined || text === 0) return "0";
      return text;
    },
  },
  {
    title: "Range Max",
    dataIndex: "rangeMax",
    key: "rangeMax",
    width: 100,
    align: "center",
    render: (text) => {
      if (text === null || text === undefined || text === 0) return "Unlimited";
      return text;
    },
  },
  {
    title: "PRICE",
    children: [
      {
        title: "CURRENCY",
        dataIndex: "priceCurrency",
        key: "priceCurrency",
        width: 120,
        align: "center",
        render: (text) => text || "",
      },
      {
        title: "CODE",
        dataIndex: "priceCode",
        key: "priceCode",
        width: 150,
        align: "center",
        render: (text) => text || "",
      },
      {
        title: "MIN",
        dataIndex: "priceMin",
        key: "priceMin",
        width: 150,
        align: "right",
        render: (text) => currencyFormatting(text, "idr"),
      },
      {
        title: "NORMAL",
        dataIndex: "priceNormal",
        key: "priceNormal",
        width: 150,
        align: "right",
        render: (text) => currencyFormatting(text, "idr"),
      },
      {
        title: "OUP",
        dataIndex: "priceOup",
        key: "priceOup",
        width: 150,
        align: "right",
        render: (text) => currencyFormatting(text, "idr"),
      },
    ],
  },
  {
    title: "AMOUNT PARTITION",
    children: [
      {
        title: "MIN",
        dataIndex: "amountPartitionMin",
        key: "amountPartitionMin",
        width: 200,
        align: "right",
        render: (text) => currencyFormatting(text, "idr"),
      },
      {
        title: "NORMAL",
        dataIndex: "amountPartitionNormal",
        key: "amountPartitionNormal",
        width: 200,
        align: "right",
        render: (text) => currencyFormatting(text, "idr"),
      },
      {
        title: "OUP",
        dataIndex: "amountPartitionOup",
        key: "amountPartitionOup",
        width: 200,
        align: "right",
        render: (text) => currencyFormatting(text, "idr"),
      },
    ],
  },
];

export const renderExpandedRow = (record, expandData, loadingExpand) => {
  const rowKey = record.key;
  const isLoading = loadingExpand[rowKey];
  const expandedData = expandData[rowKey]?.result || [];

  const expandedColumns = getExpandedColumns();

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Spin tip="Loading expanded data..." />
      </div>
    );
  }

  return (
    <div className="bg-white" style={{ marginLeft: 48 }}>
      <TableRBI
        idTable={`expanded-table-${rowKey}`}
        columns={expandedColumns}
        dataSource={expandedData}
        size="small"
        tableScrolled={{ x: 2000, y: 200 }}
        showExport={false}
        showAdvanceSearch={false}
        showSearchBar={false}
        showRefresh={false}
        useSelect={false}
        usePagination={false}
        loading={false}
      />
    </div>
  );
};
