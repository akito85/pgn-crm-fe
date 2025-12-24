import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { Tooltip } from "antd";
import {
  currencyFormatting,
  numberFormatting,
} from "../../../../../utils/formatCurrency";

export const columnsAllBilling = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 30,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "billingCode",
    title: "INVOICE NUMBER",
    dataIndex: "billingCode",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingCode",
        hasValue(search["billingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingType",
    title: "TYPE",
    dataIndex: "billingType",
    sorter: true,
    align: "center",
    width: 120,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "select",
      [
        { value: "GAS", label: "Gas" },
        { value: "NON_GAS", label: "Non Gas" },
      ]
    ),
    render: (text) => {
      const displayText =
        text === "GAS" ? "Gas" : text === "NON_GAS" ? "Non Gas" : text;
      return renderColumn(
        "billingType",
        hasValue(search["billingType"]),
        searchText,
        displayText,
        false,
        "input",
        search
      );
    },
  },
  {
    key: "totalQuantity",
    title: "QTY",
    dataIndex: "totalQuantity",
    sorter: true,
    align: "right",
    width: 120,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalQuantity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      const formatted = numberFormatting(text);
      return renderColumn(
        "totalQuantity",
        hasValue(search["totalQuantity"]),
        searchText,
        formatted,
        false,
        "input",
        search
      );
    },
  },
  {
    key: "totalPriceIdr",
    title: "AMOUNT (IDR)",
    dataIndex: "totalPriceIdr",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalPriceIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      const formatted = currencyFormatting(text);
      return renderColumn(
        "totalPriceIdr",
        hasValue(search["totalPriceIdr"]),
        searchText,
        formatted,
        false,
        "input",
        search
      );
    },
  },
  {
    key: "totalAmountIdr",
    title: "TOTAL (IDR)",
    dataIndex: "totalAmountIdr",
    sorter: true,
    align: "right",
    width: 180,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      const formatted = currencyFormatting(text);
      return renderColumn(
        "totalAmountIdr",
        hasValue(search["totalAmountIdr"]),
        searchText,
        formatted,
        false,
        "input",
        search
      );
    },
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    sorter: true,
    align: "center",
    width: 160,
    dataIndex: "transactionDate",
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
    key: "remark",
    sorter: true,
    title: "REMARK",
    isClassification: true,
    dataIndex: "remark",
    width: 250,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {renderColumn(
            "remark",
            hasValue(search["remark"]),
            searchText,
            text,
            true,
            "input",
            search
          )}
        </Tooltip>
      ) : (
        ""
      ),
  },
];
