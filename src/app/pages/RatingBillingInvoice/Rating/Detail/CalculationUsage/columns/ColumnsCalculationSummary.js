import React from "react";
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
    dataIndex: "totalAmount",
    key: "totalAmount",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    key: "totalAmount",
    width: 180,
    align: "right",
    sorter: true,
    render: (text) => renderNumber(text, 3),
  },
];

// Kolom untuk expanded table - menyesuaikan dengan design Figma
export const getExpandedColumns = () => [
  {
    title: "CALCULATED USAGE PARTITION",
    children: [
      {
        title: "NO",
        dataIndex: "no",
        key: "expanded_no",
        width: 50,
        align: "center",
        render: (text, record, index) => index + 1,
      },
      {
        title: "UOM",
        dataIndex: "uom",
        key: "uom",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "MIN",
        dataIndex: "usageMin",
        key: "usage_min",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "NORMAL",
        dataIndex: "usageNormal",
        key: "usage_normal",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "OUP",
        dataIndex: "usageOup",
        key: "usage_oup",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
    ],
  },
  {
    title: "PRICE",
    children: [
      {
        title: "CURRENCY",
        dataIndex: "priceCurrency",
        key: "price_currency",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "PRICE CODE",
        dataIndex: "priceCode",
        key: "price_code",
        width: 150,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "MIN",
        dataIndex: "priceMin",
        key: "price_min",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "NORMAL",
        dataIndex: "priceNormal",
        key: "price_normal",
        width: 150,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "OUP",
        dataIndex: "priceOup",
        key: "price_oup",
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
        dataIndex: "amountCurrency",
        key: "amount_currency",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "MIN",
        dataIndex: "amountMin",
        key: "amount_min",
        width: 200,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "NORMAL",
        dataIndex: "amountNormal",
        key: "amount_normal",
        width: 200,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
      {
        title: "OUP",
        dataIndex: "amountOup",
        key: "amount_oup",
        width: 200,
        align: "right",
        render: (text) => renderNumber(text, 3),
      },
    ],
  },
];

// Render expanded row menggunakan TableRBI component
export const renderExpandedRow = (record) => {
  const expandedData = record.partitions || [];
  const expandedColumns = getExpandedColumns();

  return (
    <div className="bg-white" style={{ marginLeft: "28px" }}>
      <TableRBI
        idTable={`expanded-table-${record.id}`}
        columns={expandedColumns}
        dataSource={expandedData}
        size="small"
        tableScrolled={{ x: 1000 }}
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
