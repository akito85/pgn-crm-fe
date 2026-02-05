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
    title: "USAGE",
    dataIndex: "usage",
    key: "usage",
    width: 150,
    align: "right",
    sorter: true,
    isNumber: true,
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
    title: "AMOUNT",
    dataIndex: "amount",
    key: "amount",
    width: 180,
    align: "right",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "amount",
        hasValue(search["amount"]),
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
    dataIndex: "amountPartitionTotal",
    key: "amountPartitionTotal",
    width: 180,
    align: "right",
    sorter: true,
    isNumber: true,
    render: (text) => currencyFormatting(text, "idr"),
  },
];

export const getExpandedColumns = () => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => index + 1,
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
        render: (text) => usageFormatting(text),
      },
      {
        title: "NORMAL",
        dataIndex: "calculatedUsageNormal",
        key: "calculatedUsageNormal",
        width: 150,
        align: "right",
        render: (text) => usageFormatting(text),
      },
      {
        title: "OUP",
        dataIndex: "calculatedUsageUop",
        key: "calculatedUsageUop",
        width: 150,
        align: "right",
        render: (text) => usageFormatting(text),
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
        render: (text) => usageFormatting(text),
      },
      {
        title: "NORMAL",
        dataIndex: "convertedCalculatedNormal",
        key: "convertedCalculatedNormal",
        width: 150,
        align: "right",
        render: (text) => usageFormatting(text),
      },
      {
        title: "OUP",
        dataIndex: "convertedCalculatedOup",
        key: "convertedCalculatedOup",
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

// Render expanded row
// Render expanded row
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
        tableScrolled={{ x: 2000, y:200}}
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
