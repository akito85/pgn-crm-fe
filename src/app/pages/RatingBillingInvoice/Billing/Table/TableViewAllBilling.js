import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { Tooltip } from "antd";

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
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "invoiceNumber",
    title: "INVOICE NUMBER",
    dataIndex: "invoiceNumber",
    isClassification:true,
    sorter: true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "invoiceNumber",
        hasValue(search["invoiceNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingType",
    title: "BILLING TYPE",
    dataIndex: "billingType",
    sorter: true,
    isClassification:true,
    width: 150,
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
        { value: "Gas", label: "Gas" },
        { value: "Non Gas", label: "Non Gas" },
      ]
    ),
    render: (text) =>
      renderColumn(
        "billingType",
        hasValue(search["billingType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    sorter: true,
    isNumber:true,
    width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "quantity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(search["quantity"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountIdr",
    title: "TOTAL AMOUNT (IDR)",
    dataIndex: "totalAmountIdr",
    sorter: true,
    isNumber:true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmountIdr",
        hasValue(search["totalAmountIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    sorter: true,
    isClassification:true,
    width: 180,
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
    isClassification:true,
    dataIndex: "remark",
    width: 300,
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