import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";

export const PosTableView = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search,
) => [
  {
    key: "no",
    title: "NO",
    dataIndex: "no",
    fixed: "left",
    width: 60,
    render: (text, object, index) => index + 1,
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
      true,
      "select",
      [
        { value: "1", label: "Customer" },
        { value: "2", label: "Prospective Customer" },
      ]
    ),
    render: (text) => {
      const typeConfig = {
        1: "Customer",
        2: "Prospective Customer",
      };
      const displayText = typeConfig[text] || text || "-";
      return renderColumn(
        "customerType",
        hasValue(search["customerType"]),
        searchText,
        displayText,
        false,
        "input",
        search,
      );
    },
  },
  {
    title: "POS NUMBER",
    dataIndex: "posNumber",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "posNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "posNumber",
        hasValue(search["posNumber"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "PROFORMA INVOICE NUMBER",
    dataIndex: "proformaInvoiceNumber",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "proformaInvoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "proformaInvoiceNumber",
        hasValue(search["proformaInvoiceNumber"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "INVOICE NUMBER",
    dataIndex: "invoiceNumber",
    isClassification: true, 
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true, 
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true, 
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod",
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriod",
        hasValue(search["billingPeriod"]),
        searchText,
        text,
        "datePeriod",
        search,
      ),
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    title: "PROFORMA INVOICE DATE",
    dataIndex: "proformaInvoiceDate",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "proformaInvoiceDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "proformaInvoiceDate",
        hasValue(search["proformaInvoiceDate"]),
        searchText,
        text,
        "date",
        search,
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true,
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
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    title: "SOR",
    dataIndex: "sor",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
    title: "AMOUNT",
    dataIndex: "amount",
    isNumber: true,
    sorter: true,
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
      ),
  },
  {
    title: "TAX BASIS",
    dataIndex: "taxBasis",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxBasis",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "taxBasis",
        hasValue(search["taxBasis"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TAX BASIS EQV",
    dataIndex: "taxBasisEqv",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxBasisEqv",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "taxBasisEqv",
        hasValue(search["taxBasisEqv"]),
        searchText,
        text,
        false,
        "input",
        search,
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
    title: "VAT",
    dataIndex: "vat",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vat",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "vat",
        hasValue(search["vat"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "VAT EQV",
    dataIndex: "vatEqv",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatEqv",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "vatEqv",
        hasValue(search["vatEqv"]),
        searchText,
        text,
        false,
        "input",
        search,
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
      true,
    ),
    render: (text) =>
      renderColumn(
        "withholdingTax",
        hasValue(search["withholdingTax"]),
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
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
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
      true,
    ),
    render: (text) =>
      renderColumn(
        "discountAmount",
        hasValue(search["discountAmount"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convertedCurrency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "convertedCurrency",
        hasValue(search["convertedCurrency"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmount",
        hasValue(search["totalAmount"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TOTAL AMOUNT EQV",
    dataIndex: "totalAmountEqv",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqv",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqv",
        hasValue(search["totalAmountEqv"]),
        searchText,
        text,
        false,
        "input",
        search,
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
      true,
    ),
    render: (text) =>
      renderColumn(
        "termsOfPayment",
        hasValue(search["termsOfPayment"]),
        searchText,
        text,
        false,
        "input",
        search,
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
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "accountingDate",
        hasValue(search["accountingDate"]),
        searchText,
        text,
        "date",
        search,
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
      true,
    ),
    render: (text) =>
      renderColumn(
        "remark",
        hasValue(search["remark"]),
        searchText,
        text,
        true,
        "input",
        search,
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
      true,
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
        search,
      ),
  },
  {
     title: "INVOICE STATUS",
    dataIndex: "invoiceStatus",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    // render: (index) => (
    //   <div className={" flex justify-center"}>
    //     <StatusComponent colour={index}>{index}</StatusComponent>
    //   </div>
    // ),
    render: (text) =>
      renderColumn(
        "invoiceStatus",
        hasValue(search["invoiceStatus"]),
        searchText,
        text,
        false,
        "status",
        search,
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
      true,
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
            search,
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
  // {
  //   title: "REGISTRATION NUMBER",
  //   dataIndex: "registrationNumber",
  //   sorter: true,
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "registrationNumber",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //   ),
  //   // render: (index) => (
  //   //   <div className={" flex justify-center"}>
  //   //     <StatusComponent colour={index}>{index}</StatusComponent>
  //   //   </div>
  //   // ),
  //   render: (text) =>
  //     renderColumn(
  //       "registrationNumber",
  //       hasValue(search["registrationNumber"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search,
  //     ),
  // },
  // {
  //   title: "EMAIL",
  //   dataIndex: "email",
  //   sorter: true,
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "email",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //   ),
  //   // render: (index) => (
  //   //   <div className={" flex justify-center"}>
  //   //     <StatusComponent colour={index}>{index}</StatusComponent>
  //   //   </div>
  //   // ),
  //   render: (text) =>
  //     renderColumn(
  //       "email",
  //       hasValue(search["email"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search,
  //     ),
  // },
  // {
  //   title: "ADDRESS",
  //   dataIndex: "address",
  //   sorter: true,
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "address",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //   ),
  //   // render: (index) => (
  //   //   <div className={" flex justify-center"}>
  //   //     <StatusComponent colour={index}>{index}</StatusComponent>
  //   //   </div>
  //   // ),
  //   render: (text) =>
  //     renderColumn(
  //       "address",
  //       hasValue(search["address"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search,
  //     ),
  // },
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
