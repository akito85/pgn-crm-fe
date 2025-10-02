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
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "INVOICE NUMBER",
    dataIndex: "invoiceNumber",
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
    title: "TEMPLATE",
    dataIndex: "templateName",
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
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
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
    title: "BILLING PERIOD",
    sorter: true,
    align: "center",
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
    title: "BILLING CODE",
    dataIndex: "billingCode",
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
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
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
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
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
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
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
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
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
    title: "ACCOUNT GROUP TYPE",
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
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    align: "center",
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
    title: "SOR",
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
    title: "COST CENTER",
    dataIndex: "costCenter",
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
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    align: "center",
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
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
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
  // {
  //   title: "CURRENCY", //
  //   dataIndex: "currency",
  //   align: "center",
  //   sorter: true,
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "currency",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch
  //   ),
  //   render: (text) => renderColumn('currency', hasValue(search['currency']), searchText, text, false, 'input', search)
  // },
  // {
  //   title: "AMOUNT",
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "amount",
  //   ...getColumnSearchPropsUseFilteredValue(
  //    search,
  //     "amount",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   )
  // },
  // {
  //   title: "AMOUNT IDR", //
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "amountIdr",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "amountIdr",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   ),
  //   render: (text) => renderColumn('amountIdr', hasValue(search['amountIdr']), searchText, text, false, 'input', search)
  // },
  // {
  //   title: "AMOUNT USD", //
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "amountUsd",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "amountUsd",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   ),
  //   render: (text) => renderColumn('amountUsd', hasValue(search['amountUsd']), searchText, text, false, 'input', search)
  // },
  // {
  //   title: "TAX BASIS",//
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "taxBasis",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "taxBasis",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   ),
  //   render: (text) => renderColumn('taxBasis', hasValue(search['taxBasis']), searchText, text, false, 'input', search)
  // },
  {
    title: "TAX BASIS EQV IDR",
    sorter: true,
    align: "right",
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
  // {
  //   title: "VAT",
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "vat", //
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "vat",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   ),
  //   render: (text) => renderColumn('vat', hasValue(search['vat']), searchText, text, false, 'input', search)
  // },
  {
    title: "VAT EQV IDR",
    sorter: true,
    align: "right",
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
    title: "WITHHOLDING TAX",
    sorter: true,
    align: "right",
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
    title: "TAX RATE TYPE",
    dataIndex: "taxRateType",
    align: "center",
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
    title: "TAX RATE",
    sorter: true,
    align: "right",
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
    title: "TAX RATE DATE",
    sorter: true,
    align: "center",
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
  // {
  //   title: "DISCOUNT AMOUNT", //
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "discountAmount",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "discountAmount",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   ),
  //   render: (text) => renderColumn('taxRate', hasValue(search['taxRate']), searchText, text, false, 'input', search)
  // },
  // {
  //   title: "DISCOUNT AMOUNT IDR",//
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "discountAmountIdr",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "discountAmountIdr",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   ),
  //   render: (text) => renderColumn('discountAmountIdr', hasValue(search['discountAmountIdr']), searchText, text, false, 'input', search)
  // },
  // {
  //   title: "DISCOUNT AMOUNT USD", //
  //   sorter: true,
  //   align: "right",
  //   dataIndex: "discountAmountUsd",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "discountAmountUsd",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //   ),
  //   render: (text) => renderColumn('discountAmountUsd', hasValue(search['discountAmountUsd']), searchText, text, false, 'input', search)
  // },
  {
    title: "TOTAL AMOUNT IDR",
    sorter: true,
    align: "right",
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
    title: "TOTAL AMOUNT USD",
    sorter: true,
    align: "right",
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
    title: "TERMS OF PAYMENT",
    dataIndex: "termOfPayment",
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
    title: "TRANSACTION DATE",
    sorter: true,
    align: "center",
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
    title: "INVOICE DATE",
    sorter: true,
    align: "center",
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
    title: "DUE DATE",
    sorter: true,
    align: "center",
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
    title: "RATE TYPE",
    sorter: true,
    align: "center",
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
    title: "RATE",
    sorter: true,
    align: "right",
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
    title: "RATE DATE",
    sorter: true,
    align: "center",
    dataIndex: "transactionDate",
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
        "transactionDate",
        hasValue(search["transactionDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "TOTAL AMOUNT EQV IDR",
    sorter: true,
    align: "right",
    dataIndex: "totalAmountEqvIdr",
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
    title: "TOTAL AMOUNT EQV USD",
    sorter: true,
    align: "right",
    dataIndex: "totalAmountEqvUsd",
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
    sorter: true,
    title: "REMARK",
    dataIndex: "remark",
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
    title: "STATUS",
    dataIndex: "status",
    fixed: "right",
    width: 150,
    align: "left",
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
      <div className="flex justify-start">
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
      </div>
    ),
  },
];
