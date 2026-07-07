import React from "react";
import { Spin } from "antd";
import TableRBI from "../../../../../../../components/TableRBI";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../../utils";
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
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priceTotalAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "priceTotalAmount",
        hasValue(search["priceTotalAmount"]),
        searchText,
        text,
        false,
        "input",
        search,
        "currency-idr",
      ),
  },
];

// data expand column
export const getExpandedColumns = (
  search = {},
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
    title: "UOM",
    dataIndex: "uom",
    key: "uom",
    width: 100,
    align: "center",
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(search["uom"]),
        searchText,
        text || "",
        false,
        "input",
        search,
      ),
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
        render: (text, record) =>
          renderColumn(
            "usagePartitionMin",
            hasValue(search["usagePartitionMin"]),
            searchText,
            text,
            false,
            "input",
            search,
            record.uom === "MMBTU" ? "energi" : "usage",
          ),
      },
      {
        title: "NORMAL",
        dataIndex: "usagePartitionNormal",
        key: "usagePartitionNormal",
        width: 150,
        align: "right",
        render: (text, record) =>
          renderColumn(
            "usagePartitionNormal",
            hasValue(search["usagePartitionNormal"]),
            searchText,
            text,
            false,
            "input",
            search,
             record.uom === "MMBTU" ? "energi" : "usage",
          ),
      },
      {
        title: "OUP",
        dataIndex: "usagePartitionOup",
        key: "usagePartitionOup",
        width: 150,
        align: "right",
        render: (text, record) =>
          renderColumn(
            "usagePartitionOup",
            hasValue(search["usagePartitionOup"]),
            searchText,
            text,
            false,
            "input",
            search,
             record.uom === "MMBTU" ? "energi" : "usage",
          ),
      },
    ],
  },
  {
    title: "Range Min",
    dataIndex: "rangeMin",
    key: "rangeMin",
    width: 100,
    align: "center",
    render: (text) =>
      renderColumn(
        "rangeMin",
        hasValue(search["rangeMin"]),
        searchText,
        text === null || text === undefined || text === 0 ? "0" : text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "Range Max",
    dataIndex: "rangeMax",
    key: "rangeMax",
    width: 100,
    align: "center",
    render: (text) =>
      renderColumn(
        "rangeMax",
        hasValue(search["rangeMax"]),
        searchText,
        text === null || text === undefined || text === 0 ? "Unlimited" : text,
        false,
        "input",
        search,
      ),
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
        render: (text) =>
          renderColumn(
            "priceCurrency",
            hasValue(search["priceCurrency"]),
            searchText,
            text || "",
            false,
            "input",
            search,
          ),
      },
      {
        title: "CODE",
        dataIndex: "priceCode",
        key: "priceCode",
        width: 150,
        align: "center",
        render: (text) =>
          renderColumn(
            "priceCode",
            hasValue(search["priceCode"]),
            searchText,
            text || "",
            false,
            "input",
            search,
          ),
      },
      {
        title: "MIN",
        dataIndex: "priceMin",
        key: "priceMin",
        width: 150,
        align: "right",
        render: (text,record) =>
          renderColumn(
            "priceMin",
            hasValue(search["priceMin"]),
            searchText,
            text,
            false,
            "input",
            search,
            record.priceCurrency === "USD" ? "currency-usd" : "currency-idr",
          ),
      },
      {
        title: "NORMAL",
        dataIndex: "priceNormal",
        key: "priceNormal",
        width: 150,
        align: "right",
        render: (text,record) =>
          renderColumn(
            "priceNormal",
            hasValue(search["priceNormal"]),
            searchText,
            text,
            false,
            "input",
            search,
            record.priceCurrency === "USD" ? "currency-usd" : "currency-idr",
          ),
      },
      {
        title: "OUP",
        dataIndex: "priceOup",
        key: "priceOup",
        width: 150,
        align: "right",
        render: (text,record) =>
          renderColumn(
            "priceOup",
            hasValue(search["priceOup"]),
            searchText,
            text,
            false,
            "input",
            search,
            record.priceCurrency === "USD" ? "currency-usd" : "currency-idr",
          ),
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
        render: (text, record) =>
          renderColumn(
            "amountPartitionMin",
            hasValue(search["amountPartitionMin"]),
            searchText,
            text,
            false,
            "input",
            search,
            record.priceCurrency === "USD" ? "currency-usd" : "currency-idr",
          ),
      },
      {
        title: "NORMAL",
        dataIndex: "amountPartitionNormal",
        key: "amountPartitionNormal",
        width: 200,
        align: "right",
        render: (text,record) =>
          renderColumn(
            "amountPartitionNormal",
            hasValue(search["amountPartitionNormal"]),
            searchText,
            text,
            false,
            "input",
            search,
            record.priceCurrency === "USD" ? "currency-usd" : "currency-idr",
          ),
      },
      {
        title: "OUP",
        dataIndex: "amountPartitionOup",
        key: "amountPartitionOup",
        width: 200,
        align: "right",
        render: (text, record) =>
          renderColumn(
            "amountPartitionOup",
            hasValue(search["amountPartitionOup"]),
            searchText,
            text,
            false,
            "input",
            search,
            record.priceCurrency === "USD" ? "currency-usd" : "currency-idr",
          ),
      },
    ],
  },
];

export const renderExpandedRow = (
  record,
  expandData,
  loadingExpand,
  search = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => {
  const rowKey = record.key;
  const isLoading = loadingExpand[rowKey];
  const expandedData = expandData[rowKey]?.result || [];

  const expandedColumns = getExpandedColumns(
    search,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
  );

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
