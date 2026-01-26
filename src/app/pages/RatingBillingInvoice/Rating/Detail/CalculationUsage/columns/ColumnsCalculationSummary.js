import React from "react";
import { Spin } from "antd";
import TableRBI from "../../../../../../../components/TableRBI";
import { separatorNumber } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";

// Helper function untuk render number dengan decimal
const renderNumber = (value, decimal = 3) => {
  if (value === null || value === undefined || value === "") return "-";
  return separatorNumber(value, decimal);
};

// Helper function untuk render date
const renderDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Kolom untuk tabel utama (summary) - Data SEDIKIT
export const columnsCalculationSummary = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    width: 38,
    align: "center",
    fixed: "left",
    render: (text, record, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "TRANSACTION DATE",
    dataIndex: "transactionDate",
    key: "transactionDate",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "transactionDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) => renderDate(text),
  },
  {
    title: "USAGE",
    dataIndex: "usage",
    key: "usage",
    width: 150,
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
      "input",
    ),
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "SA TYPE",
    dataIndex: "saType",
    key: "saType",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    key: "amount",
    width: 180,
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      {},
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "amountPartitionTotal",
    key: "amountPartitionTotal",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
];

// Kolom untuk expanded table - Data BANYAK dengan semua partisi
export const getExpandedColumns = () => [
  {
    title: "NO",
    dataIndex: "no",
    key: "expanded_no",
    width: 50,
    align: "center",
    render: (text, record, index) => index + 1,
  },
  {
    title: "CALCULATED USAGE PARTITION",
    children: [
      {
        title: "UOM",
        dataIndex: "calculatedUsageUom",
        key: "calculatedUsageUom",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "MIN",
        dataIndex: "calculatedUsageMin",
        key: "calculatedUsageMin",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "NORMAL",
        dataIndex: "calculatedUsageNormal",
        key: "calculatedUsageNormal",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "OUP",
        dataIndex: "calculatedUsageUop",
        key: "calculatedUsageUop",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
    ],
  },
  {
    title: "CONVERTED CALCULATED",
    children: [
      {
        title: "UOM",
        dataIndex: "convertedCalculatedUom",
        key: "convertedCalculatedUom",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "MIN",
        dataIndex: "convertedCalculatedMin",
        key: "convertedCalculatedMin",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 8),
      },
      {
        title: "NORMAL",
        dataIndex: "convertedCalculatedNormal",
        key: "convertedCalculatedNormal",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 8),
      },
      {
        title: "OUP",
        dataIndex: "convertedCalculatedOup",
        key: "convertedCalculatedOup",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 8),
      },
    ],
  },
  {
    title: "PRICE",
    children: [
      {
        title: "CURRENCY",
        dataIndex: "currency",
        key: "currency",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "PRICE CODE",
        dataIndex: "priceCode",
        key: "priceCode",
        width: 150,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "MIN",
        dataIndex: "priceMin",
        key: "priceMin",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "NORMAL",
        dataIndex: "priceNormal",
        key: "priceNormal",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "OUP",
        dataIndex: "priceOup",
        key: "priceOup",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
    ],
  },
  {
    title: "AMOUNT PARTITION",
    children: [
      {
        title: "CURRENCY",
        dataIndex: "amountPartitionCurrency",
        key: "amountPartitionCurrency",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "MIN",
        dataIndex: "amountPartitionMin",
        key: "amountPartitionMin",
        width: 200,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "NORMAL",
        dataIndex: "amountPartitionNormal",
        key: "amountPartitionNormal",
        width: 200,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "OUP",
        dataIndex: "amountPartitionOup",
        key: "amountPartitionOup",
        width: 200,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
    ],
  },
];

// Render expanded row - mengambil data dari redux
export const renderExpandedRow = (record, expandData, loadingExpand) => {
  const rowKey = `${record.transactionDate}-${record.saType}`;
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

  // Show empty state
  if (!expandedData || expandedData.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white" style={{ marginLeft: "28px" }}>
      <TableRBI
        idTable={`expanded-table-${rowKey}`}
        columns={expandedColumns}
        dataSource={expandedData}
        size="small"
        tableScrolled={{ x: 2000 }}
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