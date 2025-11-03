import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";

export const columnsInvoice = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
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
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "templateName",
    title: "TEMPLATE",
    dataIndex: "templateName",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "templateName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "templateName",
        hasValue(search["templateName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingCycle",
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "billingCycle",
        hasValue(search["billingCycle"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingPeriodName",
    title: "BILLING PERIOD",
    sorter: true,
    align: "center",
    width: 180,
    dataIndex: "billingPeriodName",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingPeriodName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriodName",
        hasValue(search["billingPeriodName"]),
        searchText,
        text,
        "datePeriod",
        search
      ),
  },
  {
    key: "billingCode",
    title: "BILLING CODE",
    dataIndex: "billingCode",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerNumber",
        hasValue(search["customerNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 250,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerName",
        hasValue(search["customerName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 250,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountName",
        hasValue(search["accountName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    width: 180,
    dataIndex: "accountGroupType",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountGroupType",
        hasValue(search["accountGroupType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "serviceType",
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    align: "center",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "serviceType",
        hasValue(search["serviceType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "sor",
    title: "SOR",
    width: 250,
    dataIndex: "sor",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "sor",
        hasValue(search["sor"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    align: "center",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountSegment",
        hasValue(search["accountSegment"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "meterReadingCode",
        hasValue(search["meterReadingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxBasicEqvIdr",
    title: "TAX BASIS EQV IDR",
    sorter: true,
    align: "right",
    width: 200,
    dataIndex: "taxBasicEqvIdr",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxBasicEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxBasicEqvIdr",
        hasValue(search["taxBasicEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "vatEqvIdr",
    title: "VAT EQV IDR",
    sorter: true,
    align: "right",
    width: 200,
    dataIndex: "vatEqvIdr",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "vatEqvIdr",
        hasValue(search["vatEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "withHoldingTax",
    title: "WITHHOLDING TAX",
    sorter: true,
    align: "right",
    width: 200,
    dataIndex: "withHoldingTax",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "withHoldingTax",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "withHoldingTax",
        hasValue(search["withHoldingTax"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxRateType",
    title: "TAX RATE TYPE",
    dataIndex: "taxRateType",
    align: "center",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxRateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxRateType",
        hasValue(search["taxRateType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxRate",
    title: "TAX RATE",
    sorter: true,
    align: "right",
    width: 150,
    dataIndex: "taxRate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxRate",
        hasValue(search["taxRate"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxRateDate",
    title: "TAX RATE DATE",
    sorter: true,
    align: "center",
    width: 150,
    dataIndex: "taxRateDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxRateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "taxRateDate",
        hasValue(search["taxRateDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "totalAmountIdr",
    title: "TOTAL AMOUNT IDR",
    sorter: true,
    align: "right",
    width: 200,
    dataIndex: "totalAmountIdr",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "totalAmountUsd",
    title: "TOTAL AMOUNT USD",
    sorter: true,
    align: "right",
    width: 200,
    dataIndex: "totalAmountUsd",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountUsd",
        hasValue(search["totalAmountUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "termOfPayment",
    title: "TERMS OF PAYMENT",
    dataIndex: "termOfPayment",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "termOfPayment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "termOfPayment",
        hasValue(search["termOfPayment"]),
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
    align: "center",
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
    key: "invoiceDate",
    title: "INVOICE DATE",
    sorter: true,
    align: "center",
    width: 180,
    dataIndex: "invoiceDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "invoiceDate",
        hasValue(search["invoiceDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "dueDate",
    title: "DUE DATE",
    sorter: true,
    align: "center",
    width: 180,
    dataIndex: "dueDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "dueDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "dueDate",
        hasValue(search["dueDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    sorter: true,
    align: "center",
    width: 150,
    dataIndex: "rateType",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        hasValue(search["rateType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "rate",
    title: "RATE",
    sorter: true,
    align: "right",
    width: 180,
    dataIndex: "rate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "rate",
        hasValue(search["rate"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    sorter: true,
    align: "center",
    width: 180,
    dataIndex: "rateDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(search["rateDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "totalAmountEqvIdr",
    title: "TOTAL AMOUNT EQV IDR",
    sorter: true,
    align: "right",
    width: 200,
    dataIndex: "totalAmountEqvIdr",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvIdr",
        hasValue(search["totalAmountEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountEqvUsd",
    title: "TOTAL AMOUNT EQV USD",
    sorter: true,
    align: "right",
    width: 200,
    dataIndex: "totalAmountEqvUsd",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvUsd",
        hasValue(search["totalAmountEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "remark",
    sorter: true,
    title: "REMARK",
    dataIndex: "remark",
    width: 250,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(search, "remark"),
    render: (text) =>
      renderColumn(
        "remark",
        hasValue(search["remark"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    fixed: "right",
    width: 150,
    align: "center",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => (
      // <div>
      <StatusComponent
        colour={
          text?.toLowerCase() === "inprogress"
            ? "in progress"
            : text?.toLowerCase()
        }
      >
        {toTitleCase(
          text?.toLowerCase() === "inprogress"
            ? "in progress"
            : text?.toLowerCase()
        )}
      </StatusComponent>
      // </div>
    ),
  },
];
