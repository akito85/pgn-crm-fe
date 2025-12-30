import React, { Fragment } from "react";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import {
  getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValueFE,
} from "../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";

// const onFilter = (dataIndex, value, record) => {
//   const fixSearchText = value?.toLowerCase();
//   switch (dataIndex) {
//     case "startDate":
//     case "endDate":
//     case "proformaInvoiceDate":
//     case "invoiceDate":
//     case "transactionDate":
//     case "taxRateDate":
//     case "accountingDate":
//     case "dueDate":
//     case "rateDate":
//       const date = record[dataIndex]
//         ? moment(record[dataIndex]).format("DD MMM YYYY")
//         : "";
//       return date.toLowerCase().includes(fixSearchText);
//     case "price":
//     case "quantity":
//     case "amount":
//     case "amountEqvIdr":
//     case "amountEqvUsd":
//     case "eqvIdrTaxPurpose":
//     case "discount":
//     case "total":
//     case "totalEqvIdr":
//     case "totalEqvUsd":
//     case "amountIdr":
//     case "amountUsd":
//     case "taxBasisIdr":
//     case "taxBasisUsd":
//     case "taxBasisEqvIdr":
//     case "vatIdr":
//     case "vatUsd":
//     case "vatEqvIdr":
//     case "withholdingTax":
//     case "taxRate":
//     case "discountAmount":
//     case "discountAmountIdr":
//     case "discountAmountUsd":
//     case "totalAmountIdr":
//     case "totalAmountUsd":
//     case "rate":
//     case "totalAmountEqvIdr":
//     case "totalAmountEqvUsd":
//       const tempValue = record[dataIndex]
//         ? (record[dataIndex] + "").split(".")
//         : [];
//       const thousandSeparator = ".";
//       const decimalSeparator = ",";
//       const descimal = tempValue[1]
//         ? `${decimalSeparator}${tempValue[1]}`
//         : `${decimalSeparator}00`;
//       const format =
//         tempValue.length > 0
//           ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
//             descimal
//           : "";
//       return format.toLowerCase().includes(fixSearchText);

//     default:
//       return record[dataIndex]?.toLowerCase().includes(fixSearchText);
//   }
// };

// Sorting Table
const sorter = (fieldSort, a, b) => {
  // console.log(fieldSort, a, b, "sprter");
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
      case "proformaInvoiceDate":
      case "invoiceDate":
      case "transactionDate":
      case "taxRateDate":
      case "accountingDate":
      case "dueDate":
      case "rateDate":
      case "billingPeriod":
        const date = obj[fieldSort]
          ? moment(obj[fieldSort]).format("DD MMM YYYY")
          : "";
        return date.toLowerCase();
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdrTaxPurpose":
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
        // const tempValue = obj[fieldSort]
        //   ? (obj[fieldSort] + "").split(".")
        //   : [];
        // const thousandSeparator = ".";
        // const decimalSeparator = ",";
        // const descimal = tempValue[1]
        //   ? `${decimalSeparator}${tempValue[1]}`
        //   : `${decimalSeparator}00`;
        // const format =
        //   tempValue.length > 0
        //     ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        //       descimal
        //     : "";
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
          parseInt(a.replace(/,/g, "")) - parseInt(b.replace(/,/g, ""))
        );
      default:
        return a.localeCompare(b);
    }
  };

  return handleCompare(fa, fb);
};

const PosApprovalTable = ({
  data = [],
  handleChange = {},
  totalElement = {},
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  rowSelection,
  dataConfirm = {},
  search,
  typeConfirm = false,
}) => {
  const column = [
    {
      title: "NO",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "POS NUMBER",
      dataIndex: "posNumber",
      // onFilter: (value, record) => onFilter("posNumber", value, record),
      sorter: (a, b) => sorter("posNumber", a, b),
      filteredValue: search?.["posNumber"] ? [search?.["posNumber"]] : null,
      // sorter: (a, b) => a?.posNumber?.localeCompare(b?.posNumber),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "posNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "posNumber",
          hasValue(search["posNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["posNumber"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "PROFORMA INVOICE NUMBER",
      dataIndex: "proformaInvoice",
      // onFilter: (value, record) => onFilter("proformaInvoice", value, record),
      sorter: (a, b) => sorter("proformaInvoice", a, b),
      filteredValue: search?.["proformaInvoice"]
        ? [search?.["proformaInvoice"]]
        : null,
      // sorter: (a, b) => a?.proformaInvoice?.localeCompare(b?.proformaInvoice),
      // ...getColumnSearchPropsPaging(
      //   "proformaInvoice",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "proformaInvoice",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "proformaInvoice",
          hasValue(search["proformaInvoice"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["proformaInvoice"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      // onFilter: (value, record) => onFilter("invoiceNumber", value, record),
      sorter: (a, b) => sorter("invoiceNumber", a, b),
      filteredValue: search?.["invoiceNumber"]
        ? [search?.["invoiceNumber"]]
        : null,
      // sorter: (a, b) => a?.invoiceNumber?.localeCompare(b?.invoiceNumber),
      // ...getColumnSearchPropsPaging(
      //   "invoiceNumber",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
      // onFilter: (value, record) =>
      //   record["invoiceNumber"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "BILLING CYCLE",
      dataIndex: "billingCycle",
      // onFilter: (value, record) => onFilter("billingCycle", value, record),
      sorter: (a, b) => sorter("billingCycle", a, b),
      filteredValue: search?.["billingCycle"]
        ? [search?.["billingCycle"]]
        : null,
      // sorter: (a, b) => a?.billingCycle?.localeCompare(b?.billingCycle),
      // ...getColumnSearchPropsPaging(
      //   "billingCycle",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "billingCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["billingCycle"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      // onFilter: (value, record) => onFilter("billingPeriod", value, record),
      sorter: (a, b) => sorter("billingPeriod", a, b),
      filteredValue: search?.["billingPeriod"]
        ? [search?.["billingPeriod"]]
        : null,
      // sorter: (a, b) => a?.billingPeriod?.localeCompare(b?.billingPeriod),
      // ...getColumnSearchPropsPaging(
      //   "billingPeriod",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datePeriod"
      ),
      render: (text) =>
        renderDateColumn(
          "billingPeriod",
          hasValue(search["billingPeriod"]),
          searchText,
          text,
          "datePeriod",
          search
        ),
      // onFilter: (value, record) =>
      //   record["billingPeriod"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      // onFilter: (value, record) => onFilter("customerNumber", value, record),
      sorter: (a, b) => sorter("customerNumber", a, b),
      // sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
      filteredValue: search?.["customerNumber"]
        ? [search?.["customerNumber"]]
        : null,
      // ...getColumnSearchPropsPaging(
      //   "customerNumber",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "customerNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["customerNumber"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      // onFilter: (value, record) => onFilter("customerName", value, record),
      sorter: (a, b) => sorter("customerName", a, b),
      // sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
      filteredValue: search?.["customerNumber"]
        ? [search?.["customerNumber"]]
        : null,
      // ...getColumnSearchPropsPaging(
      //   "customerName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["customerName"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      // onFilter: (value, record) => onFilter("accountNumber", value, record),
      sorter: (a, b) => sorter("accountNumber", a, b),
      filteredValue: search?.["accountNumber"]
        ? [search?.["accountNumber"]]
        : null,
      // sorter: (a, b) => a?.accountNumber?.localeCompare(b?.accountNumber),
      // ...getColumnSearchPropsPaging(
      //   "accountNumber",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["accountNumber"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      // onFilter: (value, record) => onFilter("accountName", value, record),
      sorter: (a, b) => sorter("accountName", a, b),
      filteredValue: search?.["accountName"] ? [search?.["accountName"]] : null,
      // sorter: (a, b) => a?.accountName?.localeCompare(b?.accountName),
      // ...getColumnSearchPropsPaging(
      //   "accountName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["accountName"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },

    {
      title: "PROFORMA INVOICE DATE",
      dataIndex: "proformaInvoiceDate",
      // onFilter: (value, record) =>
      filteredValue: search?.["proformaInvoiceDate"]
        ? [search?.["proformaInvoiceDate"]]
        : null,
      //   onFilter("proformaInvoiceDate", value, record),
      sorter: (a, b) => sorter("proformaInvoiceDate", a, b),
      // sorter: (a, b) =>
      //   a?.proformaInvoiceDate?.localeCompare(b?.proformaInvoiceDate),
      // ...getColumnSearchPropsPaging(
      //   "proformaInvoiceDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "proformaInvoiceDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "proformaInvoiceDate",
          hasValue(search["proformaInvoiceDate"]),
          searchText,
          text,
          "date",
          search
        ),
      // onFilter: (value, record) =>
      //   record["proformaInvoiceDate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "proformaInvoiceDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "INVOICE DATE",
      dataIndex: "invoiceDate",
      // onFilter: (value, record) => onFilter("invoiceDate", value, record),
      filteredValue: search?.["proformaInvoiceDate"]
        ? [search?.["proformaInvoiceDate"]]
        : null,
      sorter: (a, b) => sorter("invoiceDate", a, b),
      // sorter: (a, b) => a?.invoiceDate?.localeCompare(b?.invoiceDate),
      // ...getColumnSearchPropsPaging(
      //   "invoiceDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
      // onFilter: (value, record) =>
      //   record["invoiceDate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "invoiceDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "TRANSACTION DATE",
      dataIndex: "transactionDate",
      // onFilter: (value, record) => onFilter("transactionDate", value, record),
      filteredValue: search?.["transactionDate"]
        ? [search?.["transactionDate"]]
        : null,
      sorter: (a, b) => sorter("transactionDate", a, b),
      // sorter: (a, b) => a?.transactionDate?.localeCompare(b?.transactionDate),
      // ...getColumnSearchPropsPaging(
      //   "transactionDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
      // onFilter: (value, record) =>
      //   record["transactionDate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "transactionDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      // onFilter: (value, record) => onFilter("currency", value, record),
      filteredValue: search?.["currency"] ? [search?.["currency"]] : null,
      sorter: (a, b) => sorter("currency", a, b),
      // sorter: (a, b) => a?.currency?.localeCompare(b?.currency),
      // ...getColumnSearchPropsPaging(
      //   "currency",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "currency",
          hasValue(search["currency"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["currency"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      // onFilter: (value, record) => onFilter("accountGroupType", value, record),
      filteredValue: search?.["accountGroupType"]
        ? [search?.["accountGroupType"]]
        : null,
      sorter: (a, b) => sorter("accountGroupType", a, b),
      // sorter: (a, b) => a?.accountGroupType?.localeCompare(b?.accountGroupType),
      // ...getColumnSearchPropsPaging(
      //   "accountGroupType",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountGroupType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["accountGroupType"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      // onFilter: (value, record) => onFilter("sor", value, record),
      filteredValue: search?.["sor"] ? [search?.["sor"]] : null,
      sorter: (a, b) => sorter("sor", a, b),
      // sorter: (a, b) => a?.sor?.localeCompare(b?.sor),
      // ...getColumnSearchPropsPaging(
      //   "sor",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["sor"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "COST CENTER",
      dataIndex: "costcenter",
      // onFilter: (value, record) => onFilter("costcenter", value, record),
      filteredValue: search?.["costCenter"] ? [search?.["costCenter"]] : null,
      sorter: (a, b) => sorter("costcenter", a, b),
      // sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
      // ...getColumnSearchPropsPaging(
      //   "costcenter",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "costcenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "costcenter",
          hasValue(search["costcenter"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["costCenter"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      // onFilter: (value, record) => onFilter("accountSegment", value, record),
      filteredValue: search?.["accountSegment"]
        ? [search?.["accountSegment"]]
        : null,
      sorter: (a, b) => sorter("accountSegment", a, b),
      // sorter: (a, b) => a?.accountSegment?.localeCompare(b?.accountSegment),
      // ...getColumnSearchPropsPaging(
      //   "accountSegment",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["accountSegment"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      // onFilter: (value, record) => onFilter("meterReadingCode", value, record),
      filteredValue: search?.["meterReadingCode"]
        ? [search?.["meterReadingCode"]]
        : null,
      sorter: (a, b) => sorter("meterReadingCode", a, b),
      // sorter: (a, b) => a?.meterReadingCode?.localeCompare(b?.meterReadingCode),
      // ...getColumnSearchPropsPaging(
      //   "meterReadingCode",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "meterReadingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["meterReadingCode"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    // {
    //   title: "BILLING CYCLE",
    //   dataIndex: "billingCycle",
    //   sorter: (a, b) => a?.billingCycle?.localeCompare(b?.billingCycle),
    //   ...getColumnSearchPropsPaging(
    //     "billingCycle",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["billingCycle"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    // {
    //   title: "BILLING PERIOD",
    //   dataIndex: "billingPeriod",
    //   sorter: (a, b) => a?.billingPeriod?.localeCompare(b?.billingPeriod),
    //
    //   ...getColumnSearchPropsPaging(
    //     "billingPeriod",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["billingPeriod"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    // {
    //   title: "CURRENCY",
    //   dataIndex: "currency",
    //   sorter: (a, b) => a?.currency?.localeCompare(b?.currency),
    //
    //   ...getColumnSearchPropsPaging(
    //     "currency",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["currency"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    // {
    //   title: "DPP",
    //   dataIndex: "dpp",
    //   sorter: (a, b) => a?.dpp?.localeCompare(b?.dpp),
    //   ...getColumnSearchPropsPaging(
    //     "dpp",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["dpp"]?.toString().toLowerCase().includes(value.toLowerCase()),
    // },
    // {
    //   title: "PPN",
    //   dataIndex: "ppn",
    //   sorter: (a, b) => a?.ppn?.localeCompare(b?.ppn),
    //   ...getColumnSearchPropsPaging(
    //     "ppn",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["ppn"]?.toString().toLowerCase().includes(value.toLowerCase()),
    // },
    // {
    //   title: "PPH",
    //   dataIndex: "pph",
    //   sorter: (a, b) => a?.pph?.localeCompare(b?.pph),
    //   ...getColumnSearchPropsPaging(
    //     "pph",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["pph"]?.toString().toLowerCase().includes(value.toLowerCase()),
    // },
    {
      title: "AMOUNT IDR",
      dataIndex: "amountIdr",
      // onFilter: (value, record) => onFilter("amountIdr", value, record),
      filteredValue: search?.["amountIdr"] ? [search?.["amountIdr"]] : null,
      sorter: (a, b) => sorter("amountIdr", a, b),
      // sorter: (a, b) => a?.amountIdr?.localeCompare(b?.amountIdr),
      // ...getColumnSearchPropsPaging(
      //   "amountIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "amountIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "amountIdr",
          hasValue(search["amountIdr"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["amountIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "AMOUNT USD",
      dataIndex: "amountUsd",
      // onFilter: (value, record) => onFilter("amountUsd", value, record),
      filteredValue: search?.["amountUsd"] ? [search?.["amountUsd"]] : null,
      sorter: (a, b) => sorter("amountUsd", a, b),
      // sorter: (a, b) => a?.amountUsd?.localeCompare(b?.amountUsd),
      // ...getColumnSearchPropsPaging(
      //   "amountUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "amountUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "amountUsd",
          hasValue(search["amountUsd"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["amountUsd"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TAX BASIS IDR",
      dataIndex: "taxBasisIdr",
      // onFilter: (value, record) => onFilter("taxBasisIdr", value, record),
      filteredValue: search?.["taxBasisIdr"] ? [search?.["taxBasisIdr"]] : null,
      sorter: (a, b) => sorter("taxBasisIdr", a, b),
      // sorter: (a, b) => a?.taxBasisIdr?.localeCompare(b?.taxBasisIdr),
      // ...getColumnSearchPropsPaging(
      //   "taxBasisIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "taxBasisIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "taxBasisIdr",
          hasValue(search["taxBasisIdr"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["taxBasisIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TAX BASIS USD",
      dataIndex: "taxBasisUsd",
      // onFilter: (value, record) => onFilter("taxBasisUsd", value, record),
      filteredValue: search?.["taxBasisUsd"] ? [search?.["taxBasisUsd"]] : null,
      sorter: (a, b) => sorter("taxBasisUsd", a, b),
      // sorter: (a, b) => a?.taxBasisUsd?.localeCompare(b?.taxBasisUsd),
      // ...getColumnSearchPropsPaging(
      //   "taxBasisUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "taxBasisUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "taxBasisUsd",
          hasValue(search["taxBasisUsd"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["taxBasisUsd"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TAX BASIS EQV IDR",
      dataIndex: "taxBasisEqvIdr",
      // onFilter: (value, record) => onFilter("taxBasisEqvIdr", value, record),
      filteredValue: search?.["taxBasisEqvIdr"]
        ? [search?.["taxBasisEqvIdr"]]
        : null,
      sorter: (a, b) => sorter("taxBasisEqvIdr", a, b),
      // sorter: (a, b) => a?.taxBasisEqvIdr?.localeCompare(b?.taxBasisEqvIdr),
      // ...getColumnSearchPropsPaging(
      //   "taxBasisEqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "taxBasisEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "taxBasisEqvIdr",
          hasValue(search["taxBasisEqvIdr"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["taxBasisEqvIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "VAT IDR",
      dataIndex: "vatIdr",
      // onFilter: (value, record) => onFilter("vatIdr", value, record),
      filteredValue: search?.["vatIdr"] ? [search?.["vatIdr"]] : null,
      sorter: (a, b) => sorter("vatIdr", a, b),
      // sorter: (a, b) => a?.vatIdr?.localeCompare(b?.vatIdr),
      // ...getColumnSearchPropsPaging(
      //   "vatIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "vatIdr",
          hasValue(search["vatIdr"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["vatIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "VAT USD",
      dataIndex: "vatUsd",
      // onFilter: (value, record) => onFilter("vatUsd", value, record),
      filteredValue: search?.["vatUsd"] ? [search?.["vatUsd"]] : null,
      sorter: (a, b) => sorter("vatUsd", a, b),
      // sorter: (a, b) => a?.vatUsd?.localeCompare(b?.vatUsd),
      // ...getColumnSearchPropsPaging(
      //   "vatUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "vatUsd",
          hasValue(search["vatUsd"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["vatUsd"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "VAT EQV IDR",
      dataIndex: "vatEqvIdr",
      // onFilter: (value, record) => onFilter("vatEqvidr", value, record),
      filteredValue: search?.["vatEqvIdr"] ? [search?.["vatEqvIdr"]] : null,
      sorter: (a, b) => sorter("vatEqvidr", a, b),
      // sorter: (a, b) => a?.vatEqvIdr?.localeCompare(b?.vatEqvIdr),
      // ...getColumnSearchPropsPaging(
      //   "vatEqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["vatEqvIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "WITHHOLDING TAX",
      dataIndex: "withholdingTax",
      // onFilter: (value, record) => onFilter("witholdingTax", value, record),
      filteredValue: search?.["withholdingTax"]
        ? [search?.["withholdingTax"]]
        : null,
      sorter: (a, b) => sorter("witholdingTax", a, b),
      // sorter: (a, b) => a?.withholdingTax?.localeCompare(b?.withholdingTax),
      // ...getColumnSearchPropsPaging(
      //   "withholdingTax",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "withholdingTax",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "withholdingTax",
          hasValue(search["withholdingTax"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["withholdingTax"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TAX RATE TYPE",
      dataIndex: "taxRateType",
      // onFilter: (value, record) => onFilter("taxRateType", value, record),
      filteredValue: search?.["taxRateType"] ? [search?.["taxRateType"]] : null,
      sorter: (a, b) => sorter("taxRateType", a, b),
      // sorter: (a, b) => a?.taxRateType?.localeCompare(b?.taxRateType),
      // ...getColumnSearchPropsPaging(
      //   "taxRateType",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "taxRateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["taxRateType"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TAX RATE",
      dataIndex: "taxRate",
      // onFilter: (value, record) => onFilter("taxRate", value, record),
      filteredValue: search?.["taxRate"] ? [search?.["taxRate"]] : null,
      sorter: (a, b) => sorter("taxRate", a, b),
      // sorter: (a, b) => a?.taxRate?.localeCompare(b?.taxRate),
      // ...getColumnSearchPropsPaging(
      //   "taxRate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "taxRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["taxRate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TAX RATE DATE",
      dataIndex: "taxRateDate",
      // onFilter: (value, record) => onFilter("taxRateDate", value, record),
      filteredValue: search?.["taxRateDate"] ? [search?.["taxRateDate"]] : null,
      sorter: (a, b) => sorter("taxRateDate", a, b),
      // sorter: (a, b) => a?.taxRateDate?.localeCompare(b?.taxRateDate),
      // ...getColumnSearchPropsPaging(
      //   "taxRateDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
      // onFilter: (value, record) =>
      //   record["taxRateDate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "taxRateDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "DISCOUNT AMOUNT",
      dataIndex: "discountAmount",
      // onFilter: (value, record) => onFilter("discountAmount", value, record),
      filteredValue: search?.["discountAmount"]
        ? [search?.["discountAmount"]]
        : null,
      sorter: (a, b) => sorter("discountAmount", a, b),
      // sorter: (a, b) => a?.discountAmount?.localeCompare(b?.discountAmount),
      // ...getColumnSearchPropsPaging(
      //   "discountAmount",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "discountAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "discountAmount",
          hasValue(search["discountAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["discountAmount"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "DISCOUNT AMOUNT IDR",
      dataIndex: "discountAmountIdr",
      // onFilter: (value, record) => onFilter("discountAmountIdr", value, record),
      filteredValue: search?.["discountAmountIdr"]
        ? [search?.["discountAmountIdr"]]
        : null,
      sorter: (a, b) => sorter("discountAmountIdr", a, b),
      // sorter: (a, b) =>
      //   a?.discountAmountIdr?.localeCompare(b?.discountAmountIdr),
      // ...getColumnSearchPropsPaging(
      //   "discountAmountIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "discountAmountIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "discountAmountIdr",
          hasValue(search["discountAmountIdr"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["discountAmountIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "DISCOUNT AMOUNT USD",
      dataIndex: "discountAmountUsd",
      // onFilter: (value, record) => onFilter("dsicountAmountUsd", value, record),
      filteredValue: search?.["discountAmountUsd"]
        ? [search?.["discountAmountUsd"]]
        : null,
      sorter: (a, b) => sorter("dsicountAmountUsd", a, b),
      // sorter: (a, b) =>
      //   a?.discountAmountUsd?.localeCompare(b?.discountAmountUsd),
      // ...getColumnSearchPropsPaging(
      //   "discountAmountUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "discountAmountUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "discountAmountUsd",
          hasValue(search["discountAmountUsd"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["discountAmountUsd"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TOTAL AMOUNT IDR",
      dataIndex: "totalAmountIdr",
      // onFilter: (value, record) => onFilter("totalAmountIdr", value, record),
      filteredValue: search?.["totalAmountIdr"]
        ? [search?.["totalAmountIdr"]]
        : null,
      sorter: (a, b) => sorter("totalAmountIdr", a, b),
      // sorter: (a, b) => a?.totalAmountIdr?.localeCompare(b?.totalAmountIdr),
      // ...getColumnSearchPropsPaging(
      //   "totalAmountIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
      // onFilter: (value, record) =>
      //   record["totalAmountIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TOTAL AMOUNT USD",
      dataIndex: "totalAmountUsd",
      // onFilter: (value, record) => onFilter("totalAmountUsd", value, record),
      filteredValue: search?.["totalAmountUsd"]
        ? [search?.["totalAmountUsd"]]
        : null,
      sorter: (a, b) => sorter("totalAmountUsd", a, b),
      // sorter: (a, b) => a?.totalAmountUsd?.localeCompare(b?.totalAmountUsd),
      // ...getColumnSearchPropsPaging(
      //   "totalAmountUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "totalAmountUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["totalAmountUsd"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TERMS OF PAYMENT",
      dataIndex: "termsOfPayment",
      // onFilter: (value, record) => onFilter("termsOfPayment", value, record),
      filteredValue: search?.["termsOfPayment"]
        ? [search?.["termsOfPayment"]]
        : null,
      sorter: (a, b) => sorter("termsOfPayment", a, b),
      // sorter: (a, b) => a?.termsOfPayment?.localeCompare(b?.termsOfPayment),
      // ...getColumnSearchPropsPaging(
      //   "termsOfPayment",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "termsOfPayment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "termsOfPayment",
          hasValue(search["termsOfPayment"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // onFilter: (value, record) =>
      //   record["termsOfPayment"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "ACCOUNTING DATE",
      dataIndex: "accountingDate",
      // onFilter: (value, record) => onFilter("accountingDate", value, record),
      filteredValue: search?.["accountingDate"]
        ? [search?.["accountingDate"]]
        : null,
      sorter: (a, b) => sorter("accountingDate", a, b),
      // sorter: (a, b) => a?.accountingDate?.localeCompare(b?.accountingDate),
      // ...getColumnSearchPropsPaging(
      //   "accountingDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountingDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "accountingDate",
          hasValue(search["accountingDate"]),
          searchText,
          text,
          "date",
          search
        ),
      // onFilter: (value, record) =>
      //   record["accountingDate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "accountingDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      // onFilter: (value, record) => onFilter("dueDate", value, record),
      filteredValue: search?.["dueDate"] ? [search?.["dueDate"]] : null,
      sorter: (a, b) => sorter("dueDate", a, b),
      // sorter: (a, b) => a?.dueDate?.localeCompare(b?.dueDate),
      // ...getColumnSearchPropsPaging(
      //   "dueDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
      // onFilter: (value, record) =>
      //   record["dueDate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "dueDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "RATE TYPE",
      dataIndex: "rateType",
      // onFilter: (value, record) => onFilter("rateType", value, record),
      filteredValue: search?.["rateType"] ? [search?.["rateType"]] : null,
      sorter: (a, b) => sorter("rateType", a, b),
      // sorter: (a, b) => a?.rateType?.localeCompare(b?.rateType),
      // ...getColumnSearchPropsPaging(
      //   "rateType",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "rateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["rateType"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "RATE",
      dataIndex: "rate",
      // onFilter: (value, record) => onFilter("rate", value, record),
      filteredValue: search?.["rate"] ? [search?.["rate"]] : null,
      sorter: (a, b) => sorter("rate", a, b),
      // sorter: (a, b) => a?.rate?.localeCompare(b?.rate),
      // ...getColumnSearchPropsPaging(
      //   "rate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "rate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["rate"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      // onFilter: (value, record) => onFilter("rateDate", value, record),
      filteredValue: search?.["rateDate"] ? [search?.["rateDate"]] : null,
      sorter: (a, b) => sorter("rateDate", a, b),
      // sorter: (a, b) => a?.rateDate?.localeCompare(b?.rateDate),
      // ...getColumnSearchPropsPaging(
      //   "rateDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
      // onFilter: (value, record) =>
      //   record["rateDate"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "rateDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "TOTAL AMOUNT EQV IDR",
      dataIndex: "totalAmountEqvIdr",
      // onFilter: (value, record) => onFilter("totalAmountEqvIdr", value, record),
      sorter: (a, b) => sorter("totalAmountEqvIdr", a, b),
      filteredValue: search?.["totalAmountEqvIdr"]
        ? [search?.["totalAmountEqvIdr"]]
        : null,
      // sorter: (a, b) =>
      //   a?.totalAmountEqvIdrr?.localeCompare(b?.totalAmountEqvIdrr),
      // ...getColumnSearchPropsPaging(
      //   "totalAmountEqvIdr",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "totalAmountEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // onFilter: (value, record) =>
      //   record["totalAmountEqvIdr"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    {
      title: "TOTAL AMOUNT EQV USD",
      dataIndex: "totalAmountEqvUsd",
      // onFilter: (value, record) => onFilter("totalAmountEqvUsd", value, record),
      filteredValue: search?.["totalAmountEqvUsd"]
        ? [search?.["totalAmountEqvUsd"]]
        : null,
      sorter: (a, b) => sorter("totalAmountEqvUsd", a, b),
      // sorter: (a, b) =>
      //   a?.totalAmountEqvUsd?.localeCompare(b?.totalAmountEqvUsd),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "totalAmountEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      // ...getColumnSearchPropsPaging(
      //   "totalAmountEqvUsd",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      // onFilter: (value, record) =>
      //   record["totalAmountEquivalentUsd"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
    },
    // {
    //   title: "TERMS OF PAYMENT",
    //   dataIndex: "termsOfPayment",
    //   sorter: (a, b) => a?.termsOfPayment?.localeCompare(b?.termsOfPayment),
    //
    //   ...getColumnSearchPropsPaging(
    //     "termsOfPayment",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["termsOfPayment"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    // {
    //   title: "TRANSACTION DATE",
    //   dataIndex: "transactionDate",
    //   sorter: (a, b) => a?.transactionDate?.localeCompare(b?.transactionDate),
    //
    //   ...getColumnSearchPropsPaging(
    //     "transactionDate",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch,
    //     true
    //   ),
    //   onFilter: (value, record) =>
    //     record["transactionDate"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    //   render: (index) => {
    //     const text = index ? moment(index).format("DD MMM YYYY") : "";
    //     if (searchedColumn === "transactionDate") {
    //       return (
    //         <Highlighter
    //           highlightStyle={{
    //             backgroundColor: "#ffc069",
    //             padding: 0,
    //           }}
    //           searchWords={[searchText]}
    //           autoEscape
    //           textToHighlight={text ? text.toString() : ""}
    //         />
    //       );
    //     } else {
    //       return text || "";
    //     }
    //   },
    // },
    // {
    //   title: "DUE DATE",
    //   dataIndex: "dueDate",
    //   sorter: (a, b) => a?.dueDate?.localeCompare(b?.dueDate),
    //
    //   ...getColumnSearchPropsPaging(
    //     "dueDate",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch,
    //     true
    //   ),
    //   onFilter: (value, record) =>
    //     record["dueDate"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    //   render: (index) => {
    //     const text = index ? moment(index).format("DD MMM YYYY") : "";
    //     if (searchedColumn === "dueDate") {
    //       return (
    //         <Highlighter
    //           highlightStyle={{
    //             backgroundColor: "#ffc069",
    //             padding: 0,
    //           }}
    //           searchWords={[searchText]}
    //           autoEscape
    //           textToHighlight={text ? text.toString() : ""}
    //         />
    //       );
    //     } else {
    //       return text || "";
    //     }
    //   },
    // },
    {
      title: "REMARK",
      dataIndex: "remark",
      // onFilter: (value, record) => onFilter("remark", value, record),
      filteredValue: search?.["remark"] ? [search?.["remark"]] : null,
      sorter: (a, b) => sorter("remark", a, b),
      // sorter: (a, b) => a?.remark?.localeCompare(b?.remark),
      ...getColumnSearchPropsPaging(
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
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
      // onFilter: (value, record) =>
      //   record["remark"]
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(value.toLowerCase()),
      // render: (text) => {
      //   if (searchedColumn === "remark") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
  ];

  return (
    <Fragment>
      <TablePaginationNew
        type="FE"
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChange}
        tableScrolled={{
          x: 13000,
          y: 500,
        }}
        columns={column}
        rowSelection={rowSelection || undefined}
      />
      {typeConfirm ? (
        <div className="pt-[30px]">
          <DetailText label={"Remark"}>{dataConfirm || ""}</DetailText>
        </div>
      ) : null}
    </Fragment>
  );
};

export default PosApprovalTable;
