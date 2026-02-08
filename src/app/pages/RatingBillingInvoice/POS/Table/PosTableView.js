import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";

export const PosTableView = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  search
) => [
    {
      key: "no",
      title: "NO",
      dataIndex: "no",
      fixed: "left",
      width: 60,
      render: (text, object, index) => index + 1, // Infinite scroll tidak menggunakan page-based numbering
    },
    {
      title: "POS NUMBER",
      dataIndex: "posNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "PROFORMA INVOICE NUMBER",
      dataIndex: "proformaInvoice",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
      title: "BILLING CYCLE",
      dataIndex: "billingCycle",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "PROFORMA INVOICE DATE",
      dataIndex: "proformaInvoiceDate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
      sorter: true,
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
      sorter: true,
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "COST CENTER",
      dataIndex: "costcenter",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    // {
    //   title: "AMOUNT",
    //   dataIndex: "amount",
    //   sorter: true,
    //
    //   ...getColumnSearchPropsPaging(
    //     "amount",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    // },
    {
      title: "AMOUNT IDR",
      dataIndex: "amountIdr",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "AMOUNT USD",
      dataIndex: "amountUsd",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TAX BASIS IDR",
      dataIndex: "taxBasisIdr",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TAX BASIS USD",
      dataIndex: "taxBasisUsd",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TAX BASIS EQV IDR",
      dataIndex: "taxBasisEqvIdr",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    // {
    //   title: "TAX BASIS EQV USD",
    //   dataIndex: "taxBasisEqvUsd",
    //   sorter: true,
    //
    //   ...getColumnSearchPropsPaging(
    //     "taxBasisEqvUsd",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    // },
    {
      title: "VAT IDR",
      dataIndex: "vatIdr",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "VAT USD",
      dataIndex: "vatUsd",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "VAT EQV IDR",
      dataIndex: "vatEqvIdr",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "WITHHOLDING TAX",
      dataIndex: "withholdingTax",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TAX RATE TYPE",
      dataIndex: "taxRateType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TAX RATE DATE",
      dataIndex: "taxRateDate",
      sorter: true,
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
      title: "TAX RATE",
      dataIndex: "taxRate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "DISCOUNT AMOUNT",
      dataIndex: "discountAmount",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "DISCOUNT AMOUNT IDR",
      dataIndex: "discountAmountIdr",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "DISCOUNT AMOUNT USD",
      dataIndex: "discountAmountUsd",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    // {
    //   title: "TOTAL AMOUNT",
    //   dataIndex: "totalAmount",
    //   sorter: true,
    //
    //   ...getColumnSearchPropsPaging(
    //     "totalAmount",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    // },
    {
      title: "TOTAL AMOUNT IDR",
      dataIndex: "totalAmountIdr",
      sorter: true,
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
      title: "TOTAL AMOUNT USD",
      dataIndex: "totalAmountUsd",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TERMS OF PAYMENT",
      dataIndex: "termsOfPayment",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "ACCOUNTING DATE",
      dataIndex: "accountingDate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
      sorter: true,
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      sorter: true,
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
      title: "RATE",
      dataIndex: "rate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TOTAL AMOUNT EQV IDR",
      dataIndex: "totalAmountEqvIdr",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "TOTAL AMOUNT EQV USD",
      dataIndex: "totalAmountEqvUsd",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
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
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      sorter: true,
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
        renderColumn(
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
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
    {
      title: "PAYMENT STATUS",
      dataIndex: "statusPayment",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusPayment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      // render: (index) => (
      //   <div className={" flex justify-center"}>
      //     <StatusComponent colour={index}>{index}</StatusComponent>
      //   </div>
      // ),
      render: (text) =>
        renderColumn(
          "statusPayment",
          hasValue(search["statusPayment"]),
          searchText,
          text,
          false,
          "status",
          search
        ),
    },
    {
      key: "statusApproval",
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      fixed: "right",
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (statusApproval) => {
        let text;
        switch (statusApproval) {
          case "WAITING APPROVAL":
          case "WAITING_FOR_APPROVAL":
          case "WAITING_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = statusApproval
              ? statusApproval.charAt(0).toUpperCase() +
              statusApproval.slice(1).toLowerCase()
              : statusApproval;
            break;
        }
        return text
          ? renderColumn(
            "statusApproval",
            hasValue(search["statusApproval"]),
            searchText,
            text,
            false,
            "status",
            search
          )
          : text;
      },
      // render: (statusApproval) => {
      //   let text;
      //   switch (statusApproval) {
      //     case "WAITING APPROVAL":
      //       text = "Waiting Approval";
      //       break;
      //     default:
      //       text = statusApproval
      //         ? statusApproval.charAt(0).toUpperCase() +
      //           statusApproval.slice(1).toLowerCase()
      //         : statusApproval;
      //       break;
      //   }
      //   if (searchedColumn === "statusApproval") {
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
      //     return text ? (
      //       <div className={"flex justify-center"}>
      //         <StatusComponent colour={text}>{text}</StatusComponent>
      //       </div>
      //     ) : (
      //       text
      //     );
      //   }
      // },
    },
    {
      title: "REGISTRATION NUMBER",
      dataIndex: "registrationNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "registrationNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      // render: (index) => (
      //   <div className={" flex justify-center"}>
      //     <StatusComponent colour={index}>{index}</StatusComponent>
      //   </div>
      // ),
      render: (text) =>
        renderColumn(
          "registrationNumber",
          hasValue(search["registrationNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "email",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      // render: (index) => (
      //   <div className={" flex justify-center"}>
      //     <StatusComponent colour={index}>{index}</StatusComponent>
      //   </div>
      // ),
      render: (text) =>
        renderColumn(
          "email",
          hasValue(search["email"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ADDRESS",
      dataIndex: "address",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "address",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      // render: (index) => (
      //   <div className={" flex justify-center"}>
      //     <StatusComponent colour={index}>{index}</StatusComponent>
      //   </div>
      // ),
      render: (text) =>
        renderColumn(
          "address",
          hasValue(search["address"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (type) => {
        const typeConfig = {
          1: { text: "Customer", color: "#1890ff" },
          2: { text: "Prospective Customer", color: "#1890ff" }
        };
        const config = typeConfig[type] || {
          text: "UNKNOWN",
          color: "#d9d9d9",
        };
        const displayText = config.text;
        return renderColumn(
          "customerType",
          hasValue(search["customerType"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      }
      // render: (index) => (
      //   <div className={" flex justify-center"}>
      //     <StatusComponent colour={index}>{index}</StatusComponent>
      //   </div>
      // ),
      // render: (text) =>
      //   renderColumn(
      //     "customerType",
      //     hasValue(search["customerType"]),
      //     searchText,
      //     text,
      //     false,
      //     "status",
      //     search
      //   ),
    },
    // {
    //   title: "ACTION",
    //   dataIndex: "action",
    //   fixed: "right",
    //
    //   width: 100,
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex w-full justify-center gap-4">
    //         <Popover
    //           trigger={"click"}
    //           placement="bottomRight"
    //           content={
    //             <Space direction="vertical">
    //               <ButtonComponent
    //                 icon={<SVGIcon name="IconDetail" width={24} />}
    //                 border={false}
    //                 onClick={() => handleOpenDetail(r)}
    //               >
    //                 <span className={"text-black ml-3"}> Detail</span>
    //               </ButtonComponent>

    //               {r.statusApproval === "APPROVED" ? (
    //                 <ButtonComponent
    //                   icon={
    //                     <SVGIcon name="IconEye" color={"#0075bf"} width={24} />
    //                   }
    //                   border={false}
    //                 >
    //                   <span className={"text-black ml-3"}>Preview Invoice</span>
    //                 </ButtonComponent>
    //               ) : (
    //                 <ButtonComponent
    //                   icon={
    //                     <SVGIcon name="IconEye" color={"#0075bf"} width={24} />
    //                   }
    //                   border={false}
    //                   disabled
    //                 >
    //                   <span className={"text-black ml-3"}>Preview Invoice</span>
    //                 </ButtonComponent>
    //               )}

    //               {r.statusApproval === "DRAFT" ||
    //               r.statusApproval === "REJECTED" ? (
    //                 <Link
    //                   to={RBI_ROUTES.POS_UPDATE}
    //                   state={{ id: r.id, idPos: r.posNumber }}
    //                 >
    //                   <ButtonComponent
    //                     icon={
    //                       <SVGIcon name="IconEdit" color={"#0075bf"} width={24} />
    //                     }
    //                     border={false}
    //                   >
    //                     <span className={"text-black ml-3"}> Update</span>
    //                   </ButtonComponent>
    //                 </Link>
    //               ) : (
    //                 <ButtonComponent
    //                   icon={
    //                     <SVGIcon name="IconEdit" color={"#0075bf"} width={24} />
    //                   }
    //                   border={false}
    //                   disabled={true}
    //                 >
    //                   <span className={"text-black ml-3"}> Update</span>
    //                 </ButtonComponent>
    //               )}

    //               <ButtonComponent
    //                 icon={
    //                   <SVGIcon
    //                     name="IconLogHistory"
    //                     color={"#0075bf"}
    //                     width={24}
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={() => {
    //                   handleApprovalHistory(r);
    //                 }}
    //               >
    //                 <span className={"text-black ml-3"}>Approval History</span>
    //               </ButtonComponent>
    //             </Space>
    //           }
    //         >
    //           <div className="pt-1">
    //             <MoreOutlined
    //               style={{
    //                 fontSize: "24px",
    //                 color: "#0075bf",
    //                 cursor: "pointer",
    //               }}
    //             />
    //           </div>
    //         </Popover>

    //         {r.statusApproval === "DRAFT" || r.statusApproval === "REJECTED" ? (
    //           <Tooltip title="Delete">
    //             <div className="pt-1">
    //               <SVGIcon
    //                 name="IconDelete"
    //                 color={"#D90000"}
    //                 width={24}
    //                 onClick={() => handleDelete(r)}
    //               />
    //             </div>
    //           </Tooltip>
    //         ) : (
    //           <Tooltip title="Delete">
    //             <div className="pt-1">
    //               <SVGIcon
    //                 className="disabled cursor-not-allowed"
    //                 name="IconDelete"
    //                 color={
    //                   r.statusApproval === "DRAFT" ||
    //                   r.statusApproval === "REJECTED"
    //                     ? "#D90000"
    //                     : "#8D91A0"
    //                 }
    //                 width={24}
    //               />
    //             </div>
    //           </Tooltip>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

export default PosTableView;
