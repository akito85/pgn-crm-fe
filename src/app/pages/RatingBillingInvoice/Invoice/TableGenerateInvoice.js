import moment from "moment";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../utils";
import {
  getColumnSearchProps,
  getColumnSearchPropsUseFilteredValueFE,
} from "../../../../utils/getColumnSearchProps";

const sorter = (fieldSort, a, b) => {
  // console.log(fieldSort, a, b, "sprter");
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
      case "taxRateDate":
      case "transactionDate":
      case "invoiceDate":
      case "dueDate":
      case "rateDate":
      case "billingPeriodDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : "";
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
      case "amountIdr":
      case "amountUsd":
      case "taxBasisIdr":
      case "taxBasisUsd":
      case "taxBasisEqvIdr":
      case "vatIdr":
      case "vatUsd":
      case "vatEqvIdr":
      case "withholdingTax":
      case "taxRate":
      case "discountAmount":
      case "discountAmountIdr":
      case "discountAmountUsd":
      case "totalAmountIdr":
      case "totalAmountUsd":
      case "rate":
      case "totalAmountEqvIdr":
      case "totalAmountEqvUsd":
        return obj[fieldSort]
          ? (obj[fieldSort] || 0)?.toString()?.toLowerCase()
          : "0";

      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
      case "taxRateDate":
      case "transactionDate":
      case "invoiceDate":
      case "dueDate":
      case "rateDate":
      case "billingPeriodDate":
        if (a && b) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
      case "amountIdr":
      case "amountUsd":
      case "taxBasisIdr":
      case "taxBasisUsd":
      case "taxBasisEqvIdr":
      case "vatIdr":
      case "vatUsd":
      case "vatEqvIdr":
      case "withholdingTax":
      case "taxRate":
      case "discountAmount":
      case "discountAmountIdr":
      case "discountAmountUsd":
      case "totalAmountIdr":
      case "totalAmountUsd":
      case "rate":
      case "totalAmountEqvIdr":
      case "totalAmountEqvUsd":
        return Math.sign(
          parseInt(a.replace(/,/g, "")) - parseInt(b.replace(/,/g, "")),
        );
      default:
        return a.localeCompare(b);
    }
  };

  return handleCompare(fa, fb);
};

export const columnsGenerateInvoice = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
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
    // sorter: true,
    sorter: (a, b) => sorter("invoiceNumber", a, b),
    filteredValue: search?.["invoiceNumber"]
      ? [search?.["invoiceNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "invoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "invoiceNumber",
        hasValue(search["invoiceNumber"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    // sorter: true,
    sorter: (a, b) => sorter("billingCycle", a, b),
    filteredValue: search?.["billingCycle"] ? [search?.["billingCycle"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "billingCycle",
        hasValue(search["billingCycle"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    // sorter: true,
    align: "center",
    sorter: (a, b) => sorter("billingPeriod", a, b),
    filteredValue: search?.["billingPeriod"]
      ? [search?.["billingPeriod"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriod",
        hasValue(search["billingPeriod"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "BILLING CODE",
    dataIndex: "billingCode",
    // sorter: true,
    sorter: (a, b) => sorter("billingCode", a, b),
    filteredValue: search?.["billingCode"] ? [search?.["billingCode"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "billingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "billingCode",
        hasValue(search["billingCode"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: (a, b) => sorter("customerNumber", a, b),
    filteredValue: search?.["customerNumber"]
      ? [search?.["customerNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "customerNumber",
        hasValue(search["customerNumber"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    // sorter: true,
    sorter: (a, b) => sorter("customerName", a, b),
    filteredValue: search?.["customerName"] ? [search?.["customerName"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "customerName",
        hasValue(search["customerName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: (a, b) => sorter("accountNumber", a, b),
    filteredValue: search?.["accountNumber"]
      ? [search?.["accountNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountNumber",
        hasValue(search["accountNumber"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    sorter: (a, b) => sorter("accountName", a, b),
    filteredValue: search?.["accountName"] ? [search?.["accountName"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountName",
        hasValue(search["accountName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    // sorter: true,
    align: "center",
    sorter: (a, b) => sorter("accountGroupType", a, b),
    filteredValue: search?.["accountGroupType"]
      ? [search?.["accountGroupType"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountGroupType",
        hasValue(search["accountGroupType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    align: "center",
    sorter: (a, b) => sorter("serviceType", a, b),
    filteredValue: search?.["serviceType"] ? [search?.["serviceType"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "serviceType",
        hasValue(search["serviceType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "SOR",
    dataIndex: "sor",
    // sorter: true,
    sorter: (a, b) => sorter("sor", a, b),
    filteredValue: search?.["sor"] ? [search?.["sor"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "sor",
        hasValue(search["sor"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    // sorter: true,
    sorter: (a, b) => sorter("costCenter", a, b),
    filteredValue: search?.["costCenter"] ? [search?.["costCenter"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    sorter: (a, b) => sorter("accountSegment", a, b),
    filteredValue: search?.["accountSegment"]
      ? [search?.["accountSegment"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accountSegment",
        hasValue(search["accountSegment"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    // sorter: true,
    sorter: (a, b) => sorter("meterReadingCode", a, b),
    filteredValue: search?.["meterReadingCode"]
      ? [search?.["meterReadingCode"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "meterReadingCode",
        hasValue(search["meterReadingCode"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "AMOUNT IDR",
    dataIndex: "amountIdr",
    align: "right",
    // sorter: true,
    sorter: (a, b) => sorter("amountIdr", a, b),
    filteredValue: search?.["amountIdr"] ? [search?.["amountIdr"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "amountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "amountIdr",
        hasValue(search["amountIdr"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "AMOUNT USD",
    dataIndex: "amountUsd",
    align: "right",
    // sorter: true,
    sorter: (a, b) => sorter("amountUsd", a, b),
    filteredValue: search?.["amountUsd"] ? [search?.["amountUsd"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "amountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "amountUsd",
        hasValue(search["amountUsd"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  // {
  //   title: "TAX BASIS",
  //   dataIndex: "taxBasis",
  //   align: "right",
  //   // sorter: true,
  //   sorter: (a, b) => sorter("taxBasis", a, b),
  //   filteredValue: search?.["taxBasis"] ? [search?.["taxBasis"]] : null,
  //   ...getColumnSearchPropsUseFilteredValueFE(
  //     search,
  //     "taxBasis",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "taxBasis",
  //       hasValue(search["taxBasis"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search
  //     ),
  // },
  {
    title: "TAX BASIS EQV IDR",
    dataIndex: "taxBasicIdr",
    align: "right",
    sorter: (a, b) => sorter("taxBasicIdr", a, b),
    filteredValue: search?.["taxBasicIdr"] ? [search?.["taxBasicIdr"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "taxBasicIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "taxBasicIdr",
        hasValue(search["taxBasicIdr"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  // {
  //   title: "VAT",
  //   dataIndex: "vat",
  //   align: "right",
  //   sorter: (a, b) => sorter("vat", a, b),
  //   filteredValue: search?.["vat"] ? [search?.["vat"]] : null,
  //   ...getColumnSearchPropsUseFilteredValueFE(
  //     search,
  //     "vat",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "vat",
  //       hasValue(search["vat"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search
  //     ),
  // },
  {
    title: "VAT EQV IDR",
    dataIndex: "vatIdr",
    align: "right",
    // sorter: true,
    sorter: (a, b) => sorter("vatIdr", a, b),
    filteredValue: search?.["vatIdr"] ? [search?.["vatIdr"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "vatIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "vatIdr",
        hasValue(search["vatIdr"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },

  {
    title: "WITHOLDING TAX",
    dataIndex: "withHoldingTax",
    align: "right",
    sorter: (a, b) => sorter("withHoldingTax", a, b),
    filteredValue: search?.["withHoldingTax"]
      ? [search?.["withHoldingTax"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "withHoldingTax",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "withHoldingTax",
        hasValue(search["withHoldingTax"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TAX RATE TYPE",
    dataIndex: "taxRateType",
    align: "center",
    sorter: (a, b) => sorter("taxRateType", a, b),
    filteredValue: search?.["taxRateType"] ? [search?.["taxRateType"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "taxRateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "taxRateType",
        hasValue(search["taxRateType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TAX RATE",
    dataIndex: "taxRate",
    align: "right",
    // sorter: true,
    sorter: (a, b) => sorter("taxRate", a, b),
    filteredValue: search?.["taxRate"] ? [search?.["taxRate"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "taxRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "taxRate",
        hasValue(search["taxRate"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TAX RATE DATE",
    dataIndex: "taxRateDate",
    align: "center",
    sorter: (a, b) => sorter("taxRateDate", a, b),
    filteredValue: search?.["taxRateDate"] ? [search?.["taxRateDate"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "taxRateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "taxRateDate",
        hasValue(search["taxRateDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  // {
  //   title: "DISCOUNT AMOUNT IDR",
  //   dataIndex: "discAmountIdr",
  //   align: "right",
  //   sorter: (a, b) => sorter("discAmountIdr", a, b),
  //   filteredValue: search?.["discAmountIdr"] ? [search?.["discAmountIdr"]] : null,
  //   ...getColumnSearchPropsUseFilteredValueFE(
  //     search,
  //     "discAmountIdr",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "discAmountIdr",
  //       hasValue(search["discAmountIdr"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search
  //     ),
  // },
  // {
  //   title: "DISCOUNT AMOUNT USD",
  //   dataIndex: "discAmountUsd",
  //   align: "right",
  //   sorter: (a, b) => sorter("discAmountUsd", a, b),
  //   filteredValue: search?.["discAmountUsd"] ? [search?.["discAmountUsd"]] : null,
  //   ...getColumnSearchPropsUseFilteredValueFE(
  //     search,
  //     "discAmountUsd",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "discAmountUsd",
  //       hasValue(search["discAmountUsd"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search
  //     ),
  // },

  {
    title: "TOTAL AMOUNT IDR",
    // sorter: true,
    // align: "right",
    dataIndex: "totalAmountIdr",
    align: "right",
    sorter: (a, b) => sorter("totalAmountIdr", a, b),
    filteredValue: search?.["totalAmountIdr"]
      ? [search?.["totalAmountIdr"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "totalAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmountIdr",
        hasValue(search["totalAmountIdr"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TOTAL AMOUNT USD",
    // sorter: true,
    align: "right",
    dataIndex: "totalAmountUsd",
    sorter: (a, b) => sorter("totalAmountUsd", a, b),
    filteredValue: search?.["totalAmountUsd"]
      ? [search?.["totalAmountUsd"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "totalAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmountUsd",
        hasValue(search["totalAmountUsd"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TERMS OF PAYMENT",
    dataIndex: "termOfPayment",
    // sorter: true,
    align: "center",
    sorter: (a, b) => sorter("termOfPayment", a, b),
    filteredValue: search?.["termOfPayment"]
      ? [search?.["termOfPayment"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "termOfPayment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "termOfPayment",
        hasValue(search["termOfPayment"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    // sorter: true,
    title: "TRANSACTION DATE",
    dataIndex: "transactionDate",
    align: "center",
    sorter: (a, b) => sorter("transactionDate", a, b),
    filteredValue: search?.["transactionDate"]
      ? [search?.["transactionDate"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
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
    // sorter: true,
    title: "INVOICE DATE",
    dataIndex: "invoiceDate",
    align: "center",
    sorter: (a, b) => sorter("invoiceDate", a, b),
    filteredValue: search?.["invoiceDate"] ? [search?.["invoiceDate"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "invoiceDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "invoiceDate",
        hasValue(search["invoiceDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    // sorter: true,
    title: "DUE DATE",
    dataIndex: "dueDate",
    align: "center",
    sorter: (a, b) => sorter("dueDate", a, b),
    filteredValue: search?.["dueDate"] ? [search?.["dueDate"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "dueDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "dueDate",
        hasValue(search["dueDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    // sorter: true,
    title: "RATE TYPE",
    dataIndex: "rateType",
    align: "center",
    sorter: (a, b) => sorter("rateType", a, b),
    filteredValue: search?.["rateType"] ? [search?.["rateType"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        hasValue(search["rateType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    // sorter: true,
    title: "RATE",
    dataIndex: "rate",
    align: "right",
    sorter: (a, b) => sorter("rate", a, b),
    filteredValue: search?.["rate"] ? [search?.["rate"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "rate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "rate",
        hasValue(search["rate"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    // sorter: true,
    title: "RATE DATE",
    dataIndex: "rateDate",
    align: "center",
    sorter: (a, b) => sorter("rateDate", a, b),
    filteredValue: search?.["rateDate"] ? [search?.["rateDate"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(search["rateDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    // sorter: true,
    title: "TOTAL AMOUNT EQUIVALENT IDR",
    dataIndex: "totalAmountEqvIdr",
    align: "right",
    sorter: (a, b) => sorter("totalAmountEqvIdr", a, b),
    filteredValue: search?.["totalAmountEqvIdr"]
      ? [search?.["totalAmountEqvIdr"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "totalAmountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvIdr",
        hasValue(search["totalAmountEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    // sorter: true,
    title: "TOTAL AMOUNT EQUIVALENT USD",
    dataIndex: "totalAmountEqvUsd",
    align: "right",
    sorter: (a, b) => sorter("totalAmountEqvUsd", a, b),
    filteredValue: search?.["totalAmountEqvUsd"]
      ? [search?.["totalAmountEqvUsd"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "totalAmountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvUsd",
        hasValue(search["totalAmountEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
];
