// PERUBAHAN PADA COLUMNSCALCULATIONSUMMARY

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

// Kolom untuk tabel utama tetap sama, tidak ada perubahan
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
    width: 60,
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
    title: "SA TYPE",
    dataIndex: "saType",
    key: "saType",
    width: 150,
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
    title: "Calculated Total",
    dataIndex: "calculatedTotal",
    key: "calculatedTotal",
    width: 150,
    align: "right",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "calculatedTotal",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "calculatedTotal",
        hasValue(search["calculatedTotal"]),
        searchText,
        text,
        false,
        "input",
        search,
        "calculatedTotal",
      ),
  },
  {
    title: "Converted Calculated Total",
    dataIndex: "convertedCalculatedTotal",
    key: "convertedCalculatedTotal",
    width: 180,
    align: "right",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convertedCalculatedTotal",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "convertedCalculatedTotal",
        hasValue(search["convertedCalculatedTotal"]),
        searchText,
        text,
        false,
        "input",
        search,
        "usage",
      ),
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "amountPartitionTotal",
    key: "amountPartitionTotal",
    width: 180,
    align: "right",
    sorter: true,
    isNumber: true,
    render: (text) => currencyFormatting(text, "idr"),
  },
];

// PERUBAHAN: Update kolom expanded sesuai response API
export const getExpandedColumns = () => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => index + 1,
  },
  {
    title: "LINE NO",
    dataIndex: "lineNo",
    key: "lineNo",
    width: 100,
    align: "center",
    render: (text) => text || "-",
  },
  {
    title: "UOM",
    dataIndex: "uom",
    key: "uom",
    width: 100,
    align: "center",
    render: (text) => text || "-",
  },
  {
    title: "USAGE PARTITION",
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
    title: "PRICE",
    children: [
      {
        title: "CURRENCY",
        dataIndex: "priceCurrency",
        key: "priceCurrency",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        title: "CODE",
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

// PERUBAHAN UTAMA: Update renderExpandedRow untuk menggunakan id
export const renderExpandedRow = (record, expandData, loadingExpand) => {
  const rowKey = record.id; // Gunakan id sebagai key
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

  const handleWheel = (e) => {
    const expandedContainer = e.currentTarget;
    const expandedTableWrapper =
      expandedContainer.querySelector(".ant-table-body");
    if (expandedTableWrapper) {
      const { scrollLeft, scrollWidth, clientWidth } = expandedTableWrapper;
      const hasHorizontalScroll = scrollWidth > clientWidth;
      const isHorizontalScrolling = Math.abs(e.deltaX) > Math.abs(e.deltaY);

      if (isHorizontalScrolling && hasHorizontalScroll) {
        return;
      }
      if (hasHorizontalScroll) {
        const isAtLeftEdge = scrollLeft === 0 && e.deltaX < 0;
        const isAtRightEdge =
          scrollLeft + clientWidth >= scrollWidth - 1 && e.deltaX > 0;
        if (!isAtLeftEdge && !isAtRightEdge) {
          e.stopPropagation();
        }
      } else {
        e.stopPropagation();
      }
    }
  };

  return (
    <div
      className="bg-white"
      style={{ marginLeft: "28px" }}
      onWheel={handleWheel}
    >
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